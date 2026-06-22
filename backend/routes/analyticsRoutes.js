// Import Express, controllers, validation, and authentication checks.
const express = require('express');
const { body } = require('express-validator');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth verify middleware to all analytics endpoints.
router.use(authMiddleware);

// Route to get aggregate summary statistics.
router.get('/summary', analyticsController.getSummary);

// Route to get charts historical datasets.
router.get('/trends', analyticsController.getTrends);

// Route to upsert weekly session targets.
router.post(
  '/goals',
  [
    body('weekly_sessions_target').isInt({ min: 1 }).withMessage('Weekly target must be a positive integer.')
  ],
  analyticsController.upsertGoal
);

// Route to fetch weekly target completion rates.
router.get('/goals', analyticsController.getGoals);

// Export router.
module.exports = router;
