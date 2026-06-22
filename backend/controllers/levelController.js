// Import database pool and express validation for quiz endpoint.
const pool = require('../config/db');
const { validationResult } = require('express-validator');

// Helper to validate incoming requests - returns true if errors exist.
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return true;
  }
  return false;
};

// Determine initial level based on onboarding quiz answers.
// Quiz has 3 questions, each with options scored as: "beginner-level" = 1, "intermediate-level" = 2, "advanced-level" = 3
// Score ranges: 3-4 = beginner, 5-7 = intermediate, 8-9 = advanced
const calculateLevelFromQuiz = (q1Answer, q2Answer, q3Answer) => {
  // Map answer strings to scores
  const answerScores = {
    'never': 1, 'a_few_times': 2, 'regularly': 3,
    'no': 1, 'a_little': 2, 'yes_comfortable': 3,
    '5_10_min': 1, '15_20_min': 2, '20_30_min': 3
  };

  const score = (answerScores[q1Answer] || 0) + (answerScores[q2Answer] || 0) + (answerScores[q3Answer] || 0);

  // Determine level based on total score
  if (score <= 4) return 'beginner';
  if (score <= 7) return 'intermediate';
  return 'advanced';
};

// POST /api/level/quiz - Accept onboarding quiz answers and set initial user level.
exports.submitQuiz = async (req, res) => {
  try {
    if (handleValidation(req, res)) return;
    
    const userId = req.user.id;
    const { q1_meditation_experience, q2_pranayama_knowledge, q3_session_duration } = req.body;

    // Validate all three quiz answers are provided
    if (!q1_meditation_experience || !q2_pranayama_knowledge || !q3_session_duration) {
      return res.status(400).json({ success: false, message: 'All quiz answers are required.' });
    }

    // Calculate level based on quiz responses
    const level = calculateLevelFromQuiz(q1_meditation_experience, q2_pranayama_knowledge, q3_session_duration);

    // Update user's level in database
    await pool.query('UPDATE users SET level = ? WHERE id = ?', [level, userId]);

    // Create or reset the user's level_progress row so the new level is tracked correctly.
    await pool.query(
      'INSERT INTO level_progress (user_id, sessions_at_current_level, eligible_for_upgrade, last_level_change) VALUES (?, 0, FALSE, NOW()) ON DUPLICATE KEY UPDATE sessions_at_current_level = 0, eligible_for_upgrade = FALSE, last_level_change = NOW()',
      [userId]
    );

    res.status(200).json({ 
      success: true, 
      message: 'Quiz submitted successfully.',
      data: { level, message: `Welcome to the ${level} level!` }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/level/status - Return user's current level, session count at level, and upgrade eligibility.
exports.getLevelStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Query user's current level and level_progress info
    const [users] = await pool.query('SELECT level FROM users WHERE id = ?', [userId]);
    const [progress] = await pool.query(
      'SELECT sessions_at_current_level, eligible_for_upgrade FROM level_progress WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let progressData;
    if (progress.length === 0) {
      await pool.query(
        'INSERT INTO level_progress (user_id, sessions_at_current_level, eligible_for_upgrade) VALUES (?, 0, FALSE)',
        [userId]
      );
      progressData = { sessions_at_current_level: 0, eligible_for_upgrade: false };
    } else {
      progressData = progress[0];
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      data: {
        level: user.level,
        sessions_at_current_level: progressData.sessions_at_current_level,
        eligible_for_upgrade: progressData.eligible_for_upgrade,
        sessions_until_next_level: Math.max(0, 10 - progressData.sessions_at_current_level)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/level/upgrade - Confirm and execute level upgrade for eligible user.
// Validates user is eligible, upgrades level, resets session counter.
exports.upgradeLevel = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch current level and eligibility
    const [users] = await pool.query('SELECT level FROM users WHERE id = ?', [userId]);
    const [progress] = await pool.query(
      'SELECT eligible_for_upgrade FROM level_progress WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (progress.length === 0) {
      return res.status(404).json({ success: false, message: 'Level progress record not found.' });
    }

    // Verify user is eligible for upgrade
    if (!progress[0].eligible_for_upgrade) {
      return res.status(400).json({ success: false, message: 'You are not eligible for upgrade yet.' });
    }

    const currentLevel = users[0].level;
    
    // Map current level to next level
    const levelProgression = { beginner: 'intermediate', intermediate: 'advanced', advanced: 'advanced' };
    const nextLevel = levelProgression[currentLevel];

    // Prevent upgrading beyond advanced
    if (currentLevel === 'advanced') {
      return res.status(400).json({ success: false, message: 'You are already at the highest level.' });
    }

    // Update user level and reset progress tracker
    await pool.query('UPDATE users SET level = ? WHERE id = ?', [nextLevel, userId]);
    await pool.query(
      'UPDATE level_progress SET sessions_at_current_level = 0, eligible_for_upgrade = FALSE, last_level_change = NOW() WHERE user_id = ?',
      [userId]
    );

    res.status(200).json({
      success: true,
      message: `Congratulations! You've reached ${nextLevel} level!`,
      data: { newLevel: nextLevel }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to check and update upgrade eligibility after session completion.
// Called from sessionController after session is saved.
// Checks if user completed 10+ sessions AND avg score from last 5 sessions >= 70.
exports.checkUpgradeEligibility = async (userId) => {
  try {
    // Get level_progress info for user
    const [progress] = await pool.query(
      'SELECT sessions_at_current_level FROM level_progress WHERE user_id = ?',
      [userId]
    );

    if (progress.length === 0) return;

    // Get user's current level
    const [users] = await pool.query('SELECT level FROM users WHERE id = ?', [userId]);
    if (users.length === 0 || users[0].level === 'advanced') return;

    const sessionsAtLevel = progress[0].sessions_at_current_level;

    // Must have completed at least 10 sessions at current level
    if (sessionsAtLevel < 10) return;

    // Get average score from last 5 sessions
    const [sessions] = await pool.query(
      'SELECT AVG(score) as avg_score FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const avgScore = sessions[0]?.avg_score || 0;

    // Set eligible_for_upgrade = true if avg_score >= 70
    if (avgScore >= 70) {
      await pool.query(
        'UPDATE level_progress SET eligible_for_upgrade = TRUE WHERE user_id = ?',
        [userId]
      );
    }
  } catch (error) {
    console.error('Error checking upgrade eligibility:', error);
  }
};
