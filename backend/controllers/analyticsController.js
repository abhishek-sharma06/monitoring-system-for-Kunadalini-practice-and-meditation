// Import database pool connection.
const pool = require('../config/db');

// Helper function to compute current and longest practice streaks.
const calculateStreaks = (datesList) => {
  if (datesList.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Strip timestamps and filter unique dates in ascending order.
  const uniqueDates = [...new Set(datesList.map(d => new Date(d).toDateString()))]
    .map(d => new Date(d))
    .sort((a, b) => a - b);

  let longest = 0;
  let current = 0;
  let tempStreak = 0;
  let previousDate = null;

  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    if (previousDate === null) {
      tempStreak = 1;
    } else {
      const diffTime = Math.abs(currentDate - previousDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        if (tempStreak > longest) longest = tempStreak;
        tempStreak = 1;
      }
    }
    previousDate = currentDate;
  }
  if (tempStreak > longest) longest = tempStreak;

  // Determine current streak. Check if last practice was today or yesterday.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastPracticeDate = uniqueDates[uniqueDates.length - 1];
  lastPracticeDate.setHours(0, 0, 0, 0);

  if (lastPracticeDate.getTime() === today.getTime() || lastPracticeDate.getTime() === yesterday.getTime()) {
    current = tempStreak;
  } else {
    current = 0;
  }

  return { currentStreak: current, longestStreak: longest };
};

// Retrieve aggregate summary metrics for the authenticated user.
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch aggregate statistics.
    const [summaryResult] = await pool.query(
      `SELECT 
        COUNT(*) as total_sessions,
        ROUND(COALESCE(AVG(score), 0), 1) as avg_score,
        COALESCE(SUM(duration_minutes), 0) as total_duration_minutes,
        COALESCE(MAX(score), 0) as best_score,
        ROUND(COALESCE(AVG(CAST(mood_after AS SIGNED) - CAST(mood_before AS SIGNED)), 0), 1) as avg_mood_improvement
       FROM sessions WHERE user_id = ?`,
      [userId]
    );

    // Fetch most practiced chakra.
    const [chakraResult] = await pool.query(
      `SELECT chakra_focus FROM sessions 
       WHERE user_id = ? AND chakra_focus IS NOT NULL 
       GROUP BY chakra_focus ORDER BY COUNT(*) DESC LIMIT 1`,
      [userId]
    );
    const most_practiced_chakra = chakraResult.length > 0 ? chakraResult[0].chakra_focus : 'None';

    // Fetch sessions logged this week.
    const [weeklyResult] = await pool.query(
      `SELECT COUNT(*) as count FROM sessions 
       WHERE user_id = ? AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)`,
      [userId]
    );
    const sessions_this_week = weeklyResult[0].count;

    // Fetch all session dates to evaluate streaks.
    const [datesResult] = await pool.query(
      'SELECT created_at FROM sessions WHERE user_id = ? ORDER BY created_at ASC',
      [userId]
    );
    const dates = datesResult.map(row => row.created_at);
    const { currentStreak, longestStreak } = calculateStreaks(dates);

    res.status(200).json({
      success: true,
      data: {
        total_sessions: summaryResult[0].total_sessions,
        avg_score: Number(summaryResult[0].avg_score),
        total_duration_minutes: Number(summaryResult[0].total_duration_minutes),
        best_score: Number(summaryResult[0].best_score),
        most_practiced_chakra,
        avg_mood_improvement: Number(summaryResult[0].avg_mood_improvement),
        sessions_this_week,
        current_streak: currentStreak,
        longest_streak: longestStreak
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve trend details (over time / distribution) for charts.
exports.getTrends = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch scores over time.
    const [scoreOverTime] = await pool.query(
      `SELECT DATE(created_at) as date, ROUND(AVG(score), 1) as avg_score 
       FROM sessions WHERE user_id = ? 
       GROUP BY DATE(created_at) ORDER BY date ASC`,
      [userId]
    );

    // Fetch session counts per week.
    const [sessionsPerWeek] = await pool.query(
      `SELECT YEARWEEK(created_at, 1) as week, COUNT(*) as count 
       FROM sessions WHERE user_id = ? 
       GROUP BY YEARWEEK(created_at, 1) ORDER BY week ASC`,
      [userId]
    );

    // Fetch distribution across chakras.
    const [chakraDistribution] = await pool.query(
      `SELECT chakra_focus, COUNT(*) as count 
       FROM sessions WHERE user_id = ? AND chakra_focus IS NOT NULL 
       GROUP BY chakra_focus ORDER BY count DESC`,
      [userId]
    );

    // Fetch emotional state trends.
    const [moodTrend] = await pool.query(
      `SELECT DATE(created_at) as date, 
        ROUND(AVG(mood_before), 1) as avg_before, 
        ROUND(AVG(mood_after), 1) as avg_after 
       FROM sessions WHERE user_id = ? 
       GROUP BY DATE(created_at) ORDER BY date ASC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        score_over_time: scoreOverTime,
        sessions_per_week: sessionsPerWeek,
        chakra_distribution: chakraDistribution,
        mood_trend: moodTrend
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upsert target goal settings for user.
exports.upsertGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weekly_sessions_target } = req.body;

    if (!weekly_sessions_target || weekly_sessions_target < 1) {
      return res.status(400).json({ success: false, message: 'Invalid target value.' });
    }

    // Insert or update target config.
    await pool.query(
      `INSERT INTO goals (user_id, weekly_sessions_target) VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE weekly_sessions_target = ?`,
      [userId, weekly_sessions_target, weekly_sessions_target]
    );

    res.status(200).json({ success: true, message: 'Goal updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve user's weekly goals and percentage completion.
exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch target weekly target, default to 5 if not config'd.
    const [goals] = await pool.query('SELECT weekly_sessions_target FROM goals WHERE user_id = ?', [userId]);
    const weekly_target = goals.length > 0 ? goals[0].weekly_sessions_target : 5;

    // Fetch sessions logged during current week.
    const [weeklyResult] = await pool.query(
      `SELECT COUNT(*) as count FROM sessions 
       WHERE user_id = ? AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)`,
      [userId]
    );
    const sessions_this_week = weeklyResult[0].count;

    const progress_percentage = Math.min(100, Math.round((sessions_this_week / weekly_target) * 100));

    res.status(200).json({
      success: true,
      data: {
        weekly_target,
        sessions_this_week,
        progress_percentage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
