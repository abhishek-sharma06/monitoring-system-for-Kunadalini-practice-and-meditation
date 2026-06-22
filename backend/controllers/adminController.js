// Import database connection pool.
const pool = require('../config/db');

// Helper to log administrative actions to the admin_logs audit table.
const logAdminAction = async (adminId, action, targetUserId) => {
  try {
    await pool.query(
      'INSERT INTO admin_logs (admin_id, action, target_user_id) VALUES (?, ?, ?)',
      [adminId, action, targetUserId]
    );
  } catch (error) {
    console.error('Audit logging failed:', error.message);
  }
};

// Retrieve a list of users, including their practice session counts and averages.
exports.getUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const verified = req.query.verified; // 'true' or 'false'

    let sql = `
      SELECT 
        u.id, u.name, u.email, u.role, u.is_verified, u.created_at,
        COUNT(s.id) as total_sessions,
        ROUND(COALESCE(AVG(s.score), 0), 1) as avg_score
      FROM users u
      LEFT JOIN sessions s ON u.id = s.user_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (verified === 'true') {
      sql += ' AND u.is_verified = true';
    } else if (verified === 'false') {
      sql += ' AND u.is_verified = false';
    }

    sql += ' GROUP BY u.id ORDER BY u.created_at DESC';

    const [users] = await pool.query(sql, params);

    res.status(200).json({
      success: true,
      data: {
        users,
        total: users.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve a specific user's profile and entire session history.
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Query profile details.
    const [profiles] = await pool.query(
      'SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = ?',
      [id]
    );
    if (profiles.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Query session history.
    const [sessions] = await pool.query(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        profile: profiles[0],
        sessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CASCADE delete a user account and audit log the action.
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    if (parseInt(id) === parseInt(adminId)) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own administrator account.' });
    }

    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Delete user from DB. Cascading handles relational deletions in sessions/goals automatically.
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    // Record delete operation in admin logs.
    await logAdminAction(adminId, 'DELETE_USER', id);

    res.status(200).json({ success: true, message: 'User and all related session history deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle user privileges between 'admin' and 'user' roles.
exports.toggleUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    if (parseInt(id) === parseInt(adminId)) {
      return res.status(400).json({ success: false, message: 'Cannot update/demote your own administrative role.' });
    }

    const [users] = await pool.query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newRole = users[0].role === 'admin' ? 'user' : 'admin';

    // Update privileges.
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [newRole, id]);

    // Record role modification in audit logs.
    await logAdminAction(adminId, 'CHANGE_ROLE', id);

    res.status(200).json({ success: true, message: `User role successfully updated to ${newRole}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new yoga/meditation exercise content.
exports.createExercise = async (req, res) => {
  try {
    const { name, type, chakra, mantra, duration_minutes, posture, purpose, benefits, video_url, caution, guidance } = req.body;
    if (!name || !type || !chakra || !mantra) {
      return res.status(400).json({ success: false, message: 'Name, type, chakra, and mantra are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO exercises (name, type, chakra, mantra, duration_minutes, posture, purpose, benefits, video_url, caution, guidance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, chakra, mantra, duration_minutes || 10, posture, purpose, benefits, video_url, caution, guidance]
    );

    res.status(201).json({ success: true, data: { id: result.insertId }, message: 'Exercise content added successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing yoga/meditation exercise content.
exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, chakra, mantra, duration_minutes, posture, purpose, benefits, video_url, caution, guidance } = req.body;

    const [result] = await pool.query(
      `UPDATE exercises 
       SET name = ?, type = ?, chakra = ?, mantra = ?, duration_minutes = ?, posture = ?, purpose = ?, benefits = ?, video_url = ?, caution = ?, guidance = ? 
       WHERE id = ?`,
      [name, type, chakra, mantra, duration_minutes, posture, purpose, benefits, video_url, caution, guidance, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    res.status(200).json({ success: true, message: 'Exercise content updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an exercise content.
exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM exercises WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    res.status(200).json({ success: true, message: 'Exercise content deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve general platform statistics, metrics, and trends.
exports.getPlatformAnalytics = async (req, res) => {
  try {
    // Platform-wide counts.
    const [userCounts] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN is_verified = true THEN 1 ELSE 0 END) as verified_users,
        SUM(CASE WHEN is_verified = false THEN 1 ELSE 0 END) as unverified_users
      FROM users
    `);

    // Sessions metrics.
    const [sessionStats] = await pool.query(`
      SELECT 
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as total_sessions_today,
        SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) as total_sessions_this_week,
        ROUND(COALESCE(AVG(score), 0), 1) as avg_score_platform
      FROM sessions
    `);

    // Top 5 active practitioners.
    const [topUsers] = await pool.query(`
      SELECT 
        u.id, u.name, u.email,
        COUNT(s.id) as session_count,
        ROUND(COALESCE(AVG(s.score), 0), 1) as avg_score
      FROM users u
      JOIN sessions s ON u.id = s.user_id
      GROUP BY u.id 
      ORDER BY session_count DESC 
      LIMIT 5
    `);

    // Popularity of practices per Chakra target.
    const [chakraPopularity] = await pool.query(`
      SELECT chakra_focus, COUNT(*) as count 
      FROM sessions 
      WHERE chakra_focus IS NOT NULL 
      GROUP BY chakra_focus 
      ORDER BY count DESC
    `);

    // User sign-ups trend (last 30 days).
    const [newUsersTrend] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM users 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `);

    // Session log volume trend (last 30 days).
    const [sessionsTrend] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM sessions 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total_users: userCounts[0].total_users,
          verified_users: userCounts[0].verified_users,
          unverified_users: userCounts[0].unverified_users,
          total_sessions_today: Number(sessionStats[0].total_sessions_today),
          total_sessions_this_week: Number(sessionStats[0].total_sessions_this_week),
          avg_score_platform: Number(sessionStats[0].avg_score_platform)
        },
        top_5_active_users: topUsers,
        chakra_popularity: chakraPopularity,
        new_users_last_30_days: newUsersTrend,
        sessions_last_30_days: sessionsTrend
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
