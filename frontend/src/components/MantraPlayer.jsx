import React, { useState, useEffect } from 'react';
import { Music, Volume2, Square, AlertCircle } from 'lucide-react';
import { speakMantrasRepetitively, stopSpeaking, isSpeaking } from '../utils/speakMantra';

/**
 * MantraPlayer Component
 * 
 * Displays chakra bija mantra with TTS playback.
 * Features:
 * - Shows chakra name and mantra text
 * - Play/Stop buttons for audio control
 * - Pulse animation synced with mantra chanting
 * - Tracks completion for spiritual score calculation
 * - Level-based repetitions (Beginner: 5x, Intermediate: 7x, Advanced: full sequence)
 */
const MantraPlayer = ({ 
  chakra,           // Chakra object with id, englishName, bijaMantra, ttsPhonetic, description
  level = 'beginner', // User level to determine repetitions
  onPlaybackComplete, // Callback when full mantra playback finishes
  disabled = false   // Disable player (e.g., during other session activities)
}) => {
  // Determine repetitions based on user level
  const getRepetitions = () => {
    const reps = { beginner: 5, intermediate: 7, advanced: 7 };
    return reps[level] || 5;
  };

  const repetitions = getRepetitions();

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRep, setCurrentRep] = useState(0);
  const [totalReps, setTotalReps] = useState(repetitions);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [error, setError] = useState('');

  // Pulse animation state - synced with audio playback
  const [pulseScale, setPulseScale] = useState(1);

  // Handle play button click - start mantra chanting
  const handlePlay = () => {
    if (!chakra) return;

    setIsPlaying(true);
    setError('');
    setCurrentRep(0);
    setHasCompleted(false);
    setPulseScale(1);

    try {
      // Speak mantra with repetitions using Web Speech API
      speakMantrasRepetitively(
        chakra.ttsPhonetic,
        totalReps,
        {
          rate: 0.7, // Slower, deliberate pace
          pitch: 0.9, // Slightly lower for calming effect
          volume: 1,

          // Called when each repetition starts
          onRepetitionStart: (rep, total) => {
            setCurrentRep(rep);
            // Trigger pulse animation at start of each rep
            setPulseScale(1.1);
            setTimeout(() => setPulseScale(1), 200);
          },

          // Called when all repetitions complete
          onAllComplete: () => {
            setIsPlaying(false);
            setHasCompleted(true);
            setPulseScale(1);
            // Notify parent that full mantra playback completed
            if (onPlaybackComplete) {
              onPlaybackComplete();
            }
          },

          // Called on speech synthesis error
          onError: (event) => {
            console.error('Mantra playback error:', event);
            setIsPlaying(false);
            setError(`Audio error: ${event.error || 'Unknown error'}`);
          }
        }
      );
    } catch (err) {
      setError('Failed to start mantra playback');
      setIsPlaying(false);
    }
  };

  // Handle stop button click
  const handleStop = () => {
    stopSpeaking();
    setIsPlaying(false);
    setPulseScale(1);
  };

  if (!chakra) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-border text-center">
        <AlertCircle className="w-5 h-5 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No chakra selected</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col gap-6">
      {/* Header with chakra name */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">{chakra.englishName}</h2>
        <p className="text-sm text-gray-600 italic mt-1">{chakra.sanskritName}</p>
      </div>

      {/* Large mantra display with pulse animation */}
      <div className="flex justify-center">
        <div
          className={`relative w-32 h-32 rounded-full flex items-center justify-center text-center transition-transform duration-200`}
          style={{
            background: `linear-gradient(135deg, ${chakra.color}20 0%, ${chakra.color}10 100%)`,
            border: `3px solid ${chakra.color}`,
            transform: `scale(${pulseScale})`
          }}
        >
          {/* Animated outer ring when playing */}
          {isPlaying && (
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                border: `2px solid ${chakra.color}`,
                opacity: 0.3
              }}
            />
          )}

          {/* Mantra text in center */}
          <div className="z-10 text-center">
            <div className="text-5xl font-bold" style={{ color: chakra.color }}>
              {chakra.bijaMantra}
            </div>
            <div className="text-xs text-gray-600 mt-2 font-semibold uppercase tracking-wider">
              Bija Mantra
            </div>
          </div>
        </div>
      </div>

      {/* Chakra description */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed">{chakra.description}</p>
        <div className="flex flex-col gap-2 mt-3 text-xs text-gray-600">
          <div><span className="font-semibold">Location:</span> {chakra.location}</div>
          <div><span className="font-semibold">Element:</span> {chakra.element}</div>
          <div><span className="font-semibold">Focus:</span> {chakra.focus}</div>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex gap-3">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            disabled={disabled}
            className={`flex-1 py-4 font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition ${
              disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg'
            }`}
          >
            <Music className="w-5 h-5" />
            Play Mantra ({totalReps}x)
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 py-4 font-bold text-lg rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 transition shadow-md"
          >
            <Square className="w-5 h-5 fill-current" />
            Stop Playing
          </button>
        )}
      </div>

      {/* Progress indicator */}
      {isPlaying && (
        <div className="text-center">
          <p className="text-sm font-semibold text-purple-600">
            Repetition {currentRep} of {totalReps}
          </p>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentRep / totalReps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Completion indicator */}
      {hasCompleted && !isPlaying && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm font-bold text-green-700">✓ Mantra Playback Complete!</p>
          <p className="text-xs text-green-600 mt-1">This counts toward your spiritual score.</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <p className="text-xs text-red-600 mt-1">Check browser permissions and try again.</p>
        </div>
      )}

      {/* Info footer */}
      <div className="text-xs text-gray-500 text-center italic border-t border-gray-100 pt-4">
        {level === 'beginner' && '🌱 Beginner Level: 5 repetitions'}
        {level === 'intermediate' && '🌿 Intermediate Level: 7 repetitions'}
        {level === 'advanced' && '🌳 Advanced Level: Full sequence'}
      </div>
    </div>
  );
};

export default MantraPlayer;
