// Import React.
import React from 'react';

// Centered loading spinner styled using Tailwind.
const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full p-6">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-primary"></div>
      {text && <p className="mt-4 text-sm text-text-secondary font-medium">{text}</p>}
    </div>
  );
};

// Export LoadingSpinner.
export default LoadingSpinner;
