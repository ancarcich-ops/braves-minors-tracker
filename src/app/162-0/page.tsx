'use client';

import { useMemo, useState } from 'react';
import RosterBar from '@/components/RosterBar';
import ResultScreen from '@/components/ResultScreen';
import SlotMachine from '@/components/SlotMachine';
import {
  POSITIONS,
  POSITION_NAMES,
  spin,
  type Combo,
  type Pick,
} from '@/lib/game';
import { TEAM_NAMES, type Decade, type Player } from '@/lib/players';
import { simulateSeason, type SeasonResult } from '@/lib/sim';

type Phase = 'intro' | 'ready' | 'spinning' | 'choosing' | 'result';

export default function Game() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [picks, setPicks] = useState<Pick[]>([]);
  const [combo, setCombo] = useState<Combo | null>(null);
  const [spinKey, setSpinKey] = useState(0);

  const roundIndex = picks.length;
  const position = POSITIONS[roundIndex];
  const usedDecades = useMemo(
    () => new Set<Decade>(picks.map((p) => p.player.decade)),
    [picks],
  );
  const pickedIds = useMemo(() => new Set(picks.map((p) => p.player.id)), [picks]);

  const result: SeasonResult | null = useMemo(
    () => (phase === 'result' ? simulateSeason(picks) : null),
    [phase, picks],
  );

  function start() {
    setPicks([]);
    setCombo(null);
    setPhase('ready');
  }

  function doSpin() {
    const target = spin(position, usedDecades, pickedIds);
    if (!target) return; // coverage guarantees this won't happen
    setCombo(target);
    setSpinKey((k) => k + 1);
    setPhase('spinning');
  }

  function draft(player: Player) {
    const next = [...picks, { position, player }];
    setPicks(next);
    setCombo(null);
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
            Round {roundIndex + 1}
            <span className="text-chalk/40"> / {POSITIONS.length}</span>
          </h2>
          <span className="rounded-full bg-seam/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-seam">
            {POSITION_NAMES[position]}
          </span>
        </div>
        <RosterBar picks={picks} currentIndex={roundIndex} />
      </div>

      <div className="rounded-2xl border border-chalk/10 bg-panel/70 p-5 diamond-bg">
        <SlotMachine
          spinKey={spinKey}
          target={combo}
          onSettle={() => setPhase('choosing')}
        />

        <div className="mt-5">
          {phase === 'ready' && (
            <button
              onClick={doSpin}
              className="w-full rounded-lg bg-seam px-4 py-3 text-sm font-black uppercase tracking-wider text-night transition-transform hover:scale-[1.01]"
            >
              Spin for your {POSITION_NAMES[position]}
            </button>
          )}

          {phase === 'spinning' && (
            <div className="text-center text-sm text-chalk/50">Spinning…</div>
          )}

          {phase === 'choosing' && combo && (
            <div className="animate-pop">
              <p className="mb-3 text-center text-sm text-chalk/70">
                Draft your {POSITION_NAMES[position]} from the{' '}
                <span className="font-bold text-chalk">
                  {combo.decade} {TEAM_NAMES[combo.team]}
                </span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {combo.players.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => draft(pl)}
                    className="flex items-center justify-between rounded-lg border border-chalk/15 bg-night/50 px-4 py-3 text-left transition-colors hover:border-grass hover:bg-grass/10"
                  >
                    <span>
                      <span className="block font-bold">{pl.name}</span>
                      <span className="block text-xs text-chalk/45">
                        {pl.decade} · {TEAM_NAMES[pl.team]}
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
        One player per decade — every era can be used only once.
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
        Spin a <span className="font-semibold text-chalk">franchise</span> and a{' '}
        <span className="font-semibold text-chalk">decade</span>, then draft the best player from
        that team and era. Fill all nine positions — one legend per decade — and simulate a
        162-game season.
      </p>
      <p className="mt-3 max-w-md text-sm text-chalk/45">
        Nobody&apos;s ever gone 162-0. Build the team that finally does.
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
          Spin the team + decade reels each round.
        </div>
        <div className="rounded-lg border border-chalk/10 bg-panel/60 p-3">
          <div className="mb-1 font-black text-seam">2</div>
          Draft a player — one per decade, no repeats.
        </div>
        <div className="rounded-lg border border-chalk/10 bg-panel/60 p-3">
          <div className="mb-1 font-black text-seam">3</div>
          Simulate 162 games and chase perfection.
        </div>
      </div>

      <p className="mt-10 text-[11px] text-chalk/30">
        Unofficial fan project. Player ratings are subjective. Not affiliated with MLB.
      </p>
    </main>
  );
}
