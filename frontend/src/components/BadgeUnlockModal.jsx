import React from 'react';
import { X, Award } from 'lucide-react';

/**
 * BadgeUnlockModal Component
 * 
 * Celebratory popup shown when user earns new badge(s).
 * Displays badge name, description, and confetti-style animation.
 */
const BadgeUnlockModal = ({ badges = [], onDismiss }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-amber-100 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Decorative background circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-100 rounded-full opacity-50" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-100 rounded-full opacity-50" />

        {/* Content */}
        <div className="relative z-10">
          {/* Celebration header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 animate-bounce">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {badges.length === 1 ? 'Achievement Unlocked!' : `${badges.length} Achievements Unlocked!`}
            </h2>
            <p className="text-sm text-gray-500">Your practice is paying off</p>
          </div>

          {/* Badge cards */}
          <div className="space-y-3 mb-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">{badge.name}</p>
                  <p className="text-xs text-amber-700">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-md"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeUnlockModal;
