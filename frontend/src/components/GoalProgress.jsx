// Import React.
import React from 'react';

// GoalProgress shows target completion progress using a lavender and purple bar.
const GoalProgress = ({ current = 0, target = 5 }) => {
  const percentage = Math.min(100, Math.round((current / Math.max(1, target)) * 100));

  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-border">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="font-semibold text-text-primary">Weekly Practice Goal</span>
        <span className="font-medium text-text-secondary">{current} of {target} sessions completed</span>
      </div>
      <div className="w-full h-3 bg-background-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-primary rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-2 text-right">
        <span className="text-xs font-bold text-accent-primary">{percentage}% Complete</span>
      </div>
    </div>
  );
};

// Export GoalProgress.
export default GoalProgress;
