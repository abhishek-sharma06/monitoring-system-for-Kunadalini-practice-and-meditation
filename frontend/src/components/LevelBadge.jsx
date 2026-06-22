import React from 'react';

/**
 * LevelBadge Component
 * 
 * Displays user's current practitioner level as a small badge.
 * Shown on Dashboard and other pages.
 * Levels: 🌱 Beginner, 🌿 Intermediate, 🌳 Advanced
 */
const LevelBadge = ({ level = 'beginner', size = 'md' }) => {
  // Level configuration with emoji, colors, and descriptions
  const levelConfig = {
    beginner: {
      emoji: '🌱',
      label: 'Beginner',
      color: 'bg-green-100 text-green-700 border-green-200',
      bgGradient: 'from-green-50 to-green-100',
      description: 'Starting your kundalini journey'
    },
    intermediate: {
      emoji: '🌿',
      label: 'Intermediate',
      color: 'bg-teal-100 text-teal-700 border-teal-200',
      bgGradient: 'from-teal-50 to-teal-100',
      description: 'Growing your practice'
    },
    advanced: {
      emoji: '🌳',
      label: 'Advanced',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      bgGradient: 'from-purple-50 to-purple-100',
      description: 'Mastering kundalini techniques'
    }
  };

  const config = levelConfig[level] || levelConfig.beginner;

  // Size variants
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div
      title={config.description}
      className={`inline-flex items-center gap-2 rounded-full border-2 font-bold transition cursor-default ${config.color} ${sizes[size]}`}
    >
      <span className="text-lg">{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  );
};

export default LevelBadge;
