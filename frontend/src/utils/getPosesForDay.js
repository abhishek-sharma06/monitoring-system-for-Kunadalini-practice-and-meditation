/**
 * getPosesForDay - Determines which poses/mudras to show based on day and level
 * 
 * Progressive pose count:
 *   - Beginner (days 1-6): 1 pose
 *   - Beginner (days 8-13 Deepen): 2 poses
 *   - Intermediate: 2 poses
 *   - Advanced (days 1-21): 2 poses
 *   - Advanced (days 22-30 Combined): 3 poses
 */

import { chakras, getChakraByName } from '../data/chakraData';
import { alternativeYogaPoses, alternativeMudras } from '../data/alternativePoses';

/**
 * Parse chakra focus string to get the base chakra name
 * e.g., "Root (Deepen)" -> "Root", "Root + Sacral Combined" -> ["Root", "Sacral"]
 */
const parseChakraFocus = (chakraFocus) => {
  if (!chakraFocus) return [];
  
  // Handle combined chakras like "Root + Sacral Combined"
  if (chakraFocus.includes('+')) {
    return chakraFocus
      .replace('Combined', '')
      .trim()
      .split('+')
      .map(s => s.trim())
      .filter(s => s && s !== 'Full' && !s.includes('Sequence') && !s.includes('Integration'));
  }
  
  // Handle single chakra with optional suffix like "(Deepen)"
  const baseName = chakraFocus.replace(/\(.*\)/, '').trim();
  return [baseName];
};

/**
 * Get the number of poses to show based on level and day
 */
const getPoseCount = (level, dayNumber) => {
  switch (level) {
    case 'beginner':
      // Days 1-6: 1 pose, Days 8-13 (Deepen): 2 poses
      return dayNumber <= 6 ? 1 : 2;
    
    case 'intermediate':
      return 2;
    
    case 'advanced':
      // Days 1-21: 2 poses, Days 22-30 (Combined): 3 poses
      return dayNumber >= 22 ? 3 : 2;
    
    default:
      return 1;
  }
};

/**
 * Get poses for a specific day
 * @param {string} chakraFocus - The chakra focus string from program_days
 * @param {string} level - User level ('beginner', 'intermediate', 'advanced')
 * @param {number} dayNumber - The day number in the program
 * @returns {object} { yogaPoses: [], mudras: [], poseCount: number }
 */
export const getPosesForDay = (chakraFocus, level = 'beginner', dayNumber = 1) => {
  const chakraNames = parseChakraFocus(chakraFocus);
  const poseCount = getPoseCount(level, dayNumber);
  
  const yogaPoses = [];
  const mudras = [];
  
  // First, add primary poses from each focused chakra
  chakraNames.forEach(name => {
    const chakra = getChakraByName(`${name} Chakra`) || getChakraByName(name);
    if (chakra) {
      yogaPoses.push({
        ...chakra.yogaPose,
        chakraId: chakra.id,
        chakraColor: chakra.color,
        isPrimary: true
      });
      mudras.push({
        ...chakra.mudra,
        chakraId: chakra.id,
        chakraColor: chakra.color,
        isPrimary: true
      });
    }
  });
  
  // If we need more poses, add alternatives from the first focused chakra
  if (poseCount > 1 && chakraNames.length > 0) {
    const primaryChakraName = chakraNames[0].toLowerCase().replace(/\s+/g, '_');
    
    // Map common names to IDs
    const nameToId = {
      'root': 'root',
      'sacral': 'sacral',
      'solar_plexus': 'solar_plexus',
      'solar': 'solar_plexus',
      'heart': 'heart',
      'throat': 'throat',
      'third_eye': 'third_eye',
      'crown': 'crown'
    };
    
    const chakraId = nameToId[primaryChakraName] || primaryChakraName;
    
    // Add alternative yoga poses
    const altYoga = alternativeYogaPoses[chakraId] || [];
    for (let i = 0; i < poseCount - 1 && i < altYoga.length; i++) {
      const chakra = chakras.find(c => c.id === chakraId);
      yogaPoses.push({
        ...altYoga[i],
        chakraId: chakraId,
        chakraColor: chakra?.color || '#6B4FA0',
        isPrimary: false
      });
    }
    
    // Add alternative mudras
    const altMudras = alternativeMudras[chakraId] || [];
    for (let i = 0; i < poseCount - 1 && i < altMudras.length; i++) {
      const chakra = chakras.find(c => c.id === chakraId);
      mudras.push({
        ...altMudras[i],
        chakraId: chakraId,
        chakraColor: chakra?.color || '#6B4FA0',
        isPrimary: false
      });
    }
  }
  
  // If we still need more poses and have multiple chakra focuses, add from others
  if (yogaPoses.length < poseCount && chakraNames.length > 1) {
    for (let i = 1; i < chakraNames.length && yogaPoses.length < poseCount; i++) {
      const chakra = getChakraByName(`${chakraNames[i]} Chakra`) || getChakraByName(chakraNames[i]);
      if (chakra) {
        // Check if this chakra's pose is already in the list
        const exists = yogaPoses.some(p => p.name === chakra.yogaPose.name);
        if (!exists) {
          yogaPoses.push({
            ...chakra.yogaPose,
            chakraId: chakra.id,
            chakraColor: chakra.color,
            isPrimary: false
          });
          mudras.push({
            ...chakra.mudra,
            chakraId: chakra.id,
            chakraColor: chakra.color,
            isPrimary: false
          });
        }
      }
    }
  }
  
  return {
    yogaPoses: yogaPoses.slice(0, poseCount),
    mudras: mudras.slice(0, poseCount),
    poseCount: Math.min(poseCount, yogaPoses.length)
  };
};

/**
 * Get description text for pose count
 */
export const getPoseCountDescription = (poseCount) => {
  switch (poseCount) {
    case 1:
      return 'Focus on one pose today for deep practice';
    case 2:
      return 'Today you\'ll practice two poses for variety';
    case 3:
      return 'Today you\'ll practice three poses for advanced flow';
    default:
      return 'Focus on your practice';
  }
};

export default getPosesForDay;
