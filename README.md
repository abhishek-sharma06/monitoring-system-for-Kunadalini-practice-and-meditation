# Kundalini Practice & Meditation Monitoring System

> A full-stack web application for tracking Kundalini yoga practices, chakra activation, meditation sessions, breathwork, and AI-powered pose detection — built with React, Node.js, and MySQL.

---

## Author

- **Abhishek Sharma M**
- GitHub: [abhishek-sharma06](https://github.com/abhishek-sharma06)
- LinkedIn: [abhisheksharma6](https://www.linkedin.com/in/abhisheksharma6)

---

## Overview

This platform helps practitioners track their spiritual journey through daily session logging, chakra-focused practice programs, breathwork and mantra guidance, and progress analytics across five dimensions of well-being. It includes a full admin panel for user management and a built-in AI assistant for practice guidance.

---

## Features

### User Portal
- **Dashboard** — Overview of practice stats, streaks, and progress
- **Practice Sessions** — Log sessions with 5D scoring (Physical, Prana, Mind, Emotion, Spiritual)
- **AI Pose Detection** — Real-time webcam pose classification using TensorFlow.js + Teachable Machine
- **Structured Programs** — 14-day (beginner), 21-day (intermediate), and 30-day (advanced) chakra programs with daily guided flows
- **Practice History** — View and filter all past sessions
- **Analytics** — Charts and graphs for progress over time
- **Analytics Pipeline** — Python-based data analysis with cohort retention, mood correlation, and ML goal prediction
- **AI Assistant** — Chatbot for breathwork, mantra, chakra, and meditation guidance (Gemini API)
- **Mantra Audio** — Play chakra-specific bija mantras during practice

### Admin Portal
- **User Management** — Create, edit, delete, and manage all user accounts
- **Email Verification** — Verify/unverify user emails manually
- **Role Control** — Toggle admin/user roles
- **Activity Logs** — Audit trail of all admin actions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, React Router 6, Tailwind CSS, Axios |
| **Backend** | Node.js + Express 5, JWT authentication, bcryptjs |
| **Database** | MySQL 8 via mysql2/promise |
| **Email** | Nodemailer (Gmail SMTP) |
| **AI Assistant** | Google Gemini API (gemini-1.5-flash) |
| **Pose Detection** | TensorFlow.js, Teachable Machine (MobileNetV1) |
| **Charts** | Recharts |
| **Analytics** | Python, Pandas, scikit-learn, NumPy |
| **BI Integration** | CSV export for Power BI / Looker Studio |
| **Icons** | Lucide React |

---

## Project Structure

```
├── backend/                    # Express.js API server
│   ├── config/
│   │   ├── db.js               # MySQL connection pool
│   │   └── db_schema.sql       # Database schema + seed data (auto-applied on startup)
│   ├── controllers/
│   │   ├── authController.js   # Register, login, verify, password reset
│   │   ├── adminController.js  # User CRUD, role/verification toggle, audit logs
│   │   └── chatController.js   # AI assistant (Gemini + rule-based fallback)
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT token verification
│   │   ├── adminMiddleware.js  # Role-based admin guard
│   │   └── rateLimiter.js      # Request rate limiting
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints (/api/auth/*)
│   │   ├── adminRoutes.js      # Admin endpoints (/api/admin/*)
│   │   ├── sessionRoutes.js    # Practice session endpoints
│   │   ├── programRoutes.js    # Program/day/completion endpoints
│   │   ├── analyticsRoutes.js  # User analytics
│   │   ├── badgeRoutes.js      # Achievement badges
│   │   ├── levelRoutes.js      # Level progression
│   │   └── chatRoutes.js       # AI chat endpoint
│   ├── sql/                    # Auto-applied migration files
│   ├── utils/
│   │   └── sendEmail.js        # Nodemailer with console fallback
│   ├── .env                    # Environment variables (not in git)
│   ├── .env.example            # Env template
│   └── server.js               # Server entry point
│
├── frontend/                   # React + Vite SPA
│   ├── public/
│   │   └── components/         # TF.js model files for pose detection
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   ├── ProtectedRoute.jsx      # Auth route guard
│   │   │   ├── AdminRoute.jsx          # Admin route guard
│   │   │   ├── ChatbotPanel.jsx        # AI chat panel
│   │   │   ├── ChatMessage.jsx         # Chat message bubble
│   │   │   ├── ChatInput.jsx           # Chat input field
│   │   │   ├── SessionTimer.jsx        # Practice session timer
│   │   │   ├── PosePractice.jsx        # Pose detection + practice
│   │   │   ├── PoseReference.jsx       # Pose reference guide
│   │   │   ├── PracticeStyleChooser.jsx # Choose practice style
│   │   │   ├── ChakraIntro.jsx         # Chakra intro screen
│   │   │   ├── MantraPlayer.jsx        # Chakra mantra audio
│   │   │   ├── ChantingWithPose.jsx    # Chanting + pose combo
│   │   │   ├── BreathAnimation.jsx     # Breath animation
│   │   │   ├── BreathWarmup.jsx        # Breath warmup
│   │   │   ├── BreathCooldown.jsx      # Breath cooldown
│   │   │   ├── SafetyReminder.jsx      # Safety reminder
│   │   │   ├── SafetyDisclaimer.jsx    # Safety disclaimer
│   │   │   ├── InsightScreen.jsx       # Post-session insights
│   │   │   ├── RestDayScreen.jsx       # Rest day screen
│   │   │   ├── MoodPicker.jsx          # Mood selection
│   │   │   ├── MoodCheckin.jsx         # Mood check-in
│   │   │   ├── FiveDPreview.jsx        # 5D score preview
│   │   │   ├── FiveDHistory.jsx        # 5D score history
│   │   │   ├── GoalProgress.jsx        # Goal progress display
│   │   │   ├── BadgesPanel.jsx         # Achievement badges panel
│   │   │   ├── BadgeCard.jsx           # Individual badge card
│   │   │   ├── BadgeUnlockModal.jsx    # Badge unlock popup
│   │   │   ├── LevelBadge.jsx          # Level badge display
│   │   │   ├── LevelUpgradeModal.jsx   # Level upgrade popup
│   │   │   ├── LevelQuiz.jsx           # Level quiz
│   │   │   ├── StreakBadge.jsx         # Streak badge
│   │   │   └── LoadingSpinner.jsx      # Loading spinner
│   │   ├── context/AuthContext.jsx      # Auth state management
│   │   ├── data/
│   │   │   ├── chakraData.js           # Chakra definitions
│   │   │   ├── badges.js               # Badge definitions
│   │   │   └── alternativePoses.js     # Alternative poses data
│   │   ├── hooks/useAuth.js            # Custom auth hook
│   │   ├── pages/
│   │   │   ├── Landing.jsx             # Public landing page
│   │   │   ├── Register.jsx            # Registration
│   │   │   ├── UserLogin.jsx           # User login portal
│   │   │   ├── AdminLogin.jsx          # Admin login portal
│   │   │   ├── VerifyEmail.jsx         # Email verification handler
│   │   │   ├── Dashboard.jsx           # User dashboard
│   │   │   ├── Practice.jsx            # Practice session (pose detection + timer)
│   │   │   ├── LogSession.jsx          # Manual session logging
│   │   │   ├── Analytics.jsx           # User analytics charts
│   │   │   ├── History.jsx             # Session history
│   │   │   ├── Chatbot.jsx             # AI assistant page
│   │   │   ├── ProgramSelection.jsx    # Browse programs
│   │   │   ├── ProgramOverview.jsx     # Program details
│   │   │   ├── DayFlow.jsx             # Daily practice flow
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx  # Admin home (user stats)
│   │   │       └── UserList.jsx        # User management table
│   │   └── utils/
│   │       ├── axios.js                # Axios instance with auth interceptor
│   │       ├── compute5D.js            # 5D score computation
│   │       ├── getPosesForDay.js       # Get poses for program day
│   │       ├── localHistory.js         # Local storage history
│   │       └── speakMantra.js          # Mantra text-to-speech
│   ├── vite.config.js                  # Vite config with /api proxy
│   └── package.json
│
├── .gitignore
├── LICENSE
├── README.md
└── analytics/                  # Python analytics pipeline
    ├── fetch_data.py           # Fetches data from API → CSV
    ├── cohort_analysis.py      # User retention cohort analysis
    ├── mood_correlation.py     # Mood vs session metric correlations
    ├── streak_prediction.py    # ML model for goal completion prediction
    ├── requirements.txt        # Python dependencies
    ├── README.md               # Analytics setup instructions
    └── output/                 # Generated CSV files
        ├── sessions.csv
        ├── cohort_detailed.csv
        ├── chakra_mood_report.csv
        ├── correlation_report.csv
        └── prediction_results.csv
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8
- npm or yarn

### 1. Clone and install

```bash
git clone <repository-url>
cd monitoring-system-for-Kundalini-practice-and-meditation

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kundalini_db
JWT_SECRET=your_random_secret_string
JWT_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
PORT=3000
```

### 3. Start the servers

```bash
# Terminal 1 — Backend (auto-creates DB, tables, and seeds data)
cd backend
node server.js

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The app opens at `http://localhost:5173`.

### Default Admin Login

Check the database seed script or create an admin user via the setup process. Credentials are stored in environment variables.

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register new user |
| GET | `/verify?token=` | Verify email |
| POST | `/resend-verification` | Resend verification email |
| POST | `/login` | Login (returns JWT) |
| POST | `/forgot-password` | Request password reset |
| POST | `/reset-password` | Reset password with token |
| GET | `/me` | Get current user profile (auth required) |

### Admin (`/api/admin`) — All routes require admin role
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List users (search, filter by verified/role) |
| GET | `/users/:id` | Get user details |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| PATCH | `/users/:id/role` | Toggle admin/user role |
| PATCH | `/users/:id/verify` | Toggle email verification |
| GET | `/logs` | View admin activity logs |

### Other
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/sessions` | Log a practice session |
| GET | `/api/sessions` | Get user sessions |
| GET | `/api/analytics/summary` | Get aggregate session stats |
| GET | `/api/analytics/trends` | Get chart trend data |
| GET | `/api/analytics/export` | Export all data as JSON for Python pipeline |
| POST | `/api/chat` | Send message to AI assistant |
| POST | `/api/programs/:id/enroll` | Enroll in a program |

---

## 5D Scoring System

Each practice session is scored across five dimensions (0-10 scale):

| Dimension | What it measures |
|-----------|-----------------|
| **Physical** | Energy level, body awareness, physical comfort |
| **Prana** | Breath quality, breathing depth, vital energy |
| **Mind** | Focus, clarity, mental stillness |
| **Emotion** | Emotional balance, stress level, inner peace |
| **Spiritual** | Meditation depth, intuition, connection |

---

## Chakra System

The app tracks practice across all 7 chakras:

| Chakra | Color | Mantra | Focus |
|--------|-------|--------|-------|
| Root (Muladhara) | Red | LAM | Grounding, safety |
| Sacral (Swadhisthana) | Orange | VAM | Creativity, emotion |
| Solar Plexus (Manipura) | Yellow | RAM | Confidence, power |
| Heart (Anahata) | Green | YAM | Love, compassion |
| Throat (Vishuddha) | Blue | HAM | Communication |
| Third Eye (Ajna) | Indigo | OM | Intuition |
| Crown (Sahasrara) | Violet | OM | Awareness |

---

## Analytics Pipeline

The project includes a Python-based analytics layer for deeper data analysis beyond the in-app charts.

### What It Does

| Script | Analysis | Output |
|--------|----------|--------|
| `cohort_analysis.py` | Weekly practice retention tracking | `cohort_detailed.csv` |
| `mood_correlation.py` | Correlation between session metrics and mood improvement | `chakra_mood_report.csv`, `correlation_report.csv` |
| `streak_prediction.py` | RandomForest model predicting weekly goal completion | `prediction_results.csv`, `feature_importance.csv` |

### Quick Start

```bash
# Install Python dependencies
cd analytics
pip install -r requirements.txt

# Start backend server (separate terminal)
cd backend
npm run dev

# Fetch data from your app
python fetch_data.py

# Run analysis scripts
python cohort_analysis.py
python mood_correlation.py
python streak_prediction.py
```

### Output

CSV files are saved to `analytics/output/` and can be imported into Power BI, Google Looker Studio, or any BI tool.

---

## License

(c) 2026 Abhishek Sharma M. All Rights Reserved.

This project is proprietary. See [LICENSE](./LICENSE) for terms.
