"""
fetch_data.py - Fetches data from the backend API and saves as CSV files.
Run this FIRST before running any analysis scripts.

Usage: python fetch_data.py
Requires: backend server running on http://localhost:3000
"""
import os
import sys
import json
import requests
import pandas as pd

BASE_URL = "http://localhost:3000"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")

def fetch_token(email, password):
    """Login and get JWT token."""
    res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": email,
        "password": password
    })
    res.raise_for_status()
    return res.json()["data"]["token"]

def fetch_export_data(token):
    """Fetch all user data from the export endpoint."""
    res = requests.get(f"{BASE_URL}/api/analytics/export", headers={
        "Authorization": f"Bearer {token}"
    })
    res.raise_for_status()
    return res.json()["data"]

def save_csvs(data):
    """Convert JSON data to CSV files."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Save sessions
    if data.get("sessions"):
        df_sessions = pd.json_normalize(data["sessions"])
        df_sessions.to_csv(os.path.join(OUTPUT_DIR, "sessions.csv"), index=False)
        print(f"  Saved sessions.csv ({len(df_sessions)} rows)")

    # Save user info
    if data.get("user"):
        df_user = pd.json_normalize(data["user"])
        df_user.to_csv(os.path.join(OUTPUT_DIR, "user.csv"), index=False)
        print(f"  Saved user.csv")

    # Save goals
    if data.get("goals"):
        df_goals = pd.json_normalize(data["goals"])
        df_goals.to_csv(os.path.join(OUTPUT_DIR, "goals.csv"), index=False)
        print(f"  Saved goals.csv")

    # Save day completions
    if data.get("day_completions"):
        df_completions = pd.json_normalize(data["day_completions"])
        df_completions.to_csv(os.path.join(OUTPUT_DIR, "day_completions.csv"), index=False)
        print(f"  Saved day_completions.csv ({len(df_completions)} rows)")

    # Save raw JSON for reference
    with open(os.path.join(OUTPUT_DIR, "raw_export.json"), "w") as f:
        json.dump(data, f, indent=2, default=str)
    print(f"  Saved raw_export.json")

def main():
    print("=" * 50)
    print("Kundalini Analytics - Data Fetcher")
    print("=" * 50)

    # Check if server is running
    try:
        requests.get(f"{BASE_URL}", timeout=3)
    except requests.ConnectionError:
        print(f"\nERROR: Backend server not running at {BASE_URL}")
        print("Start it first: cd backend && npm run dev")
        sys.exit(1)

    # Get credentials
    email = input("\nEnter your email: ").strip()
    password = input("Enter your password: ").strip()

    if not email or not password:
        print("ERROR: Email and password are required.")
        sys.exit(1)

    print("\nLogging in...")
    try:
        token = fetch_token(email, password)
    except requests.HTTPError as e:
        print(f"ERROR: Login failed - {e}")
        sys.exit(1)

    print("Fetching data...")
    data = fetch_export_data(token)

    print("\nSaving CSV files:")
    save_csvs(data)

    session_count = len(data.get("sessions", []))
    print(f"\nDone! {session_count} sessions exported to analytics/output/")
    print("You can now run: python cohort_analysis.py")
    print("                 python mood_correlation.py")
    print("                 python streak_prediction.py")

if __name__ == "__main__":
    main()
