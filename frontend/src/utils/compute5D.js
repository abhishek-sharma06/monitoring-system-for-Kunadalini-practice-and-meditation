// Compute a simple 5D index from available session signals.
// Inputs expected (object):
// - score: AI physical score 0-10
// - breathCompleted: boolean
// - breathCycles: number
// - breathTarget: number
// - mantraPlayed: boolean
// - moodBefore/moodAfter optional

export default function compute5D({ score = 5.0, breathCompleted = false, breathCycles = 0, breathTarget = 3, mantraPlayed = false }) {
  const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));

  // Physical: normalized AI score (0-10 -> 0-100)
  const physical = clamp(score * 10);

  // Prana: proportion of breath cycles completed (if completed full target -> 100)
  const prana = breathCompleted ? 100 : clamp((breathCycles / Math.max(1, breathTarget)) * 100);

  // Mind: unknown without face analysis; fallback to 50 as neutral
  const mind = 50;

  // Emotion: unknown without emotion analysis; fallback to 50
  const emotion = 50;

  // Spiritual: combination of mantra and breath completion
  const spiritualBase = (mantraPlayed ? 70 : 0) + (breathCompleted ? 30 : 0);
  const spiritual = clamp(spiritualBase);

  const five_d_score = clamp((physical + prana + mind + emotion + spiritual) / 5);

  return {
    physical,
    prana,
    mind,
    emotion,
    spiritual,
    five_d_score
  };
}
