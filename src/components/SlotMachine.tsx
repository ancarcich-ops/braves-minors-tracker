'use client';

import { useEffect, useRef, useState } from 'react';
import { DECADES, POSITION_NAMES } from '@/lib/game';
import { type Decade, type Position } from '@/lib/players';

interface Props {
  /** Bumped each time a spin starts. */
  spinKey: number;
  /** The position being drafted this round (the locked reel). */
  position: Position;
  /** The era the reel should settle on, or null when idle. */
  targetDecade: Decade | null;
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

export default function SlotMachine({ spinKey, position, targetDecade, onSettle }: Props) {
  const [decadeLabel, setDecadeLabel] = useState('—');
  const [spinning, setSpinning] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    if (spinKey === 0 || !targetDecade) return;
    settledRef.current = false;
    setSpinning(true);

    // Cycle random eras to fake the reel motion.
    const cycle = setInterval(() => {
      setDecadeLabel(DECADES[Math.floor(Math.random() * DECADES.length)]);
    }, 70);

    const stop = setTimeout(() => {
      clearInterval(cycle);
      setDecadeLabel(targetDecade);
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
      <Reel label="Position" value={POSITION_NAMES[position]} spinning={spinning} locked />
      <div className="flex items-end pb-5 text-2xl font-black text-seam">×</div>
      <Reel label="Era" value={decadeLabel} spinning={spinning} />
    </div>
  );
}
