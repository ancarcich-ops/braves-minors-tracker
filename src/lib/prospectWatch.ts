import type { Game, ProspectPerformance, ProspectWatch } from './types';
import type { Team } from './teams';
import { getTeamBySlug } from './teams';
import { getScoreboard } from './mlb';
import { nameKey } from './prospectSeed';
import { getTrackedProspects, headshotUrl, type TrackedProspect } from './prospects';
import { mockProspectWatch } from './mock';

const BASE = 'https://statsapi.mlb.com/api/v1';
const useMock = () => process.env.USE_MOCK_DATA === '1';

const DEFAULT_TEAM = getTeamBySlug('braves');

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`MLB API ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

const ipToNumber = (ip: string | number | undefined): number => {
  const [w, f] = String(ip ?? '0').split('.');
  return parseInt(w || '0', 10) + parseInt(f || '0', 10) / 3;
};

/** Did this batting line clear the "notable" bar? */
function hitterLine(b: any): string | null {
  const h = b.hits ?? 0;
  const ab = b.atBats ?? 0;
  const hr = b.homeRuns ?? 0;
  const doubles = b.doubles ?? 0;
  const triples = b.triples ?? 0;
  const rbi = b.rbi ?? 0;
  const bb = b.baseOnBalls ?? 0;
  const sb = b.stolenBases ?? 0;
  const xbh = doubles + triples + hr;

  const notable = hr >= 1 || h >= 3 || rbi >= 3 || (h >= 2 && xbh >= 1) || sb >= 2;
  if (!notable) return null;

  const parts = [`${h}-${ab}`];
  if (hr) parts.push(hr > 1 ? `${hr} HR` : 'HR');
  if (triples) parts.push(triples > 1 ? `${triples} 3B` : '3B');
  if (doubles) parts.push(doubles > 1 ? `${doubles} 2B` : '2B');
  if (rbi) parts.push(`${rbi} RBI`);
  if (bb) parts.push(`${bb} BB`);
  if (sb) parts.push(`${sb} SB`);
  return parts.join(', ');
}

/** Did this pitching line clear the "notable" bar? */
function pitcherLine(p: any): string | null {
  const ip = ipToNumber(p.inningsPitched);
  const er = p.earnedRuns ?? 0;
  const so = p.strikeOuts ?? 0;
  const h = p.hits ?? 0;
  const bb = p.baseOnBalls ?? 0;
  const saves = p.saves ?? 0;

  const notable = (ip >= 5 && er <= 2) || so >= 7 || (saves >= 1 && er === 0);
  if (!notable) return null;

  const parts = [`${p.inningsPitched ?? ip} IP`, `${er} ER`, `${so} K`];
  if (h) parts.push(`${h} H`);
  if (bb) parts.push(`${bb} BB`);
  if (saves) parts.push('SV');
  return parts.join(', ');
}

/** Best-effort: a video/recap URL keyed to this player, if the game has one. */
async function findHighlight(gamePk: number, playerId: number): Promise<string | undefined> {
  try {
    const data = await getJSON<any>(`${BASE}/game/${gamePk}/content`);
    const buckets = [
      data?.highlights?.highlights?.items,
      data?.highlights?.live?.items,
      data?.media?.epg,
    ].filter(Array.isArray) as any[][];

    for (const items of buckets) {
      for (const item of items) {
        const keywords: any[] = item?.keywordsAll || item?.keywords || [];
        const mentionsPlayer = keywords.some(
          (k) => k?.type === 'player_id' && String(k?.value) === String(playerId),
        );
        if (!mentionsPlayer) continue;
        const playbacks: any[] = item?.playbacks || [];
        const mp4 = playbacks.find((pb) => /mp4/i.test(pb?.name || pb?.url || ''));
        const url = mp4?.url || playbacks[0]?.url;
        if (url) return url;
      }
    }
  } catch {
    /* content endpoint is flaky; fall back to Gameday */
  }
  return undefined;
}

function bravesSide(game: Game): 'home' | 'away' | null {
  if (game.home.isBraves) return 'home';
  if (game.away.isBraves) return 'away';
  return null;
}

/**
 * Tracked Top-30 prospects who had a notable game in today's slate, with their
 * rank, a stat line, and a link to video/recap when available. Live from
 * boxscores; degrades to mock.
 */
export async function getProspectWatch(
  date: string,
  team: Team = DEFAULT_TEAM,
): Promise<ProspectWatch> {
  if (useMock()) return mockProspectWatch(date);

  try {
    const [{ games }, { list }] = await Promise.all([
      getScoreboard(date, team.id),
      getTrackedProspects(team),
    ]);
    const played = games.filter((g) => g.state === 'live' || g.state === 'final');
    // Match boxscore players to this org's tracked prospects.
    const byKey = new Map<string, TrackedProspect>(list.map((p) => [nameKey(p.name), p]));

    const performances: ProspectPerformance[] = [];

    await Promise.all(
      played.map(async (game) => {
        try {
          const box = await getJSON<any>(`${BASE}/game/${game.gamePk}/boxscore`);
          // Scan both sides; only this org's tracked prospects will match.
          for (const sideKey of ['home', 'away'] as const) {
            const players = box?.teams?.[sideKey]?.players ?? {};
            const opponent =
              sideKey === 'home' ? game.away.name : game.home.name;
            for (const key of Object.keys(players)) {
              const pl = players[key];
              const fullName: string = pl?.person?.fullName ?? '';
              const tracked = byKey.get(nameKey(fullName));
              if (!tracked) continue;

              const pitcher = tracked.isPitcher;
              const line = pitcher
                ? pitcherLine(pl?.stats?.pitching ?? {})
                : hitterLine(pl?.stats?.batting ?? {});
              if (!line) continue;

              const playerId: number | undefined = pl?.person?.id;
              const highlightUrl = playerId
                ? await findHighlight(game.gamePk, playerId)
                : undefined;

              performances.push({
                id: tracked.id,
                name: tracked.name,
                rank: tracked.rank,
                position: tracked.position,
                isPitcher: pitcher,
                level: game.level,
                team: game.affiliateName,
                opponent,
                line,
                profileUrl: playerId ? `https://www.mlb.com/player/${playerId}` : undefined,
                headshotUrl: playerId ? headshotUrl(playerId) : undefined,
                highlightUrl,
                gamedayUrl: `https://www.mlb.com/gameday/${game.gamePk}`,
              });
            }
          }
        } catch (err) {
          console.error(`[prospectWatch] boxscore failed for ${game.gamePk}:`, err);
        }
      }),
    );

    // Best games first by rank (lower = better prospect).
    performances.sort((a, b) => a.rank - b.rank);
    return { date, performances, isMock: false };
  } catch (err) {
    console.error('[prospectWatch] falling back to mock:', err);
    return mockProspectWatch(date);
  }
}
