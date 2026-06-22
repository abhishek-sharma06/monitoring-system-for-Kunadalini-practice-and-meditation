// Import crypto for verification tokens, bcryptjs for hashing, and jsonwebtoken for session signatures.
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

// Helper to standardise express-validation error results.
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return true;
  }
  return false;
};

// Register user, create verification token, and dispatch email verification.
exports.register = async (req, res) => {
  try {
    if (handleValidation(req, res)) return;
    const { name, email, password } = req.body;

    // Check if email already exists in DB.
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email address already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Insert new user into database.
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, verification_token, token_expires_at) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, token, tokenExpires]
    );

    // Ensure level progression tracking is available for this new user.
    await pool.query(
      'INSERT INTO level_progress (user_id, sessions_at_current_level, eligible_for_upgrade) VALUES (?, 0, FALSE)',
      [result.insertId]
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyLink = `${clientUrl}/verify-email?token=${token}`;

    const htmlContent = `
      <div style="font-family: 'DM Sans', sans-serif; padding: 20px; color: #1A1A2E;">
        <h2>Verify your Kundalini account</h2>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <a href="${verifyLink}" style="background-color: #6B4FA0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Verify My Email</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `;

    const emailResult = await sendEmail({ to: email, subject: 'Verify your Kundalini account', html: htmlContent });

    // If email wasn't actually delivered, include the link in the response so the user can verify manually.
    const responsePayload = { success: true, message: 'Registration successful. Please check your email to verify your account.' };
    if (emailResult && !emailResult.delivered && emailResult.link) {
      responsePayload.message = 'Registration successful. Email could not be delivered — use the link below to verify your account.';
      responsePayload.verifyLink = emailResult.link;
    }

    res.status(201).json(responsePayload);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// Verify user email activation token from URL.
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required.' });
    }

    // Query user by verification token.
    const [users] = await pool.query('SELECT id, token_expires_at FROM users WHERE verification_token = ?', [token]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid verification link.' });
    }

    const user = users[0];
    if (new Date() > new Date(user.token_expires_at)) {
      return res.status(400).json({ success: false, message: 'Link expired. Please request a new one.' });
    }

    // Update verification status and clear token values.
    await pool.query(
      'UPDATE users SET is_verified = true, verification_token = NULL, token_expires_at = NULL WHERE id = ?',
      [user.id]
    );

    res.status(200).json({ success: true, message: 'Email verified. You can now login.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, message: 'Verification failed. Please try again.' });
  }
};

// Resend verification email to unverified accounts.
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Query user to verify status.
    const [users] = await pool.query('SELECT id, is_verified FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // Return success even if user not found to prevent email enumeration
      return res.status(200).json({ success: true, message: 'If an account exists, a verification email has been sent.' });
    }

    const user = users[0];
    if (user.is_verified) {
      return res.status(400).json({ success: false, message: 'Account is already verified.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Save newly generated token to db.
    await pool.query(
      'UPDATE users SET verification_token = ?, token_expires_at = ? WHERE id = ?',
      [token, tokenExpires, user.id]
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyLink = `${clientUrl}/verify-email?token=${token}`;

    const htmlContent = `
      <div style="font-family: 'DM Sans', sans-serif; padding: 20px; color: #1A1A2E;">
        <h2>Verify your Kundalini account</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verifyLink}" style="background-color: #6B4FA0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Verify My Email</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `;

    const emailResult = await sendEmail({ to: email, subject: 'Verify your Kundalini account', html: htmlContent });

    const responsePayload = { success: true, message: 'Verification email resent.' };
    if (emailResult && !emailResult.delivered && emailResult.link) {
      responsePayload.message = 'Email could not be delivered. Use the link below to verify.';
      responsePayload.verifyLink = emailResult.link;
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend verification email. Please try again.' });
  }
};

// Authenticate user credentials and return signed session token.
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Query user by email.
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = users[0];
    if (!user.is_verified) {
      return res.status(401).json({ success: false, isUnverified: true, message: 'Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, level: user.level }
      },
      message: 'Login successful.'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// Trigger password reset email dispatcher.
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Query user by email.
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    
    // We send same status message for security reasons.
    if (users.length === 0) {
      return res.status(200).json({ success: true, message: 'Reset email sent if account exists.' });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update reset token details (uses separate reset_token columns to avoid overwriting verification_token).
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?',
      [token, tokenExpires, user.id]
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl}/reset-password?token=${token}`;

    const htmlContent = `
      <div style="font-family: 'DM Sans', sans-serif; padding: 20px; color: #1A1A2E;">
        <h2>Reset your Kundalini password</h2>
        <p>Please click the button below to choose a new password:</p>
        <a href="${resetLink}" style="background-color: #6B4FA0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      </div>
    `;

    await sendEmail({ to: email, subject: 'Reset your Kundalini password', html: htmlContent });

    res.status(200).json({ success: true, message: 'Reset email sent if account exists.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request. Please try again.' });
  }
};

// Reset password using token sent in recovery email.
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    // Query user by reset token (uses separate reset_token column).
    const [users] = await pool.query('SELECT id, reset_token_expires_at FROM users WHERE reset_token = ?', [token]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }

    const user = users[0];
    if (new Date() > new Date(user.reset_token_expires_at)) {
      return res.status(400).json({ success: false, message: 'Link expired.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save new password and clear reset token columns.
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Password reset failed. Please try again.' });
  }
};

// Return authenticated user data.
exports.getMe = async (req, res) => {
  try {
    // Query authenticated user info.
    const [users] = await pool.query('SELECT id, name, email, role, level, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }
    res.status(200).json({ success: true, data: users[0] });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to load user profile.' });
  }
};

// Accept safety disclaimer - marks user as having read and accepted safety information for kundalini practice.
exports.acceptDisclaimer = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    // Update user record to mark disclaimer as accepted with current timestamp
    await pool.query(
      'UPDATE users SET safety_disclaimer_accepted = true, safety_disclaimer_accepted_at = NOW() WHERE id = ?',
      [req.user.id]
    );

    res.status(200).json({ success: true, message: 'Safety disclaimer accepted.' });
  } catch (error) {
    console.error('Accept disclaimer error:', error);
    res.status(500).json({ success: false, message: 'Failed to save disclaimer acceptance.' });
  }
};
