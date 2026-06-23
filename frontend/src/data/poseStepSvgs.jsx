import React from 'react';

// ============================================================
// MOUNTAIN POSE (Root Chakra) - Step-by-step SVGs
// ============================================================

export const MountainStep1 = ({ size = 100, color = '#C41E3A' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Standing straight, feet together */}
    <circle cx="50" cy="16" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="24" x2="50" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="34" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="66" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="46" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="54" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="88" x2="60" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const MountainStep2 = ({ size = 100, color = '#C41E3A' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Feet hip-width apart, weight arrows */}
    <circle cx="50" cy="16" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="24" x2="50" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="34" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="66" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="42" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="58" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Weight distribution arrows */}
    <path d="M42 84 L42 80 L38 80" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M58 84 L58 80 L62 80" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="36" y1="88" x2="64" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const MountainStep3 = ({ size = 100, color = '#C41E3A' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Thighs engaged - arrows on legs */}
    <circle cx="50" cy="16" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="24" x2="50" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="34" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="66" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="42" y2="88" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="62" x2="58" y2="88" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Upward arrows on thighs */}
    <path d="M44 76 L44 72 L42 74 M44 72 L46 74" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M56 76 L56 72 L54 74 M56 72 L58 74" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="36" y1="88" x2="64" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const MountainStep4 = ({ size = 100, color = '#C41E3A' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tailbone lengthened, core engaged */}
    <circle cx="50" cy="16" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="24" x2="50" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="34" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="66" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="42" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="58" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Core engagement highlight */}
    <ellipse cx="50" cy="52" rx="6" ry="8" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
    {/* Downward arrow for tailbone */}
    <path d="M50 60 L50 66 L48 64 M50 66 L52 64" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="36" y1="88" x2="64" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const MountainStep5 = ({ size = 100, color = '#C41E3A' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shoulders rolled back and down */}
    <circle cx="50" cy="16" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="24" x2="50" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Arms at sides, palms forward */}
    <line x1="50" y1="36" x2="32" y2="58" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="68" y2="58" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="42" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="58" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Shoulder rollback arrows */}
    <path d="M42 34 Q38 30 40 26" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M58 34 Q62 30 60 26" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <line x1="36" y1="88" x2="64" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const MountainStep6 = ({ size = 100, color = '#C41E3A' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Final hold - serene pose with breath indicator */}
    <circle cx="50" cy="16" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="24" x2="50" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="32" y2="58" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="68" y2="58" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="42" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="62" x2="58" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Breath circles */}
    <circle cx="50" cy="44" r="12" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
    <circle cx="50" cy="44" r="16" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
    <line x1="36" y1="88" x2="64" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

// ============================================================
// GODDESS POSE (Sacral Chakra) - Step-by-step SVGs
// ============================================================

export const GoddessStep1 = ({ size = 100, color = '#FF7F00' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stand with feet wide */}
    <circle cx="50" cy="14" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="22" x2="50" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="34" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="66" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="30" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="70" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="88" x2="76" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const GoddessStep2 = ({ size = 100, color = '#FF7F00' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Toes turned out 45 degrees */}
    <circle cx="50" cy="14" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="22" x2="50" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="34" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="66" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="30" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="70" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Toe turn indicators */}
    <path d="M26 86 L22 82" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M74 86 L78 82" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="24" y1="88" x2="76" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const GoddessStep3 = ({ size = 100, color = '#FF7F00' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Arms raised, elbows bent 90 degrees */}
    <circle cx="50" cy="14" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="22" x2="50" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Arms in cactus position */}
    <line x1="50" y1="34" x2="30" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="26" x2="30" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="70" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="70" y1="26" x2="70" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="30" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="70" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="88" x2="76" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const GoddessStep4 = ({ size = 100, color = '#FF7F00' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bend knees into squat */}
    <circle cx="50" cy="14" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="22" x2="50" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="30" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="26" x2="30" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="70" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="70" y1="26" x2="70" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Bent legs */}
    <line x1="50" y1="56" x2="34" y2="70" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="70" x2="30" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="66" y2="70" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="66" y1="70" x2="70" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="88" x2="76" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const GoddessStep5 = ({ size = 100, color = '#FF7F00' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Thighs parallel to floor, core engaged */}
    <circle cx="50" cy="14" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="22" x2="50" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="30" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="26" x2="30" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="70" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="70" y1="26" x2="70" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Deep squat with parallel thighs */}
    <line x1="50" y1="56" x2="34" y2="68" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="34" y1="68" x2="30" y2="88" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="56" x2="66" y2="68" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="66" y1="68" x2="70" y2="88" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Parallel indicator */}
    <line x1="28" y1="68" x2="72" y2="68" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
    <line x1="24" y1="88" x2="76" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const GoddessStep6 = ({ size = 100, color = '#FF7F00' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hold with breath */}
    <circle cx="50" cy="14" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="50" y1="22" x2="50" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="30" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="26" x2="30" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="70" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="70" y1="26" x2="70" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="34" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="68" x2="30" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="56" x2="66" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="66" y1="68" x2="70" y2="88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Breath circles */}
    <circle cx="50" cy="44" r="10" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
    <circle cx="50" cy="44" r="14" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
    <line x1="24" y1="88" x2="76" y2="88" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

// ============================================================
// BOAT POSE (Solar Plexus) - Step-by-step SVGs
// ============================================================

export const BoatStep1 = ({ size = 100, color = '#FFD700' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sit with knees bent */}
    <circle cx="30" cy="32" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="34" y1="38" x2="44" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="46" x2="24" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="46" x2="52" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="62" x2="50" y2="80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="62" x2="38" y2="80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="80" x2="56" y2="80" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const BoatStep2 = ({ size = 100, color = '#FFD700' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lean back slightly, spine straight */}
    <circle cx="32" cy="30" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="36" y1="36" x2="52" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="44" x2="28" y2="54" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="44" x2="56" y2="54" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="62" x2="58" y2="80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="62" x2="46" y2="80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Spine straight indicator */}
    <line x1="36" y1="36" x2="52" y2="62" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
    <line x1="26" y1="80" x2="62" y2="80" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const BoatStep3 = ({ size = 100, color = '#FFD700' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lift feet, shins parallel to ground */}
    <circle cx="32" cy="28" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="36" y1="34" x2="52" y2="60" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="42" x2="28" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="42" x2="56" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Legs lifted, shins parallel */}
    <line x1="52" y1="60" x2="72" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="56" x2="78" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="60" x2="68" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="68" y1="62" x2="74" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Parallel indicator */}
    <line x1="52" y1="56" x2="80" y2="56" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
    <ellipse cx="52" cy="64" rx="6" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

export const BoatStep4 = ({ size = 100, color = '#FFD700' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Extend arms forward alongside legs */}
    <circle cx="32" cy="28" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="36" y1="34" x2="52" y2="60" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Arms extended forward */}
    <line x1="42" y1="42" x2="22" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="42" x2="62" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="60" x2="72" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="56" x2="78" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="60" x2="68" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="68" y1="62" x2="74" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="52" cy="64" rx="6" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

export const BoatStep5 = ({ size = 100, color = '#FFD700' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Engage core deeply, chest lifted */}
    <circle cx="32" cy="28" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="36" y1="34" x2="52" y2="60" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="42" y1="42" x2="22" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="42" x2="62" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="60" x2="72" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="56" x2="78" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="60" x2="68" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="68" y1="62" x2="74" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Core engagement highlight */}
    <ellipse cx="46" cy="48" rx="5" ry="7" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
    <ellipse cx="52" cy="64" rx="6" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

export const BoatStep6 = ({ size = 100, color = '#FFD700' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hold and breathe */}
    <circle cx="32" cy="28" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="36" y1="34" x2="52" y2="60" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="42" x2="22" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="42" x2="62" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="60" x2="72" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="56" x2="78" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="60" x2="68" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="68" y1="62" x2="74" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Breath circles */}
    <circle cx="46" cy="44" r="8" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
    <circle cx="46" cy="44" r="12" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
    <ellipse cx="52" cy="64" rx="6" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

// ============================================================
// COBRA POSE (Heart Chakra) - Step-by-step SVGs
// ============================================================

export const CobraStep1 = ({ size = 100, color = '#00B050' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lie face down, legs together */}
    <circle cx="20" cy="50" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M26 50 Q50 52 80 54" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80 54 L90 54" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="56" x2="20" y2="72" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="56" x2="26" y2="72" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const CobraStep2 = ({ size = 100, color = '#00B050' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hands under shoulders */}
    <circle cx="20" cy="48" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M26 48 Q50 50 80 52" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80 52 L90 52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Hands placed under shoulders */}
    <line x1="24" y1="52" x2="20" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="52" x2="28" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="20" cy="68" rx="3" ry="2" stroke={color} strokeWidth="1.5" fill="none" />
    <ellipse cx="28" cy="68" rx="3" ry="2" stroke={color} strokeWidth="1.5" fill="none" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const CobraStep3 = ({ size = 100, color = '#00B050' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Press into palms, lift chest */}
    <circle cx="20" cy="40" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M26 44 Q30 50 36 54" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M36 54 Q56 56 80 56" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80 56 L90 56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Arms supporting */}
    <line x1="28" y1="50" x2="24" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="54" x2="32" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Lift arrow */}
    <path d="M20 36 L20 30 L18 32 M20 30 L22 32" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const CobraStep4 = ({ size = 100, color = '#00B050' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Elbows slightly bent, shoulders relaxed */}
    <circle cx="20" cy="38" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M26 42 Q30 48 36 52" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M36 52 Q56 54 80 54" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80 54 L90 54" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Bent elbows */}
    <line x1="28" y1="48" x2="24" y2="64" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="52" x2="32" y2="64" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Shoulder relaxation arrows */}
    <path d="M24 38 Q22 42 24 44" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M30 38 Q32 42 30 44" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const CobraStep5 = ({ size = 100, color = '#00B050' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lift only as high as comfortable */}
    <circle cx="20" cy="36" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M26 40 Q30 46 36 50" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M36 50 Q56 52 80 52" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80 52 L90 52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="46" x2="24" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="50" x2="32" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Comfort zone indicator */}
    <path d="M16 36 L16 44" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
    <path d="M14 44 L18 44" stroke={color} strokeWidth="1" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const CobraStep6 = ({ size = 100, color = '#00B050' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hold for breaths, then lower */}
    <circle cx="20" cy="36" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M26 40 Q30 46 36 50" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M36 50 Q56 52 80 52" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80 52 L90 52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="46" x2="24" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="50" x2="32" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Breath circles */}
    <circle cx="32" cy="42" r="8" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
    <circle cx="32" cy="42" r="12" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
    {/* Lower arrow */}
    <path d="M20 46 L20 52 L18 50 M20 52 L22 50" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

// ============================================================
// FISH POSE (Throat Chakra) - Step-by-step SVGs
// ============================================================

export const FishStep1 = ({ size = 100, color = '#00CCFF' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lie on back, legs together */}
    <circle cx="18" cy="48" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M24 48 Q50 48 82 48" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M82 48 L90 48" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="56" x2="94" y2="56" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const FishStep2 = ({ size = 100, color = '#00CCFF' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Place hands under hips, palms down */}
    <circle cx="18" cy="46" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M24 46 Q50 46 82 46" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M82 46 L90 46" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Hands under body */}
    <ellipse cx="50" cy="52" rx="8" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
    <line x1="14" y1="56" x2="94" y2="56" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const FishStep3 = ({ size = 100, color = '#00CCFF' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Press into forearms, lift chest */}
    <circle cx="18" cy="42" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M24 44 Q36 36 50 38" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M50 38 Q70 42 82 44" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M82 44 L90 44" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Forearms pressing */}
    <line x1="40" y1="42" x2="36" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="40" x2="46" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Lift arrow */}
    <path d="M36 38 L36 32 L34 34 M36 32 L38 34" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="14" y1="56" x2="94" y2="56" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const FishStep4 = ({ size = 100, color = '#00CCFF' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Arch back, head drops back */}
    <circle cx="16" cy="40" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M22 42 Q36 30 50 34" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M50 34 Q70 38 82 40" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M82 40 L90 40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="38" x2="36" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="36" x2="46" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Arch indicator */}
    <path d="M30 34 Q36 28 42 34" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
    <line x1="14" y1="56" x2="94" y2="56" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const FishStep5 = ({ size = 100, color = '#00CCFF' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Crown of head may touch floor */}
    <circle cx="16" cy="38" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M22 40 Q36 28 50 32" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M50 32 Q70 36 82 38" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M82 38 L90 38" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="36" x2="36" y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="46" y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Head touching floor indicator */}
    <circle cx="16" cy="46" r="2" stroke={color} strokeWidth="1" fill="none" />
    <line x1="14" y1="56" x2="94" y2="56" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const FishStep6 = ({ size = 100, color = '#00CCFF' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hold and breathe, then release */}
    <circle cx="16" cy="38" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M22 40 Q36 28 50 32" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M50 32 Q70 36 82 38" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M82 38 L90 38" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="36" x2="36" y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="34" x2="46" y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Breath circles */}
    <circle cx="36" cy="34" r="8" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
    <circle cx="36" cy="34" r="12" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
    <line x1="14" y1="56" x2="94" y2="56" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

// ============================================================
// CHILD'S POSE (Third Eye) - Step-by-step SVGs
// ============================================================

export const ChildsStep1 = ({ size = 100, color = '#4B0082' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Kneel on floor */}
    <circle cx="40" cy="24" r="7" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="31" x2="40" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="42" x2="28" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="42" x2="52" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Kneeling legs */}
    <line x1="40" y1="52" x2="34" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="52" x2="46" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const ChildsStep2 = ({ size = 100, color = '#4B0082' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Big toes touching, knees apart */}
    <circle cx="40" cy="24" r="7" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="31" x2="40" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="42" x2="28" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="42" x2="52" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Knees wide apart */}
    <line x1="40" y1="52" x2="26" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="52" x2="54" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Toes touching indicator */}
    <circle cx="40" cy="70" r="2" stroke={color} strokeWidth="1.5" fill="none" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const ChildsStep3 = ({ size = 100, color = '#4B0082' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sit back on heels */}
    <circle cx="40" cy="28" r="7" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="35" x2="40" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="44" x2="28" y2="54" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="44" x2="52" y2="54" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Sitting on heels */}
    <line x1="40" y1="56" x2="30" y2="66" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="56" x2="50" y2="66" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="40" cy="66" rx="10" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const ChildsStep4 = ({ size = 100, color = '#4B0082' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fold forward, arms extended */}
    <circle cx="22" cy="52" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M28 50 Q40 36 54 38" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M54 38 Q64 42 68 54" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Arms extended forward */}
    <line x1="22" y1="48" x2="10" y2="44" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="22" y1="48" x2="10" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const ChildsStep5 = ({ size = 100, color = '#4B0082' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rest forehead on floor */}
    <circle cx="22" cy="54" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M28 52 Q40 38 54 40" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M54 40 Q64 44 68 56" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <line x1="22" y1="50" x2="10" y2="46" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="22" y1="50" x2="10" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Forehead touching floor */}
    <circle cx="22" cy="60" r="2" stroke={color} strokeWidth="1" fill="none" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const ChildsStep6 = ({ size = 100, color = '#4B0082' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Breathe deeply, surrender */}
    <circle cx="22" cy="54" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M28 52 Q40 38 54 40" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M54 40 Q64 44 68 56" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <line x1="22" y1="50" x2="10" y2="46" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="22" y1="50" x2="10" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Breath circles */}
    <circle cx="40" cy="46" r="8" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
    <circle cx="40" cy="46" r="12" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
    <line x1="14" y1="72" x2="94" y2="72" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

// ============================================================
// LOTUS POSE (Crown Chakra) - Step-by-step SVGs
// ============================================================

export const LotusStep1 = ({ size = 100, color = '#9400D3' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sit with legs extended */}
    <circle cx="40" cy="20" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="28" x2="40" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="26" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="54" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Extended legs */}
    <line x1="40" y1="56" x2="28" y2="80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="56" x2="52" y2="80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="22" y1="80" x2="58" y2="80" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const LotusStep2 = ({ size = 100, color = '#9400D3' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bend right knee, place foot on left thigh */}
    <circle cx="40" cy="20" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="28" x2="40" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="26" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="54" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Right leg bent, foot on left thigh */}
    <line x1="40" y1="56" x2="30" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M30 68 Q34 64 42 62" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <line x1="40" y1="56" x2="52" y2="80" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="22" y1="80" x2="58" y2="80" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const LotusStep3 = ({ size = 100, color = '#9400D3' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bend left knee, place foot on right thigh */}
    <circle cx="40" cy="20" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="28" x2="40" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="26" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="54" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Both legs crossed */}
    <path d="M40 56 Q30 60 26 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M40 56 Q50 60 54 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M26 66 Q34 72 42 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M54 66 Q46 72 38 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <line x1="22" y1="76" x2="58" y2="76" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const LotusStep4 = ({ size = 100, color = '#9400D3' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Both soles face upward */}
    <circle cx="40" cy="20" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="28" x2="40" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="26" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="54" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Crossed legs with upturned feet */}
    <path d="M40 56 Q30 60 26 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M40 56 Q50 60 54 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M26 66 Q34 72 42 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M54 66 Q46 72 38 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Upturned feet indicators */}
    <path d="M26 66 Q24 62 28 60" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M54 66 Q56 62 52 60" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <line x1="22" y1="76" x2="58" y2="76" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const LotusStep5 = ({ size = 100, color = '#9400D3' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rest hands on knees in mudra */}
    <circle cx="40" cy="20" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="28" x2="40" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Arms to knees */}
    <line x1="40" y1="40" x2="24" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="56" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M40 56 Q30 60 26 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M40 56 Q50 60 54 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M26 66 Q34 72 42 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M54 66 Q46 72 38 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Mudra circles on knees */}
    <circle cx="24" cy="62" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="56" cy="62" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <line x1="22" y1="76" x2="58" y2="76" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const LotusStep6 = ({ size = 100, color = '#9400D3' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hold for meditation */}
    <circle cx="40" cy="20" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="40" y1="28" x2="40" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="24" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="40" x2="56" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M40 56 Q30 60 26 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M40 56 Q50 60 54 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M26 66 Q34 72 42 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M54 66 Q46 72 38 66" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="24" cy="62" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="56" cy="62" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    {/* Breath/energy circles */}
    <circle cx="40" cy="40" r="10" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
    <circle cx="40" cy="40" r="14" stroke={color} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
    <line x1="22" y1="76" x2="58" y2="76" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

// ============================================================
// LOOKUP MAPS - Export all step SVGs organized by pose
// ============================================================

export const yogaPoseStepSvgs = {
  root: [MountainStep1, MountainStep2, MountainStep3, MountainStep4, MountainStep5, MountainStep6],
  sacral: [GoddessStep1, GoddessStep2, GoddessStep3, GoddessStep4, GoddessStep5, GoddessStep6],
  solar_plexus: [BoatStep1, BoatStep2, BoatStep3, BoatStep4, BoatStep5, BoatStep6],
  heart: [CobraStep1, CobraStep2, CobraStep3, CobraStep4, CobraStep5, CobraStep6],
  throat: [FishStep1, FishStep2, FishStep3, FishStep4, FishStep5, FishStep6],
  third_eye: [ChildsStep1, ChildsStep2, ChildsStep3, ChildsStep4, ChildsStep5, ChildsStep6],
  crown: [LotusStep1, LotusStep2, LotusStep3, LotusStep4, LotusStep5, LotusStep6]
};

export const getYogaPoseSteps = (chakraId) => yogaPoseStepSvgs[chakraId] || yogaPoseStepSvgs.root;
