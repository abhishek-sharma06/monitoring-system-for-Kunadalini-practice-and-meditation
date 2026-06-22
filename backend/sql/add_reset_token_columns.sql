-- Add separate columns for password reset tokens to avoid conflict with email verification tokens.
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires_at DATETIME DEFAULT NULL;
