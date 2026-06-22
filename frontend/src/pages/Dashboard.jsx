// Import React hooks, navigation tools, components, and API client.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import StreakBadge from '../components/StreakBadge';
import LevelBadge from '../components/LevelBadge';
import GoalProgress from '../components/GoalProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import LevelQuiz from '../components/LevelQuiz';
import LevelUpgradeModal from '../components/LevelUpgradeModal';
import BadgesPanel from '../components/BadgesPanel';
import { Calendar, Award, Compass, Heart, Play, AlertCircle, BookOpen } from 'lucide-react';

// Dashboard component - main user hub showing progress, level, and recent sessions.
const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [goal, setGoal] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Level system state - tracks user's practitioner level and upgrade eligibility
  const [userLevel, setUserLevel] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState([]);
  const [showLevelQuiz, setShowLevelQuiz] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Dynamically calculate greeting based on local time.
  const getGreeting = () => {
    const hours = new Date().getHours();
    let phrase = 'Good morning';
    if (hours >= 12 && hours < 17) phrase = 'Good afternoon';
    if (hours >= 17) phrase = 'Good evening';
    return `${phrase}, ${user?.name || 'Practitioner'} 🙏`;
  };

  useEffect(() => {
    // Fetch dashboard data: analytics, goals, sessions, and level status on mount
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, goalRes, recentRes, levelRes, earnedBadgesRes] = await Promise.all([
          api.get('/api/analytics/summary'),
          api.get('/api/analytics/goals'),
          api.get('/api/sessions?page=1&limit=5'),
          api.get('/api/level/status'),
          api.get('/api/badges/earned')
        ]);
        
        setSummary(summaryRes.data.data);
        setGoal(goalRes.data.data);
        setRecent(recentRes.data.data.sessions);
        setEarnedBadgeIds(earnedBadgesRes.data.data.map((badge) => badge.id));
        
        // Level status returns user's current level and upgrade eligibility
        const levelData = levelRes.data.data;
        setUserLevel(levelData.level);

        // Fetch active program if user has one in progress.
        try {
          const activeProgramRes = await api.get('/api/programs/active');
          setActiveProgram(activeProgramRes.data.data);
        } catch (activeErr) {
          if (activeErr.response?.status !== 404) {
            console.warn('Unable to fetch active program', activeErr);
          }
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setShowLevelQuiz(true);
        } else {
          setError(typeof err === 'string' ? err : 'Failed to fetch dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Handle quiz completion - save selected level and proceed to dashboard
  const handleQuizComplete = (selectedLevel) => {
    setUserLevel(selectedLevel);
    setShowLevelQuiz(false);
  };

  // Handle level upgrade confirmation - update state and reload level data
  const handleUpgradeComplete = (newLevel) => {
    setUserLevel(newLevel);
    setShowUpgradeModal(false);
  };

  // Determine if user has logged a practice session today.
  const hasPracticedToday = () => {
    if (recent.length === 0) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    const lastPracticeStr = new Date(recent[0].created_at).toISOString().split('T')[0];
    return todayStr === lastPracticeStr;
  };

  if (loading) {
    return <LoadingSpinner text="Restoring your practice space..." />;
  }

  // Show level quiz if user hasn't completed onboarding quiz yet
  if (showLevelQuiz) {
    return <LevelQuiz onComplete={handleQuizComplete} />;
  }

  return (
    <>
      {/* Show level upgrade modal if user is eligible */}
      {showUpgradeModal && userLevel && (
        <LevelUpgradeModal 
          currentLevel={userLevel} 
          onUpgrade={handleUpgradeComplete}
          onCancel={() => setShowUpgradeModal(false)}
        />
      )}

      {/* Main dashboard content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary">{getGreeting()}</h1>
          <p className="text-sm text-text-secondary">Welcome back to your mindfulness sanctuary.</p>
        </div>
        <div className="flex gap-3 items-center">
          {userLevel && <LevelBadge level={userLevel} size="md" />}
          <StreakBadge count={summary?.current_streak || 0} />
          <Link
            to="/practice"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-accent-primary text-white text-sm font-bold rounded-full hover:bg-opacity-90 transition shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Practice
          </Link>
        </div>
      </div>

      {/* Daily Reminder Banner */}
      {!hasPracticedToday() && (
        <div className="bg-background-secondary border border-border rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <span className="text-2xl" role="img" aria-label="yoga-meditation">🧘</span>
            <div>
              <p className="text-sm font-bold text-text-primary">You haven't practiced today</p>
              <p className="text-xs text-text-secondary">A short 5-10 minute session builds daily momentum. Ready to begin?</p>
            </div>
          </div>
          <Link
            to="/practice"
            className="text-xs font-bold bg-white text-accent-primary border border-border px-4 py-2 rounded-full hover:bg-background-secondary/50 transition"
          >
            Settle Into Practice
          </Link>
        </div>
      )}

      {/* Active Program Card */}
      {activeProgram && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-text-secondary">Current Program</p>
                <h2 className="text-xl font-bold text-text-primary">{activeProgram.program.name}</h2>
              </div>
            </div>
            <p className="text-sm text-text-secondary max-w-2xl mb-4">
              Continue your guided practice path. You're on Day {activeProgram.userProgress.current_day} of {activeProgram.program.total_days}.
            </p>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${activeProgram.progressMetrics.percentComplete}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-2">{activeProgram.progressMetrics.percentComplete}% complete</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/programs/${activeProgram.program.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition"
            >
              Continue Program
            </Link>
            <Link
              to="/programs"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 text-slate-900 font-semibold rounded-full hover:bg-slate-200 transition"
            >
              Browse Programs
            </Link>
          </div>
        </div>
      )}

      {/* GoalProgress Row */}
      {goal && (
        <div className="w-full">
          <GoalProgress current={goal.sessions_this_week} target={goal.weekly_target} />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 text-accent-primary rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Total Sessions</p>
            <p className="text-xl font-extrabold text-text-primary">{summary?.total_sessions || 0}</p>
          </div>
        </div>
        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-50 text-accent-secondary rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Average Score</p>
            <p className="text-xl font-extrabold text-text-primary">{summary?.avg_score || 0}/10</p>
          </div>
        </div>
        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Best Chakra</p>
            <p className="text-base font-extrabold text-text-primary truncate max-w-[150px]" title={summary?.most_practiced_chakra}>
              {summary?.most_practiced_chakra || 'None'}
            </p>
          </div>
        </div>
        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 text-success rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary">Mood Improvement</p>
            <p className="text-xl font-extrabold text-text-primary">
              {summary?.avg_mood_improvement > 0 ? `+${summary.avg_mood_improvement}` : summary?.avg_mood_improvement || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Recent Sessions, Right Practice Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent sessions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text-primary">Recent Practice Sessions</h2>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-text-secondary">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-medium">No sessions logged yet.</p>
              <Link to="/practice" className="mt-2 text-xs font-bold text-accent-primary hover:underline">
                Start your first practice session
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recent.map((s) => (
                <div key={s.id} className="flex justify-between items-center p-3.5 bg-background-primary/50 border border-border/50 rounded-xl hover:bg-background-secondary/30 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" role="img" aria-label="lotus">🌸</span>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{s.chakra_focus || 'General Meditation'}</p>
                      <p className="text-xs text-text-secondary">{new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-accent-primary">{s.duration_minutes}m</p>
                    <p className="text-xs text-text-secondary">Score: {Number(s.score).toFixed(1)}/10</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text-primary">Daily Wisdom</h2>
          <div className="italic text-sm text-text-secondary leading-relaxed bg-background-secondary/40 p-4 rounded-xl border border-border/40">
            "Observe sensations without grasping. Let awareness flow like water finding its natural course. Short daily practice is more transformative than occasional intensity."
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Helpful Tips</h4>
            <ul className="text-xs text-text-secondary flex flex-col gap-1.5 list-disc pl-4">
              <li>Practice with a straight, comfortable spine.</li>
              <li>Coordinate breathing matches to AI feedback.</li>
              <li>Journal reflections immediately post-practice.</li>
            </ul>
          </div>
          {/* Badges panel: shows unlocked/locked badges based on recent data */}
          <div>
            <BadgesPanel recentSessions={recent} earnedBadgeIds={earnedBadgeIds} />
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

// Export Dashboard.
export default Dashboard;
