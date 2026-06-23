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
    color: '#C41E3A', // Deep red
    yogaPose: {
      name: 'Mountain Pose',
      sanskritName: 'Tadasana',
      description: 'Stand tall and grounded like a mountain. This foundational pose builds stability and connects you to earth energy through your feet.',
      steps: [
        'Stand with feet together or hip-width apart',
        'Distribute weight evenly across both feet',
        'Engage thigh muscles, lift kneecaps gently',
        'Lengthen tailbone toward floor, core lightly engaged',
        'Roll shoulders back and down, arms at sides with palms forward',
        'Hold for 5-10 deep breaths, feeling rooted to the ground'
      ],
      benefits: 'Grounding, improved posture, stability, body awareness, calm focus',
      duration: '1-2 minutes',
      alignmentTips: [
        'Distribute weight evenly across both feet',
        'Keep shoulders relaxed, away from ears',
        'Engage core without clenching'
      ]
    },
    mudra: {
      name: 'Prithvi Mudra',
      subtitle: 'Earth Gesture',
      description: 'Touch the tip of your thumb to the tip of your ring finger. This mudra activates the earth element, promoting stability and grounding.',
      steps: [
        'Sit comfortably with spine erect',
        'Rest hands on knees, palms facing up',
        'Touch tip of thumb to tip of ring finger',
        'Keep index, middle, and pinky fingers extended naturally',
        'Hold gently without tension in the fingers',
        'Breathe deeply for 5-10 minutes'
      ],
      benefits: 'Stability, reduces anxiety, enhances vitality, strengthens connection to earth',
      duration: '5-10 minutes',
      alignmentTips: [
        'Keep index, middle, and pinky fingers extended naturally',
        'Apply gentle pressure between thumb and ring finger',
        'Maintain a straight spine while holding'
      ]
    }
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
    color: '#FF7F00', // Orange
    yogaPose: {
      name: 'Goddess Pose',
      sanskritName: 'Utkata Konasana',
      description: 'A powerful wide-legged squat that opens the hips and activates the sacral center. Embody the divine feminine energy of creation.',
      steps: [
        'Stand with feet wide apart, toes turned out 45 degrees',
        'Inhale and raise arms to shoulder height, elbows bent at 90 degrees',
        'Exhale and bend knees deeply, lowering into a wide squat',
        'Keep knees tracking over toes, thighs parallel to floor if possible',
        'Engage core, lengthen spine, gaze forward',
        'Hold for 5-8 breaths, then slowly straighten legs to release'
      ],
      benefits: 'Hip opening, emotional release, creativity boost, leg strength, pelvic energy activation',
      duration: '1-2 minutes',
      alignmentTips: [
        'Keep knees tracking over your toes, not collapsing inward',
        'Lengthen your spine, avoid rounding the back',
        'Sink hips only as deep as comfortable'
      ]
    },
    mudra: {
      name: 'Varun Mudra',
      subtitle: 'Water Gesture',
      description: 'Touch the tip of your thumb to the tip of your pinky finger. This mudra balances the water element, enhancing emotional fluidity and creativity.',
      steps: [
        'Sit in a comfortable meditative position',
        'Rest hands on knees, palms facing upward',
        'Touch tip of thumb to tip of pinky finger',
        'Keep other three fingers extended and relaxed',
        'Apply gentle pressure, not force',
        'Breathe naturally for 5-10 minutes'
      ],
      benefits: 'Emotional balance, enhanced creativity, fluidity, improved circulation, hydration',
      duration: '5-10 minutes',
      alignmentTips: [
        'Keep the other three fingers extended and relaxed',
        'Apply gentle pressure, never force the connection',
        'Breathe naturally while holding the mudra'
      ]
    }
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
    color: '#FFD700', // Golden yellow
    yogaPose: {
      name: 'Boat Pose',
      sanskritName: 'Paripurna Navasana',
      description: 'Engage your core fire in this powerful pose that ignites the solar plexus. Balance on your sit bones while extending legs and arms.',
      steps: [
        'Sit with knees bent, feet flat on floor',
        'Lean back slightly, keeping spine straight',
        'Lift feet off floor, bringing shins parallel to ground',
        'Extend arms forward alongside legs, palms facing each other',
        'Engage core deeply, chest lifted, gaze toward toes',
        'Hold for 5-8 breaths, then slowly lower with control'
      ],
      benefits: 'Core strength, increased willpower, digestive stimulation, confidence building, metabolic boost',
      duration: '30-60 seconds',
      alignmentTips: [
        'Keep your chest lifted, avoid rounding the spine',
        'Engage your deep core muscles, not just the surface abs',
        'Breathe steadily even while holding the pose'
      ]
    },
    mudra: {
      name: 'Surya Mudra',
      subtitle: 'Sun Gesture',
      description: 'Bend the ring finger to the base of the thumb and press lightly. This mudra activates the fire element, boosting metabolism and personal power.',
      steps: [
        'Sit comfortably with a straight spine',
        'Place hands on knees, palms facing up',
        'Bend ring finger down to base of thumb',
        'Press thumb gently over the bent ring finger',
        'Keep index, middle, and pinky fingers extended',
        'Hold for 5-10 minutes while breathing deeply'
      ],
      benefits: 'Boosts metabolism, enhances willpower, increases confidence, activates digestive fire',
      duration: '5-10 minutes',
      alignmentTips: [
        'Keep the ring finger bent at the base, not the middle joint',
        'Thumb presses gently, not with force',
        'Keep the other three fingers extended straight'
      ]
    }
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
    color: '#00B050', // Green
    yogaPose: {
      name: 'Cobra Pose',
      sanskritName: 'Bhujangasana',
      description: 'Open your heart center with this gentle backbend. Lift your chest like a cobra rising, inviting love and vulnerability.',
      steps: [
        'Lie face down with legs together, tops of feet on floor',
        'Place palms under shoulders, elbows close to body',
        'Inhale and press into palms, lifting chest off floor',
        'Keep elbows slightly bent, shoulders relaxed away from ears',
        'Lift only as high as comfortable, engaging back muscles',
        'Hold for 5-8 breaths, then slowly lower on exhale'
      ],
      benefits: 'Heart opening, chest expansion, improved posture, emotional release, spine strengthening',
      duration: '1-2 minutes',
      alignmentTips: [
        'Keep elbows slightly bent, never locked',
        'Roll shoulders away from your ears',
        'Lift using your back muscles, not just arm strength'
      ]
    },
    mudra: {
      name: 'Anjali Mudra',
      subtitle: 'Prayer Gesture',
      description: 'Bring palms together at heart center in prayer position. This universal gesture of reverence opens the heart chakra and cultivates gratitude.',
      steps: [
        'Sit or stand with spine tall',
        'Bring palms together at center of chest',
        'Keep fingers pointing upward, thumbs resting near sternum',
        'Maintain small space between palms (not pressing hard)',
        'Close eyes or soften gaze, breathe naturally',
        'Hold for 5-10 minutes, cultivating feelings of love'
      ],
      benefits: 'Heart opening, gratitude, inner peace, compassion, connection to self and others',
      duration: '5-10 minutes',
      alignmentTips: [
        'Keep a small space between palms, do not press hard',
        'Thumbs rest gently near your sternum',
        'Relax your shoulders while holding'
      ]
    }
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
    color: '#00CCFF', // Light blue/Turquoise
    yogaPose: {
      name: 'Fish Pose',
      sanskritName: 'Matsyasana',
      description: 'A deep backbend that exposes and stretches the throat area. This pose opens the throat chakra for authentic self-expression.',
      steps: [
        'Lie on your back with legs together',
        'Place hands under hips, palms down',
        'Press into forearms, lifting chest toward ceiling',
        'Arch back, letting head drop back gently',
        'Crown of head may lightly touch floor (optional)',
        'Hold for 5-8 breaths, then slowly release with support'
      ],
      benefits: 'Throat opening, thyroid stimulation, improved communication, chest expansion, emotional release',
      duration: '1-2 minutes',
      alignmentTips: [
        'Support your head, do not let it drop heavily',
        'Keep weight on your forearms, not your neck',
        'Only arch as deep as comfortable for your spine'
      ]
    },
    mudra: {
      name: 'Shunya Mudra',
      subtitle: 'Emptiness Gesture',
      description: 'Fold the middle finger to the base of the thumb and press lightly. This mudra clears throat blockages and enhances communication.',
      steps: [
        'Sit in a comfortable position',
        'Rest hands on knees, palms up',
        'Fold middle finger down to base of thumb',
        'Press thumb gently over the middle finger',
        'Keep index, ring, and pinky extended',
        'Hold for 5-10 minutes while focusing on throat'
      ],
      benefits: 'Clear communication, throat health, enhanced expression, reduced fear of speaking',
      duration: '5-10 minutes',
      alignmentTips: [
        'Keep the middle finger folded at the base knuckle',
        'Thumb presses gently over the folded finger',
        'Keep the other fingers extended and relaxed'
      ]
    }
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
    color: '#4B0082', // Indigo
    yogaPose: {
      name: "Child's Pose",
      sanskritName: 'Balasana',
      description: 'A restorative forward fold that calms the mind and directs awareness inward. Rest your forehead on the ground to stimulate the third eye.',
      steps: [
        'Kneel on floor, big toes touching, knees apart',
        'Sit back on heels',
        'Fold forward, extending arms in front or alongside body',
        'Rest forehead gently on the floor',
        'Breathe deeply, releasing tension with each exhale',
        'Hold for 2-5 minutes, surrendering to stillness'
      ],
      benefits: 'Inner reflection, calming the mind, third eye stimulation, stress relief, spiritual connection',
      duration: '2-5 minutes',
      alignmentTips: [
        'Let your forehead rest gently on the floor',
        'Keep your arms relaxed alongside or in front of you',
        'Breathe into your back body with each inhale'
      ]
    },
    mudra: {
      name: 'Gyan Mudra',
      subtitle: 'Knowledge Gesture',
      description: 'Touch the tip of your thumb to the tip of your index finger. This classic meditation mudra enhances intuition and wisdom.',
      steps: [
        'Sit in meditation posture with spine erect',
        'Rest hands on knees, palms facing up',
        'Touch tip of thumb to tip of index finger',
        'Keep middle, ring, and pinky fingers extended',
        'Form a gentle circle with thumb and index finger',
        'Hold for 10-20 minutes during meditation'
      ],
      benefits: 'Enhanced intuition, mental clarity, wisdom, improved focus, spiritual insight',
      duration: '10-20 minutes',
      alignmentTips: [
        'Form a gentle circle, do not press the fingers together',
        'Keep the other three fingers extended but relaxed',
        'Rest your hands comfortably on your knees'
      ]
    }
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
    color: '#9400D3', // Violet
    yogaPose: {
      name: 'Lotus Pose',
      sanskritName: 'Padmasana',
      description: 'The quintessential meditation pose. Cross legs in a bound position to create a stable base for deep spiritual practice.',
      steps: [
        'Sit on floor with legs extended',
        'Bend right knee, place foot on left thigh',
        'Bend left knee, place foot on right thigh',
        'Both soles face upward, heels close to abdomen',
        'Rest hands on knees in any comfortable mudra',
        'Hold for 10-30 minutes during meditation'
      ],
      benefits: 'Deep meditation, spiritual opening, calm mind, hip flexibility, energy alignment',
      duration: '10-30 minutes',
      alignmentTips: [
        'Only cross legs as far as your hips allow',
        'Keep your spine tall, avoid rounding the lower back',
        'Place feet gently on thighs, never force the position'
      ]
    },
    mudra: {
      name: 'Prana Mudra',
      subtitle: 'Life Force Gesture',
      description: 'Touch the tips of thumb, ring finger, and pinky finger together. This mudra awakens prana and connects you to universal consciousness.',
      steps: [
        'Sit in a comfortable meditative position',
        'Rest hands on knees, palms facing up',
        'Touch tips of thumb, ring finger, and pinky together',
        'Keep index and middle fingers extended',
        'Hold gently, feeling the energy connection',
        'Breathe deeply for 5-15 minutes'
      ],
      benefits: 'Awakens life force, spiritual growth, enhanced clarity, vitality, connection to higher consciousness',
      duration: '5-15 minutes',
      alignmentTips: [
        'Touch all three fingertips together gently',
        'Keep index and middle fingers extended straight',
        'Hold without tension, let energy flow naturally'
      ]
    }
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
