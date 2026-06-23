/**
 * Alternative Poses - Additional yoga poses and mudras for progressive practice
 * 
 * Each chakra has a primary pose (in chakraData.js) and alternatives here.
 * The number of poses shown per session increases with program level/days:
 *   - Beginner (days 1-6): 1 pose
 *   - Beginner (days 8-13 Deepen): 2 poses
 * - Intermediate: 2 poses
 *   - Advanced (days 1-21): 2 poses
 *   - Advanced (days 22-30 Combined): 3 poses
 */

export const alternativeYogaPoses = {
  root: [
    {
      name: 'Tree Pose',
      sanskritName: 'Vrksasana',
      description: 'Stand on one leg with the other foot placed on the inner thigh. This pose builds balance and strengthens the connection to earth energy.',
      steps: [
        'Stand tall in Mountain Pose',
        'Shift weight to left foot',
        'Place right foot on inner left thigh',
        'Bring hands to prayer at heart',
        'Focus on a steady point ahead',
        'Hold for 5-8 breaths, then switch sides'
      ],
      benefits: 'Balance, focus, hip opening, grounding, mental clarity',
      duration: '1-2 minutes each side'
    },
    {
      name: 'Warrior I',
      sanskritName: 'Virabhadrasana I',
      description: 'A powerful standing pose that builds strength and stability. Root through your feet while reaching toward the sky.',
      steps: [
        'Step right foot forward into a lunge',
        'Back foot angled at 45 degrees',
        'Bend right knee over ankle',
        'Raise arms overhead, palms facing',
        'Square hips forward, engage core',
        'Hold for 5-8 breaths, then switch sides'
      ],
      benefits: 'Leg strength, hip flexibility, grounding, confidence, stability',
      duration: '1-2 minutes each side'
    }
  ],
  sacral: [
    {
      name: 'Triangle Pose',
      sanskritName: 'Trikonasana',
      description: 'A flowing side stretch that opens the hips and creates fluid movement through the body, awakening sacral energy.',
      steps: [
        'Stand with feet wide apart',
        'Turn right foot out 90 degrees',
        'Extend arms parallel to floor',
        'Reach right hand toward right shin',
        'Extend left arm toward ceiling',
        'Hold for 5-8 breaths, then switch sides'
      ],
      benefits: 'Hip opening, side stretch, emotional release, creativity, flexibility',
      duration: '1-2 minutes each side'
    },
    {
      name: 'Crescent Lunge',
      sanskritName: 'Anjaneyasana',
      description: 'A deep hip flexor stretch that opens the front body and creates a gentle backbend, stimulating creative energy.',
      steps: [
        'Step right foot forward into lunge',
        'Lower left knee to floor',
        'Raise arms overhead',
        'Sink hips forward and down',
        'Lift chest, slight backbend',
        'Hold for 5-8 breaths, then switch sides'
      ],
      benefits: 'Hip flexor opening, emotional release, heart opening, balance',
      duration: '1-2 minutes each side'
    }
  ],
  solar_plexus: [
    {
      name: 'Plank Pose',
      sanskritName: 'Phalakasana',
      description: 'A core-strengthening pose that builds willpower and personal power. Hold strong like a plank of wood.',
      steps: [
        'Start in tabletop position',
        'Step feet back into push-up position',
        'Align wrists under shoulders',
        'Engage core, keep body straight',
        'Hold gaze between hands',
        'Hold for 30-60 seconds'
      ],
      benefits: 'Core strength, willpower, metabolism, confidence, arm strength',
      duration: '30-60 seconds'
    },
    {
      name: 'Warrior III',
      sanskritName: 'Virabhadrasana III',
      description: 'A balancing pose that builds core fire and determination. Stand strong on one leg while extending the body.',
      steps: [
        'Stand on right leg',
        'Hinge forward at hips',
        'Extend left leg behind you',
        'Reach arms forward or alongside body',
        'Body forms a T-shape',
        'Hold for 5-8 breaths, then switch sides'
      ],
      benefits: 'Core strength, balance, willpower, focus, full-body engagement',
      duration: '30-60 seconds each side'
    }
  ],
  heart: [
    {
      name: 'Bridge Pose',
      sanskritName: 'Setu Bandhasana',
      description: 'A gentle backbend that opens the chest and heart center. Create a bridge between earth and sky.',
      steps: [
        'Lie on back, knees bent, feet flat',
        'Arms alongside body, palms down',
        'Press into feet, lift hips',
        'Roll shoulders under if comfortable',
        'Keep thighs parallel',
        'Hold for 5-8 breaths, then lower slowly'
      ],
      benefits: 'Heart opening, chest expansion, back strength, emotional release',
      duration: '1-2 minutes'
    },
    {
      name: 'Camel Pose',
      sanskritName: 'Ustrasana',
      description: 'A deep backbend that fully opens the heart center. Surrender into the pose with trust and vulnerability.',
      steps: [
        'Kneel with knees hip-width apart',
        'Place hands on lower back',
        'Inhale, lift chest toward ceiling',
        'Gently arch back, head dropping back',
        'Reach hands toward heels if comfortable',
        'Hold for 3-5 breaths, then slowly rise'
      ],
      benefits: 'Deep heart opening, throat stretch, emotional release, vulnerability',
      duration: '30-60 seconds'
    }
  ],
  throat: [
    {
      name: 'Shoulder Stand',
      sanskritName: 'Sarvangasana',
      description: 'An inverted pose that compresses the throat area, stimulating the throat chakra for clear communication.',
      steps: [
        'Lie on back, legs together',
        'Press into arms, lift legs overhead',
        'Support lower back with hands',
        'Bring legs vertical, chin to chest',
        'Keep weight on shoulders, not neck',
        'Hold for 5-8 breaths, then lower slowly'
      ],
      benefits: 'Throat stimulation, thyroid balance, circulation, calm mind',
      duration: '1-2 minutes'
    },
    {
      name: 'Plow Pose',
      sanskritName: 'Halasana',
      description: 'A forward fold that compresses the throat and stretches the spine, enhancing communication energy.',
      steps: [
        'Lie on back, legs together',
        'Lift legs overhead using core',
        'Bring toes to floor behind head',
        'Keep legs straight if possible',
        'Arms can press into floor behind back',
        'Hold for 5-8 breaths, then roll down'
      ],
      benefits: 'Throat opening, spine flexibility, calming, thyroid stimulation',
      duration: '1-2 minutes'
    }
  ],
  third_eye: [
    {
      name: 'Rabbit Pose',
      sanskritName: 'Sasangasana',
      description: 'A deep forward fold that brings the crown of the head to the floor, stimulating the third eye center.',
      steps: [
        'Kneel with knees hip-width apart',
        'Hold onto heels with hands',
        'Tuck chin to chest',
        'Round spine, bring crown to floor',
        'Lift hips while keeping head down',
        'Hold for 5-8 breaths, then slowly release'
      ],
      benefits: 'Third eye stimulation, spine stretching, calming, introspection',
      duration: '1-2 minutes'
    },
    {
      name: 'Eagle Pose',
      sanskritName: 'Garudasana',
      description: 'A balancing pose that requires intense focus and concentration, activating the third eye through single-pointed awareness.',
      steps: [
        'Stand on right leg',
        'Cross left thigh over right',
        'Wrap left foot behind right calf',
        'Cross right arm over left at elbows',
        'Press palms together',
        'Hold for 5-8 breaths, then switch sides'
      ],
      benefits: 'Balance, focus, hip opening, concentration, third eye activation',
      duration: '30-60 seconds each side'
    }
  ],
  crown: [
    {
      name: 'Headstand',
      sanskritName: 'Sirsasana',
      description: 'The king of yoga poses. Inversion brings blood flow to the crown, activating higher consciousness.',
      steps: [
        'Interlace fingers, place forearms on floor',
        'Place crown of head on floor, cradled by hands',
        'Walk feet in, lift hips',
        'Slowly lift legs to vertical',
        'Engage core, breathe steadily',
        'Hold for 1-5 minutes, then lower slowly'
      ],
      benefits: 'Crown activation, circulation, focus, spiritual awakening, confidence',
      duration: '1-5 minutes'
    },
    {
      name: 'Corpse Pose',
      sanskritName: 'Savasana',
      description: 'Complete surrender and relaxation. Allow energy to integrate and flow freely through all chakras to the crown.',
      steps: [
        'Lie flat on back',
        'Legs slightly apart, arms at sides palms up',
        'Close eyes, relax entire body',
        'Release all tension with each breath',
        'Allow mind to become still',
        'Rest for 5-15 minutes'
      ],
      benefits: 'Deep relaxation, integration, stress relief, crown opening, peace',
      duration: '5-15 minutes'
    }
  ]
};

export const alternativeMudras = {
  root: [
    {
      name: 'Dhyana Mudra',
      subtitle: 'Meditation Gesture',
      description: 'Place both hands in lap, right over left, thumbs touching. This mudra promotes deep meditation and grounding.',
      steps: [
        'Sit comfortably with spine erect',
        'Place left hand in lap, palm up',
        'Place right hand on top, palm up',
        'Touch tips of thumbs together',
        'Form a triangle with thumbs and index fingers',
        'Hold for 10-20 minutes during meditation'
      ],
      benefits: 'Deep meditation, balance, grounding, concentration, inner peace',
      duration: '10-20 minutes'
    }
  ],
  sacral: [
    {
      name: 'Kalesvara Mudra',
      subtitle: 'Time Controller Gesture',
      description: 'Fold all fingers inward except middle fingers, which point up. This mudra helps control time perception and emotional flow.',
      steps: [
        'Sit in a comfortable position',
        'Place hands in front of heart',
        'Fold index, ring, and pinky fingers inward',
        'Keep middle fingers extended and touching',
        'Thumbs fold inward toward palms',
        'Hold for 5-10 minutes'
      ],
      benefits: 'Emotional balance, time awareness, creativity, sexual energy balance',
      duration: '5-10 minutes'
    }
  ],
  solar_plexus: [
    {
      name: 'Shakti Mudra',
      subtitle: 'Power Gesture',
      description: 'Fold index and middle fingers under thumb, extend ring and pinky. This mudra awakens inner power and transformative energy.',
      steps: [
        'Sit comfortably with straight spine',
        'Place hands on knees, palms up',
        'Fold index and middle fingers down',
        'Cover them with thumb',
        'Extend ring and pinky fingers',
        'Hold for 5-10 minutes while breathing deeply'
      ],
      benefits: 'Inner power, transformation, confidence, digestive fire, willpower',
      duration: '5-10 minutes'
    }
  ],
  heart: [
    {
      name: 'Hridaya Mudra',
      subtitle: 'Heart Gesture',
      description: 'Connect index finger to thumb base, middle and ring to thumb tip. This mudra directly opens the heart center.',
      steps: [
        'Sit in meditation posture',
        'Place hands on knees, palms up',
        'Touch index finger to base of thumb',
        'Touch middle and ring finger tips to thumb tip',
        'Keep pinky extended',
        'Hold for 5-10 minutes, focusing on heart'
      ],
      benefits: 'Heart opening, compassion, emotional healing, love, inner peace',
      duration: '5-10 minutes'
    }
  ],
  throat: [
    {
      name: 'Bhairava Mudra',
      subtitle: 'Fearless Gesture',
      description: 'Place right hand over left, palms facing each other with thumbs touching. This mudra enhances communication and fearless expression.',
      steps: [
        'Sit comfortably with spine erect',
        'Place left hand in lap, palm up',
        'Place right hand on top, palm down',
        'Thumbs lightly touch each other',
        'Fingers interlock naturally',
        'Hold for 5-10 minutes'
      ],
      benefits: 'Fearless communication, expression, throat chakra activation, confidence',
      duration: '5-10 minutes'
    }
  ],
  third_eye: [
    {
      name: 'Nikita Mudra',
      subtitle: 'Third Eye Gesture',
      description: 'Touch index and middle fingers to thumb, extend ring and pinky. This mudra concentrates energy at the third eye.',
      steps: [
        'Sit in meditation posture',
        'Place hands on knees, palms up',
        'Touch index and middle finger tips to thumb tip',
        'Extend ring and pinky fingers',
        'Focus attention between eyebrows',
        'Hold for 10-20 minutes during meditation'
      ],
      benefits: 'Intuition, third eye activation, clarity, insight, spiritual awareness',
      duration: '10-20 minutes'
    }
  ],
  crown: [
    {
      name: 'Mahasir Mudra',
      subtitle: 'Great Head Gesture',
      description: 'Connect all fingertips to thumb, creating a flower-like shape. This mudra opens the crown to universal consciousness.',
      steps: [
        'Sit in a comfortable meditative position',
        'Place hands on knees, palms up',
        'Touch all four fingertips to thumb tip',
        'Hands form a flower or cup shape',
        'Relax shoulders, breathe naturally',
        'Hold for 10-20 minutes'
      ],
      benefits: 'Crown opening, spiritual connection, peace, unity consciousness, clarity',
      duration: '10-20 minutes'
    }
  ]
};
