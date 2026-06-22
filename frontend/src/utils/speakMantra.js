/**
 * Web Speech API Utility - Speaks mantra using browser's native text-to-speech
 * 
 * Uses window.speechSynthesis API (available in all modern browsers).
 * Optimized for mantra chanting with slower, calming delivery.
 */

/**
 * Speak a mantra using Web Speech API
 * @param {string} text - Phonetic text to speak (e.g., 'Lum')
 * @param {object} options - Configuration options
 * @param {number} options.rate - Speed (0.5=very slow, 1=normal, 2=fast) - default 0.7
 * @param {number} options.pitch - Pitch (0.5=low, 1=normal, 2=high) - default 0.9
 * @param {number} options.volume - Volume (0-1) - default 1
 * @param {function} options.onStart - Callback when speaking starts
 * @param {function} options.onEnd - Callback when speaking ends
 * @param {function} options.onError - Callback on error
 * @returns {void}
 */
export const speakMantra = (text, options = {}) => {
  // Check if Web Speech API is available in browser
  const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
  const speechSynthesis = window.speechSynthesis;

  if (!SpeechSynthesisUtterance || !speechSynthesis) {
    console.error('Web Speech API not supported in this browser');
    if (options.onError) {
      options.onError(new Error('Speech synthesis not supported'));
    }
    return;
  }

  // Create utterance object for this mantra
  const utterance = new SpeechSynthesisUtterance(text);

  // Configure voice parameters for calm, meditative delivery
  utterance.rate = options.rate || 0.7; // Slower pace (0.7 = 30% slower than normal)
  utterance.pitch = options.pitch || 0.9; // Slightly lower pitch (calming)
  utterance.volume = options.volume || 1; // Full volume

  // Set callbacks
  if (options.onStart) {
    utterance.onstart = () => {
      console.log(`Speaking: "${text}"`);
      options.onStart();
    };
  }

  if (options.onEnd) {
    utterance.onend = () => {
      console.log(`Finished speaking: "${text}"`);
      options.onEnd();
    };
  }

  if (options.onError) {
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      options.onError(event);
    };
  }

  // Speak the mantra
  speechSynthesis.cancel(); // Cancel any ongoing speech
  speechSynthesis.speak(utterance);
};

/**
 * Speak a mantra multiple times with delay between repetitions
 * @param {string} text - Phonetic text to speak
 * @param {number} repetitions - Number of times to repeat (default 5)
 * @param {object} options - Configuration options (same as speakMantra)
 * @param {number} options.delayBetweenReps - Delay between repetitions in ms (default 1500)
 * @param {function} options.onRepetitionStart - Called when each rep starts
 * @param {function} options.onAllComplete - Called when all reps done
 * @returns {void}
 */
export const speakMantrasRepetitively = (text, repetitions = 5, options = {}) => {
  const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
  const speechSynthesis = window.speechSynthesis;

  if (!SpeechSynthesisUtterance || !speechSynthesis) {
    console.error('Web Speech API not supported');
    if (options.onError) {
      options.onError(new Error('Speech synthesis not supported'));
    }
    return;
  }

  let currentRepetition = 0;
  const delayBetweenReps = options.delayBetweenReps || 1500; // 1.5 second break between reps

  // Recursive function to speak each repetition with delay
  const speakNextRepetition = () => {
    if (currentRepetition >= repetitions) {
      // All repetitions complete
      console.log(`Mantra chanting complete: ${repetitions} repetitions of "${text}"`);
      if (options.onAllComplete) {
        options.onAllComplete();
      }
      return;
    }

    currentRepetition++;
    console.log(`Repetition ${currentRepetition} of ${repetitions}`);

    if (options.onRepetitionStart) {
      options.onRepetitionStart(currentRepetition, repetitions);
    }

    // Create and speak utterance for this repetition
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.7;
    utterance.pitch = options.pitch || 0.9;
    utterance.volume = options.volume || 1;

    // After this repetition ends, schedule the next one
    utterance.onend = () => {
      if (currentRepetition < repetitions) {
        // Schedule next repetition with delay
        setTimeout(speakNextRepetition, delayBetweenReps);
      } else {
        // Final repetition done
        if (options.onAllComplete) {
          options.onAllComplete();
        }
      }
    };

    utterance.onerror = (event) => {
      console.error('Error during mantra chanting:', event.error);
      if (options.onError) {
        options.onError(event);
      }
    };

    speechSynthesis.cancel(); // Ensure clean start
    speechSynthesis.speak(utterance);
  };

  // Start the first repetition
  speakNextRepetition();
};

/**
 * Stop any ongoing speech synthesis
 * @returns {void}
 */
export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    console.log('Speech synthesis stopped');
  }
};

/**
 * Check if speech synthesis is currently active
 * @returns {boolean} True if speaking, false otherwise
 */
export const isSpeaking = () => {
  return window.speechSynthesis?.speaking || false;
};

export default { speakMantra, speakMantrasRepetitively, stopSpeaking, isSpeaking };
