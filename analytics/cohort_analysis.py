"""
cohort_analysis.py - User Retention Cohort Analysis

What it does:
  Groups users by their signup week and tracks how many come back
  to practice in subsequent weeks. Outputs a retention heatmap table.

Input:  output/sessions.csv, output/user.csv
Output: output/cohort_retention.csv

Usage: python cohort_analysis.py
"""
import os
import sys
import pandas as pd
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")


def load_data():
    """Load sessions and user CSV files."""
    sessions_path = os.path.join(OUTPUT_DIR, "sessions.csv")
    user_path = os.path.join(OUTPUT_DIR, "user.csv")

    if not os.path.exists(sessions_path):
        print("ERROR: sessions.csv not found. Run fetch_data.py first.")
        sys.exit(1)
    if not os.path.exists(user_path):
        print("ERROR: user.csv not found. Run fetch_data.py first.")
        sys.exit(1)

    sessions = pd.read_csv(sessions_path, parse_dates=["created_at"])
    user = pd.read_csv(user_path, parse_dates=["created_at"])
    return sessions, user


def compute_cohorts(sessions, user):
    """Compute weekly cohort retention table."""
    # Get user signup date
    signup_date = user["created_at"].iloc[0]

    # Calculate signup week for each session
    sessions["weeks_since_signup"] = (
        (sessions["created_at"] - signup_date).dt.days // 7
    )

    # Count unique sessions per week
    weekly_activity = (
        sessions.groupby("weeks_since_signup")["id"]
        .nunique()
        .reset_index()
    )
    weekly_activity.columns = ["weeks_since_signup", "sessions"]

    # Build retention table
    # At week 0, the user is active by definition
    total_weeks = int(weekly_activity["weeks_since_signup"].max()) + 1

    cohort_data = []
    for week in range(total_weeks):
        row = {"cohort_week": f"Week {week}"}
        sessions_in_week = weekly_activity[
            weekly_activity["weeks_since_signup"] == week
        ]["sessions"].values

        if len(sessions_in_week) > 0:
            row["sessions"] = int(sessions_in_week[0])
        else:
            row["sessions"] = 0
        cohort_data.append(row)

    return pd.DataFrame(cohort_data)


def compute_detailed_retention(sessions, user):
    """Compute more detailed retention: active weeks out of total."""
    signup_date = user["created_at"].iloc[0]

    sessions["weeks_since_signup"] = (
        (sessions["created_at"] - signup_date).dt.days // 7
    )

    total_weeks = int(sessions["weeks_since_signup"].max()) + 1

    retention = []
    for week in range(total_weeks):
        week_sessions = sessions[sessions["weeks_since_signup"] == week]
        week_start = signup_date + pd.Timedelta(weeks=week)
        week_end = week_start + pd.Timedelta(weeks=1)

        retention.append({
            "week_number": week,
            "week_start": week_start.strftime("%Y-%m-%d"),
            "week_end": week_end.strftime("%Y-%m-%d"),
            "sessions_count": len(week_sessions),
            "avg_score": round(week_sessions["score"].mean(), 2)
            if len(week_sessions) > 0
            else 0,
            "avg_mood_improvement": round(
                (week_sessions["mood_after"] - week_sessions["mood_before"]).mean(), 2
            )
            if len(week_sessions) > 0
            else 0,
        })

    return pd.DataFrame(retention)


def print_summary(cohort_df, detailed_df):
    """Print human-readable summary."""
    print("\n" + "=" * 50)
    print("COHORT ANALYSIS RESULTS")
    print("=" * 50)

    total_weeks = len(cohort_df)
    total_sessions = cohort_df["sessions"].sum()
    active_weeks = (cohort_df["sessions"] > 0).sum()

    print(f"\nTotal active weeks: {active_weeks} / {total_weeks}")
    print(f"Total sessions: {total_sessions}")

    if total_weeks > 0:
        consistency = round((active_weeks / total_weeks) * 100, 1)
        print(f"Practice consistency: {consistency}%")

    # Weekly breakdown
    print("\nWeek-by-Week Activity:")
    print("-" * 40)
    for _, row in detailed_df.iterrows():
        bar = "#" * row["sessions_count"]
        mood_arrow = ""
        if row["avg_mood_improvement"] > 0:
            mood_arrow = f" (mood +{row['avg_mood_improvement']})"
        print(f"  {row['week_start']}  |  {row['sessions_count']:2d} sessions  {bar}{mood_arrow}")


def main():
    print("Running cohort analysis...")
    sessions, user = load_data()

    print(f"  Loaded {len(sessions)} sessions")
    print(f"  User signup: {user['created_at'].iloc[0]}")

    cohort_df = compute_cohorts(sessions, user)
    detailed_df = compute_detailed_retention(sessions, user)

    # Save outputs
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    cohort_df.to_csv(os.path.join(OUTPUT_DIR, "cohort_retention.csv"), index=False)
    detailed_df.to_csv(
        os.path.join(OUTPUT_DIR, "cohort_detailed.csv"), index=False
    )

    print(f"  Saved cohort_retention.csv")
    print(f"  Saved cohort_detailed.csv")

    print_summary(cohort_df, detailed_df)


if __name__ == "__main__":
    main()
