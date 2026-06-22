// Import Express, controllers, validators, and authentication middleware.
const express = require('express');
const { body } = require('express-validator');
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authorization guard to all session routes.
router.use(authMiddleware);

// Route to log a new session with request body validation.
router.post(
  '/',
  [
    body('duration_minutes').isInt({ min: 1 }).withMessage('Duration must be a positive integer.'),
    body('score').isDecimal().withMessage('Score must be a decimal value.'),
    body('poses_detected').isInt({ min: 0 }).withMessage('Poses detected count must be a non-negative integer.'),
    body('chakra_focus').optional().isString().withMessage('Chakra focus must be a string value.'),
    body('mood_before').isInt({ min: 1, max: 5 }).withMessage('Mood before must be an integer between 1 and 5.'),
    body('mood_after').isInt({ min: 1, max: 5 }).withMessage('Mood after must be an integer between 1 and 5.'),
    body('notes').optional().isString().withMessage('Notes must be a text value.')
  ],
  sessionController.createSession
);

// Route to query user's paginated session list.
router.get('/', sessionController.getSessions);

// Route to fetch all exercises content.
router.get('/exercises', sessionController.getExercises);

// Route to fetch details of a specific session.
router.get('/:id', sessionController.getSessionById);

// Route to remove a logged session.
router.delete('/:id', sessionController.deleteSession);

// Export router.
module.exports = router;
