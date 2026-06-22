const express = require('express');
const badgeController = require('../controllers/badgeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public catalog of badge definitions.
router.get('/', badgeController.getAllBadges);

// Authenticated endpoint to fetch badges earned by the current user.
router.get('/earned', authMiddleware, badgeController.getUserBadges);

module.exports = router;
