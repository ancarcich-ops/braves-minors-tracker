'use client';

import { POSITIONS, type Pick } from '@/lib/game';
import { TEAM_NAMES } from '@/lib/players';

interface Props {
  picks: Pick[];
  currentIndex: number;
}

export default function RosterBar({ picks, currentIndex }: Props) {
  const byPosition = new Map(picks.map((pk) => [pk.position, pk]));

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
      {POSITIONS.map((pos, i) => {
        const pk = byPosition.get(pos);
        const isCurrent = i === currentIndex && !pk;
        return (
          <div
            key={pos}
            className={[
              'rounded-lg border px-2 py-1.5 text-center transition-colors',
              pk
                ? 'border-grass/40 bg-grass/10'
                : isCurrent
                  ? 'border-seam bg-seam/10'
                  : 'border-chalk/10 bg-night/40',
            ].join(' ')}
          >
            <div
              className={[
                'text-[10px] font-bold uppercase tracking-wider',
                isCurrent ? 'text-seam' : 'text-chalk/50',
              ].join(' ')}
            >
              {pos}
            </div>
            {pk ? (
              <div className="animate-pop">
                <div className="truncate text-[11px] font-semibold leading-tight" title={pk.player.name}>
                  {pk.player.name}
                </div>
                <div className="truncate text-[9px] text-chalk/45">
                  {TEAM_NAMES[pk.player.team]?.split(' ').pop()} · {pk.player.decade}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-chalk/25">—</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
