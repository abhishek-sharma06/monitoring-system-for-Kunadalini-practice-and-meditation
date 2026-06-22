import React, { useEffect, useState } from 'react';
import MantraPlayer from './MantraPlayer';
import { getChakraByName } from '../data/chakraData';

// ChakraIntro: Step 4 - Chakra introduction and mantra audio playback
const ChakraIntro = ({ programDay, onNext }) => {
  const [mantraPlayed, setMantraPlayed] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Today's Chakra Focus
        </h2>
        <p className="text-slate-600">
          Let's connect with the {programDay.chakra_focus} chakra energy.
        </p>
      </div>

      {/* Chakra card */}
      <div
        className="p-6 rounded-lg text-white"
        style={{ backgroundColor: chakra.color }}
      >
        <h3 className="text-3xl font-bold mb-4">{programDay.chakra_focus}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-90">Mantra</p>
            <p className="text-xl font-bold">{chakra.bijaMantra}</p>
          </div>
          <div>
            <p className="opacity-90">Location</p>
            <p className="font-semibold">{chakra.location}</p>
          </div>
          <div>
            <p className="opacity-90">Element</p>
            <p className="font-semibold">{chakra.element}</p>
          </div>
          <div>
            <p className="opacity-90">Focus</p>
            <p className="font-semibold">{chakra.focus}</p>
          </div>
        </div>
        <p className="mt-4 italic">
          {chakra.description}
        </p>
      </div>

      {/* Mantra player */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">
          Listen to the Mantra
        </h3>
        <MantraPlayer
          chakra={chakra}
          level="beginner"
          onPlaybackComplete={() => setMantraPlayed(true)}
        />
      </div>

      {/* Continue button */}
      <button
        onClick={() => onNext({ mantra_played: mantraPlayed })}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95"
      >
        Ready for Poses
      </button>
    </div>
  );
};

export default ChakraIntro;
