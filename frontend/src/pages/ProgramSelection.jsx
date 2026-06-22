import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import { Flame, Heart, Zap, Lock, Play } from 'lucide-react';

// ProgramSelection: Display 3 programs and allow user to start one
const ProgramSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingProgram, setStartingProgram] = useState(null);

  useEffect(() => {
    // Fetch all programs on mount
    const fetchPrograms = async () => {
      try {
        const res = await api.get('/api/programs');
        setPrograms(res.data.data);
      } catch (err) {
        setError('Failed to load programs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // Track which program ID triggered the error
  const [errorProgramId, setErrorProgramId] = useState(null);

  // Handle start program button click
  const handleStartProgram = async (programId) => {
    try {
      setStartingProgram(programId);
      setError('');
      setErrorProgramId(null);
      const res = await api.post(`/api/programs/${programId}/start`);
      
      if (res.data.success) {
        navigate(`/programs/${programId}`);
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.response?.data?.message || 'Failed to start program.';
      setError(msg);
      setErrorProgramId(programId);
      console.error('Start program error:', err);
    } finally {
      setStartingProgram(null);
    }
  };

  // Determine if user can access program based on their level
  const canAccessProgram = (programLevel) => {
    const levelHierarchy = { beginner: 1, intermediate: 2, advanced: 3 };
    if (!user?.level) {
      // Allow beginner program for new users without a defined level yet
      return programLevel === 'beginner';
    }
    return levelHierarchy[user.level] >= levelHierarchy[programLevel];
  };

  // Get icon for program level
  const getLevelIcon = (level) => {
    switch (level) {
      case 'beginner':
        return <Flame className="w-6 h-6" />;
      case 'intermediate':
        return <Heart className="w-6 h-6" />;
      case 'advanced':
        return <Zap className="w-6 h-6" />;
      default:
        return null;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Choose Your Practice Journey
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select a structured program tailored to your experience level. Complete days sequentially to unlock deeper practices.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm font-semibold">{error}</p>
            {error.includes('already started') && errorProgramId && (
              <button
                onClick={() => navigate(`/programs/${errorProgramId}`)}
                className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition"
              >
                Go to Program
              </button>
            )}
          </div>
        )}

        {/* Program cards grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {programs.map((program) => {
            const canAccess = canAccessProgram(program.level);
            const isLocked = !canAccess;

            return (
              <div
                key={program.id}
                className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  isLocked ? 'opacity-60 grayscale' : 'hover:shadow-2xl hover:scale-105'
                }`}
              >
                {/* Background gradient based on level */}
                <div
                  className={`absolute inset-0 ${
                    program.level === 'beginner'
                      ? 'bg-gradient-to-br from-amber-100 to-orange-100'
                      : program.level === 'intermediate'
                      ? 'bg-gradient-to-br from-rose-100 to-pink-100'
                      : 'bg-gradient-to-br from-violet-100 to-purple-100'
                  }`}
                />

                {/* Lock overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <div className="text-center text-white">
                      <Lock className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-semibold">Unlock at {program.level} level</p>
                    </div>
                  </div>
                )}

                {/* Card content */}
                <div className="relative z-0 p-8 h-full flex flex-col">
                  {/* Level icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                    program.level === 'beginner'
                      ? 'bg-amber-200 text-amber-700'
                      : program.level === 'intermediate'
                      ? 'bg-rose-200 text-rose-700'
                      : 'bg-violet-200 text-violet-700'
                  }`}>
                    {getLevelIcon(program.level)}
                  </div>

                  {/* Program name */}
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {program.name}
                  </h2>

                  {/* Program stats */}
                  <div className="mb-4 flex items-center gap-2 text-slate-600">
                    <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-sm font-medium capitalize">
                      {program.level}
                    </span>
                    <span className="text-sm font-semibold">
                      {program.total_days} days
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-700 text-sm mb-6 flex-grow">
                    {program.description}
                  </p>

                  {/* Start button */}
                  <button
                    onClick={() => handleStartProgram(program.id)}
                    disabled={isLocked || startingProgram === program.id}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                      isLocked
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : startingProgram === program.id
                        ? 'bg-slate-400 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                    }`}
                  >
                    {startingProgram === program.id ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start Program
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 How it works</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Start a program and complete Day 1 to unlock Day 2</li>
            <li>• Each day guides you through 10 steps: warmup, practice, cool-down, and insights</li>
            <li>• Rest days are included for integration and recovery</li>
            <li>• Complete the full program to advance to the next level</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProgramSelection;
