import React, { useEffect, useState, useRef } from 'react';

// BreathAnimation: visual breathing circle and cycle counter with phase countdown
// Props:
// - level: 'beginner'|'intermediate'|'advanced' to set inhale/hold/exhale seconds
// - targetCycles: number of full breath cycles to complete
// - onCycleComplete(n): called after each completed cycle with cycle count
// - onComplete(): called when targetCycles reached
// - resetKey: change value to reset internal counters
const LEVEL_PHASES = {
  beginner: { inhale: 4, hold: 4, exhale: 4 },
  intermediate: { inhale: 6, hold: 6, exhale: 6 },
  advanced: { inhale: 8, hold: 8, exhale: 8 }
};

export default function BreathAnimation({
  level = 'beginner',
  targetCycles = 3,
  onCycleComplete,
  onComplete,
  resetKey,
  autoStart = false
}) {
  const [running, setRunning] = useState(autoStart);
  const [cycleCount, setCycleCount] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0); // 0=inhale,1=hold,2=exhale
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(autoStart);
  const tickRef = useRef(null);

  const phases = LEVEL_PHASES[level] || LEVEL_PHASES.beginner;
  const phaseNames = ['Inhale', 'Hold', 'Exhale'];
  const phaseDurations = [phases.inhale, phases.hold, phases.exhale];

  // initialize timeLeft when level changes
  useEffect(() => {
    setPhaseIndex(0);
    setTimeLeft(phaseDurations[0]);
    setStarted(autoStart);
    setRunning(autoStart);
  }, [level, autoStart]);

  // reset handling via resetKey
  useEffect(() => {
    setStarted(false);
    setRunning(false);
    setCycleCount(0);
    setPhaseIndex(0);
    setTimeLeft(phaseDurations[0]);
  }, [resetKey]);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }

    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // advance phase
          setPhaseIndex((idx) => {
            const next = (idx + 1) % 3;
            setTimeLeft(phaseDurations[next]);
            // completed a full cycle when moving from exhale to inhale
            if (idx === 2) {
              setCycleCount((c) => {
                const nextCycle = c + 1;
                if (onCycleComplete) onCycleComplete(nextCycle);
                if (nextCycle >= targetCycles) {
                  setRunning(false);
                  if (onComplete) onComplete();
                }
                return nextCycle;
              });
            }
            return next;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running, phaseDurations, targetCycles, onCycleComplete, onComplete]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        <div
          className="rounded-full bg-gradient-to-br from-purple-200 to-teal-100 flex items-center justify-center"
          style={{
            width: 180,
            height: 180,
            animationName: 'calm-breath',
            animationDuration: `${phaseDurations[0] + phaseDurations[1] + phaseDurations[2]}s`,
            animationTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
            animationIterationCount: running ? 'infinite' : '0'
          }}
        >
          <div className="text-center">
            <div className="text-sm font-semibold text-purple-800">{phaseNames[phaseIndex]}</div>
            <div className="text-xs text-gray-600">{timeLeft}s</div>
          </div>
        </div>
        <span
          className="absolute block rounded-full"
          style={{
            width: 240,
            height: 240,
            borderRadius: '9999px',
            boxShadow: '0 0 28px rgba(107,79,160,0.12)'
          }}
        />
      </div>

      {!started ? (
        <button
          onClick={() => {
            setStarted(true);
            setRunning(true);
          }}
          className="px-4 py-2 text-xs bg-accent-primary text-white rounded-full hover:bg-opacity-90"
        >
          Start Breath
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-xs text-text-secondary">Cycles: <span className="font-bold">{cycleCount}/{targetCycles}</span></div>
          <button
            onClick={() => setRunning((r) => !r)}
            className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200"
          >
            {running ? 'Pause' : 'Resume'}
          </button>
        </div>
      )}
    </div>
  );
}
