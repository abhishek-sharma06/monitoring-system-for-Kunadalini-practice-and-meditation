import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import BadgeUnlockModal from '../components/BadgeUnlockModal';
import { CheckCircle, Lock, Play, ChevronLeft } from 'lucide-react';
import { BADGES } from '../data/badges';

// ProgramOverview: Show calendar of days with lock/unlock/completion status
const ProgramOverview = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [program, setProgram] = useState(null);
  const [days, setDays] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    // Fetch program days with status
    const fetchProgramData = async () => {
      try {
        const res = await api.get(`/api/programs/${programId}/days`);
        const { program: prog, days: daysData, userProgress: progress } = res.data.data;
        setProgram(prog);
        setDays(daysData);
        setUserProgress(progress);
      } catch (err) {
        setError('Failed to load program details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgramData();
  }, [programId]);

  // Show badge modal when new badges are passed via navigation state
  const newBadgeIds = location.state?.newBadges || [];
  const newBadges = BADGES.filter((badge) => newBadgeIds.includes(badge.id));

  useEffect(() => {
    if (newBadges.length > 0) {
      setShowBadgeModal(true);
    }
  }, [newBadges.length]);

  if (loading) return <LoadingSpinner />;
  if (error || !program) {
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
        <div className="text-red-700">{error || 'Program not found.'}</div>
      </div>
    );
  }

  // Count completed days
  const completedCount = days.filter(d => d.status === 'completed').length;
  const progressPercent = Math.round((completedCount / program.total_days) * 100);

  const insightData = location.state?.insightData || null;

  // Get current day (first unlocked/incomplete day)
  const currentDay = days.find(d => d.status === 'unlocked') || 
                     days.find(d => d.status === 'completed') || 
                     days[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 md:p-8">
      {/* Badge unlock celebration modal */}
      {showBadgeModal && newBadges.length > 0 && (
        <BadgeUnlockModal
          badges={newBadges}
          onDismiss={() => setShowBadgeModal(false)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/programs')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Programs
        </button>

        {/* Program header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {program.name}
          </h1>
          {location.state?.completedDay && (
            <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
              <p className="font-semibold">Day completed successfully!</p>
              <p className="text-sm mt-1">Your next practice is now unlocked. Keep the momentum going.</p>
            </div>
          )}
          {insightData && (
            <div className="mb-4 rounded-3xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-purple-700 font-semibold">Recent session insight</p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    Mood improved by {insightData.moodChange >= 0 ? `+${insightData.moodChange}` : insightData.moodChange} points
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
                  <div className="rounded-2xl bg-white p-3 text-center">
                    <p className="text-[10px] uppercase text-slate-500">Physical</p>
                    <p className="text-xl font-semibold text-slate-900">{insightData.before.physical_score}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-center">
                    <p className="text-[10px] uppercase text-slate-500">Prana</p>
                    <p className="text-xl font-semibold text-slate-900">{insightData.before.prana_score}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-center">
                    <p className="text-[10px] uppercase text-slate-500">Mind</p>
                    <p className="text-xl font-semibold text-slate-900">{insightData.before.mind_score}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-center">
                    <p className="text-[10px] uppercase text-slate-500">Spirit</p>
                    <p className="text-xl font-semibold text-slate-900">{insightData.before.spiritual_score}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-semibold mb-3">New achievement unlocked</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {newBadges.map((badge) => (
                  <div key={badge.id} className="rounded-2xl bg-white p-4 border border-amber-100 shadow-sm">
                    <p className="text-sm font-bold text-amber-900">{badge.name}</p>
                    <p className="text-xs text-amber-700 mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-slate-600 mb-4">
            {program.description}
          </p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">
                Progress: Day {userProgress?.current_day || 1} of {program.total_days}
              </span>
              <span className="text-sm font-semibold text-purple-600">
                {completedCount} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {progressPercent}% complete
            </p>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {days.map((day) => {
            const isDayUnlocked = day.status !== 'locked';
            const isCompleted = day.status === 'completed';
            const isCurrent = day.status === 'unlocked';

            return (
              <button
                key={day.id}
                onClick={() => {
                  if (isDayUnlocked && !isCompleted) {
                    navigate(`/programs/${programId}/day/${day.id}`);
                  }
                }}
                disabled={!isDayUnlocked}
                className={`relative rounded-lg p-4 font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${
                  isCompleted
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : isCurrent
                    ? 'bg-purple-500 text-white border-2 border-purple-600 shadow-lg scale-105'
                    : isDayUnlocked
                    ? 'bg-blue-100 border-2 border-blue-400 text-blue-700 hover:shadow-md'
                    : 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed grayscale'
                }`}
              >
                {isCompleted && <CheckCircle className="w-5 h-5" />}
                {isCurrent && <Play className="w-5 h-5" />}
                {!isDayUnlocked && <Lock className="w-5 h-5" />}

                <span className="text-sm md:text-base">
                  Day {day.day_number}
                </span>

                {day.chakra_focus && (
                  <span className="text-xs text-center leading-tight max-w-[60px]">
                    {day.is_rest_day ? '🌙 Rest' : day.chakra_focus}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        {currentDay && !days.every(d => d.status === 'completed') && (
          <div className="flex justify-center">
            <button
              onClick={() => navigate(`/programs/${programId}/day/${currentDay.id}`)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              Continue to Day {currentDay.day_number}
            </button>
          </div>
        )}

        {/* Completion message */}
        {days.every(d => d.status === 'completed') && (
          <div className="text-center p-6 bg-green-100 border-2 border-green-500 rounded-lg">
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              🎉 Program Complete!
            </h2>
            <p className="text-green-700 mb-4">
              You've successfully completed all {program.total_days} days!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramOverview;
