// BadgeController: Manage badge catalog and earned badge records.
const pool = require('../config/db');

exports.getAllBadges = async (req, res) => {
  try {
    const [badges] = await pool.query('SELECT id, name, description FROM badges ORDER BY id ASC');
    res.status(200).json({ success: true, data: badges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT b.id, b.name, b.description, ub.earned_at
       FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       WHERE ub.user_id = ?
       ORDER BY ub.earned_at DESC`,
      [userId]
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.awardUserBadges = async (userId, badgeIds = []) => {
  if (!Array.isArray(badgeIds) || badgeIds.length === 0) {
    return [];
  }

  const uniqueBadgeIds = Array.from(new Set(badgeIds));
  const [existingRows] = await pool.query(
    'SELECT badge_id FROM user_badges WHERE user_id = ? AND badge_id IN (?)',
    [userId, uniqueBadgeIds]
  );

  const existingSet = new Set(existingRows.map((row) => row.badge_id));
  const newBadgeIds = uniqueBadgeIds.filter((id) => !existingSet.has(id));

  if (newBadgeIds.length === 0) {
    return [];
  }

  const values = newBadgeIds.map((badgeId) => [userId, badgeId]);
  await pool.query('INSERT INTO user_badges (user_id, badge_id) VALUES ?', [values]);
  return newBadgeIds;
};
