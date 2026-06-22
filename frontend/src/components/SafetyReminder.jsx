import React from 'react';
import { AlertCircle } from 'lucide-react';

// SafetyReminder: Step 1 - Short, dismissible safety reminder before practice
const SafetyReminder = ({ onNext }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        <AlertCircle className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Before You Begin
          </h2>
          <div className="space-y-3 text-slate-700">
            <p>
              <strong>Safe space:</strong> Practice in a quiet, comfortable location where you won't be disturbed.
            </p>
            <p>
              <strong>Avoid if:</strong> You're dizzy, ill, or in an altered state. Listen to your body.
            </p>
            <p>
              <strong>Breathing gently:</strong> Never force your breath. If you feel uncomfortable, stop and breathe normally.
            </p>
            <p>
              <strong>Energy sensations:</strong> It's normal to feel tingling, warmth, or vivid dreams. These are signs to listen to your body, not to stop.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onNext()}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95"
      >
        I'm Ready to Begin
      </button>
    </div>
  );
};

export default SafetyReminder;
