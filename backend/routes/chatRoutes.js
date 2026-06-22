const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// Per-user rate limiter for chat to prevent abuse (10 requests per minute)
const chatLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	keyGenerator: (req) => {
		if (req.user?.id) return String(req.user.id);
		return ipKeyGenerator(req);
	},
	standardHeaders: true,
	legacyHeaders: false
});

// Protected chat endpoint — accepts { message }
router.post('/', auth, chatLimiter, chatController.chat);

module.exports = router;
