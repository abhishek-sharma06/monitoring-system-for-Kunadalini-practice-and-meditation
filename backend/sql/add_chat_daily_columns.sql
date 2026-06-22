-- Add daily chat counters to users for per-user daily quotas
ALTER TABLE users
  ADD COLUMN daily_chat_count INT DEFAULT 0,
  ADD COLUMN daily_chat_count_date DATE DEFAULT NULL;

-- Optional: create an index to speed lookups by date
CREATE INDEX IF NOT EXISTS idx_users_daily_chat_date ON users(daily_chat_count_date);

-- Add breath/mantra/5D tracking columns to sessions
ALTER TABLE sessions
  ADD COLUMN breath_cycles INT DEFAULT 0,
  ADD COLUMN breath_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN mantra_played BOOLEAN DEFAULT FALSE,
  ADD COLUMN five_d_score DECIMAL(5,2) DEFAULT NULL;

-- Add overall 5D index columns to sessions for before/after comparison
ALTER TABLE sessions
  ADD COLUMN overall_index_before DECIMAL(5,2) DEFAULT NULL,
  ADD COLUMN overall_index_after DECIMAL(5,2) DEFAULT NULL;

-- Add 5D score columns to sessions if missing (physical, prana, mind, emotion, spiritual)
-- These columns may be missing if the sessions table was created before they were added to the schema
ALTER TABLE sessions
  ADD COLUMN physical_score DECIMAL(5,2) DEFAULT NULL,
  ADD COLUMN prana_score DECIMAL(5,2) DEFAULT NULL,
  ADD COLUMN mind_score DECIMAL(5,2) DEFAULT NULL,
  ADD COLUMN emotion_score DECIMAL(5,2) DEFAULT NULL,
  ADD COLUMN spiritual_score DECIMAL(5,2) DEFAULT NULL;

-- Add program_day_id column to sessions if missing
ALTER TABLE sessions
  ADD COLUMN program_day_id INT DEFAULT NULL;
