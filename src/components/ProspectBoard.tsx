'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { Prospect } from '@/lib/types';

const STORAGE_KEY = 'braves-prospect-order-v1';

const LEVEL_BADGE: Record<string, string> = {
  AAA: 'bg-braves-red',
  AA: 'bg-orange-600',
  'High-A': 'bg-amber-600',
  'Low-A': 'bg-emerald-700',
  Rookie: 'bg-sky-700',
  DSL: 'bg-indigo-700',
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function StatLine({ p }: { p: Prospect }) {
  if (p.isPitcher && p.pitching) {
    const s = p.pitching;
    return (
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums text-white/70">
        <Stat label="ERA" value={s.era} />
        <Stat label="WHIP" value={s.whip} />
        <Stat label="IP" value={s.ip} />
        <Stat label="SO" value={String(s.so)} />
        <Stat label="W-L" value={`${s.w}-${s.l}`} />
      </dl>
    );
  }
  if (!p.isPitcher && p.hitting) {
    const s = p.hitting;
    return (
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums text-white/70">
        <Stat label="AVG" value={s.avg} />
        <Stat label="OPS" value={s.ops} />
        <Stat label="HR" value={String(s.hr)} />
        <Stat label="RBI" value={String(s.rbi)} />
        <Stat label="SB" value={String(s.sb)} />
      </dl>
    );
  }
  return <p className="text-xs text-white/40">No stats for this season yet.</p>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <dt className="text-[10px] uppercase tracking-wide text-white/40">{label}</dt>
      <dd className="font-semibold text-white/90">{value}</dd>
    </div>
  );
}

function Bio({ p }: { p: Prospect }) {
  const bits = [
    p.position,
    p.bats && p.throws ? `B/T: ${p.bats}/${p.throws}` : p.throws ? `Throws ${p.throws}` : null,
    p.age ? `Age ${p.age}` : null,
    p.eta ? `ETA ${p.eta}` : null,
  ].filter(Boolean);
  return <p className="text-xs text-white/50">{bits.join('  ·  ')}</p>;
}

function Row({
  p,
  displayRank,
  editing,
  isFirst,
  isLast,
  onMove,
}: {
  p: Prospect;
  displayRank: number;
  editing: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex w-8 shrink-0 flex-col items-center">
        <span className="text-lg font-bold tabular-nums text-white/90">{displayRank}</span>
        {displayRank !== p.rank && (
          <span className="text-[10px] tabular-nums text-white/40" title={`Seed rank #${p.rank}`}>
            #{p.rank}
          </span>
        )}
      </div>

      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-braves-navy">
        {p.headshotUrl ? (
          <Image src={p.headshotUrl} alt="" fill sizes="48px" className="object-cover" unoptimized />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white/70">
            {initials(p.name)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {p.level && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${
                LEVEL_BADGE[p.level] ?? 'bg-slate-600'
              }`}
            >
              {p.level}
            </span>
          )}
          {p.profileUrl ? (
            <a
              href={p.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-semibold text-white hover:text-braves-sand"
            >
              {p.name}
            </a>
          ) : (
            <span className="truncate font-semibold text-white">{p.name}</span>
          )}
          {p.team && <span className="hidden truncate text-xs text-white/40 sm:inline">{p.team}</span>}
        </div>
        <div className="mt-0.5">
          <Bio p={p} />
        </div>
        {p.note && <p className="mt-1 hidden text-xs text-white/45 sm:block">{p.note}</p>}
        <div className="mt-1.5">
          <StatLine p={p} />
        </div>
      </div>

      {editing && (
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={isFirst}
            aria-label={`Move ${p.name} up`}
            className="rounded border border-white/15 px-2 py-0.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={isLast}
            aria-label={`Move ${p.name} down`}
            className="rounded border border-white/15 px-2 py-0.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30"
          >
            ↓
          </button>
        </div>
      )}
    </li>
  );
}

export default function ProspectBoard({ prospects }: { prospects: Prospect[] }) {
  // Seed order is deterministic, so SSR and the first client render match.
  const seedOrder = useMemo(() => prospects.map((p) => p.id), [prospects]);
  const [order, setOrder] = useState<string[]>(seedOrder);
  const [editing, setEditing] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // After mount, adopt any saved custom order from a previous visit.
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as string[];
        if (Array.isArray(saved) && saved.length) setOrder(saved);
      }
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const byId = useMemo(() => new Map(prospects.map((p) => [p.id, p])), [prospects]);

  // Apply saved order, dropping unknown ids and appending any new prospects.
  const ordered = useMemo(() => {
    const seen = new Set<string>();
    const list: Prospect[] = [];
    for (const id of order) {
      const p = byId.get(id);
      if (p && !seen.has(id)) {
        list.push(p);
        seen.add(id);
      }
    }
    for (const p of prospects) if (!seen.has(p.id)) list.push(p);
    return list;
  }, [order, byId, prospects]);

  const customized = hydrated && ordered.some((p, i) => p.id !== seedOrder[i]);

  function persist(ids: string[]) {
    setOrder(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* storage may be unavailable */
    }
  }

  function move(index: number, dir: -1 | 1) {
    const ids = ordered.map((p) => p.id);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    persist(ids);
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setOrder(seedOrder);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-white/50">
          {customized ? 'Showing your custom rankings.' : 'Showing the seeded rankings.'}
        </p>
        <div className="flex items-center gap-2">
          {customized && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10"
            >
              Reset to seed
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              editing
                ? 'bg-braves-red text-white'
                : 'border border-white/15 text-white/80 hover:bg-white/10'
            }`}
          >
            {editing ? 'Done' : 'Edit rankings'}
          </button>
        </div>
      </div>

      {editing && (
        <p className="mb-3 text-xs text-white/45">
          Use the arrows to re-rank. Changes save in this browser only.
        </p>
      )}

      <ol className="space-y-2">
        {ordered.map((p, i) => (
          <Row
            key={p.id}
            p={p}
            displayRank={i + 1}
            editing={editing}
            isFirst={i === 0}
            isLast={i === ordered.length - 1}
            onMove={(dir) => move(i, dir)}
          />
        ))}
      </ol>
    </div>
  );
}
