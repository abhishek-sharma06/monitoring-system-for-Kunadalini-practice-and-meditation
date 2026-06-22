import React, { useMemo } from 'react';
import BadgeCard from './BadgeCard';
import { BADGES } from '../data/badges';
import { getFiveDHistory } from '../utils/localHistory';

// Determine badges earned from recent sessions and local history
export default function BadgesPanel({ recentSessions = [], earnedBadgeIds = [] }) {
  const fiveDHistory = getFiveDHistory();

  const earnedMap = useMemo(() => {
    const map = {};

    if (earnedBadgeIds.length > 0) {
      earnedBadgeIds.forEach((badgeId) => {
        map[badgeId] = true;
      });
      return map;
    }

    const totalSessions = recentSessions.length;

    // first session
    map['first_session'] = totalSessions >= 1;

    // breath_novice: any session where breath_completed is true
    map['breath_novice'] = recentSessions.some(s => s.breath_completed === 1 || s.breath_completed === true);

    // mantra_initiate: any session where mantra_played true
    map['mantra_initiate'] = recentSessions.some(s => s.mantra_played === 1 || s.mantra_played === true);

    // five_d_high: check local history for any high snapshot
    map['five_d_high'] = fiveDHistory.some(e => (e.five_d_score || 0) >= 80);

    // consistency_10: total sessions across API (not local history) >= 10
    map['consistency_10'] = totalSessions >= 10;

    return map;
  }, [recentSessions, fiveDHistory, earnedBadgeIds]);

  return (
    <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold">Badges</div>
        <div className="text-xs text-text-secondary">Achievements</div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {BADGES.map(b => (
          <BadgeCard key={b.id} badge={b} earned={!!earnedMap[b.id]} />
        ))}
      </div>
    </div>
  );
}
