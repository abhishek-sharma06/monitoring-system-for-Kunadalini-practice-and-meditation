// Import pool connection.
const pool = require('../config/db');
const { validationResult } = require('express-validator');
const levelController = require('./levelController'); // Import level controller for upgrade checks

// Helper to standardise express-validation error results.
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return true;
  }
  return false;
};

// Create a new practice session entry and update level progress tracking.
exports.createSession = async (req, res) => {
  try {
    if (handleValidation(req, res)) return;
    
    const { duration_minutes, score, poses_detected, chakra_focus, mood_before, mood_after, notes, breath_cycles, breath_completed, mantra_played, five_d_score, five_d } = req.body;
    const userId = req.user.id;

    // Compute overall 5D index before/after if five_d data is provided
    let overall_index_before = null;
    let overall_index_after = null;
    if (five_d) {
      // If before/after metrics are available, compute both indices
      const beforeMetrics = req.body.before_metrics;
      const afterMetrics = req.body.after_metrics;
      if (beforeMetrics && afterMetrics) {
        // Before index: computed from baseline (all zeros = low score)
        const bPhy = beforeMetrics.pose_confidence || 0;
        const bPra = beforeMetrics.breath_cycles_assigned > 0
          ? (beforeMetrics.breath_cycles_completed / beforeMetrics.breath_cycles_assigned) * 100 : 0;
        const bMind = Math.max(0, 100 - (beforeMetrics.distraction_count || 0) * 5);
        const bEmo = beforeMetrics.total_frames > 0
          ? (beforeMetrics.positive_expression_frames / beforeMetrics.total_frames) * 100 : 50;
        const bSpir = (beforeMetrics.mantra_played ? 50 : 0) +
          (beforeMetrics.breath_cycles_assigned > 0
            ? (Math.min(beforeMetrics.breath_cycles_completed, beforeMetrics.breath_cycles_assigned) / beforeMetrics.breath_cycles_assigned) * 50 : 0);
        overall_index_before = Math.round(((bPhy + bPra + bMind + bEmo + bSpir) / 5) * 100) / 100;

        // After index: computed from session results
        const aPhy = afterMetrics.pose_confidence || 0;
        const aPra = afterMetrics.breath_cycles_assigned > 0
          ? (afterMetrics.breath_cycles_completed / afterMetrics.breath_cycles_assigned) * 100 : 0;
        const aMind = Math.max(0, 100 - (afterMetrics.distraction_count || 0) * 5);
        const aEmo = afterMetrics.total_frames > 0
          ? (afterMetrics.positive_expression_frames / afterMetrics.total_frames) * 100 : 50;
        const aSpir = (afterMetrics.mantra_played ? 50 : 0) +
          (afterMetrics.breath_cycles_assigned > 0
            ? (Math.min(afterMetrics.breath_cycles_completed, afterMetrics.breath_cycles_assigned) / afterMetrics.breath_cycles_assigned) * 50 : 0);
        overall_index_after = Math.round(((aPhy + aPra + aMind + aEmo + aSpir) / 5) * 100) / 100;
      } else {
        // Fallback: use the five_d object directly
        overall_index_before = five_d.physical !== undefined ? five_d.five_d_score : null;
        overall_index_after = five_d.five_d_score || null;
      }
    }

    // Insert session into database.
    const [result] = await pool.query(
      'INSERT INTO sessions (user_id, duration_minutes, score, poses_detected, chakra_focus, mood_before, mood_after, notes, breath_cycles, breath_completed, mantra_played, five_d_score, overall_index_before, overall_index_after) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, duration_minutes, score, poses_detected, chakra_focus, mood_before, mood_after, notes, breath_cycles || 0, breath_completed ? 1 : 0, mantra_played ? 1 : 0, five_d_score || null, overall_index_before, overall_index_after]
    );

    // Ensure a level_progress row exists for the user before incrementing.
    await pool.query(
      'INSERT INTO level_progress (user_id, sessions_at_current_level, eligible_for_upgrade) VALUES (?, 0, FALSE) ON DUPLICATE KEY UPDATE user_id = user_id',
      [userId]
    );

    // Increment sessions_at_current_level counter for level progression tracking
    await pool.query(
      'UPDATE level_progress SET sessions_at_current_level = sessions_at_current_level + 1 WHERE user_id = ?',
      [userId]
    );

    // Check if user is now eligible for level upgrade (10+ sessions AND avg score >= 70)
    await levelController.checkUpgradeEligibility(userId);

    // Retrieve the inserted session.
    const [sessions] = await pool.query('SELECT * FROM sessions WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, data: sessions[0], message: 'Session logged successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve paginated practice sessions list for authenticated user.
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch total sessions count.
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM sessions WHERE user_id = ?', [userId]);
    const total = countResult[0].total;

    // Fetch paginated sessions sorted by date.
    const [sessions] = await pool.query(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );

    res.status(200).json({
      success: true,
      data: {
        sessions,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve details for a single practice session belonging to authenticated user.
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Query session details.
    const [sessions] = await pool.query('SELECT * FROM sessions WHERE id = ?', [id]);
    if (sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const session = sessions[0];
    if (session.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access forbidden.' });
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a practice session entry belonging to authenticated user.
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Query session.
    const [sessions] = await pool.query('SELECT user_id FROM sessions WHERE id = ?', [id]);
    if (sessions.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (sessions[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access forbidden.' });
    }

    // Delete session from DB.
    await pool.query('DELETE FROM sessions WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Session deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve all yoga poses and meditation exercises for users.
exports.getExercises = async (req, res) => {
  try {
    const [exercises] = await pool.query('SELECT * FROM exercises ORDER BY id ASC');
    res.status(200).json({ success: true, data: exercises });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
