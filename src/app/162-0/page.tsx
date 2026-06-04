'use client';

import { useMemo, useState } from 'react';
import RosterBar from '@/components/RosterBar';
import ResultScreen from '@/components/ResultScreen';
import SlotMachine from '@/components/SlotMachine';
import { POSITIONS, POSITION_NAMES, spin, type Combo, type Pick } from '@/lib/game';
import { TEAM_NAMES, type Decade, type Player } from '@/lib/players';
import { simulateSeason, type SeasonResult } from '@/lib/sim';

type Phase = 'intro' | 'ready' | 'spinning' | 'choosing' | 'result';

export default function Game() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [picks, setPicks] = useState<Pick[]>([]);
  const [combo, setCombo] = useState<Combo | null>(null);
  const [spinKey, setSpinKey] = useState(0);

  const usedDecades = useMemo(
    () => new Set<Decade>(picks.map((p) => p.player.decade)),
    [picks],
  );
  const openPositions = useMemo(() => {
    const filled = new Set(picks.map((p) => p.position));
    return new Set(POSITIONS.filter((p) => !filled.has(p)));
  }, [picks]);
  const pickedNames = useMemo(() => new Set(picks.map((p) => p.player.name)), [picks]);

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
    const target = spin(usedDecades, openPositions, pickedNames);
    if (!target) return; // full coverage guarantees this won't happen
    setCombo(target);
    setSpinKey((k) => k + 1);
    setPhase('spinning');
  }

  function draft(player: Player) {
    const next = [...picks, { position: player.pos, player }];
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
          target={combo ? { team: combo.team, decade: combo.decade } : null}
          onSettle={() => setPhase('choosing')}
        />

        <div className="mt-5">
          {phase === 'ready' && (
            <button
              onClick={doSpin}
              className="w-full rounded-lg bg-seam px-4 py-3 text-sm font-black uppercase tracking-wider text-night transition-transform hover:scale-[1.01]"
            >
              {picks.length === 0 ? 'Spin for a team & era' : 'Spin again'}
            </button>
          )}

          {phase === 'spinning' && (
            <div className="text-center text-sm text-chalk/50">Spinning…</div>
          )}

          {phase === 'choosing' && combo && (
            <div className="animate-pop">
              <p className="mb-3 text-center text-sm text-chalk/70">
                Draft <span className="font-bold text-chalk">one</span> player from the{' '}
                <span className="font-bold text-chalk">
                  {combo.decade} {TEAM_NAMES[combo.team]}
                </span>
              </p>
              <div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
                {combo.players.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => draft(pl)}
                    className="flex items-center justify-between gap-2 rounded-lg border border-chalk/15 bg-night/50 px-4 py-3 text-left transition-colors hover:border-grass hover:bg-grass/10"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-7 shrink-0 text-xs font-black text-seam">{pl.pos}</span>
                      <span className="font-bold leading-tight">{pl.name}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-chalk/55">
                      {pl.stat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-chalk/35">
        One pick per era — every decade can be used only once, so spend each spin wisely.
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
        Spin a <span className="font-semibold text-chalk">team</span> and a{' '}
        <span className="font-semibold text-chalk">decade</span>, then draft one player from that
        club&apos;s roster into an open position. Each era can be used only once — fill all nine
        spots, then simulate a 162-game season.
      </p>
      <p className="mt-3 max-w-md text-sm text-chalk/45">
        You only get one pick per decade, so spend each spin wisely. Nobody&apos;s ever gone 162-0.
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
          Spin a team and an era.
        </div>
        <div className="rounded-lg border border-chalk/10 bg-panel/60 p-3">
          <div className="mb-1 font-black text-seam">2</div>
          Draft one of its players into an open spot.
        </div>
        <div className="rounded-lg border border-chalk/10 bg-panel/60 p-3">
          <div className="mb-1 font-black text-seam">3</div>
          Use each decade once, then simulate.
        </div>
      </div>

      <p className="mt-10 text-[11px] text-chalk/30">
        Unofficial fan project. Stats are real but illustrative. Not affiliated with MLB.
      </p>
    </main>
  );
}
