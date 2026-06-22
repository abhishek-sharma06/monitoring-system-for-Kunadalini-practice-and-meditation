import React, { useState } from 'react';
import BreathAnimation from './BreathAnimation';

// BreathWarmup: Step 3 - 2-3 warm-up breath cycles using BreathAnimation
const BreathWarmup = ({ sessionData, onNext, programDay }) => {
  const [breathingStarted, setBreathingStarted] = useState(false);
  const [cycles, setCycles] = useState(0);

  // Determine level-based breath cycles
  const targetCycles = 3;

  const handleBreathComplete = () => {
    onNext({ breath_cycles_completed: targetCycles });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Breathing Warm-up
        </h2>
        <p className="text-slate-600">
          Let's start with a few gentle breath cycles to center yourself. Follow the circle's rhythm.
        </p>
      </div>

      {/* Breath Animation */}
      {!breathingStarted ? (
        <div className="text-center">
          <p className="text-slate-700 mb-4">
            Ready to begin? We'll do {targetCycles} breath cycles to warm up.
          </p>
          <button
            onClick={() => setBreathingStarted(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95"
          >
            Start Breathing
          </button>
        </div>
      ) : (
        <div className="text-center">
          <BreathAnimation
            level="beginner"
            targetCycles={targetCycles}
            autoStart={true}
            onCycleComplete={(count) => setCycles(count)}
            onComplete={handleBreathComplete}
          />
          <p className="mt-6 text-slate-700 font-semibold">
            Cycles: {cycles} / {targetCycles}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <strong>Tip:</strong> Feel your chest expanding and contracting. If you feel dizzy at any point, return to normal breathing.
      </div>
    </div>
  );
};

export default BreathWarmup;
