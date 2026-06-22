import React, { useState } from 'react';

// MoodCheckin: Step 2 & 8 - Mood picker (before/after variants)
const MoodCheckin = ({ sessionData, stepNumber, isAfterMood = false, onNext }) => {
  const [moodSelected, setMoodSelected] = useState(
    isAfterMood ? sessionData.mood_after : sessionData.mood_before
  );

  const moods = [
    { level: 1, emoji: '😢', label: 'Struggling' },
    { level: 2, emoji: '😕', label: 'Neutral' },
    { level: 3, emoji: '😊', label: 'Good' },
    { level: 4, emoji: '😄', label: 'Great' },
    { level: 5, emoji: '🤩', label: 'Amazing' }
  ];

  const handleMoodSelect = (level) => {
    setMoodSelected(level);
  };

  const handleContinue = () => {
    const dataKey = isAfterMood ? 'mood_after' : 'mood_before';
    onNext({ [dataKey]: moodSelected });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isAfterMood ? 'How are you feeling now?' : 'How are you feeling right now?'}
        </h2>
        <p className="text-slate-600">
          {isAfterMood
            ? 'Rate your mood after this practice session.'
            : "This helps us understand your practice journey. We'll check in again at the end."}
        </p>
      </div>

      {/* Mood selector */}
      <div className="flex justify-between gap-2 md:gap-4">
        {moods.map((mood) => (
          <button
            key={mood.level}
            onClick={() => handleMoodSelect(mood.level)}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
              moodSelected === mood.level
                ? 'bg-purple-500 text-white shadow-lg scale-110'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="text-4xl md:text-5xl">{mood.emoji}</span>
            <span className="text-xs md:text-sm font-semibold text-center leading-tight">
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Selected mood display */}
      {moodSelected && (
        <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-slate-700">
            You selected: <strong>{moods.find(m => m.level === moodSelected)?.label}</strong>
          </p>
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!moodSelected}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          moodSelected
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg active:scale-95'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default MoodCheckin;
