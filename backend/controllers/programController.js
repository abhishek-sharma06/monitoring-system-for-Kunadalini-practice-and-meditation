// Import database pool and validation helpers.
const pool = require('../config/db');
const badgeController = require('./badgeController');
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

// Calculate 5D scores from session metrics.
// Expects: pose_confidence, shake_count, breath_cycles_completed, breath_cycles_assigned, 
//          distraction_count, positive_expression_frames, total_frames, mantra_played, duration_minutes, target_duration_minutes
const calculate5DScores = (metrics) => {
  const {
    pose_confidence = 75,      // avg confidence 0-100
    shake_count = 0,           // number of shakes detected
    breath_cycles_completed = 0,
    breath_cycles_assigned = 3,
    distraction_count = 0,     // estimated distractions
    positive_expression_frames = 0,
    total_frames = 100,
    mantra_played = false,
    duration_minutes = 0,
    target_duration_minutes = 10
  } = metrics;

  // Physical: pose confidence - penalties for shakiness
  const physical_score = Math.max(0, Math.min(100, pose_confidence - (shake_count * 2)));

  // Prana: duration ratio + bonus for completing breath cycles
  const prana_score = Math.max(
    0,
    Math.min(
      100,
      (duration_minutes / Math.max(target_duration_minutes, 1)) * 100 + 
      (breath_cycles_completed >= breath_cycles_assigned ? 10 : 0)
    )
  );

  // Mind: penalty for distractions
  const mind_score = Math.max(0, 100 - (distraction_count * 5));

  // Emotion: positive expression frames ratio (requires face-api.js data from frontend)
  const emotion_score = total_frames > 0 
    ? (positive_expression_frames / total_frames) * 100 
    : 50; // Default if no face data

  // Spiritual: mantra completion + breath cycle ratio
  const spiritual_score = 
    (mantra_played ? 50 : 0) + 
    (breath_cycles_assigned > 0 
      ? (Math.min(breath_cycles_completed, breath_cycles_assigned) / breath_cycles_assigned) * 50 
      : 0);

  return {
    physical_score: Math.round(physical_score * 100) / 100,
    prana_score: Math.round(prana_score * 100) / 100,
    mind_score: Math.round(mind_score * 100) / 100,
    emotion_score: Math.round(emotion_score * 100) / 100,
    spiritual_score: Math.round(spiritual_score * 100) / 100
  };
};


// GET /api/programs — Return all 3 programs with descriptions.
exports.listPrograms = async (req, res) => {
  try {
    const [programs] = await pool.query(
      'SELECT id, name, level, total_days, description FROM programs ORDER BY total_days ASC'
    );

    res.status(200).json({
      success: true,
      data: programs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/programs/:id/days — Return all days for a program with lock/unlock/completion status for logged-in user.
exports.getProgramDays = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Fetch program details.
    const [programs] = await pool.query(
      'SELECT * FROM programs WHERE id = ?',
      [id]
    );

    if (programs.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    const program = programs[0];

    // Fetch all days for this program.
    const [days] = await pool.query(
      'SELECT * FROM program_days WHERE program_id = ? ORDER BY day_number ASC',
      [id]
    );

    // If user is authenticated, fetch their progress and completion status for this program.
    let userProgress = null;
    let completedDays = [];

    if (userId) {
      const [progressRows] = await pool.query(
        'SELECT * FROM user_program_progress WHERE user_id = ? AND program_id = ?',
        [userId, id]
      );

      if (progressRows.length > 0) {
        userProgress = progressRows[0];

        // Fetch completed days for this user in this program.
        const [completions] = await pool.query(
          `SELECT program_day_id FROM day_completions 
           WHERE user_id = ? AND program_day_id IN (
             SELECT id FROM program_days WHERE program_id = ?
           )`,
          [userId, id]
        );
        completedDays = completions.map(c => c.program_day_id);
      }
    }

    // Enrich days with status: 'completed' | 'current' (unlocked) | 'locked'
    const enrichedDays = days.map((day, idx) => {
      let status = 'locked';

      if (userProgress) {
        if (completedDays.includes(day.id)) {
          status = 'completed';
        } else if (day.day_number <= userProgress.current_day) {
          status = 'unlocked';
        }
      } else {
        // Not started program — only day 1 is unlocked.
        if (day.day_number === 1) {
          status = 'unlocked';
        }
      }

      return {
        ...day,
        status
      };
    });

    res.status(200).json({
      success: true,
      data: {
        program,
        days: enrichedDays,
        userProgress: userProgress || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/programs/:id/start — Create user_program_progress row, set current_day = 1.
exports.startProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify program exists.
    const [programs] = await pool.query(
      'SELECT * FROM programs WHERE id = ?',
      [id]
    );

    if (programs.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    // Check if user already has this program in progress.
    const [existing] = await pool.query(
      'SELECT * FROM user_program_progress WHERE user_id = ? AND program_id = ?',
      [userId, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already started this program.'
      });
    }

    // Enforce user level access on program start.
    const [userRows] = await pool.query('SELECT level FROM users WHERE id = ?', [userId]);
    const userLevel = userRows[0]?.level || 'beginner';
    const accessRank = { beginner: 1, intermediate: 2, advanced: 3 };

    if (!accessRank[userLevel] || accessRank[userLevel] < accessRank[program.level]) {
      return res.status(403).json({
        success: false,
        message: `Your current level (${userLevel}) cannot start the ${program.level} program yet.`
      });
    }

    // Create new user_program_progress record.
    const [result] = await pool.query(
      'INSERT INTO user_program_progress (user_id, program_id, current_day, status) VALUES (?, ?, 1, ?)',
      [userId, id, 'in_progress']
    );

    const [newProgress] = await pool.query(
      'SELECT * FROM user_program_progress WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Program started successfully.',
      data: newProgress[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/programs/active — Return user's current active program with current day details.
exports.getActiveProgram = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user's active (in_progress) program.
    const [progresses] = await pool.query(
      `SELECT upp.*, p.* FROM user_program_progress upp
       JOIN programs p ON upp.program_id = p.id
       WHERE upp.user_id = ? AND upp.status = 'in_progress'
       LIMIT 1`,
      [userId]
    );

    if (progresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active program found. Start a new program to begin.'
      });
    }

    const progress = progresses[0];

    // Fetch the current day details.
    const [currentDay] = await pool.query(
      'SELECT * FROM program_days WHERE program_id = ? AND day_number = ?',
      [progress.program_id, progress.current_day]
    );

    // Fetch all days for progress bar calculation.
    const [allDays] = await pool.query(
      'SELECT id FROM program_days WHERE program_id = ?',
      [progress.program_id]
    );

    // Count completed days for this program.
    const [completedDays] = await pool.query(
      `SELECT COUNT(*) as count FROM day_completions
       WHERE user_id = ? AND program_day_id IN (
         SELECT id FROM program_days WHERE program_id = ?
       )`,
      [userId, progress.program_id]
    );

    res.status(200).json({
      success: true,
      data: {
        program: {
          id: progress.program_id,
          name: progress.name,
          level: progress.level,
          total_days: progress.total_days
        },
        userProgress: {
          current_day: progress.current_day,
          status: progress.status,
          started_at: progress.started_at
        },
        currentDay: currentDay.length > 0 ? currentDay[0] : null,
        progressMetrics: {
          completedDays: completedDays[0].count,
          totalDays: allDays.length,
          percentComplete: Math.round((completedDays[0].count / allDays.length) * 100)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/programs/day/:dayId/complete — Complete a program day with session data and metrics.
exports.completeDay = async (req, res) => {
  try {
    if (handleValidation(req, res)) return;

    const { dayId } = req.params;
    const userId = req.user.id;
    const {
      duration_minutes,
      mood_before,
      mood_after,
      pose_confidence,
      shake_count,
      breath_cycles_completed,
      breath_cycles_assigned,
      distraction_count,
      positive_expression_frames,
      total_frames,
      mantra_played,
      target_duration_minutes,
      notes,
      before_metrics
    } = req.body;

    // Fetch program_day details.
    const [programDays] = await pool.query(
      'SELECT * FROM program_days WHERE id = ?',
      [dayId]
    );

    if (programDays.length === 0) {
      return res.status(404).json({ success: false, message: 'Program day not found.' });
    }

    const programDay = programDays[0];

    // Check if user has already completed this day.
    const [existingCompletion] = await pool.query(
      'SELECT * FROM day_completions WHERE user_id = ? AND program_day_id = ?',
      [userId, dayId]
    );

    if (existingCompletion.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this day.'
      });
    }

    const actualDuration = duration_minutes !== undefined && duration_minutes !== null
      ? duration_minutes
      : target_duration_minutes || 10;

    // Calculate 5D scores - BEFORE (from initial snapshot) and AFTER (from completed session)
    const beforeScores = calculate5DScores(before_metrics || {
      pose_confidence: 0,
      shake_count: 0,
      breath_cycles_completed: 0,
      breath_cycles_assigned: breath_cycles_assigned || 3,
      distraction_count: 0,
      positive_expression_frames: 0,
      total_frames: 100,
      mantra_played: false,
      duration_minutes: 0,
      target_duration_minutes: target_duration_minutes || 10
    });

    const afterScores = calculate5DScores({
      pose_confidence,
      shake_count,
      breath_cycles_completed,
      breath_cycles_assigned,
      distraction_count,
      positive_expression_frames,
      total_frames,
      mantra_played,
      duration_minutes: actualDuration,
      target_duration_minutes: target_duration_minutes || 10
    });

    // Compute overall 5D index before/after
    const computeOverall = (s) => Math.round(((s.physical_score + s.prana_score + s.mind_score + s.emotion_score + s.spiritual_score) / 5) * 100) / 100;
    const overall_index_before = computeOverall(beforeScores);
    const overall_index_after = computeOverall(afterScores);

    // Create session record linked to program_day.
    const [sessionResult] = await pool.query(
      `INSERT INTO sessions (
        user_id, duration_minutes, mood_before, mood_after,
        physical_score, prana_score, mind_score, emotion_score, spiritual_score,
        overall_index_before, overall_index_after,
        program_day_id, chakra_focus, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, actualDuration, mood_before, mood_after,
        afterScores.physical_score, afterScores.prana_score, afterScores.mind_score, 
        afterScores.emotion_score, afterScores.spiritual_score,
        overall_index_before, overall_index_after,
        dayId, programDay.chakra_focus, notes || null
      ]
    );

    const sessionId = sessionResult.insertId;

    // Determine badge awards from this completed session.
    const [sessionCountRows] = await pool.query(
      'SELECT COUNT(*) AS count FROM sessions WHERE user_id = ?',
      [userId]
    );
    const totalUserSessions = sessionCountRows[0]?.count || 0;
    const badgeCandidates = [];

    if (totalUserSessions === 1) {
      badgeCandidates.push('first_session');
    }
    if (breath_cycles_assigned > 0 && breath_cycles_completed >= breath_cycles_assigned) {
      badgeCandidates.push('breath_novice');
    }
    if (mantra_played) {
      badgeCandidates.push('mantra_initiate');
    }
    const averageScore = (
      afterScores.physical_score + afterScores.prana_score + afterScores.mind_score + afterScores.emotion_score + afterScores.spiritual_score
    ) / 5;
    if (averageScore >= 80) {
      badgeCandidates.push('five_d_high');
    }
    if (totalUserSessions >= 10) {
      badgeCandidates.push('consistency_10');
    }

    // Record day completion.
    await pool.query(
      'INSERT INTO day_completions (user_id, program_day_id, session_id) VALUES (?, ?, ?)',
      [userId, dayId, sessionId]
    );

    const newBadges = await badgeController.awardUserBadges(userId, badgeCandidates);

    // Fetch user's program progress.
    const [progresses] = await pool.query(
      'SELECT * FROM user_program_progress WHERE user_id = ? AND program_id = ?',
      [userId, programDay.program_id]
    );

    if (progresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User program progress not found.'
      });
    }

    const progress = progresses[0];

    // Get the program to check total days.
    const [programs] = await pool.query(
      'SELECT * FROM programs WHERE id = ?',
      [programDay.program_id]
    );

    const program = programs[0];

    // Unlock next day (only if current day matches what we just completed).
    let nextDayNumber = progress.current_day + 1;
    let newStatus = 'in_progress';

    if (nextDayNumber > program.total_days) {
      // Program is now complete.
      nextDayNumber = program.total_days; // Reset to last day
      newStatus = 'completed';
    }

    await pool.query(
      'UPDATE user_program_progress SET current_day = ?, status = ? WHERE user_id = ? AND program_id = ?',
      [nextDayNumber, newStatus, userId, programDay.program_id]
    );

    // Fetch the 5D scores (before/after) for insight screen.
    const insightData = {
      sessionId: sessionId,
      before: beforeScores,
      after: afterScores,
      mood: { before: mood_before, after: mood_after },
      moodChange: (mood_after || 0) - (mood_before || 0)
    };

    res.status(201).json({
      success: true,
      message: 'Day completed successfully.',
      data: {
        session: {
          id: sessionId,
          program_day_id: dayId,
          scores: afterScores
        },
        programProgress: {
          current_day: nextDayNumber,
          status: newStatus,
          totalDays: program.total_days,
          percentComplete: Math.round((nextDayNumber / program.total_days) * 100)
        },
        insightData,
        newBadges
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;
