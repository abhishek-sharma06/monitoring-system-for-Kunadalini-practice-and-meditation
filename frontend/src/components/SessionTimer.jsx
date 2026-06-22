// Import React hooks.
import React, { useState, useEffect, useRef } from 'react';

// SessionTimer controls session interval updates.
const SessionTimer = ({ onStop }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Handle intervals while running.
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Start/Resume timer.
  const handleStart = () => {
    setIsRunning(true);
  };

  // Pause timer.
  const handlePause = () => {
    setIsRunning(false);
  };

  // Stop timer and notify parent handler.
  const handleStop = () => {
    setIsRunning(false);
    // Convert to minutes, minimum 1 minute.
    const durationMinutes = Math.max(1, Math.ceil(seconds / 60));
    onStop(durationMinutes);
  };

  // Helper to format MM:SS display.
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm max-w-sm mx-auto">
      <span className="text-xs uppercase tracking-widest text-text-secondary font-bold">Session Timer</span>
      <div className="text-4xl font-semibold text-text-primary tabular-nums">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            type="button"
            onClick={handleStart}
            className="px-5 py-2 bg-accent-secondary text-white font-semibold rounded-full hover:bg-opacity-90 transition"
          >
            {seconds > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="px-5 py-2 bg-yellow-500 text-white font-semibold rounded-full hover:bg-opacity-90 transition"
          >
            Pause
          </button>
        )}
        <button
          type="button"
          onClick={handleStop}
          disabled={seconds === 0}
          className="px-5 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

// Export SessionTimer.
export default SessionTimer;
