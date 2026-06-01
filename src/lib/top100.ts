import type { Top100Payload, Top100Prospect } from './types';
import { getTeamBySlug } from './teams';
import { isPitcher, nameKey, prospectId } from './prospectSeed';
import { buildRosterIndex, fetchSeasonStats, headshotUrl } from './prospects';
import { TOP100_SEED } from './top100Seed';
import { mockTop100 } from './mock';

const useMock = () => process.env.USE_MOCK_DATA === '1';
const season = () => process.env.SEASON || String(new Date().getUTCFullYear());

/**
 * The seeded global Top-100, enriched with each player's live id, level, and
 * season stats. Players are grouped by org so each roster index is built once.
 * Falls back to mock on failure.
 */
export async function getTop100(): Promise<Top100Payload> {
  if (useMock()) return mockTop100();

  try {
    const yr = season();
    const slugs = Array.from(new Set(TOP100_SEED.map((s) => s.team)));

    // One roster index per org (cached by the fetch layer).
    const indexBySlug = new Map<string, Awaited<ReturnType<typeof buildRosterIndex>>>();
    await Promise.all(
      slugs.map(async (slug) => {
        try {
          const team = getTeamBySlug(slug);
          indexBySlug.set(slug, await buildRosterIndex(yr, team.id));
        } catch (err) {
          console.error(`[top100] roster index failed for ${slug}:`, err);
        }
      }),
    );

    const prospects = await Promise.all(
      TOP100_SEED.map(async (s): Promise<Top100Prospect> => {
        const team = getTeamBySlug(s.team);
        const match = indexBySlug.get(s.team)?.get(nameKey(s.name));
        const id = match?.id;
        const pitcher = isPitcher(s.position);
        const { hitting, pitching } = id
          ? await fetchSeasonStats(id, pitcher, yr)
          : { hitting: null, pitching: null };

        return {
          id: prospectId(s.name),
          rank: s.rank,
          name: s.name,
          position: s.position,
          isPitcher: pitcher,
          teamSlug: s.team,
          teamShort: team.short,
          level: match?.level,
          eta: s.eta,
          mlbamId: id,
          headshotUrl: id ? headshotUrl(id) : undefined,
          profileUrl: id ? `https://www.mlb.com/player/${id}` : undefined,
          hitting,
          pitching,
        };
      }),
    );

    prospects.sort((a, b) => a.rank - b.rank);
    return { prospects, season: yr, isMock: false };
  } catch (err) {
    console.error('[top100] falling back to mock:', err);
    return mockTop100();
  }
}
