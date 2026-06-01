import type { Transaction, TransactionCategory, TransactionsFeed } from './types';
import type { Team } from './teams';
import { getTeamBySlug } from './teams';
import { getAffiliates } from './mlb';
import { mockTransactions } from './mock';

const BASE = 'https://statsapi.mlb.com/api/v1';

const DEFAULT_TEAM = getTeamBySlug('braves');

const useMock = () => process.env.USE_MOCK_DATA === '1';

/** Today's date (YYYY-MM-DD) in US Eastern, where the Braves system plays. */
export function easternToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Shift a YYYY-MM-DD date back by n days, staying in YYYY-MM-DD form. */
export function daysBefore(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function getJSON<T>(url: string): Promise<T> {
  // Transactions trickle in through the day; cache for 30 minutes.
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`MLB API ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

/** Bucket a raw transaction into a color-coded category. */
export function categorize(code: string, desc: string, text: string): TransactionCategory {
  const c = (code || '').toUpperCase();
  const s = `${desc} ${text}`.toLowerCase();

  if (/activated|reinstated/.test(s)) return 'activation';
  if (/injured list|disabled list|\bil\b|\b(7|10|15|60)-day\b/.test(s)) return 'injury';
  if (c === 'TR' || /\btrade(d)?\b/.test(s)) return 'trade';
  if (c === 'REL' || /released/.test(s)) return 'release';
  if (c === 'DES' || /designated for assignment|sent outright|outrighted/.test(s)) return 'release';
  if (c === 'SFA' || /\bsigned\b/.test(s)) return 'signing';
  if (c === 'RCL' || c === 'SE' || /recalled|selected the contract|promoted/.test(s)) return 'promotion';
  if (c === 'OPT' || c === 'ASG' || /optioned|assigned|sent .* to/.test(s)) return 'demotion';
  return 'other';
}

function mapTransaction(t: any): Transaction | null {
  const date = t.effectiveDate || t.date || t.resolutionDate;
  if (!date) return null;
  const person = t.person;
  return {
    id: String(t.id),
    date: String(date).slice(0, 10),
    player: person?.fullName ?? 'Unknown',
    playerId: person?.id,
    profileUrl: person?.id ? `https://www.mlb.com/player/${person.id}` : undefined,
    typeCode: t.typeCode ?? '',
    typeDesc: t.typeDesc ?? '',
    description: t.description ?? t.typeDesc ?? '',
    fromTeam: t.fromTeam?.name,
    toTeam: t.toTeam?.name,
    category: categorize(t.typeCode, t.typeDesc, t.description),
  };
}

/**
 * Recent transactions across the whole Braves organization — the parent club
 * plus every minor-league affiliate — so promotions, demotions, IL moves,
 * signings and releases all show up. Falls back to mock on any failure.
 */
export async function getTransactions(
  days = 30,
  team: Team = DEFAULT_TEAM,
): Promise<TransactionsFeed> {
  const endDate = easternToday();
  const startDate = daysBefore(endDate, days);

  if (useMock()) return mockTransactions(startDate, endDate);

  try {
    const affiliates = await getAffiliates(team.id);
    const teamIds = [team.id, ...affiliates.map((a) => a.teamId)];

    // The same move can appear under both the parent and affiliate; dedupe by id.
    const byId = new Map<string, Transaction>();
    await Promise.all(
      teamIds.map(async (id) => {
        try {
          const url = `${BASE}/transactions?teamId=${id}&startDate=${startDate}&endDate=${endDate}`;
          const data = await getJSON<{ transactions?: any[] }>(url);
          for (const raw of data.transactions || []) {
            const tx = mapTransaction(raw);
            if (tx) byId.set(tx.id, tx);
          }
        } catch (err) {
          console.error(`[transactions] fetch failed for team ${id}:`, err);
        }
      }),
    );

    if (byId.size === 0) {
      // Nothing came back (likely all calls failed) — show the mock instead.
      throw new Error('no transactions returned');
    }

    const transactions = [...byId.values()].sort(
      (a, b) => b.date.localeCompare(a.date) || a.player.localeCompare(b.player),
    );
    return { startDate, endDate, transactions, isMock: false };
  } catch (err) {
    console.error('[transactions] falling back to mock:', err);
    return mockTransactions(startDate, endDate);
  }
}
