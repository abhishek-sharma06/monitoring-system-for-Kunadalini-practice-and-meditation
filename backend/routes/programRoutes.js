// Import Express, controllers, validators, and authentication middleware.
const express = require('express');
const { body } = require('express-validator');
const programController = require('../controllers/programController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/programs — List all 3 programs (public).
router.get('/', programController.listPrograms);

// GET /api/programs/active — Get user's current active program (requires auth).
router.get('/active', authMiddleware, programController.getActiveProgram);

// GET /api/programs/:id/days — Get all days for a program with status (requires auth for full details).
router.get('/:id/days', authMiddleware, programController.getProgramDays);

// POST /api/programs/:id/start — Start a program (requires auth).
router.post(
  '/:id/start',
  authMiddleware,
  programController.startProgram
);

// POST /api/programs/day/:dayId/complete — Complete a program day with session metrics.
router.post(
  '/day/:dayId/complete',
  authMiddleware,
  [
    body('duration_minutes').isInt({ min: 0 }).withMessage('Duration must be a non-negative integer.'),
    body('mood_before').isInt({ min: 1, max: 5 }).withMessage('Mood before must be 1-5.'),
    body('mood_after').isInt({ min: 1, max: 5 }).withMessage('Mood after must be 1-5.')
  ],
  programController.completeDay
);

module.exports = router;

