import React from 'react';

export default function BadgeCard({ badge, earned }) {
  return (
    <div className={`p-3 rounded-xl border ${earned ? 'border-accent-primary bg-gradient-to-br from-purple-50 to-teal-50' : 'border-border bg-white'}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-text-primary">{badge.name}</div>
          <div className="text-xs text-text-secondary">{badge.description}</div>
        </div>
        <div className="text-xs font-semibold">
          {earned ? <span className="text-green-600">Earned</span> : <span className="text-gray-400">Locked</span>}
        </div>
      </div>
    </div>
  );
}
