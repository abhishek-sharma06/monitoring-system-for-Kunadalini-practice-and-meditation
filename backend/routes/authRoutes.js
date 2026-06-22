// Import Express, controllers, validators, rate limiters, and verification middleware.
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to handle user registration with request body validators.
router.post(
  '/register',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Enter a valid email address.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter.')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number.')
  ],
  authController.register
);

// Route to verify account email via validation token.
router.get('/verify', authLimiter, authController.verifyEmail);

// Route to request resending account verification email.
router.post('/resend-verification', authLimiter, authController.resendVerification);

// Route to authenticate credentials and sign login token.
router.post('/login', authLimiter, authController.login);

// Route to request recovery token for forgotten password.
router.post('/forgot-password', authLimiter, authController.forgotPassword);

// Route to update password credentials via validation token.
router.post(
  '/reset-password',
  authLimiter,
  [
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter.')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number.')
  ],
  authController.resetPassword
);

// Route to retrieve logged in user profile information.
router.get('/me', authMiddleware, authController.getMe);

// Route to mark safety disclaimer as accepted by authenticated user.
router.post('/accept-disclaimer', authMiddleware, authController.acceptDisclaimer);

// Export router.
module.exports = router;
