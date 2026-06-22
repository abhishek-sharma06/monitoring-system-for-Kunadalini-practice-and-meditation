import React, { useState } from 'react';
import BreathAnimation from './BreathAnimation';

// BreathCooldown: Step 7 - 1-2 cool-down breath cycles
const BreathCooldown = ({ sessionData, onNext }) => {
  const [breathingStarted, setBreathingStarted] = useState(false);
  const [cycles, setCycles] = useState(0);

  const targetCycles = 2;

  const handleBreathComplete = () => {
    onNext({ breath_cycles_completed: targetCycles });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Cool-down Breathing
        </h2>
        <p className="text-slate-600">
          Let's gently return to normal breathing and settle the energy.
        </p>
      </div>

      {/* Breath Animation */}
      {!breathingStarted ? (
        <div className="text-center">
          <p className="text-slate-700 mb-4">
            We'll do {targetCycles} gentle breath cycles to transition back.
          </p>
          <button
            onClick={() => setBreathingStarted(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95"
          >
            Begin Cool-down
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
        <strong>Notice:</strong> How does your body feel now compared to before? Take a moment to appreciate the practice.
      </div>
    </div>
  );
};

export default BreathCooldown;
