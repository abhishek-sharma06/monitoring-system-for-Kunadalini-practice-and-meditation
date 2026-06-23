-- Query to create users table containing authentication info and verification tokens.
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  token_expires_at DATETIME,
  safety_disclaimer_accepted BOOLEAN DEFAULT FALSE,
  safety_disclaimer_accepted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query to create sessions table tracking details of individual practices.
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  duration_minutes INT,
  score DECIMAL(5,2),
  poses_detected INT,
  chakra_focus VARCHAR(50),
  mood_before TINYINT CHECK (mood_before BETWEEN 1 AND 5),
  mood_after TINYINT CHECK (mood_after BETWEEN 1 AND 5),
  physical_score DECIMAL(5,2),
  prana_score DECIMAL(5,2),
  mind_score DECIMAL(5,2),
  emotion_score DECIMAL(5,2),
  spiritual_score DECIMAL(5,2),
  overall_index_before DECIMAL(5,2),
  overall_index_after DECIMAL(5,2),
  program_day_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Query to create goals table containing weekly targets for each user.
CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  weekly_sessions_target INT DEFAULT 5,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Query to create admin_logs table tracking administrative actions.
CREATE TABLE IF NOT EXISTS admin_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(255),
  target_user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Query to create exercises table storing yoga poses and meditation techniques.
CREATE TABLE IF NOT EXISTS exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('yoga', 'meditation', 'breathwork') NOT NULL,
  chakra VARCHAR(50) NOT NULL,
  mantra VARCHAR(50) NOT NULL,
  duration_minutes INT DEFAULT 10,
  posture VARCHAR(255),
  purpose TEXT,
  benefits TEXT,
  video_url VARCHAR(255),
  caution TEXT,
  guidance TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query to create programs table for structured multi-day practice journeys.
CREATE TABLE IF NOT EXISTS programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
  total_days INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query to create program_days table for individual days within a program.
CREATE TABLE IF NOT EXISTS program_days (
  id INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  day_number INT NOT NULL,
  chakra_focus VARCHAR(50),
  is_rest_day BOOLEAN DEFAULT FALSE,
  session_length_minutes INT,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_program_day (program_id, day_number)
);

-- Query to create user_program_progress table tracking user's progress through a program.
CREATE TABLE IF NOT EXISTS user_program_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  current_day INT DEFAULT 1,
  status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_program (user_id, program_id)
);

-- Query to create level_progress table tracking user level progress and upgrade eligibility.
CREATE TABLE IF NOT EXISTS level_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  sessions_at_current_level INT DEFAULT 0,
  eligible_for_upgrade BOOLEAN DEFAULT FALSE,
  last_level_change TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_level (user_id)
);

-- Query to create day_completions table tracking when users complete program days.
CREATE TABLE IF NOT EXISTS day_completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  program_day_id INT NOT NULL,
  session_id INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_day_id) REFERENCES program_days(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
  UNIQUE KEY unique_day_completion (user_id, program_day_id)
);

-- Query to create badges catalog and earned badge records.
CREATE TABLE IF NOT EXISTS badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  badge_id VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_badge (user_id, badge_id)
);

INSERT IGNORE INTO badges (id, name, description)
VALUES
('first_session', 'First Session', 'Complete your first practice session'),
('breath_novice', 'Breath Novice', 'Complete a full breath practice cycle target once'),
('mantra_initiate', 'Mantra Initiate', 'Play at least one mantra during a session'),
('five_d_high', 'Elevated 5D', 'Achieve a 5D score of 80% or higher'),
('consistency_10', '10 Days Consistent', 'Log 10 practice sessions');

-- Admin user should be created via setup script or environment variables
-- See README.md for setup instructions

-- Seed statements to insert 3 structured programs.
INSERT IGNORE INTO programs (id, name, level, total_days, description)
VALUES
(1, '14-Day Foundation', 'beginner', 14, 'Master the foundational three chakras: Root, Sacral, and Solar Plexus. Perfect for beginners starting their Kundalini practice journey. Breath ratio: 4-4-4 seconds. Session length: 5-10 minutes. Breath of Fire is locked.'),
(2, '21-Day Chakra Balance', 'intermediate', 21, 'Explore all 7 chakras across 3 weekly cycles. Deepen your practice and learn chakra balancing techniques. Breath ratio: 6-6-6 seconds. Session length: 15-20 minutes. Breath of Fire: unlocked with guidance.'),
(3, '30-Day Full Awakening', 'advanced', 30, 'Complete Kundalini journey through all chakras with advanced combined sequences. Final week focuses on full LAM-VAM-RAM-YAM-HAM-OM-OM sequence. Breath ratio: 8-8-8 seconds progressing to 20-20-20. Session length: 20-30 minutes.');

-- Seed statements for Beginner 14-Day Foundation program days.
INSERT IGNORE INTO program_days (program_id, day_number, chakra_focus, is_rest_day, session_length_minutes)
VALUES
(1, 1, 'Root', FALSE, 8),
(1, 2, 'Root', FALSE, 8),
(1, 3, 'Sacral', FALSE, 8),
(1, 4, 'Sacral', FALSE, 8),
(1, 5, 'Solar Plexus', FALSE, 8),
(1, 6, 'Solar Plexus', FALSE, 8),
(1, 7, NULL, TRUE, 0),
(1, 8, 'Root (Deepen)', FALSE, 10),
(1, 9, 'Root (Deepen)', FALSE, 10),
(1, 10, 'Sacral (Deepen)', FALSE, 10),
(1, 11, 'Sacral (Deepen)', FALSE, 10),
(1, 12, 'Solar Plexus (Deepen)', FALSE, 10),
(1, 13, 'Solar Plexus (Deepen)', FALSE, 10),
(1, 14, 'Final Reflection & Level-up Check', FALSE, 10);

-- Seed statements for Intermediate 21-Day Chakra Balance program days (3 cycles).
INSERT IGNORE INTO program_days (program_id, day_number, chakra_focus, is_rest_day, session_length_minutes)
VALUES
(2, 1, 'Root', FALSE, 15),
(2, 2, 'Sacral', FALSE, 15),
(2, 3, 'Solar Plexus', FALSE, 15),
(2, 4, 'Heart', FALSE, 15),
(2, 5, 'Throat', FALSE, 15),
(2, 6, 'Third Eye', FALSE, 15),
(2, 7, NULL, TRUE, 0),
(2, 8, 'Root', FALSE, 18),
(2, 9, 'Sacral', FALSE, 18),
(2, 10, 'Solar Plexus', FALSE, 18),
(2, 11, 'Heart', FALSE, 18),
(2, 12, 'Throat', FALSE, 18),
(2, 13, 'Third Eye', FALSE, 18),
(2, 14, NULL, TRUE, 0),
(2, 15, 'Root', FALSE, 20),
(2, 16, 'Sacral', FALSE, 20),
(2, 17, 'Solar Plexus', FALSE, 20),
(2, 18, 'Heart', FALSE, 20),
(2, 19, 'Throat', FALSE, 20),
(2, 20, 'Third Eye + Crown', FALSE, 20),
(2, 21, NULL, TRUE, 0);

-- Seed statements for Advanced 30-Day Full Awakening program days.
INSERT IGNORE INTO program_days (program_id, day_number, chakra_focus, is_rest_day, session_length_minutes)
VALUES
(3, 1, 'Root', FALSE, 20),
(3, 2, 'Sacral', FALSE, 20),
(3, 3, 'Solar Plexus', FALSE, 20),
(3, 4, 'Heart', FALSE, 20),
(3, 5, 'Throat', FALSE, 20),
(3, 6, 'Third Eye', FALSE, 20),
(3, 7, NULL, TRUE, 0),
(3, 8, 'Root', FALSE, 23),
(3, 9, 'Sacral', FALSE, 23),
(3, 10, 'Solar Plexus', FALSE, 23),
(3, 11, 'Heart', FALSE, 23),
(3, 12, 'Throat', FALSE, 23),
(3, 13, 'Third Eye', FALSE, 23),
(3, 14, NULL, TRUE, 0),
(3, 15, 'Root', FALSE, 25),
(3, 16, 'Sacral', FALSE, 25),
(3, 17, 'Solar Plexus', FALSE, 25),
(3, 18, 'Heart', FALSE, 25),
(3, 19, 'Throat', FALSE, 25),
(3, 20, 'Third Eye', FALSE, 25),
(3, 21, 'Crown', FALSE, 25),
(3, 22, 'Root + Sacral Combined', FALSE, 28),
(3, 23, 'Sacral + Solar Plexus Combined', FALSE, 28),
(3, 24, 'Solar Plexus + Heart Combined', FALSE, 28),
(3, 25, NULL, TRUE, 0),
(3, 26, 'Heart + Throat Combined', FALSE, 28),
(3, 27, 'Throat + Third Eye Combined', FALSE, 28),
(3, 28, 'Third Eye + Crown Combined', FALSE, 28),
(3, 29, 'Full 7-Chakra Sequence (LAM-VAM-RAM-YAM-HAM-OM)', FALSE, 30),
(3, 30, 'Integration & Celebration', FALSE, 30);

-- Seed statements to insert original exercises.
INSERT IGNORE INTO exercises (id, name, type, chakra, mantra, duration_minutes, posture, purpose, benefits, video_url, caution, guidance)
VALUES 
(1, 'Nadi Shodhana (Alternate Nostril)', 'breathwork', 'Ida & Pingala', 'LAM', 8, 'Comfortable cross-legged', 'Balance left & right energies, purify nadis', 'Calmness, clarity, balanced energy', 'https://youtu.be/l11qFpRqhIQ?si=KYZvJ-ScbkxFpMR5', 'Avoid when congested or dizzy', 'Sit with spine straight. Use right thumb and ring finger to alternate nostrils. Gentle, even breath.'),
(2, 'Kapalabhati (Skull Shining)', 'breathwork', 'Muladhara & Manipura', 'VAM', 4, 'Seated upright', 'Energize body, cleanse', 'Alertness, detox, vitality', 'https://youtu.be/52TOhE94fEg?si=eR8QVN8O21j3xE8d', 'Avoid with high blood pressure or pregnancy', 'Short active exhalations and passive inhalations. Start slowly.'),
(3, 'Bija Mantras (Chakra Seed Sounds)', 'meditation', 'Individual chakras', 'OM', 15, 'Any meditative posture', 'Activate chakras', 'Vibrational alignment, awareness', 'https://youtu.be/NmAHY_tg9Es?si=RI6_Buw6kxV92xjo', 'Maintain steady breathing', 'Chant each bija (Lam, Vam, Ram...) with focused attention on corresponding chakra.'),
(4, 'Chakra Visualization (Lotus / Light)', 'meditation', 'Root to Crown', 'OM', 20, 'Seated spine straight', 'Guide Kundalini through chakras', 'Enhanced focus, inner vision', 'https://youtube.com/shorts/qGrIjou4ZcI?si=wyvLEWeIAebfJtHu', 'Avoid over-focus, stay grounded', 'Visualize each chakra as a spinning lotus of light rising through the spine.');
