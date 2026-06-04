'use client';

import { useEffect, useState } from 'react';
import { POSITIONS, type Pick } from '@/lib/game';
import { TEAM_NAMES } from '@/lib/players';
import type { SeasonResult } from '@/lib/sim';

const TONE_RING: Record<SeasonResult['verdict']['tone'], string> = {
  perfect: 'from-yellow-300 to-seam',
  legendary: 'from-grass to-field',
  great: 'from-grass to-field',
  good: 'from-sky-400 to-sky-600',
  mid: 'from-slate-400 to-slate-600',
  poor: 'from-slate-500 to-slate-700',
};

interface Props {
  picks: Pick[];
  result: SeasonResult;
  onReplay: () => void;
}

export default function ResultScreen({ picks, result, onReplay }: Props) {
  const [shownWins, setShownWins] = useState(0);
  const [copied, setCopied] = useState(false);

  // Animate the win total counting up for a little drama.
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setShownWins(Math.round(eased * result.wins));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result.wins]);

  const byPosition = new Map(picks.map((pk) => [pk.position, pk]));

  const shareText =
    `I went ${result.wins}-${result.losses} in 162-0 — ${result.verdict.title}!\n` +
    picks
      .map(
        (pk) =>
          `${pk.position}: ${pk.player.name} (${pk.player.decade} ${TEAM_NAMES[pk.player.team]?.split(' ').pop()})`,
      )
      .join('\n') +
    `\nBuild your perfect season at 162-0.`;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: '162-0', text: shareText });
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="animate-pop">
      <div className="mb-6 text-center">
        <div
          className={`mx-auto mb-3 inline-block rounded-full bg-gradient-to-r ${TONE_RING[result.verdict.tone]} px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-night`}
        >
          {result.verdict.title}
        </div>
        <div className="font-black leading-none tabular-nums">
          <span className="text-6xl sm:text-7xl">{shownWins}</span>
          <span className="text-3xl text-chalk/40">–{result.losses}</span>
        </div>
        <p className="mx-auto mt-3 max-w-md text-sm text-chalk/60">{result.verdict.blurb}</p>
        <p className="mt-1 text-xs text-chalk/35">
          {(result.winPct * 100).toFixed(0)}% per-game win chance
        </p>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-chalk/10 bg-panel/70">
        <div className="border-b border-chalk/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-chalk/50">
          Your Lineup Card
        </div>
        <div className="divide-y divide-chalk/5">
          {POSITIONS.map((pos) => {
            const pk = byPosition.get(pos)!;
            return (
              <div key={pos} className="flex items-center gap-3 px-4 py-2 text-sm">
                <span className="w-7 shrink-0 text-xs font-black text-seam">{pos}</span>
                <span className="min-w-0 flex-1 truncate font-semibold">{pk.player.name}</span>
                <span className="hidden text-xs text-chalk/45 sm:inline">
                  {TEAM_NAMES[pk.player.team]?.split(' ').pop()} · {pk.player.decade}
                </span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-chalk/55">
                  {pk.player.stat}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={share}
          className="flex-1 rounded-lg border border-chalk/15 bg-night/60 px-4 py-3 text-sm font-bold transition-colors hover:bg-night"
        >
          {copied ? 'Copied to clipboard ✓' : 'Share result'}
        </button>
        <button
          onClick={onReplay}
          className="flex-1 rounded-lg bg-seam px-4 py-3 text-sm font-black text-night transition-transform hover:scale-[1.02]"
        >
          Play again
        </button>
      </div>
    </div>
  );
}
