'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Bumped each time a spin starts. */
  spinKey: number;
  /** Franchise display names to flicker through while spinning. */
  pool: string[];
  /** The franchise name the reel settles on. */
  target: string | null;
  onSettle: () => void;
}

export default function SlotMachine({ spinKey, pool, target, onSettle }: Props) {
  const [label, setLabel] = useState('—');
  const [spinning, setSpinning] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    if (spinKey === 0 || !target) return;
    settledRef.current = false;
    setSpinning(true);

    const cycle = setInterval(() => {
      setLabel(pool[Math.floor(Math.random() * pool.length)] ?? '—');
    }, 65);

    const stop = setTimeout(() => {
      clearInterval(cycle);
      setLabel(target);
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
    <div>
      <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-chalk/40">
        On the clock
      </div>
      <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-xl border border-chalk/15 bg-night/60 px-3 shadow-inner">
        <span
          className={[
            'text-center text-2xl font-black leading-tight',
            spinning ? 'blur-[1.5px] opacity-70' : 'animate-pop text-seam',
          ].join(' ')}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
