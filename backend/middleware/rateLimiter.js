// Import rate limiting module.
const rateLimit = require('express-rate-limit');

// Define standard rate limiter for general api endpoints.
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { success: false, message: 'Too many requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Define stricter rate limiter for sensitive authentication endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per window
  message: { success: false, message: 'Too many authentication attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Export rate limiting middlewares.
module.exports = { standardLimiter, authLimiter };
