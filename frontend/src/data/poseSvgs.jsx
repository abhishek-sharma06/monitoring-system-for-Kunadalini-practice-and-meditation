import React from 'react';

// ============================================================
// YOGA POSE SVGs - Filled human silhouettes with color-coded body parts
// ============================================================

export const MountainPose = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="60" cy="16" r="9" fill={color} opacity="0.9" />
    {/* Neck */}
    <rect x="57" y="24" width="6" height="6" rx="2" fill={color} opacity="0.7" />
    {/* Torso - filled trapezoid */}
    <path d="M48 30 L72 30 L70 68 L50 68 Z" fill={color} opacity="0.85" />
    {/* Shoulders - joint dots */}
    <circle cx="48" cy="32" r="3.5" fill={color} />
    <circle cx="72" cy="32" r="3.5" fill={color} />
    {/* Left arm */}
    <path d="M48 32 L38 52 L36 62" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Right arm */}
    <path d="M72 32 L82 52 L84 62" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Elbow joints */}
    <circle cx="38" cy="52" r="2.5" fill={color} />
    <circle cx="82" cy="52" r="2.5" fill={color} />
    {/* Left leg - filled */}
    <path d="M52 66 L46 100 L42 100 L50 66 Z" fill={color} opacity="0.75" />
    {/* Right leg - filled */}
    <path d="M68 66 L74 100 L78 100 L70 66 Z" fill={color} opacity="0.75" />
    {/* Knee joints */}
    <circle cx="45" cy="84" r="2.5" fill={color} />
    <circle cx="75" cy="84" r="2.5" fill={color} />
    {/* Feet */}
    <ellipse cx="42" cy="103" rx="6" ry="3" fill={color} opacity="0.7" />
    <ellipse cx="78" cy="103" rx="6" ry="3" fill={color} opacity="0.7" />
    {/* Ground line */}
    <line x1="30" y1="108" x2="90" y2="108" stroke={color} strokeWidth="2" strokeDasharray="4 3" opacity="0.4" />
    {/* Upward arrow - lengthening */}
    <line x1="60" y1="6" x2="60" y2="2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M57 5 L60 1 L63 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const GoddessPose = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="60" cy="14" r="9" fill={color} opacity="0.9" />
    {/* Neck */}
    <rect x="57" y="22" width="6" height="5" rx="2" fill={color} opacity="0.7" />
    {/* Torso */}
    <path d="M46 27 L74 27 L72 60 L48 60 Z" fill={color} opacity="0.85" />
    {/* Shoulders */}
    <circle cx="46" cy="29" r="3.5" fill={color} />
    <circle cx="74" cy="29" r="3.5" fill={color} />
    {/* Left arm raised - cactus shape */}
    <path d="M46 29 L32 22 L32 38" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Right arm raised - cactus shape */}
    <path d="M74 29 L88 22 L88 38" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Elbow joints */}
    <circle cx="32" cy="22" r="2.5" fill={color} />
    <circle cx="88" cy="22" r="2.5" fill={color} />
    {/* Left leg - wide and bent */}
    <path d="M50 58 L30 78 L26 104" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Right leg - wide and bent */}
    <path d="M70 58 L90 78 L94 104" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Knee joints */}
    <circle cx="30" cy="78" r="3" fill={color} />
    <circle cx="90" cy="78" r="3" fill={color} />
    {/* Feet */}
    <ellipse cx="26" cy="107" rx="6" ry="3" fill={color} opacity="0.7" />
    <ellipse cx="94" cy="107" rx="6" ry="3" fill={color} opacity="0.7" />
    {/* Ground line */}
    <line x1="16" y1="112" x2="104" y2="112" stroke={color} strokeWidth="2" strokeDasharray="4 3" opacity="0.4" />
    {/* Parallel indicator for thighs */}
    <line x1="28" y1="78" x2="92" y2="78" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
  </svg>
);

export const BoatPose = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="36" cy="24" r="9" fill={color} opacity="0.9" />
    {/* Neck */}
    <rect x="38" y="32" width="5" height="5" rx="2" fill={color} opacity="0.7" />
    {/* Torso - angled back */}
    <path d="M34 36 L48 36 L72 66 L58 66 Z" fill={color} opacity="0.85" />
    {/* Hip joint */}
    <circle cx="62" cy="66" r="3.5" fill={color} />
    {/* Left arm extended forward */}
    <path d="M40 42 L22 38" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Right arm extended forward */}
    <path d="M44 44 L26 42" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Legs angled up - filled shapes */}
    <path d="M62 64 L92 38 L96 38 L66 66 Z" fill={color} opacity="0.75" />
    <path d="M64 68 L96 42 L100 42 L68 70 Z" fill={color} opacity="0.65" />
    {/* Knee joints */}
    <circle cx="84" cy="46" r="2.5" fill={color} />
    <circle cx="88" cy="50" r="2.5" fill={color} />
    {/* Feet */}
    <ellipse cx="96" cy="36" rx="3" ry="5" fill={color} opacity="0.7" transform="rotate(-15 96 36)" />
    <ellipse cx="100" cy="40" rx="3" ry="5" fill={color} opacity="0.7" transform="rotate(-15 100 40)" />
    {/* V-shape indicator */}
    <path d="M42 70 L60 66 L62 44" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" fill="none" />
    {/* Support base */}
    <ellipse cx="60" cy="72" rx="10" ry="4" fill={color} opacity="0.2" />
  </svg>
);

export const CobraPose = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head - lifted */}
    <circle cx="24" cy="32" r="9" fill={color} opacity="0.9" />
    {/* Neck curving up */}
    <path d="M28 40 Q32 46 38 48" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Torso along ground - filled */}
    <path d="M38 48 Q60 50 96 54 L96 60 Q60 56 38 54 Z" fill={color} opacity="0.8" />
    {/* Chest lifted area */}
    <ellipse cx="34" cy="44" rx="10" ry="8" fill={color} opacity="0.3" />
    {/* Left arm supporting */}
    <path d="M30 46 L26 68" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Right arm supporting */}
    <path d="M42 50 L38 68" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Hands on ground */}
    <ellipse cx="26" cy="70" rx="4" ry="2.5" fill={color} opacity="0.6" />
    <ellipse cx="38" cy="70" rx="4" ry="2.5" fill={color} opacity="0.6" />
    {/* Legs on ground */}
    <path d="M96 54 L106 56" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Toes */}
    <circle cx="108" cy="56" r="2.5" fill={color} opacity="0.6" />
    {/* Ground line */}
    <line x1="14" y1="72" x2="114" y2="72" stroke={color} strokeWidth="2" strokeDasharray="4 3" opacity="0.4" />
    {/* Lift arrow */}
    <path d="M22 26 L22 20 L20 22 M22 20 L24 22" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const FishPose = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head - tilted back */}
    <circle cx="20" cy="44" r="9" fill={color} opacity="0.9" />
    {/* Chest arched up - filled */}
    <path d="M28 48 Q44 30 66 36 Q72 38 74 42 L74 50 Q66 44 44 42 Q34 44 28 50 Z" fill={color} opacity="0.7" />
    {/* Body along ground */}
    <path d="M74 42 L104 48" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Arms under body */}
    <path d="M50 40 L46 56" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M62 38 L58 56" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Hands */}
    <ellipse cx="46" cy="57" rx="3" ry="2" fill={color} opacity="0.6" />
    <ellipse cx="58" cy="57" rx="3" ry="2" fill={color} opacity="0.6" />
    {/* Legs */}
    <path d="M104 48 L110 48" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="112" cy="48" r="2" fill={color} opacity="0.6" />
    {/* Ground line */}
    <line x1="12" y1="58" x2="116" y2="58" stroke={color} strokeWidth="2" strokeDasharray="4 3" opacity="0.4" />
    {/* Arch indicator */}
    <path d="M36 42 Q44 28 56 34" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" fill="none" />
  </svg>
);

export const ChildsPose = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head - resting on ground */}
    <circle cx="22" cy="60" r="9" fill={color} opacity="0.9" />
    {/* Back curved over - filled */}
    <path d="M30 56 Q48 34 72 38 Q82 40 86 52 L86 60 Q82 54 72 50 Q48 46 30 60 Z" fill={color} opacity="0.75" />
    {/* Arms extended forward */}
    <path d="M22 54 L8 48" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M22 58 L8 54" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Hands */}
    <circle cx="6" cy="46" r="2.5" fill={color} opacity="0.6" />
    <circle cx="6" cy="56" r="2.5" fill={color} opacity="0.6" />
    {/* Knees on ground */}
    <path d="M86 58 Q90 66 84 72" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Knees */}
    <circle cx="88" cy="64" r="3" fill={color} />
    {/* Toes touching */}
    <circle cx="82" cy="74" r="2" fill={color} opacity="0.6" />
    <circle cx="86" cy="74" r="2" fill={color} opacity="0.6" />
    {/* Ground line */}
    <line x1="2" y1="76" x2="92" y2="76" stroke={color} strokeWidth="2" strokeDasharray="4 3" opacity="0.4" />
    {/* Forehead touching floor indicator */}
    <circle cx="22" cy="66" r="3" stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
  </svg>
);

export const LotusPose = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="60" cy="14" r="9" fill={color} opacity="0.9" />
    {/* Neck */}
    <rect x="57" y="22" width="6" height="5" rx="2" fill={color} opacity="0.7" />
    {/* Torso - upright */}
    <path d="M48 27 L72 27 L70 62 L50 62 Z" fill={color} opacity="0.85" />
    {/* Shoulders */}
    <circle cx="48" cy="29" r="3.5" fill={color} />
    <circle cx="72" cy="29" r="3.5" fill={color} />
    {/* Left arm to knee */}
    <path d="M48 32 L32 58" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Right arm to knee */}
    <path d="M72 32 L88 58" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Hand mudra circles */}
    <circle cx="32" cy="58" r="3.5" fill={color} opacity="0.6" />
    <circle cx="88" cy="58" r="3.5" fill={color} opacity="0.6" />
    {/* Crossed legs - filled */}
    <path d="M50 60 Q36 64 28 72 Q38 80 52 72" fill={color} opacity="0.7" />
    <path d="M70 60 Q84 64 92 72 Q82 80 68 72" fill={color} opacity="0.7" />
    {/* Feet upturned */}
    <path d="M28 72 Q26 66 30 64" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M92 72 Q94 66 90 64" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Energy circles */}
    <circle cx="60" cy="42" r="14" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.25" />
    <circle cx="60" cy="42" r="20" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.15" />
  </svg>
);

// ============================================================
// MUDRA SVGs - Filled hand diagrams with finger positions
// ============================================================

export const PrithviMudra = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Palm - filled */}
    <ellipse cx="60" cy="70" rx="24" ry="28" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" />
    {/* Thumb - touching ring finger */}
    <path d="M40 56 Q34 42 38 28" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Index finger extended */}
    <path d="M48 48 Q46 28 44 14" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Middle finger extended */}
    <path d="M58 46 Q58 26 58 10" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Ring finger - touching thumb */}
    <path d="M68 48 Q74 38 74 28" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Pinky extended */}
    <path d="M78 52 Q84 36 86 22" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Connection dots - filled */}
    <circle cx="38" cy="26" r="5" fill={color} opacity="0.8" />
    <circle cx="74" cy="26" r="5" fill={color} opacity="0.8" />
    {/* Connection line */}
    <line x1="42" y1="26" x2="70" y2="26" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
    {/* Finger tips */}
    <circle cx="44" cy="12" r="3" fill={color} opacity="0.5" />
    <circle cx="58" cy="8" r="3" fill={color} opacity="0.5" />
    <circle cx="86" cy="20" r="3" fill={color} opacity="0.5" />
    <text x="60" y="112" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">Thumb + Ring</text>
  </svg>
);

export const VarunMudra = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Palm */}
    <ellipse cx="60" cy="70" rx="24" ry="28" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" />
    {/* Thumb - touching pinky */}
    <path d="M40 56 Q32 44 34 30" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Index finger extended */}
    <path d="M48 48 Q46 28 44 14" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Middle finger extended */}
    <path d="M58 46 Q58 26 58 10" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Ring finger extended */}
    <path d="M68 48 Q70 28 72 14" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Pinky - touching thumb */}
    <path d="M80 54 Q86 42 84 30" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Connection dots */}
    <circle cx="34" cy="28" r="5" fill={color} opacity="0.8" />
    <circle cx="84" cy="28" r="5" fill={color} opacity="0.8" />
    <line x1="38" y1="28" x2="80" y2="28" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
    {/* Finger tips */}
    <circle cx="44" cy="12" r="3" fill={color} opacity="0.5" />
    <circle cx="58" cy="8" r="3" fill={color} opacity="0.5" />
    <circle cx="72" cy="12" r="3" fill={color} opacity="0.5" />
    <text x="60" y="112" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">Thumb + Pinky</text>
  </svg>
);

export const SuryaMudra = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Palm */}
    <ellipse cx="60" cy="70" rx="24" ry="28" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" />
    {/* Thumb - pressing ring finger */}
    <path d="M40 56 Q36 46 40 34" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Index finger extended */}
    <path d="M48 48 Q46 28 44 14" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Middle finger extended */}
    <path d="M58 46 Q58 26 58 10" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Ring finger bent under thumb */}
    <path d="M68 48 Q64 40 54 34" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Pinky extended */}
    <path d="M78 52 Q84 36 86 22" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Thumb pressing down indicator */}
    <circle cx="48" cy="34" r="5" fill={color} opacity="0.8" />
    {/* Pressing arrow */}
    <path d="M48 30 L48 36" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M46 34 L48 37 L50 34" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Finger tips */}
    <circle cx="44" cy="12" r="3" fill={color} opacity="0.5" />
    <circle cx="58" cy="8" r="3" fill={color} opacity="0.5" />
    <circle cx="86" cy="20" r="3" fill={color} opacity="0.5" />
    <text x="60" y="112" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">Ring under Thumb</text>
  </svg>
);

export const AnjaliMudra = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Left hand - filled */}
    <ellipse cx="48" cy="66" rx="16" ry="26" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" />
    {/* Right hand - filled */}
    <ellipse cx="72" cy="66" rx="16" ry="26" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" />
    {/* Left fingers pointing up */}
    <path d="M42 42 L42 16" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M48 40 L48 12" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M54 42 L54 16" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* Right fingers pointing up */}
    <path d="M66 42 L66 16" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M72 40 L72 12" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M78 42 L78 16" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* Thumbs touching */}
    <line x1="40" y1="54" x2="80" y2="54" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* Small heart between palms */}
    <path d="M54 58 Q60 50 66 58" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Finger tips */}
    <circle cx="42" cy="14" r="2.5" fill={color} opacity="0.5" />
    <circle cx="48" cy="10" r="2.5" fill={color} opacity="0.5" />
    <circle cx="54" cy="14" r="2.5" fill={color} opacity="0.5" />
    <circle cx="66" cy="14" r="2.5" fill={color} opacity="0.5" />
    <circle cx="72" cy="10" r="2.5" fill={color} opacity="0.5" />
    <circle cx="78" cy="14" r="2.5" fill={color} opacity="0.5" />
    <text x="60" y="112" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">Palms Together</text>
  </svg>
);

export const ShunyaMudra = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Palm */}
    <ellipse cx="60" cy="70" rx="24" ry="28" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" />
    {/* Thumb - pressing middle finger */}
    <path d="M40 56 Q36 46 40 34" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Index finger extended */}
    <path d="M48 48 Q46 28 44 14" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Middle finger bent under thumb */}
    <path d="M58 46 Q54 38 48 32" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Ring finger extended */}
    <path d="M68 48 Q70 28 72 14" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Pinky extended */}
    <path d="M78 52 Q84 36 86 22" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Connection dot */}
    <circle cx="48" cy="32" r="5" fill={color} opacity="0.8" />
    {/* Finger tips */}
    <circle cx="44" cy="12" r="3" fill={color} opacity="0.5" />
    <circle cx="72" cy="12" r="3" fill={color} opacity="0.5" />
    <circle cx="86" cy="20" r="3" fill={color} opacity="0.5" />
    <text x="60" y="112" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">Middle under Thumb</text>
  </svg>
);

export const GyanMudra = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Palm */}
    <ellipse cx="60" cy="70" rx="24" ry="28" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" />
    {/* Thumb - touching index finger */}
    <path d="M40 56 Q34 42 38 28" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Index finger - touching thumb, forming circle */}
    <path d="M48 48 Q42 38 38 28" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Circle formed by thumb + index */}
    <circle cx="38" cy="28" r="7" stroke={color} strokeWidth="3" fill="none" />
    <circle cx="38" cy="28" r="3" fill={color} opacity="0.5" />
    {/* Middle finger extended */}
    <path d="M58 46 Q58 26 58 10" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Ring finger extended */}
    <path d="M68 48 Q70 28 72 14" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Pinky extended */}
    <path d="M78 52 Q84 36 86 22" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Finger tips */}
    <circle cx="58" cy="8" r="3" fill={color} opacity="0.5" />
    <circle cx="72" cy="12" r="3" fill={color} opacity="0.5" />
    <circle cx="86" cy="20" r="3" fill={color} opacity="0.5" />
    <text x="60" y="112" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">Thumb + Index</text>
  </svg>
);

export const PranaMudra = ({ size = 120, color = '#6B4FA0' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Palm */}
    <ellipse cx="60" cy="70" rx="24" ry="28" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5" />
    {/* Thumb touching ring + pinky */}
    <path d="M40 56 Q34 42 38 28" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Index finger extended */}
    <path d="M48 48 Q46 28 44 14" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Middle finger extended */}
    <path d="M58 46 Q58 26 58 10" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Ring finger touching thumb */}
    <path d="M68 48 Q60 38 44 30" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Pinky touching thumb */}
    <path d="M80 54 Q68 42 48 32" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Three connection dots */}
    <circle cx="38" cy="26" r="5" fill={color} opacity="0.8" />
    <circle cx="50" cy="30" r="4" fill={color} opacity="0.6" />
    <circle cx="56" cy="32" r="4" fill={color} opacity="0.6" />
    {/* Connection lines */}
    <line x1="42" y1="27" x2="47" y2="29" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
    <line x1="53" y1="30" x2="53" y2="31" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
    {/* Finger tips */}
    <circle cx="44" cy="12" r="3" fill={color} opacity="0.5" />
    <circle cx="58" cy="8" r="3" fill={color} opacity="0.5" />
    <text x="60" y="112" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">Thumb + Ring + Pinky</text>
  </svg>
);

// ============================================================
// LOOKUP MAPS
// ============================================================

export const yogaPoseSvgs = {
  root: MountainPose,
  sacral: GoddessPose,
  solar_plexus: BoatPose,
  heart: CobraPose,
  throat: FishPose,
  third_eye: ChildsPose,
  crown: LotusPose
};

export const mudraSvgs = {
  root: PrithviMudra,
  sacral: VarunMudra,
  solar_plexus: SuryaMudra,
  heart: AnjaliMudra,
  throat: ShunyaMudra,
  third_eye: GyanMudra,
  crown: PranaMudra
};

export const getYogaPoseSvg = (chakraId) => yogaPoseSvgs[chakraId] || MountainPose;
export const getMudraSvg = (chakraId) => mudraSvgs[chakraId] || PrithviMudra;
