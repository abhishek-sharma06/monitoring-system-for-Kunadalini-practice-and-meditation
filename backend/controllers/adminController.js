const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const logAdminAction = async (adminId, action, targetUserId) => {
  try {
    await pool.query('INSERT INTO admin_logs (admin_id, action, target_user_id) VALUES (?, ?, ?)', [adminId, action, targetUserId]);
  } catch (error) {
    console.error('Audit logging failed:', error.message);
  }
};

// ─── User Management ─────────────────────────────────────────────────────────

exports.getUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const verified = req.query.verified;
    const role = req.query.role;

    let sql = `SELECT id, name, email, role, level, is_verified, safety_disclaimer_accepted, created_at FROM users WHERE 1=1`;
    const params = [];

    if (search) { sql += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (verified === 'true') sql += ' AND is_verified = true';
    else if (verified === 'false') sql += ' AND is_verified = false';
    if (role === 'admin') sql += ' AND role = "admin"';
    else if (role === 'user') sql += ' AND role = "user"';

    sql += ' ORDER BY created_at DESC';
    const [users] = await pool.query(sql, params);
    res.status(200).json({ success: true, data: { users, total: users.length } });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ success: false, message: 'Failed to load users.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, level, is_verified, safety_disclaimer_accepted, safety_disclaimer_accepted_at, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, data: users[0] });
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({ success: false, message: 'Failed to load user.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, level, is_verified } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, level, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user', level || 'beginner', is_verified || false]
    );

    await pool.query('INSERT IGNORE INTO level_progress (user_id, sessions_at_current_level, eligible_for_upgrade) VALUES (?, 0, FALSE)', [result.insertId]);
    await logAdminAction(req.user.id, 'CREATE_USER', result.insertId);
    res.status(201).json({ success: true, data: { id: result.insertId }, message: 'User created successfully.' });
  } catch (error) {
    console.error('createUser error:', error);
    res.status(500).json({ success: false, message: 'Failed to create user.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, level } = req.body;

    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });

    if (email) {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    const fields = [];
    const params = [];
    if (name) { fields.push('name = ?'); params.push(name); }
    if (email) { fields.push('email = ?'); params.push(email); }
    if (role) { fields.push('role = ?'); params.push(role); }
    if (level) { fields.push('level = ?'); params.push(level); }

    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update.' });

    params.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    await logAdminAction(req.user.id, 'UPDATE_USER', id);
    res.status(200).json({ success: true, message: 'User updated.' });
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
};

exports.toggleVerification = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, is_verified FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });

    const newStatus = !users[0].is_verified;
    await pool.query('UPDATE users SET is_verified = ? WHERE id = ?', [newStatus, req.params.id]);
    await logAdminAction(req.user.id, newStatus ? 'VERIFY_USER' : 'UNVERIFY_USER', req.params.id);
    res.status(200).json({ success: true, data: { is_verified: newStatus }, message: `User ${newStatus ? 'verified' : 'unverified'}.` });
  } catch (error) {
    console.error('toggleVerification error:', error);
    res.status(500).json({ success: false, message: 'Failed to update verification.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === parseInt(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }

    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    await logAdminAction(req.user.id, 'DELETE_USER', id);
    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

exports.toggleUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === parseInt(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role.' });
    }

    const [users] = await pool.query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });

    const newRole = users[0].role === 'admin' ? 'user' : 'admin';
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [newRole, id]);
    await logAdminAction(req.user.id, 'CHANGE_ROLE', id);
    res.status(200).json({ success: true, data: { role: newRole }, message: `Role updated to ${newRole}.` });
  } catch (error) {
    console.error('toggleUserRole error:', error);
    res.status(500).json({ success: false, message: 'Failed to update role.' });
  }
};

// ─── Admin Logs ──────────────────────────────────────────────────────────────

exports.getAdminLogs = async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT al.id, al.action, al.created_at,
        admin.name as admin_name, admin.email as admin_email,
        target.name as target_name, target.email as target_email
      FROM admin_logs al
      JOIN users admin ON al.admin_id = admin.id
      LEFT JOIN users target ON al.target_user_id = target.id
      ORDER BY al.created_at DESC LIMIT 100
    `);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('getAdminLogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to load logs.' });
  }
};
