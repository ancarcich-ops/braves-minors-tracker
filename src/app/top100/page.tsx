import Image from 'next/image';
import { getTop100 } from '@/lib/top100';
import type { Top100Prospect } from '@/lib/types';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { Trophy } from 'lucide-react';
import TeamLogo from '@/components/TeamLogo';
import { getTeamBySlug } from '@/lib/teams';

export const revalidate = 900;

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <dt className="text-[10px] uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="font-semibold tabular-nums text-slate-200">{value}</dd>
    </div>
  );
}

function StatLine({ p }: { p: Top100Prospect }) {
  if (p.isPitcher && p.pitching) {
    const s = p.pitching;
    return (
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <Stat label="ERA" value={s.era} />
        <Stat label="WHIP" value={s.whip} />
        <Stat label="IP" value={s.ip} />
        <Stat label="SO" value={String(s.so)} />
      </dl>
    );
  }
  if (!p.isPitcher && p.hitting) {
    const s = p.hitting;
    return (
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <Stat label="AVG" value={s.avg} />
        <Stat label="OPS" value={s.ops} />
        <Stat label="HR" value={String(s.hr)} />
        <Stat label="SB" value={String(s.sb)} />
      </dl>
    );
  }
  return <p className="text-xs text-slate-500">No {p.eta ? `stats yet · ETA ${p.eta}` : 'stats yet'}.</p>;
}

function Row({ p }: { p: Top100Prospect }) {
  return (
    <li className="glass glass-hover flex items-center gap-3 rounded-2xl p-3 shadow-card">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-braves-gold to-braves-red text-sm font-black text-white">
        {p.rank}
      </span>
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-braves-navy">
        {p.headshotUrl ? (
          <Image src={p.headshotUrl} alt="" fill sizes="44px" className="object-cover" unoptimized />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white/70">
            {initials(p.name)}
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {p.profileUrl ? (
            <a
              href={p.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-semibold text-white hover:text-braves-gold"
            >
              {p.name}
            </a>
          ) : (
            <span className="truncate font-semibold text-white">{p.name}</span>
          )}
          <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 ring-1 ring-white/10">
            <TeamLogo teamId={getTeamBySlug(p.teamSlug).id} name={p.teamShort} size={14} />
            {p.teamShort}
          </span>
          <span className="text-xs text-slate-500">{p.position}</span>
        </div>
        <div className="mt-1">
          <StatLine p={p} />
        </div>
      </div>
    </li>
  );
}

export default async function Top100Page() {
  const { prospects, season, isMock } = await getTop100();

  return (
    <div>
      <Reveal>
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-braves-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-braves-red">
              Across Baseball
            </span>
            {isMock && (
              <span className="rounded-full bg-braves-gold/15 px-2 py-0.5 text-[10px] font-semibold text-braves-gold ring-1 ring-braves-gold/30">
                sample data
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Top 100 Prospects</h1>
          <p className="mt-1 text-sm text-slate-400">
            The game&apos;s best prospects · live {season} stats
          </p>
        </div>
      </Reveal>

      <Stagger className="space-y-2">
        {prospects.map((p) => (
          <StaggerItem key={p.id}>
            <Row p={p} />
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-6 text-xs text-slate-500">
        Seeded from MLB Pipeline’s 2026 board (an editable starting point — currently{' '}
        {prospects.length} of 100) in <code className="text-slate-400">src/lib/top100Seed.ts</code>.
        Stats and headshots are resolved live from the MLB Stats API.
      </p>
    </div>
  );
}
