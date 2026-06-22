// Import React.
import React from 'react';

// StreakBadge displays a fire emoji and the current day streak with a clean Tailwind hover tooltip.
const StreakBadge = ({ count = 0 }) => {
  return (
    <div className="relative group flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100 cursor-help transition-all hover:bg-orange-100/50">
      <span className="text-base" role="img" aria-label="streak">🔥</span>
      <span className="text-sm font-semibold leading-none">{count} Day Streak</span>
      
      {/* Self-contained Tailwind Hover Tooltip */}
      <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-text-primary text-white text-xs rounded-lg px-2.5 py-1.5 shadow-md whitespace-nowrap z-50">
        {count > 0 ? `You've practiced ${count} days in a row!` : 'Start practicing to begin your streak!'}
      </div>
    </div>
  );
};

// Export StreakBadge.
export default StreakBadge;
