'use client';

import { useMemo, useState } from 'react';
import RosterBar from '@/components/RosterBar';
import ResultScreen from '@/components/ResultScreen';
import SlotMachine from '@/components/SlotMachine';
import {
  FRANCHISE_CODES,
  FRANCHISE_NAMES,
  POSITIONS,
  POSITION_NAMES,
  franchiseRoster,
  spinFranchise,
  type Pick,
} from '@/lib/game';
import { TEAM_NAMES, type Player } from '@/lib/players';
import { simulateSeason, type SeasonResult } from '@/lib/sim';

type Phase = 'intro' | 'ready' | 'spinning' | 'choosing' | 'result';

const FRANCHISE_POOL = FRANCHISE_CODES.map((c) => FRANCHISE_NAMES[c]);

export default function Game() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [picks, setPicks] = useState<Pick[]>([]);
  const [usedFranchises, setUsedFranchises] = useState<Set<string>>(new Set());
  const [franchise, setFranchise] = useState<string | null>(null);
  const [spinKey, setSpinKey] = useState(0);

  const openPositions = useMemo(() => {
    const filled = new Set(picks.map((p) => p.position));
    return new Set(POSITIONS.filter((p) => !filled.has(p)));
  }, [picks]);
  const pickedNames = useMemo(() => new Set(picks.map((p) => p.player.name)), [picks]);

  const roster = useMemo(
    () => (franchise ? franchiseRoster(franchise, openPositions, pickedNames) : []),
    [franchise, openPositions, pickedNames],
  );

  const result: SeasonResult | null = useMemo(
    () => (phase === 'result' ? simulateSeason(picks) : null),
    [phase, picks],
  );

  function start() {
    setPicks([]);
    setUsedFranchises(new Set());
    setFranchise(null);
    setPhase('ready');
  }

  function doSpin() {
    const f = spinFranchise(openPositions, pickedNames, usedFranchises);
    if (!f) return;
    setFranchise(f);
    setUsedFranchises((prev) => new Set(prev).add(f));
    setSpinKey((k) => k + 1);
    setPhase('spinning');
  }

  function draft(player: Player) {
    const next = [...picks, { position: player.pos, player }];
    setPicks(next);
    setFranchise(null);
    setPhase(next.length === POSITIONS.length ? 'result' : 'ready');
  }

  if (phase === 'intro') return <Intro onStart={start} />;

  if (phase === 'result' && result) {
    return (
      <Shell>
        <ResultScreen picks={picks} result={result} onReplay={start} />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-5">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">
            Pick {picks.length + 1}
            <span className="text-chalk/40"> / {POSITIONS.length}</span>
          </h2>
          <span className="text-xs text-chalk/45">{openPositions.size} positions open</span>
        </div>
        <RosterBar picks={picks} />
      </div>

      <div className="rounded-2xl border border-chalk/10 bg-panel/70 p-5 diamond-bg">
        <SlotMachine
          spinKey={spinKey}
          pool={FRANCHISE_POOL}
          target={franchise ? FRANCHISE_NAMES[franchise] : null}
          onSettle={() => setPhase('choosing')}
        />

        <div className="mt-5">
          {phase === 'ready' && (
            <button
              onClick={doSpin}
              className="w-full rounded-lg bg-seam px-4 py-3 text-sm font-black uppercase tracking-wider text-night transition-transform hover:scale-[1.01]"
            >
              {picks.length === 0 ? 'Spin for a franchise' : 'Spin the next franchise'}
            </button>
          )}

          {phase === 'spinning' && (
            <div className="text-center text-sm text-chalk/50">Spinning…</div>
          )}

          {phase === 'choosing' && franchise && (
            <div className="animate-pop">
              <p className="mb-3 text-center text-sm text-chalk/70">
                Draft <span className="font-bold text-chalk">one</span> player from the{' '}
                <span className="font-bold text-chalk">{FRANCHISE_NAMES[franchise]}</span> to fill an
                open spot
              </p>
              <div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
                {roster.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => draft(pl)}
                    className="flex items-center justify-between rounded-lg border border-chalk/15 bg-night/50 px-4 py-3 text-left transition-colors hover:border-grass hover:bg-grass/10"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-7 shrink-0 text-xs font-black text-seam">{pl.pos}</span>
                      <span>
                        <span className="block font-bold leading-tight">{pl.name}</span>
                        <span className="block text-xs text-chalk/45">
                          {pl.decade} · {TEAM_NAMES[pl.team]}
                        </span>
                      </span>
                    </span>
                    <span className="rounded bg-grass/20 px-2 py-1 text-sm font-black tabular-nums text-grass">
                      {pl.ovr}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-chalk/35">
        One player per franchise — choose the position wisely, you won&apos;t see this club again.
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-black tracking-tight">
          162<span className="text-seam">-</span>0
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-chalk/40">build the perfect season</p>
      </header>
      {children}
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-10 text-center">
      <h1 className="text-6xl font-black tracking-tight sm:text-7xl">
        162<span className="text-seam">-</span>0
      </h1>
      <p className="mt-2 text-sm uppercase tracking-[0.35em] text-chalk/50">
        build the perfect season
      </p>

      <p className="mt-8 max-w-md text-chalk/70">
        Spin a <span className="font-semibold text-chalk">franchise</span> and draft just{' '}
        <span className="font-semibold text-chalk">one</span> of its all-time greats to fill a
        position. Spin again for a new club, pick from the spots you have left, and keep going until
        your nine-man lineup is set — then simulate a 162-game season.
      </p>
      <p className="mt-3 max-w-md text-sm text-chalk/45">
        You only get one player per franchise, so spend each spin wisely. Nobody&apos;s ever gone
        162-0.
      </p>

      <button
        onClick={onStart}
        className="mt-8 rounded-lg bg-seam px-8 py-4 text-base font-black uppercase tracking-wider text-night transition-transform hover:scale-[1.03]"
      >
        Play ball
      </button>

      <div className="mt-10 grid w-full max-w-md grid-cols-3 gap-3 text-left text-xs text-chalk/55">
        <div className="rounded-lg border border-chalk/10 bg-panel/60 p-3">
          <div className="mb-1 font-black text-seam">1</div>
          Spin to land on a franchise.
        </div>
        <div className="rounded-lg border border-chalk/10 bg-panel/60 p-3">
          <div className="mb-1 font-black text-seam">2</div>
          Draft one of its players into an open spot.
        </div>
        <div className="rounded-lg border border-chalk/10 bg-panel/60 p-3">
          <div className="mb-1 font-black text-seam">3</div>
          Fill all nine, simulate, chase perfection.
        </div>
      </div>

      <p className="mt-10 text-[11px] text-chalk/30">
        Unofficial fan project. Player ratings are subjective. Not affiliated with MLB.
      </p>
    </main>
  );
}
