// Import React.
import React from 'react';

// MoodPicker maps 1-5 ratings to calm emoji feedback controls.
const MoodPicker = ({ value, onChange, label = "How are you feeling?" }) => {
  const moods = [
    { rating: 1, emoji: '😞', label: 'Very Low' },
    { rating: 2, emoji: '😕', label: 'Low' },
    { rating: 3, emoji: '😐', label: 'Neutral' },
    { rating: 4, emoji: '🙂', label: 'Good' },
    { rating: 5, emoji: '😊', label: 'Radiant' }
  ];

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {label && <span className="text-sm font-semibold text-text-primary">{label}</span>}
      <div className="flex justify-center gap-4">
        {moods.map((m) => (
          <button
            key={m.rating}
            type="button"
            onClick={() => onChange(m.rating)}
            className={`text-3xl transition-all duration-200 transform hover:scale-125 focus:outline-none ${
              value === m.rating ? 'scale-125 filter drop-shadow-md brightness-110' : 'opacity-60 grayscale-[30%] hover:opacity-100 hover:grayscale-0'
            }`}
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Export MoodPicker.
export default MoodPicker;
