import React from 'react';

// Simple horizontal bar preview for 5D scores
// Props: fiveD (object with physical, prana, mind, emotion, spiritual, five_d_score)
export default function FiveDPreview({ fiveD }) {
  if (!fiveD) return null;

  const items = [
    { key: 'physical', label: 'Physical' },
    { key: 'prana', label: 'Prana' },
    { key: 'mind', label: 'Mind' },
    { key: 'emotion', label: 'Emotion' },
    { key: 'spiritual', label: 'Spiritual' }
  ];

  return (
    <div className="bg-white border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">5D Snapshot</div>
        <div className="text-xs text-gray-500">Score: <span className="font-semibold text-accent-primary">{fiveD.five_d_score.toFixed(1)}</span></div>
      </div>

      <div className="space-y-2">
        {items.map((it) => {
          const val = Math.round((fiveD[it.key] || 0));
          return (
            <div key={it.key} className="flex items-center gap-3">
              <div className="w-20 text-xs text-text-secondary">{it.label}</div>
              <div className="flex-1 bg-background-secondary rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-teal-400" style={{ width: `${val}%` }} />
              </div>
              <div className="w-10 text-right text-xs font-semibold">{val}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
