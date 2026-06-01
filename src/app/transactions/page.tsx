import { getTransactions } from '@/lib/transactions';
import { getSelectedTeam } from '@/lib/team-server';
import type { Transaction, TransactionCategory } from '@/lib/types';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import {
  ArrowLeftRight,
  ChevronsUp,
  ChevronsDown,
  Plus,
  HeartPulse,
  FileSignature,
  UserMinus,
  Circle,
  type LucideIcon,
} from 'lucide-react';

// Transactions trickle in through the day.
export const revalidate = 1800;

const CATEGORY: Record<
  TransactionCategory,
  { label: string; icon: LucideIcon; chip: string }
> = {
  promotion: { label: 'Promotion', icon: ChevronsUp, chip: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' },
  demotion: { label: 'Option', icon: ChevronsDown, chip: 'bg-amber-500/15 text-amber-300 ring-amber-500/30' },
  injury: { label: 'Injured List', icon: Plus, chip: 'bg-braves-red/15 text-red-300 ring-braves-red/30' },
  activation: { label: 'Activated', icon: HeartPulse, chip: 'bg-teal-500/15 text-teal-300 ring-teal-500/30' },
  signing: { label: 'Signing', icon: FileSignature, chip: 'bg-sky-500/15 text-sky-300 ring-sky-500/30' },
  release: { label: 'Release', icon: UserMinus, chip: 'bg-rose-500/15 text-rose-300 ring-rose-500/30' },
  trade: { label: 'Trade', icon: ArrowLeftRight, chip: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30' },
  other: { label: 'Move', icon: Circle, chip: 'bg-slate-500/15 text-slate-300 ring-slate-500/30' },
};

function prettyDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function Move({ t }: { t: Transaction }) {
  const meta = CATEGORY[t.category];
  const Icon = meta.icon;
  return (
    <li className="glass glass-hover rounded-2xl p-3.5 shadow-card">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 ${meta.chip}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {t.profileUrl ? (
              <a
                href={t.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-braves-gold"
              >
                {t.player}
              </a>
            ) : (
              <span className="font-semibold text-white">{t.player}</span>
            )}
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${meta.chip}`}>
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{t.description}</p>
          {(t.fromTeam || t.toTeam) && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              {t.fromTeam && <span>{t.fromTeam}</span>}
              {t.fromTeam && t.toTeam && <ArrowLeftRight className="h-3 w-3" />}
              {t.toTeam && <span>{t.toTeam}</span>}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export default async function TransactionsPage() {
  const team = getSelectedTeam();
  const { transactions, isMock } = await getTransactions(30, team);

  // Group by date, newest first (the feed is already sorted).
  const groups: { date: string; moves: Transaction[] }[] = [];
  for (const t of transactions) {
    const last = groups[groups.length - 1];
    if (last && last.date === t.date) last.moves.push(t);
    else groups.push({ date: t.date, moves: [t] });
  }

  return (
    <div>
      <Reveal>
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-braves-red">
              {team.short} · Roster Moves
            </span>
            {isMock && (
              <span className="rounded-full bg-braves-gold/15 px-2 py-0.5 text-[10px] font-semibold text-braves-gold ring-1 ring-braves-gold/30">
                sample data
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Transactions</h1>
          <p className="mt-1 text-sm text-slate-400">
            Promotions, options, IL moves, signings &amp; releases across the system · last 30 days
          </p>
        </div>
      </Reveal>

      {transactions.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="glass rounded-2xl px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-200">No moves lately</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
              No organizational transactions in the last 30 days. Check back as the season heats up.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-8">
          {groups.map(({ date, moves }, i) => (
            <section key={date}>
              <Reveal delay={0.05 * Math.min(i, 4)}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                    {prettyDate(date)}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  <span className="text-xs text-slate-500">
                    {moves.length} move{moves.length > 1 ? 's' : ''}
                  </span>
                </div>
              </Reveal>
              <Stagger className="space-y-2">
                {moves.map((t) => (
                  <StaggerItem key={t.id}>
                    <Move t={t} />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
