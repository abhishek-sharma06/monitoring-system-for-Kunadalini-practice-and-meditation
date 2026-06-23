# Kundalini Analytics Pipeline

Data analytics layer for the Kundalini Practice & Meditation Monitoring System.

## What This Does

Extracts session data from the app and runs statistical analysis:

1. **Cohort Analysis** - Tracks user practice retention over weeks
2. **Mood Correlation** - Finds which factors improve mood the most
3. **Streak Prediction** - Predicts if you'll hit your weekly goal

All outputs are saved as CSV files in `output/` folder, ready for Power BI.

## Setup (One-Time)

### Step 1: Install Python

Download Python 3.10+ from https://www.python.org/downloads/
Check "Add Python to PATH" during installation.

Verify installation:
```
python --version
```

### Step 2: Install Dependencies

Open terminal in this `analytics/` folder and run:
```
pip install -r requirements.txt
```

## How to Use

### Step 1: Start Backend Server

```
cd ../backend
npm run dev
```

### Step 2: Fetch Data from App

In a new terminal, in this `analytics/` folder:
```
python fetch_data.py
```
Enter your email and password when prompted.
This saves CSV files to `output/` folder.

### Step 3: Run Analysis Scripts

```
python cohort_analysis.py
python mood_correlation.py
python streak_prediction.py
```

Each script prints results to terminal AND saves CSV files to `output/`.

### Step 4: Open in Power BI (Optional)

1. Open Power BI Desktop (free download from Microsoft)
2. Get Data > Text/CSV
3. Select files from `output/` folder
4. Build dashboards

## Output Files

After running all scripts, `output/` contains:

| File | From Script | Description |
|------|-------------|-------------|
| `cohort_retention.csv` | cohort_analysis.py | Week-by-week activity counts |
| `cohort_detailed.csv` | cohort_analysis.py | Detailed weekly stats with mood |
| `correlation_report.csv` | mood_correlation.py | Metric correlations with mood |
| `chakra_mood_report.csv` | mood_correlation.py | Which chakra improves mood most |
| `duration_mood_report.csv` | mood_correlation.py | Best session duration for mood |
| `prediction_results.csv` | streak_prediction.py | Goal completion predictions |
| `feature_importance.csv` | streak_prediction.py | What drives goal completion |

## Troubleshooting

**"sessions.csv not found"**
- Run `python fetch_data.py` first
- Make sure backend server is running

**"ModuleNotFoundError: No module named pandas"**
- Run `pip install -r requirements.txt`

**Login failed**
- Make sure you're using the correct email/password
- Backend must be running on http://localhost:3000
