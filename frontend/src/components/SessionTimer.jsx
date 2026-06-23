import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';

const SessionTimer = ({ onStop, targetDuration, onTimeUpdate, onTargetReached, overlay = false }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const targetReachedRef = useRef(false);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (onTimeUpdate) onTimeUpdate(next);
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, onTimeUpdate]);

  // Check target duration reached
  useEffect(() => {
    if (targetDuration && seconds >= targetDuration * 60 && !targetReachedRef.current) {
      targetReachedRef.current = true;
      setIsRunning(false);
      if (onTargetReached) onTargetReached();
    }
  }, [seconds, targetDuration, onTargetReached]);

  // Auto-start on mount
  useEffect(() => {
    setIsRunning(true);
  }, []);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsRunning(false);
    const durationMinutes = Math.max(1, Math.ceil(seconds / 60));
    if (onStop) onStop(durationMinutes);
  };

  // Compact overlay mode for camera feed
  if (overlay) {
    return (
      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm font-semibold tabular-nums">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span>{formatTime(seconds)}</span>
        {targetDuration > 0 && (
          <span className="text-white/60 text-xs">/ {targetDuration}m</span>
        )}
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  // Full card mode
  return (
    <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm max-w-sm mx-auto">
      <span className="text-xs uppercase tracking-widest text-text-secondary font-bold">Session Timer</span>
      <div className="text-4xl font-semibold text-text-primary tabular-nums">
        {formatTime(seconds)}
      </div>
      {targetDuration > 0 && (
        <div className="text-xs text-text-secondary">
          Target: {targetDuration} minutes
        </div>
      )}
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            type="button"
            onClick={() => setIsRunning(true)}
            className="px-5 py-2 bg-accent-secondary text-white font-semibold rounded-full hover:bg-opacity-90 transition"
          >
            {seconds > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsRunning(false)}
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

export default SessionTimer;
