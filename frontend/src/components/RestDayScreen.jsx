import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreathAnimation from './BreathAnimation';
import { Moon, Heart, ChevronLeft } from 'lucide-react';

// RestDayScreen: Simplified screen for rest days
const RestDayScreen = ({ programId, dayNumber, onComplete }) => {
  const navigate = useNavigate();
  const [doOptionalBreathing, setDoOptionalBreathing] = useState(false);
  const [breathComplete, setBreathComplete] = useState(false);

  const handleCompleteDay = () => {
    onComplete?.({
      duration_minutes: 0,
      mood_before: 3,
      mood_after: 3,
      pose_confidence: 0,
      mantra_played: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(`/programs/${programId}`)}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Program
        </button>

        {/* Rest day card */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center space-y-6">
          <Moon className="w-16 h-16 text-indigo-500 mx-auto" />

          <h1 className="text-4xl font-bold text-slate-900">
            Rest Day
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Today is a day of integration and recovery. Your body and energy are processing the practices from the past days.
          </p>

          {/* Rest day guidance */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-left space-y-3">
            <h2 className="font-semibold text-indigo-900">Rest Day Suggestions:</h2>
            <ul className="text-indigo-800 space-y-2 text-sm">
              <li>• Take a gentle walk in nature</li>
              <li>• Stay hydrated and nourish yourself with healthy foods</li>
              <li>• Journaling about your experiences</li>
              <li>• Get extra sleep if needed</li>
              <li>• Avoid intense exercise or stressful activities</li>
              <li>• Meditate or practice gentle stretching</li>
            </ul>
          </div>

          {/* Optional gentle breathing */}
          {!doOptionalBreathing ? (
            <div className="space-y-4">
              <p className="text-slate-600">
                Optional: Do you want to do a gentle 2-cycle breathing exercise?
              </p>
              <button
                onClick={() => setDoOptionalBreathing(true)}
                className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-all"
              >
                Yes, Gentle Breathing
              </button>
            </div>
          ) : breathComplete ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">
                ✓ Gentle breathing complete. You're all set for the day.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">
                A few gentle breaths to settle your energy.
              </p>
              <BreathAnimation
                level="beginner"
                targetCycles={2}
                autoStart={true}
                onComplete={() => setBreathComplete(true)}
              />
            </div>
          )}

          {/* Mark complete button */}
          <button
            onClick={handleCompleteDay}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Mark Rest Day Complete
          </button>

          {/* Affirmation */}
          <p className="italic text-slate-500 text-sm border-t border-gray-200 pt-6">
            "Rest is not laziness. Rest is integration. Honor your body's wisdom."
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestDayScreen;
