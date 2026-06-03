'use client';

import { useEffect, useRef, useState } from 'react';
import { DECADES } from '@/lib/game';
import { TEAM_NAMES, type Decade } from '@/lib/players';

const TEAM_CODES = Object.keys(TEAM_NAMES);

interface Props {
  /** Bumped each time a spin starts. */
  spinKey: number;
  /** The team+decade the reels should settle on, or null when idle. */
  target: { team: string; decade: Decade } | null;
  onSettle: () => void;
}

function Reel({ label, value, spinning }: { label: string; value: string; spinning: boolean }) {
  return (
    <div className="flex-1">
      <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-chalk/40">
        {label}
      </div>
      <div className="relative h-16 overflow-hidden rounded-lg border border-chalk/15 bg-night/60 shadow-inner">
        <div
          className={[
            'flex h-full items-center justify-center px-2 text-center text-sm font-bold leading-tight',
            spinning ? 'blur-[1px] opacity-70' : 'animate-pop',
          ].join(' ')}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default function SlotMachine({ spinKey, target, onSettle }: Props) {
  const [teamLabel, setTeamLabel] = useState('—');
  const [decadeLabel, setDecadeLabel] = useState('—');
  const [spinning, setSpinning] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    if (spinKey === 0 || !target) return;
    settledRef.current = false;
    setSpinning(true);

    // Cycle random labels to fake the reel motion.
    const cycle = setInterval(() => {
      setTeamLabel(TEAM_NAMES[TEAM_CODES[Math.floor(Math.random() * TEAM_CODES.length)]]);
      setDecadeLabel(DECADES[Math.floor(Math.random() * DECADES.length)]);
    }, 70);

    const stop = setTimeout(() => {
      clearInterval(cycle);
      setTeamLabel(TEAM_NAMES[target.team] ?? target.team);
      setDecadeLabel(target.decade);
      setSpinning(false);
      if (!settledRef.current) {
        settledRef.current = true;
        onSettle();
      }
    }, 1300);

    return () => {
      clearInterval(cycle);
      clearTimeout(stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey]);

  return (
    <div className="flex items-stretch gap-3">
      <Reel label="Franchise" value={teamLabel} spinning={spinning} />
      <div className="flex items-end pb-5 text-2xl font-black text-seam">×</div>
      <Reel label="Era" value={decadeLabel} spinning={spinning} />
    </div>
  );
}
