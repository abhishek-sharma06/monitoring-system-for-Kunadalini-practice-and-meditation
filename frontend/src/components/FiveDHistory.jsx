import React, { useEffect, useState } from 'react';
import { getFiveDHistory } from '../utils/localHistory';

export default function FiveDHistory() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(getFiveDHistory());
  }, []);

  if (!entries || entries.length === 0) return null;

  return (
    <div className="bg-white border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold">Recent 5D History</div>
        <div className="text-xs text-gray-500">Showing last {Math.min(entries.length, 7)}</div>
      </div>

      <div className="space-y-3">
        {entries.slice(0, 7).map((e, i) => (
          <div key={e.timestamp + i} className="flex items-center gap-3">
            <div className="w-20 text-xs text-text-secondary">{new Date(e.timestamp).toLocaleString()}</div>
            <div className="flex-1 bg-background-secondary rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-teal-400" style={{ width: `${Math.round(e.five_d_score)}%` }} />
            </div>
            <div className="w-10 text-right text-xs font-semibold">{Math.round(e.five_d_score)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
