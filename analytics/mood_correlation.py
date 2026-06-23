"""
mood_correlation.py - Correlation Analysis Between Session Metrics and Mood

What it does:
  Calculates statistical correlations between mood improvement and
  other session metrics (duration, score, 5D dimensions).
  Also shows which chakra focus gives the best mood boost.

Input:  output/sessions.csv
Output: output/correlation_report.csv, output/chakra_mood_report.csv

Usage: python mood_correlation.py
"""
import os
import sys
import pandas as pd
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")


def load_sessions():
    """Load sessions CSV file."""
    path = os.path.join(OUTPUT_DIR, "sessions.csv")
    if not os.path.exists(path):
        print("ERROR: sessions.csv not found. Run fetch_data.py first.")
        sys.exit(1)
    return pd.read_csv(path, parse_dates=["created_at"])


def compute_correlations(df):
    """Compute Pearson correlations between mood improvement and other metrics."""
    df = df.dropna(subset=["mood_before", "mood_after"])
    df["mood_improvement"] = df["mood_after"] - df["mood_before"]

    metrics = ["duration_minutes", "score", "poses_detected",
               "physical_score", "prana_score", "mind_score",
               "emotion_score", "spiritual_score",
               "overall_index_before", "overall_index_after"]

    results = []
    for metric in metrics:
        if metric in df.columns:
            valid = df[["mood_improvement", metric]].dropna()
            if len(valid) >= 3:
                corr = valid["mood_improvement"].corr(valid[metric])
                results.append({
                    "metric": metric,
                    "correlation_with_mood": round(corr, 3),
                    "strength": interpret_correlation(corr),
                    "sample_size": len(valid)
                })

    return pd.DataFrame(results)


def interpret_correlation(r):
    """Interpret correlation strength."""
    abs_r = abs(r)
    if abs_r >= 0.7:
        return "Strong"
    elif abs_r >= 0.4:
        return "Moderate"
    elif abs_r >= 0.2:
        return "Weak"
    else:
        return "Negligible"


def chakra_mood_analysis(df):
    """Analyze which chakra focus gives the best mood improvement."""
    df = df.dropna(subset=["mood_before", "mood_after", "chakra_focus"])
    df["mood_improvement"] = df["mood_after"] - df["mood_before"]

    chakra_stats = (
        df.groupby("chakra_focus")
        .agg(
            sessions=("id", "count"),
            avg_mood_improvement=("mood_improvement", "mean"),
            avg_score=("score", "mean"),
            avg_duration=("duration_minutes", "mean"),
        )
        .round(2)
        .sort_values("avg_mood_improvement", ascending=False)
        .reset_index()
    )

    chakra_stats["mood_interpretation"] = chakra_stats["avg_mood_improvement"].apply(
        lambda x: "Positive" if x > 0 else ("Neutral" if x == 0 else "Negative")
    )

    return chakra_stats


def duration_buckets(df):
    """Analyze mood improvement across different session durations."""
    df = df.dropna(subset=["mood_before", "mood_after", "duration_minutes"])
    df["mood_improvement"] = df["mood_after"] - df["mood_before"]

    bins = [0, 5, 10, 15, 20, 30, 60]
    labels = ["0-5min", "5-10min", "10-15min", "15-20min", "20-30min", "30min+"]
    df["duration_bucket"] = pd.cut(df["duration_minutes"], bins=bins, labels=labels)

    bucket_stats = (
        df.groupby("duration_bucket", observed=True)
        .agg(
            sessions=("id", "count"),
            avg_mood_improvement=("mood_improvement", "mean"),
            avg_score=("score", "mean"),
        )
        .round(2)
        .reset_index()
    )

    return bucket_stats


def print_summary(corr_df, chakra_df, bucket_df):
    """Print human-readable summary."""
    print("\n" + "=" * 50)
    print("MOOD CORRELATION ANALYSIS")
    print("=" * 50)

    # Top correlations
    print("\nTop Correlations with Mood Improvement:")
    print("-" * 50)
    for _, row in corr_df.head(5).iterrows():
        print(f"  {row['metric']:25s}  r={row['correlation_with_mood']:+.3f}  ({row['strength']})")

    # Best chakra for mood
    if len(chakra_df) > 0:
        print("\nChakra Focus vs Mood Improvement:")
        print("-" * 50)
        for _, row in chakra_df.iterrows():
            print(f"  {row['chakra_focus']:25s}  mood={row['avg_mood_improvement']:+.2f}  ({row['sessions']} sessions)")

    # Duration buckets
    if len(bucket_df) > 0:
        print("\nSession Duration vs Mood Improvement:")
        print("-" * 50)
        for _, row in bucket_df.iterrows():
            if row["sessions"] > 0:
                print(f"  {row['duration_bucket']:12s}  mood={row['avg_mood_improvement']:+.2f}  score={row['avg_score']:.1f}  ({row['sessions']} sessions)")


def main():
    print("Running mood correlation analysis...")
    df = load_sessions()

    print(f"  Loaded {len(df)} sessions")

    corr_df = compute_correlations(df)
    chakra_df = chakra_mood_analysis(df)
    bucket_df = duration_buckets(df)

    # Save outputs
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    corr_df.to_csv(os.path.join(OUTPUT_DIR, "correlation_report.csv"), index=False)
    chakra_df.to_csv(os.path.join(OUTPUT_DIR, "chakra_mood_report.csv"), index=False)
    bucket_df.to_csv(os.path.join(OUTPUT_DIR, "duration_mood_report.csv"), index=False)

    print(f"  Saved correlation_report.csv")
    print(f"  Saved chakra_mood_report.csv")
    print(f"  Saved duration_mood_report.csv")

    print_summary(corr_df, chakra_df, bucket_df)


if __name__ == "__main__":
    main()
