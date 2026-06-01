import type {
  HittingStats,
  PitchingStats,
  Prospect,
  ProspectsPayload,
} from './types';
import type { Team } from './teams';
import { getTeamBySlug } from './teams';
import { getAffiliates } from './mlb';
import { mockProspects } from './mock';
import { getSeed, isPitcher, nameKey, prospectId } from './prospectSeed';

const BASE = 'https://statsapi.mlb.com/api/v1';

const useMock = () => process.env.USE_MOCK_DATA === '1';
const season = () => process.env.SEASON || String(new Date().getUTCFullYear());

const DEFAULT_TEAM = getTeamBySlug('braves');

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
  name: string;
  position: string;
  age?: number;
  level: string;
  team: string;
}

const LEVEL_RANK: Record<string, number> = {
  AAA: 0,
  AA: 1,
  'High-A': 2,
  'Low-A': 3,
  Rookie: 4,
  DSL: 5,
};

/** Build a name -> {id, level, team, ...} index across an org's affiliates. */
export async function buildRosterIndex(
  yr: string,
  orgId: number,
): Promise<Map<string, RosterEntry>> {
  const affiliates = await getAffiliates(orgId);
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
              name: p.fullName,
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

/** A team's tracked Top-30 — from a curated seed, or derived from rosters. */
export interface TrackedProspect {
  rank: number;
  name: string;
  position: string;
  isPitcher: boolean;
  id: string;
  mlbamId?: number;
  level?: string;
  team?: string;
  age?: number;
  bats?: string;
  throws?: string;
  eta?: string;
  note?: string;
}

export interface TrackedProspects {
  list: TrackedProspect[];
  curated: boolean;
}

/**
 * Resolve the org's tracked prospects. Curated teams use their hand-seeded
 * Top-30 (matched to live rosters for ids/levels); everyone else gets a list
 * derived from affiliate rosters (youngest at the highest levels).
 */
export async function getTrackedProspects(team: Team): Promise<TrackedProspects> {
  const yr = season();
  const index = await buildRosterIndex(yr, team.id);
  const seed = getSeed(team.slug);

  if (seed) {
    const list = seed.map((s): TrackedProspect => {
      const match = index.get(nameKey(s.name));
      return {
        rank: s.rank,
        name: s.name,
        position: s.position,
        isPitcher: isPitcher(s.position),
        id: prospectId(s.name),
        mlbamId: s.mlbamId ?? match?.id,
        level: match?.level ?? (s.level as string | undefined),
        team: match?.team,
        age: match?.age ?? s.age,
        bats: s.bats,
        throws: s.throws,
        eta: s.eta,
        note: s.note,
      };
    });
    return { list, curated: true };
  }

  // Roster-derived: rank by level (higher first), then by youth.
  const derived = [...index.values()]
    .sort((a, b) => {
      const lr = (LEVEL_RANK[a.level] ?? 9) - (LEVEL_RANK[b.level] ?? 9);
      if (lr !== 0) return lr;
      return (a.age ?? 99) - (b.age ?? 99);
    })
    .slice(0, 30)
    .map((e, i): TrackedProspect => ({
      rank: i + 1,
      name: e.name,
      position: e.position,
      isPitcher: isPitcher(e.position),
      id: prospectId(e.name),
      mlbamId: e.id,
      level: e.level,
      team: e.team,
      age: e.age,
    }));
  return { list: derived, curated: false };
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
export async function fetchSeasonStats(
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

/** A team's Top-30, enriched with live identity + season stats (mock on failure). */
export async function getProspects(team: Team = DEFAULT_TEAM): Promise<ProspectsPayload> {
  if (useMock()) return mockProspects();

  try {
    const yr = season();
    const { list, curated } = await getTrackedProspects(team);
    if (list.length === 0) throw new Error('no prospects resolved');

    const prospects = await Promise.all(
      list.map(async (tp): Promise<Prospect> => {
        const { hitting, pitching } = tp.mlbamId
          ? await fetchSeasonStats(tp.mlbamId, tp.isPitcher, yr)
          : { hitting: null, pitching: null };
        return {
          id: tp.id,
          rank: tp.rank,
          name: tp.name,
          position: tp.position,
          isPitcher: tp.isPitcher,
          bats: tp.bats,
          throws: tp.throws,
          age: tp.age,
          eta: tp.eta,
          level: tp.level,
          team: tp.team,
          mlbamId: tp.mlbamId,
          headshotUrl: tp.mlbamId ? headshotUrl(tp.mlbamId) : undefined,
          profileUrl: tp.mlbamId ? `https://www.mlb.com/player/${tp.mlbamId}` : undefined,
          note: tp.note,
          hitting,
          pitching,
        };
      }),
    );

    return { prospects, season: yr, isMock: false, curated };
  } catch (err) {
    console.error('[prospects] falling back to mock prospects:', err);
    return mockProspects();
  }
}
