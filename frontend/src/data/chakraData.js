/**
 * Chakra Data - Complete definitions of all 7 kundalini chakras
 * 
 * Each chakra includes Sanskrit name, bija mantra (seed sound),
 * phonetic spelling for accurate TTS pronunciation, location,
 * element, color, and spiritual significance.
 * 
 * Phonetic spellings are optimized for browser Web Speech API.
 */

export const chakras = [
  {
    // Root Chakra - Foundation & Grounding
    id: 'root',
    sanskritName: 'Muladhara',
    englishName: 'Root Chakra',
    bijaMantra: 'LAM',
    ttsPhonetic: 'Lum',
    element: 'Earth',
    focus: 'Grounding and safety',
    description: 'The Root Chakra is your foundation. It governs your sense of safety, security, and connection to the physical world. When balanced, you feel grounded and stable.',
    location: 'Base of spine',
    benefits: 'Stability, courage, confidence, financial security, feeling grounded in the present moment',
    color: '#C41E3A' // Deep red
  },
  {
    // Sacral Chakra - Creativity & Sexuality
    id: 'sacral',
    sanskritName: 'Svadhisthana',
    englishName: 'Sacral Chakra',
    bijaMantra: 'VAM',
    ttsPhonetic: 'Vum',
    element: 'Water',
    focus: 'Creativity and sexuality',
    description: 'The Sacral Chakra is your creative center. It governs sensuality, passion, desire, and creative expression. When balanced, you embrace change with joy.',
    location: 'Lower abdomen, 2 inches below navel',
    benefits: 'Creativity, sexuality, pleasure, healthy relationships, emotional balance, flexibility',
    color: '#FF7F00' // Orange
  },
  {
    // Solar Plexus Chakra - Personal Power & Will
    id: 'solar_plexus',
    sanskritName: 'Manipura',
    englishName: 'Solar Plexus Chakra',
    bijaMantra: 'RAM',
    ttsPhonetic: 'Rum',
    element: 'Fire',
    focus: 'Personal power and will',
    description: 'The Solar Plexus Chakra is your power center. It governs willpower, determination, and personal transformation. When balanced, you feel confident and in control of your destiny.',
    location: 'Upper abdomen, above navel',
    benefits: 'Personal power, confidence, willpower, metabolism, digestive health, self-discipline',
    color: '#FFD700' // Golden yellow
  },
  {
    // Heart Chakra - Love & Compassion
    id: 'heart',
    sanskritName: 'Anahata',
    englishName: 'Heart Chakra',
    bijaMantra: 'YAM',
    ttsPhonetic: 'Yum',
    element: 'Air',
    focus: 'Love and compassion',
    description: 'The Heart Chakra is the center of love and compassion. It bridges the physical and spiritual worlds. When balanced, you give and receive love freely, showing compassion to yourself and others.',
    location: 'Center of chest',
    benefits: 'Love, compassion, inner peace, healing, forgiveness, emotional balance, unconditional acceptance',
    color: '#00B050' // Green
  },
  {
    // Throat Chakra - Communication & Truth
    id: 'throat',
    sanskritName: 'Vishuddha',
    englishName: 'Throat Chakra',
    bijaMantra: 'HAM',
    ttsPhonetic: 'Hum',
    element: 'Sound/Ether',
    focus: 'Communication and truth',
    description: 'The Throat Chakra is your communication center. It governs self-expression, truth, and authentic voice. When balanced, you speak your truth with clarity and listen deeply.',
    location: 'Center of throat',
    benefits: 'Clear communication, authentic self-expression, listening, creativity, honesty, throat health',
    color: '#00CCFF' // Light blue/Turquoise
  },
  {
    // Third Eye Chakra - Intuition & Insight
    id: 'third_eye',
    sanskritName: 'Ajna',
    englishName: 'Third Eye Chakra',
    bijaMantra: 'OM',
    ttsPhonetic: 'Ohm',
    element: 'Light',
    focus: 'Intuition and inner wisdom',
    description: 'The Third Eye Chakra is your intuition center. It governs inner wisdom, insight, and spiritual awareness. When balanced, you trust your intuition and see beyond the veil of illusion.',
    location: 'Between eyebrows',
    benefits: 'Intuition, inner wisdom, insight, spiritual awareness, clarity of vision, imagination, dreams',
    color: '#4B0082' // Indigo
  },
  {
    // Crown Chakra - Spiritual Connection & Enlightenment
    id: 'crown',
    sanskritName: 'Sahasrara',
    englishName: 'Crown Chakra',
    bijaMantra: 'OM (silent or audible)',
    ttsPhonetic: 'Aum',
    element: 'Thought/Consciousness',
    focus: 'Spiritual connection and enlightenment',
    description: 'The Crown Chakra is your spiritual connection point. It represents enlightenment, divine consciousness, and universal connection. When open, you experience unity consciousness.',
    location: 'Top of head',
    benefits: 'Spiritual connection, enlightenment, unity consciousness, inner peace, fulfillment, divine love',
    color: '#9400D3' // Violet
  }
];

/**
 * Helper function to get chakra by ID
 * @param {string} chakraId - The chakra identifier (e.g., 'root', 'heart')
 * @returns {object} Chakra object or null if not found
 */
export const getChakraById = (chakraId) => {
  return chakras.find(c => c.id === chakraId) || null;
};

/**
 * Helper function to get chakra by English name
 * @param {string} name - The chakra name (e.g., 'Root Chakra')
 * @returns {object} Chakra object or null if not found
 */
export const getChakraByName = (name) => {
  return chakras.find(c => c.englishName === name) || null;
};

/**
 * Get chakras available for a specific level
 * @param {string} level - User level ('beginner', 'intermediate', 'advanced')
 * @returns {array} Array of available chakra objects
 */
export const getChakrasByLevel = (level) => {
  const levelConfig = {
    beginner: ['root', 'sacral', 'solar_plexus'],
    intermediate: ['root', 'sacral', 'solar_plexus', 'heart', 'throat', 'third_eye', 'crown'],
    advanced: ['root', 'sacral', 'solar_plexus', 'heart', 'throat', 'third_eye', 'crown']
  };

  const chakraIds = levelConfig[level] || levelConfig.beginner;
  return chakras.filter(c => chakraIds.includes(c.id));
};

export default chakras;
