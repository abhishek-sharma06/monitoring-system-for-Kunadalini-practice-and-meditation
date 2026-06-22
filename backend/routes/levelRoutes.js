// Import Express, validators, level controller, and auth middleware.
const express = require('express');
const { body } = require('express-validator');
const levelController = require('../controllers/levelController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/level/quiz - Submit onboarding quiz answers and calculate initial level (protected route).
router.post(
  '/quiz',
  authMiddleware,
  [
    body('q1_meditation_experience').notEmpty().withMessage('Question 1 answer is required.'),
    body('q2_pranayama_knowledge').notEmpty().withMessage('Question 2 answer is required.'),
    body('q3_session_duration').notEmpty().withMessage('Question 3 answer is required.')
  ],
  levelController.submitQuiz
);

// GET /api/level/status - Fetch user's current level and progress info (protected route).
router.get('/status', authMiddleware, levelController.getLevelStatus);

// POST /api/level/upgrade - Confirm level upgrade for eligible user (protected route).
router.post('/upgrade', authMiddleware, levelController.upgradeLevel);

// Export router.
module.exports = router;
