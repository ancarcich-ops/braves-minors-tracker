'use client';

import { useEffect, useRef, useState } from 'react';
import { POSITION_NAMES } from '@/lib/game';
import { type Position } from '@/lib/players';

interface Props {
  /** Bumped each time a deal starts. */
  spinKey: number;
  /** The position being drafted this round (the locked reel). */
  position: Position;
  /** Candidate names to flicker through while "scouting". */
  pool: string[];
  onSettle: () => void;
}

function Reel({
  label,
  value,
  spinning,
  locked,
}: {
  label: string;
  value: string;
  spinning: boolean;
  locked?: boolean;
}) {
  return (
    <div className="flex-1">
      <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-chalk/40">
        {label}
      </div>
      <div
        className={[
          'relative flex h-16 items-center justify-center overflow-hidden rounded-lg border px-2 text-center shadow-inner',
          locked ? 'border-seam/40 bg-seam/5' : 'border-chalk/15 bg-night/60',
        ].join(' ')}
      >
        <span
          className={[
            'text-sm font-bold leading-tight',
            spinning && !locked ? 'blur-[1px] opacity-70' : 'animate-pop',
          ].join(' ')}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export default function SlotMachine({ spinKey, position, pool, onSettle }: Props) {
  const [nameLabel, setNameLabel] = useState('—');
  const [spinning, setSpinning] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    if (spinKey === 0 || pool.length === 0) return;
    settledRef.current = false;
    setSpinning(true);

    const cycle = setInterval(() => {
      setNameLabel(pool[Math.floor(Math.random() * pool.length)]);
    }, 70);

    const stop = setTimeout(() => {
      clearInterval(cycle);
      setSpinning(false);
      setNameLabel('On the board');
      if (!settledRef.current) {
        settledRef.current = true;
        onSettle();
      }
    }, 1200);

    return () => {
      clearInterval(cycle);
      clearTimeout(stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey]);

  return (
    <div className="flex items-stretch gap-3">
      <Reel label="Position" value={POSITION_NAMES[position]} spinning={spinning} locked />
      <div className="flex items-end pb-5 text-2xl font-black text-seam">›</div>
      <Reel label="Scouting" value={spinning ? nameLabel : 'On the board'} spinning={spinning} />
    </div>
  );
}
