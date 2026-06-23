"""
streak_prediction.py - Predict Weekly Goal Completion

What it does:
  Uses session history features to predict whether a user will
  complete their weekly session goal. Builds a simple RandomForest
  classifier and outputs predictions + feature importance.

Input:  output/sessions.csv, output/goals.csv
Output: output/prediction_results.csv, output/feature_importance.csv

Usage: python streak_prediction.py
"""
import os
import sys
import warnings
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, classification_report

warnings.filterwarnings("ignore")

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")


def load_data():
    """Load sessions and goals CSV files."""
    sessions_path = os.path.join(OUTPUT_DIR, "sessions.csv")
    goals_path = os.path.join(OUTPUT_DIR, "goals.csv")

    if not os.path.exists(sessions_path):
        print("ERROR: sessions.csv not found. Run fetch_data.py first.")
        sys.exit(1)

    sessions = pd.read_csv(sessions_path, parse_dates=["created_at"])

    weekly_target = 5  # default
    if os.path.exists(goals_path):
        goals = pd.read_csv(goals_path)
        if "weekly_sessions_target" in goals.columns:
            weekly_target = int(goals["weekly_sessions_target"].iloc[0])

    return sessions, weekly_target


def engineer_features(sessions, weekly_target):
    """Create per-user-week features for prediction."""
    sessions["week"] = sessions["created_at"].dt.isocalendar().week.astype(int)
    sessions["year"] = sessions["created_at"].dt.year

    features_list = []
    for (year, week), group in sessions.groupby(["year", "week"]):
        group = group.sort_values("created_at")

        # Target: did user complete weekly goal?
        sessions_that_week = len(group)
        completed_goal = 1 if sessions_that_week >= weekly_target else 0

        # Features
        feature_row = {
            "year": year,
            "week": week,
            "sessions_count": sessions_that_week,
            "avg_score": group["score"].mean() if "score" in group.columns else 0,
            "max_score": group["score"].max() if "score" in group.columns else 0,
            "avg_duration": group["duration_minutes"].mean() if "duration_minutes" in group.columns else 0,
            "total_duration": group["duration_minutes"].sum() if "duration_minutes" in group.columns else 0,
            "avg_mood_before": group["mood_before"].mean() if "mood_before" in group.columns else 3,
            "avg_mood_after": group["mood_after"].mean() if "mood_after" in group.columns else 3,
            "unique_chakras": group["chakra_focus"].nunique() if "chakra_focus" in group.columns else 0,
            "completed_goal": completed_goal,
        }

        # 5D scores if available
        for col in ["physical_score", "prana_score", "mind_score", "emotion_score", "spiritual_score"]:
            if col in group.columns:
                feature_row[f"avg_{col}"] = group[col].mean()

        features_list.append(feature_row)

    return pd.DataFrame(features_list)


def train_model(df):
    """Train a RandomForest classifier."""
    # Define feature columns (exclude metadata and target)
    exclude_cols = ["year", "week", "completed_goal"]
    feature_cols = [c for c in df.columns if c not in exclude_cols]

    X = df[feature_cols].fillna(0)
    y = df["completed_goal"]

    # Need at least 4 samples for train/test split
    if len(X) < 4:
        print(f"\n  WARNING: Only {len(X)} weeks of data found.")
        print("  Need at least 4 weeks for meaningful prediction.")
        print("  Showing available data instead.\n")

        # Return simple stats without ML
        result_df = df[["year", "week", "sessions_count", "completed_goal"]].copy()
        result_df["prediction"] = y  # just use actual values
        result_df["prediction_label"] = result_df["completed_goal"].map(
            {1: "Goal Completed", 0: "Goal Not Met"}
        )
        return result_df, None, feature_cols

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=5)
    model.fit(X_train, y_train)

    # Predictions
    y_pred = model.predict(X_test)

    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)

    print(f"\n  Model Performance:")
    print(f"  Accuracy:  {accuracy:.1%}")
    print(f"  Precision: {precision:.1%}")
    print(f"  Recall:    {recall:.1%}")

    # Feature importance
    importance_df = pd.DataFrame({
        "feature": feature_cols,
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False).round(3)

    # Full predictions on all data
    df["prediction"] = model.predict(X)
    df["prediction_label"] = df["prediction"].map(
        {1: "Goal Completed", 0: "Goal Not Met"}
    )

    return df, importance_df, feature_cols


def print_summary(df, importance_df):
    """Print human-readable summary."""
    print("\n" + "=" * 50)
    print("WEEKLY GOAL PREDICTION RESULTS")
    print("=" * 50)

    total_weeks = len(df)
    completed = (df["completed_goal"] == 1).sum()
    predicted_correctly = (df["prediction"] == df["completed_goal"]).sum() if "prediction" in df.columns else 0

    print(f"\nTotal weeks analyzed: {total_weeks}")
    print(f"Weeks goal was met: {completed} / {total_weeks} ({completed/total_weeks*100:.0f}%)")

    if total_weeks > 0 and "prediction" in df.columns:
        print(f"Prediction accuracy: {predicted_correctly} / {total_weeks}")

    # Weekly breakdown
    print("\nWeekly Breakdown:")
    print("-" * 50)
    for _, row in df.iterrows():
        status = "V" if row["completed_goal"] == 1 else "X"
        sessions = row["sessions_count"]
        print(f"  Year {int(row['year'])} Week {int(row['week']):2d}  |  {sessions} sessions  [{status}]")

    # Feature importance
    if importance_df is not None:
        print("\nTop Predictive Features:")
        print("-" * 50)
        for _, row in importance_df.head(5).iterrows():
            bar = "#" * int(row["importance"] * 50)
            print(f"  {row['feature']:25s}  {row['importance']:.3f}  {bar}")


def main():
    print("Running streak prediction analysis...")
    sessions, weekly_target = load_data()

    print(f"  Loaded {len(sessions)} sessions")
    print(f"  Weekly target: {weekly_target} sessions")

    df = engineer_features(sessions, weekly_target)
    print(f"  Created {len(df)} weekly feature rows")

    result_df, importance_df, feature_cols = train_model(df)

    # Save outputs
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    result_df.to_csv(os.path.join(OUTPUT_DIR, "prediction_results.csv"), index=False)
    if importance_df is not None:
        importance_df.to_csv(os.path.join(OUTPUT_DIR, "feature_importance.csv"), index=False)
        print(f"  Saved feature_importance.csv")
    print(f"  Saved prediction_results.csv")

    print_summary(result_df, importance_df)


if __name__ == "__main__":
    main()
