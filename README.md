# 🧘 Analysis and Monitoring System for Kundalini Tantra Practices and Meditation

> A comprehensive web application for tracking Kundalini yoga practices, chakra activation, meditation sessions, and AI-powered yoga pose detection — all in one spiritual wellness platform.

---

## About

- Author / Developer : Abhishek Sharma M
- Mail : abhisheksharmam6 [at] gmail [dot] com
- Working link : https://avinaykumar26.github.io/Analysis-and-Monitoring-System-for-Kundalini-Tantra-Practices-and-Meditation/
- View in any browser using above link , loading dashboard can take some time .
- Github : (https://github.com/abhishek-sharma06)
- LinkedIn : www.linkedin.com/in/abhisheksharma6

---

## 📖 Overview

The **Kundalini Tantra Dashboard** is a multi-page web application designed to help practitioners navigate their spiritual journey. It combines ancient Kundalini wisdom with modern web technologies, offering interactive tools for self-assessment, chakra monitoring, guided meditation, AI pose detection, and data-driven progress analytics.

---

## ✨ Features

### 🏠 Landing Page (`index.html`)
- Responsive hero section with dark/light mode support
- Navigation cards linking to all major modules
- Mobile-friendly hamburger menu
- Testimonial section and call-to-action
- Built with **Tailwind CSS** and **Google Material Symbols**

### 📊 Tantra Analysis (`components/kundalini-analuysis.html`)
- **5-dimension self-assessment**: Physical State, Breath & Prana, Mind & Focus, Emotion & Balance, Spiritual Awareness
- Heart rate and oxygen level inputs for biometric tracking
- Calculates a composite **Kundalini KPI** (Key Performance Indicator) score
- Identifies your current **Kundalini Stage** (Dormant → Unified Consciousness)
- Personalized recommendations and chakra-layer breakdown
- **Chart.js** line chart for historical progress visualization
- Data persistence via `localStorage`
- Night/Day mode toggle

### 🔮 Chakra Monitoring (`components/kundalini-tantra-tracker.html`)
- Interactive **Chakra Activation cards** for all 7 chakras (Root → Crown)
- **Body Part / Energy Focus** cards mapping physical areas to chakras
- Per-exercise **timer** with start/stop controls
- Checkbox-based exercise completion tracking
- Daily KPI calculation and save functionality
- Historical progress table and **Chart.js** multi-dataset line chart
- Night/Day mode toggle

### 🧭 Guidance (`components/guidance.html`)
- Premium glassmorphism UI with animated particle background
- **7 detailed chakra sections** with mantras, practices, mudras, and safety notes
- Sidebar navigation with scroll tracking
- Embedded video players for guided practices
- Breathing exercise guides and bandha instructions
- Light/Dark theme toggle
- Built with **Bootstrap 5**, **Font Awesome**, and **Cormorant Garamond** typography

### 🧘 Meditation Practice App (`components/meditation.html`)
- **7 meditation techniques** from Beginner to Advanced level:
  - Nadi Shodhana, Kapalabhati, Bhastrika, Bija Mantras, Chakra Visualization, Mudra & Bandha, Shakti Visualization
- Search and filter by level (Beginner / Intermediate / Advanced)
- Built-in **session timer** with start, pause, and stop controls
- Post-session **feedback form** (rating, emotional state, notes)
- Practice history table with all past sessions
- Progress statistics (total sessions, total minutes, average rating)
- Quick Start 10-minute session
- Night/Day mode toggle

### 📷 AI Yoga Pose Detection (`components/posedetection.html`)
- **TensorFlow.js** + **Teachable Machine** pose classification model
- Real-time webcam feed with live pose predictions
- Detects 7 chakra-aligned yoga poses:
  - Muladhara, Swadishtana, Manipura, Anahata, Vishuddha, Sahasrara, Ajna
- Confidence percentage bars for each pose class
- Camera flip (front/back) support
- Session statistics and practice tips
- Light/Dark theme toggle

### 📈 Streamlit Analytics Dashboard (`components/dashboard.py`)
- **Streamlit**-based Python dashboard for advanced data analytics
- CSV file upload and data exploration
- Statistical summaries (numerical + categorical)
- Interactive **Plotly** charts (Histogram, Box Plot, Violin Plot)
- Chakra-specific analysis with color-coded visualizations
- Data export in CSV and JSON formats
- Custom-styled UI with gradient headers and chakra badges

---

## 🗂️ Project Structure

```
kundalini-dashboard/
├── index.html                              # Landing page (Tailwind CSS)
├── README.md                               # Project documentation
├── requirements.txt                        # Python dependencies (Streamlit dashboard)
├── LICENSE                                 # All Rights Reserved license
│
├── css/
│   └── styles.css                          # Shared CSS with light/dark theme variables
│
├── js/
│   └── dashboard.js                        # Theme toggle & component loader logic
│
├── components/
│   ├── kundalini-analuysis.html            # Tantra Analysis — 5-dimension KPI tracker
│   ├── kundalini-tantra-tracker.html       # Chakra Monitoring — exercise cards & timers
│   ├── guidance.html                       # Guidance — glassmorphism UI, chakra sections
│   ├── meditation.html                     # Meditation — techniques, timer, feedback
│   ├── posedetection.html                  # AI Yoga Pose Detection (TensorFlow.js)
│   ├── dashboard.py                        # Streamlit analytics dashboard (Python)
│   ├── model.json                          # TF.js model topology (MobileNetV1)
│   ├── metadata.json                       # Teachable Machine model metadata
│   └── weights.bin                         # Pre-trained model weights (~5.6 MB)
│
└── data/
    └── sample-data.json                    # Sample data (chakras, body parts, techniques)
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Python 3.8+ (only for the Streamlit dashboard)
- A local HTTP server (recommended for webcam / model features)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd kundalini-dashboard
   ```

2. **Open the landing page:**
   - Simply open `index.html` in your browser, or
   - Start a local server for full functionality:
     ```bash
     # Python
     python -m http.server 8000

     # Node.js
     npx serve .
     ```
   - Navigate to `http://localhost:8000`

3. **Run the Streamlit Dashboard** (optional):
   ```bash
   pip install -r requirements.txt
   streamlit run components/dashboard.py
   ```
   - Opens at `http://localhost:8501`

---

## 🛠️ Tech Stack

| Layer          | Technology                                                    |
|----------------|---------------------------------------------------------------|
| **Frontend**   | HTML5, CSS3, JavaScript (ES6+)                                |
| **Styling**    | Tailwind CSS (landing), Bootstrap 5 (components), Vanilla CSS |
| **Charts**     | Chart.js (client-side), Plotly (Streamlit)                    |
| **AI/ML**      | TensorFlow.js, Teachable Machine (PoseNet / MobileNetV1)     |
| **Backend**    | Streamlit (Python)                                            |
| **Fonts**      | Google Fonts (Manrope, Inter, Poppins, Cormorant Garamond)    |
| **Icons**      | Google Material Symbols, Font Awesome 6                       |
| **Storage**    | Browser `localStorage` (client-side persistence)              |

---

## 🎨 Design Highlights

- **Dark/Light mode** across all pages with smooth CSS transitions
- **Glassmorphism** effects on the Guidance page with animated particles
- **Chakra color system** consistently applied (Root → Crown: Red → Violet)
- **Responsive design** — mobile-first layout with hamburger navigation
- **Micro-animations** — hover transforms, fade-ins, and pulse effects
- **Premium typography** — serif headings + sans-serif body text

---

## 📊 Data & KPI System

The dashboard uses a **5-pillar KPI framework** to assess spiritual progress:

| Pillar         | Code | Covers                                            |
|----------------|------|---------------------------------------------------|
| Physical       | PS   | Energy, Sleep, Body Connection, Heart Rate, SpO₂  |
| Prana          | PR   | Breathing Depth, Nostril Balance, Spinal Vibration |
| Mind           | MS   | Focus Duration, Clarity, Mind Wandering            |
| Emotion        | ES   | Emotional Stability, Stress Level, Compassion      |
| Spiritual      | SS   | Meditation Depth, Intuition, Purpose Alignment     |

**Overall KPI** = Average of all 5 pillars (scale 0–10)

### Kundalini Stages
| KPI Range | Stage                              |
|-----------|------------------------------------|
| 0 – 5    | 🔴 Dormant Energy (Muladhara)       |
| 5 – 7    | 🟠 Awakening (Swadhisthana)         |
| 7 – 8.5  | 🟢 Rising (Anahata)                 |
| 8.5 – 9.5| 🔵 Harmonizing (Ajna)               |
| 9.5 – 10 | 🟣 Unified Consciousness (Sahasrara)|

---

## 🤖 AI Pose Detection Model

- **Architecture:** MobileNetV1 (PoseNet backbone via Teachable Machine)
- **Input Resolution:** 257×257
- **Output Classes:** 7 chakra-aligned yoga poses
- **Framework:** TensorFlow.js v1.7.4
- **Weights:** `weights.bin` (~5.6 MB)

> ⚠️ Webcam access requires HTTPS or `localhost`. Use a local server for development.

---

## 📝 Usage Guidelines

1. **Daily Practice Tracking** — Input your state across all 5 dimensions in Tantra Analysis
2. **Chakra Exercises** — Select a chakra or body part, use timers to track exercise duration
3. **Meditation Sessions** — Browse techniques, start timed sessions, and log feedback
4. **Pose Detection** — Use AI-powered webcam detection to validate yoga poses
5. **Analytics** — Upload CSV data to the Streamlit dashboard for deep analysis

---

## 📄 License

**© 2025 Abhishek Sharma M. All Rights Reserved.**

This project is **proprietary** and protected under a custom All Rights Reserved license. You may **NOT** copy, modify, distribute, or use this project (in whole or in part) without **prior written permission** from the author. If permission is granted, proper **credit and attribution** must be given.

See the [LICENSE](./LICENSE) file for full terms.

> ⚠️ **This repository is public for portfolio/reference purposes only. Public visibility does NOT grant any usage rights.**

To request permission, contact: [GitHub – abhishek-sharma06][(https://github.com/abhishek-sharma06)

---

<p align="center">
  <em> 🕉️ "The awakening of Kundalini is the beginning of spiritual consciousness." — Swami Sivananda </em>
</p>
