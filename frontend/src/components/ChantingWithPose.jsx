import React, { useState, useRef } from 'react';
import MantraPlayer from './MantraPlayer';
import { getChakraByName } from '../data/chakraData';
import { Music, AlertCircle } from 'lucide-react';

// ChantingWithPose: Step 6 - Mantra audio plays while holding pose
const ChantingWithPose = ({ programDay, onNext }) => {
  const [mantraAudio, setMantraAudio] = useState(null);
  const [isChanting, setIsChanting] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const timerRef = useRef(null);

  const focusKeyword = programDay.chakra_focus?.split(' ')[0] || 'Root';
  const chakraNameMap = {
    Root: 'Root Chakra',
    Sacral: 'Sacral Chakra',
    Solar: 'Solar Plexus Chakra',
    Heart: 'Heart Chakra',
    Throat: 'Throat Chakra',
    Third: 'Third Eye Chakra',
    Crown: 'Crown Chakra'
  };
  const chakraFocusName = chakraNameMap[focusKeyword] || programDay.chakra_focus;
  const chakra = getChakraByName(chakraFocusName) || getChakraByName('Root Chakra');

  const handleStartChanting = () => {
    setIsChanting(true);
    timerRef.current = setInterval(() => {
      setHoldTime(t => t + 1);
    }, 1000);
  };

  const handleStopChanting = () => {
    setIsChanting(false);
    if (timerRef.current) clearInterval(timerRef.current);
    onNext({
      mantra_played: true,
      duration_minutes: Math.ceil(holdTime / 60)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Chanting with Pose
        </h2>
        <p className="text-slate-600">
          Hold the pose while chanting the mantra. Feel the vibration in your body.
        </p>
      </div>

      {/* Chanting instruction */}
      <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex gap-4 items-start">
          <Music className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-purple-900 mb-2">
              How to Chant
            </h3>
            <ul className="text-purple-800 text-sm space-y-1">
              <li>• Inhale deeply</li>
              <li>• Chant the mantra on exhale (e.g., "LLLLAAAAMMMM")</li>
              <li>• Feel the vibration at the chakra location</li>
              <li>• Repeat 5-7 times</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mantra player */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">
          Reference Mantra
        </h3>
        <MantraPlayer
          chakra={chakra}
          level="beginner"
          onPlaybackComplete={() => {}}
        />
      </div>

      {/* Chanting timer */}
      {!isChanting ? (
        <button
          onClick={handleStartChanting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95"
        >
          Start Chanting
        </button>
      ) : (
        <div className="space-y-3">
          <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
            <p className="text-slate-700 text-sm mb-2">Chanting Duration</p>
            <p className="text-4xl font-bold text-purple-600">
              {Math.floor(holdTime / 60)}:{(holdTime % 60).toString().padStart(2, '0')}
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              Keep holding the pose while chanting. Feel the mantra vibrate through you.
            </div>
          </div>

          <button
            onClick={handleStopChanting}
            className="w-full py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all active:scale-95"
          >
            ✓ Finished Chanting
          </button>
        </div>
      )}
    </div>
  );
};

export default ChantingWithPose;
