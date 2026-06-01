import type { ProspectPerformance } from '@/lib/types';
import { Star, Play, ExternalLink } from 'lucide-react';

const LEVEL_STYLE: Record<string, string> = {
  AAA: 'bg-braves-red/15 text-red-300 ring-braves-red/30',
  AA: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  'High-A': 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  'Low-A': 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  Rookie: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  DSL: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30',
};

function PerfRow({ p }: { p: ProspectPerformance }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5 transition-colors hover:bg-white/[0.06]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-braves-gold to-[#b07f00] text-sm font-black text-braves-navy shadow-glow">
        {p.rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
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
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${
              LEVEL_STYLE[p.level] ?? 'bg-slate-500/15 text-slate-300 ring-slate-500/30'
            }`}
          >
            {p.level}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-braves-gold">{p.line}</p>
        {p.opponent && <p className="text-[11px] text-slate-500">{p.team} vs {p.opponent}</p>}
      </div>
      {p.highlightUrl ? (
        <a
          href={p.highlightUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-braves-red px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#a50e34]"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Watch
        </a>
      ) : (
        <a
          href={p.gamedayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-300 ring-1 ring-white/15 transition-colors hover:bg-white/10"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Recap
        </a>
      )}
    </li>
  );
}

export default function ProspectWatch({ performances }: { performances: ProspectPerformance[] }) {
  if (performances.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-braves-gold/20 bg-gradient-to-br from-braves-navy/60 via-ink-850/60 to-ink-900/60 p-4 shadow-card backdrop-blur-xl">
      {/* brand accent stripe */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-braves-red via-braves-gold to-braves-red" />
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 fill-braves-gold text-braves-gold" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Prospect Watch
        </h2>
        <span className="rounded-full bg-braves-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-braves-gold ring-1 ring-braves-gold/30">
          Today
        </span>
        <div className="ml-auto text-xs text-slate-400">
          {performances.length} standout{performances.length > 1 ? 's' : ''}
        </div>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {performances.map((p) => (
          <PerfRow key={`${p.id}-${p.gamedayUrl}`} p={p} />
        ))}
      </ul>
    </div>
  );
}
