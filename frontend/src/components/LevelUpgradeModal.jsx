import React, { useState } from 'react';
import { Zap, X } from 'lucide-react';
import api from '../api/axios';

/**
 * LevelUpgradeModal Component
 * 
 * Celebratory modal shown when user becomes eligible for level upgrade.
 * Appears after 10+ sessions at current level with avg score >= 70.
 * User can confirm upgrade or defer it for later.
 */
const LevelUpgradeModal = ({ currentLevel, onUpgrade, onCancel }) => {
  // Track upgrade submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Map current level to next level
  const levelProgression = {
    beginner: { next: 'intermediate', emoji: '🌿', message: 'You\'ve mastered the fundamentals!' },
    intermediate: { next: 'advanced', emoji: '🌳', message: 'You\'re ready for advanced practice!' },
    advanced: { next: 'advanced', emoji: '✨', message: 'You\'re at the highest level!' }
  };

  const nextLevel = levelProgression[currentLevel]?.next || 'advanced';
  const config = levelProgression[currentLevel] || {};

  // Submit level upgrade request to backend
  const handleConfirmUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/level/upgrade');
      if (res.data.success) {
        // Call parent callback with new level
        onUpgrade(nextLevel);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to upgrade level. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-purple-100 relative">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Celebration header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">{config.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Level Up!</h2>
          <p className="text-sm text-gray-600">{config.message}</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 mb-6">
            {error}
          </div>
        )}

        {/* Upgrade details */}
        <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-6 mb-6 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🌱</div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-semibold uppercase">Current Level</p>
              <p className="text-lg font-bold text-gray-800 capitalize">{currentLevel}</p>
            </div>
            <div className="text-2xl text-purple-600">→</div>
            <div className="flex-1 text-right">
              <div className="text-4xl mb-1">{config.emoji}</div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Your New Level</p>
              <p className="text-lg font-bold text-purple-700 capitalize">{nextLevel}</p>
            </div>
          </div>
        </div>

        {/* What changes section */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" /> What Unlocks:
          </p>
          {nextLevel === 'intermediate' && (
            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Longer breath ratios (6-6-6 seconds)</li>
              <li>Access to all 7 chakras</li>
              <li>2-3 chakra combinations</li>
              <li>15-20 min sessions</li>
              <li>Breath of Fire (with safety warning)</li>
            </ul>
          )}
          {nextLevel === 'advanced' && (
            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Advanced breath ratios (8-8-8 seconds +)</li>
              <li>Full 7-chakra sequences</li>
              <li>Complete mantra progressions</li>
              <li>20-30 min sessions</li>
              <li>Full Breath of Fire techniques</li>
            </ul>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
          >
            Not Yet
          </button>
          <button
            onClick={handleConfirmUpgrade}
            disabled={loading}
            className={`flex-1 py-3 font-bold rounded-xl transition ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
            }`}
          >
            {loading ? 'Upgrading...' : 'Confirm Upgrade'}
          </button>
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You can change your level anytime in settings
        </p>
      </div>
    </div>
  );
};

export default LevelUpgradeModal;
