import Image from 'next/image';
import { getMovers } from '@/lib/movers';
import { getSelectedTeam } from '@/lib/team-server';
import type { Mover } from '@/lib/types';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { TrendingUp, TrendingDown, Flame, Snowflake } from 'lucide-react';

// Recompute trends a few times a day.
export const revalidate = 1800;

const LEVEL_STYLE: Record<string, string> = {
  AAA: 'bg-braves-red/15 text-red-300 ring-braves-red/30',
  AA: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  'High-A': 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  'Low-A': 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  Rookie: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  DSL: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30',
};

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

function MoverCard({ m }: { m: Mover }) {
  const up = m.direction === 'riser';
  const accent = up ? 'text-emerald-300' : 'text-rose-300';
  const chip = up
    ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
    : 'bg-rose-500/15 text-rose-300 ring-rose-500/30';
  const Arrow = up ? TrendingUp : TrendingDown;

  return (
    <li className="glass glass-hover rounded-2xl p-3.5 shadow-card">
      <div className="flex items-center gap-3">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-braves-navy text-xs font-bold text-white/80 ring-1 ring-white/10">
          {m.headshotUrl ? (
            <Image src={m.headshotUrl} alt="" fill sizes="44px" className="object-cover" unoptimized />
          ) : (
            initials(m.name)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {m.level && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${
                  LEVEL_STYLE[m.level] ?? 'bg-slate-500/15 text-slate-300 ring-slate-500/30'
                }`}
              >
                {m.level}
              </span>
            )}
            {m.profileUrl ? (
              <a
                href={m.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-semibold text-white hover:text-braves-gold"
              >
                {m.name}
              </a>
            ) : (
              <span className="truncate font-semibold text-white">{m.name}</span>
            )}
            <span className="shrink-0 text-xs text-slate-500">{m.position}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            <span className="text-slate-500">L{m.window}:</span> {m.recentLine}
          </p>
          <p className="text-xs text-slate-500">Season: {m.seasonLine}</p>
        </div>
        <div className={`flex shrink-0 flex-col items-end ${accent}`}>
          <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-bold ring-1 ${chip}`}>
            <Arrow className="h-3.5 w-3.5" />
            {m.delta}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
            {m.metricLabel} {m.recentMetric}
            <span className="text-slate-600"> / {m.seasonMetric}</span>
          </span>
        </div>
      </div>
    </li>
  );
}

function Column({
  title,
  icon: Icon,
  tint,
  movers,
  emptyText,
}: {
  title: string;
  icon: typeof Flame;
  tint: string;
  movers: Mover[];
  emptyText: string;
}) {
  return (
    <section>
      <Reveal>
        <div className="mb-3 flex items-center gap-2">
          <Icon className={`h-4 w-4 ${tint}`} />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">{title}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          <span className="text-xs text-slate-500">{movers.length}</span>
        </div>
      </Reveal>
      {movers.length === 0 ? (
        <div className="glass rounded-2xl px-4 py-8 text-center text-sm text-slate-400">{emptyText}</div>
      ) : (
        <Stagger className="space-y-2">
          {movers.map((m) => (
            <StaggerItem key={m.id}>
              <MoverCard m={m} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}

export default async function MoversPage() {
  const team = getSelectedTeam();
  const { risers, slumpers, windowSize, isMock } = await getMovers(team);

  return (
    <div>
      <Reveal>
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-braves-red">
              {team.short} · Trends
            </span>
            {isMock && (
              <span className="rounded-full bg-braves-gold/15 px-2 py-0.5 text-[10px] font-semibold text-braves-gold ring-1 ring-braves-gold/30">
                sample data
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Risers &amp; Slumpers</h1>
          <p className="mt-1 text-sm text-slate-400">
            Last {windowSize} games vs. season baseline, across tracked prospects
          </p>
        </div>
      </Reveal>

      <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
        <Column
          title="Risers"
          icon={Flame}
          tint="text-orange-400"
          movers={risers}
          emptyText="No clear risers right now."
        />
        <Column
          title="Slumpers"
          icon={Snowflake}
          tint="text-sky-400"
          movers={slumpers}
          emptyText="No clear slumpers right now."
        />
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Trends are computed live from game-by-game logs (MLB Stats API) — recent {windowSize}-game
        form vs. season rates. Hitters trend on OPS, pitchers on ERA; small samples are filtered out.
      </p>
    </div>
  );
}
