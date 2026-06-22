import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * SafetyDisclaimer Component
 * 
 * Displays safety information for kundalini practice.
 * Can show either:
 * - DETAILED version: Full lengthy disclaimer (shown once at signup)
 * - SHORT version: Quick reminder (shown before each practice)
 */
const SafetyDisclaimer = ({ 
  mode = 'short', // 'short' or 'detailed'
  onAccept,       // Callback when user accepts disclaimer
  onSkip          // Callback to dismiss short version (optional)
}) => {
  // Track if user has checked the acceptance checkbox (only for detailed mode)
  const [isChecked, setIsChecked] = useState(false);

  // Handle accept button click - only enabled when checkbox is checked (detailed mode)
  const handleAccept = () => {
    if (mode === 'detailed' && !isChecked) {
      alert('Please check the box to continue');
      return;
    }
    onAccept();
  };

  // SHORT VERSION - Quick reminder before practice
  if (mode === 'short') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 border-l-4 border-purple-500">
          {/* Header with icon */}
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-lg font-semibold text-gray-800">Quick Reminder</h2>
          </div>

          {/* Short disclaimer text */}
          <p className="text-gray-700 mb-6 text-sm leading-relaxed">
            Breathe gently, stop if uncomfortable. Never force your breath or push beyond your limits. 
            If you feel dizzy or unwell, pause and breathe normally.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onSkip || handleAccept}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DETAILED VERSION - Full disclaimer (shown once at signup)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-4 my-8 border-l-4 border-purple-500">
        {/* Header */}
        <div className="flex items-center mb-6">
          <AlertCircle className="w-7 h-7 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Important Safety Information</h2>
        </div>

        {/* Disclaimer text - comprehensive safety guidance */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Before you begin: This app guides you through breathing exercises (pranayama) and gentle 
            movement inspired by Kundalini yoga traditions. Please read before continuing:
          </p>

          <ul className="space-y-3 text-sm text-gray-700">
            {/* Individual safety points */}
            <li className="flex">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>
                <strong>Mental Health:</strong> If you have any serious mental health condition, 
                please consult a healthcare professional before starting energy work practices.
              </span>
            </li>

            <li className="flex">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>
                <strong>Pregnancy & Menstruation:</strong> If you are pregnant or menstruating, 
                avoid vigorous breathing techniques like Breath of Fire — gentler options are always available.
              </span>
            </li>

            <li className="flex">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>
                <strong>Gradual Progress:</strong> Always start gently and increase intensity gradually — 
                never force your breath.
              </span>
            </li>

            <li className="flex">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>
                <strong>Not Medical Advice:</strong> This app is a wellness tool, not a substitute for 
                professional medical or psychological care.
              </span>
            </li>

            <li className="flex">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>
                <strong>Stop if Uncomfortable:</strong> If you feel dizzy, uncomfortable, or unwell at 
                any point, stop immediately and breathe normally.
              </span>
            </li>
          </ul>
        </div>

        {/* Checkbox for acknowledgment */}
        <div className="mb-6 flex items-start">
          <input
            type="checkbox"
            id="disclaimer-check"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5 mr-3 cursor-pointer"
          />
          <label htmlFor="disclaimer-check" className="text-sm text-gray-700 cursor-pointer">
            I have read and understood this information
          </label>
        </div>

        {/* Action button */}
        <button
          onClick={handleAccept}
          disabled={!isChecked}
          className={`w-full font-semibold py-3 px-4 rounded transition ${
            isChecked
              ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isChecked ? 'I Understand & Continue' : 'Check the box to continue'}
        </button>

        {/* Info message */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You won't see this again after today
        </p>
      </div>
    </div>
  );
};

export default SafetyDisclaimer;
