import type {
  HittingStats,
  PitchingStats,
  Prospect,
  ProspectsPayload,
} from './types';
import { getAffiliates } from './mlb';
import { mockProspects } from './mock';
import { PROSPECT_SEED, isPitcher, nameKey, prospectId } from './prospectSeed';

const BASE = 'https://statsapi.mlb.com/api/v1';

const useMock = () => process.env.USE_MOCK_DATA === '1';
const season = () => process.env.SEASON || String(new Date().getUTCFullYear());

export function headshotUrl(id: number): string {
  return (
    'https://img.mlbstatic.com/mlb-photos/image/upload/' +
    'd_people:generic:headshot:67:current.png/w_240,q_auto:best/' +
    `v1/people/${id}/headshot/67/current`
  );
}

async function getJSON<T>(url: string): Promise<T> {
  // Prospect stats refresh a few times a day; cache for 15 minutes.
  const res = await fetch(url, { next: { revalidate: 900 } });
  if (!res.ok) throw new Error(`MLB API ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

export interface RosterEntry {
  id: number;
  position: string;
  age?: number;
  level: string;
  team: string;
}

/** Build a name -> {id, level, team, ...} index across every Braves affiliate. */
export async function buildRosterIndex(yr: string): Promise<Map<string, RosterEntry>> {
  const affiliates = await getAffiliates();
  const index = new Map<string, RosterEntry>();
  await Promise.all(
    affiliates.map(async (a) => {
      try {
        const url = `${BASE}/teams/${a.teamId}/roster?rosterType=fullSeason&season=${yr}&hydrate=person`;
        const data = await getJSON<{ roster?: any[] }>(url);
        for (const r of data.roster || []) {
          const p = r.person;
          if (!p?.id || !p?.fullName) continue;
          // First affiliate wins; affiliates come highest-level first.
          const key = nameKey(p.fullName);
          if (!index.has(key)) {
            index.set(key, {
              id: p.id,
              position: r.position?.abbreviation || p.primaryPosition?.abbreviation || '',
              age: p.currentAge,
              level: a.level,
              team: a.name,
            });
          }
        }
      } catch (err) {
        // One affiliate failing shouldn't sink the whole board.
        console.error(`[prospects] roster fetch failed for ${a.name}:`, err);
      }
    }),
  );
  return index;
}

function mapHitting(stat: any): HittingStats {
  return {
    games: stat.gamesPlayed ?? 0,
    avg: stat.avg ?? '.000',
    obp: stat.obp ?? '.000',
    slg: stat.slg ?? '.000',
    ops: stat.ops ?? '.000',
    hr: stat.homeRuns ?? 0,
    rbi: stat.rbi ?? 0,
    sb: stat.stolenBases ?? 0,
  };
}

function mapPitching(stat: any): PitchingStats {
  return {
    games: stat.gamesPlayed ?? 0,
    w: stat.wins ?? 0,
    l: stat.losses ?? 0,
    era: stat.era ?? '-.--',
    whip: stat.whip ?? '-.--',
    ip: stat.inningsPitched ?? '0.0',
    so: stat.strikeOuts ?? 0,
    bb: stat.baseOnBalls ?? 0,
  };
}

/** Pull a player's season line, picking the split with the most playing time. */
async function fetchStats(
  id: number,
  pitcher: boolean,
  yr: string,
): Promise<{ hitting: HittingStats | null; pitching: PitchingStats | null }> {
  const group = pitcher ? 'pitching' : 'hitting';
  try {
    const url = `${BASE}/people/${id}/stats?stats=season&season=${yr}&group=${group}&sportIds=11,12,13,14,16`;
    const data = await getJSON<{ stats?: { splits?: any[] }[] }>(url);
    const splits = data.stats?.[0]?.splits ?? [];
    if (splits.length === 0) return { hitting: null, pitching: null };
    // A player can have lines at multiple levels; show the busiest one.
    const best = splits.reduce((a, b) =>
      (b?.stat?.gamesPlayed ?? 0) > (a?.stat?.gamesPlayed ?? 0) ? b : a,
    );
    const stat = best?.stat;
    if (!stat) return { hitting: null, pitching: null };
    return pitcher
      ? { hitting: null, pitching: mapPitching(stat) }
      : { hitting: mapHitting(stat), pitching: null };
  } catch (err) {
    console.error(`[prospects] stats fetch failed for ${id}:`, err);
    return { hitting: null, pitching: null };
  }
}

/** The seeded Top-30, enriched with live identity + 2026 stats (mock on failure). */
export async function getProspects(): Promise<ProspectsPayload> {
  if (useMock()) return mockProspects();

  try {
    const yr = season();
    const index = await buildRosterIndex(yr);

    const prospects = await Promise.all(
      PROSPECT_SEED.map(async (seed): Promise<Prospect> => {
        const match = index.get(nameKey(seed.name));
        const id = seed.mlbamId ?? match?.id;
        const pitcher = isPitcher(seed.position);
        const { hitting, pitching } = id
          ? await fetchStats(id, pitcher, yr)
          : { hitting: null, pitching: null };

        return {
          id: prospectId(seed.name),
          rank: seed.rank,
          name: seed.name,
          position: seed.position,
          isPitcher: pitcher,
          bats: seed.bats,
          throws: seed.throws,
          age: match?.age ?? seed.age,
          eta: seed.eta,
          level: match?.level ?? seed.level,
          team: match?.team,
          mlbamId: id,
          headshotUrl: id ? headshotUrl(id) : undefined,
          profileUrl: id ? `https://www.mlb.com/player/${id}` : undefined,
          note: seed.note,
          hitting,
          pitching,
        };
      }),
    );

    return { prospects, season: yr, isMock: false };
  } catch (err) {
    console.error('[prospects] falling back to mock prospects:', err);
    return mockProspects();
  }
}
