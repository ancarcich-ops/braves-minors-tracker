import type { Mover, MoversPayload } from './types';
import { PROSPECT_SEED, isPitcher, nameKey, prospectId } from './prospectSeed';
import { buildRosterIndex, headshotUrl } from './prospects';
import { mockMovers } from './mock';

const BASE = 'https://statsapi.mlb.com/api/v1';

const useMock = () => process.env.USE_MOCK_DATA === '1';
const season = () => process.env.SEASON || String(new Date().getUTCFullYear());

// Rolling window (in games) the "recent" form is measured over.
export const WINDOW = 15;

// Minimum sample sizes so a 2-for-3 night doesn't masquerade as a trend.
const MIN_SEASON_GAMES = 12;
const MIN_WINDOW_GAMES = 6;
// A move must clear this normalized score to count as hot/cold.
const SCORE_THRESHOLD = 0.4;

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`MLB API ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

// --- small stat helpers -----------------------------------------------------

const fmt3 = (v: number) => (Number.isFinite(v) ? v.toFixed(3).replace(/^0/, '') : '.000');
const fmt2 = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : '-.--');

/** "5.1" innings -> outs (16). */
function ipToOuts(ip: string | number | undefined): number {
  if (ip == null) return 0;
  const s = String(ip);
  const [whole, frac] = s.split('.');
  return parseInt(whole || '0', 10) * 3 + parseInt(frac || '0', 10);
}

/** outs -> "5.1" innings. */
function outsToIp(outs: number): string {
  return `${Math.floor(outs / 3)}.${outs % 3}`;
}

interface HitAgg {
  g: number;
  ab: number;
  h: number;
  bb: number;
  hbp: number;
  sf: number;
  tb: number;
  hr: number;
  rbi: number;
  sb: number;
}
interface PitchAgg {
  g: number;
  outs: number;
  er: number;
  h: number;
  bb: number;
  so: number;
}

const num = (v: any) => (typeof v === 'number' ? v : parseInt(v, 10) || 0);

function aggHitting(stats: any[]): HitAgg {
  const a: HitAgg = { g: 0, ab: 0, h: 0, bb: 0, hbp: 0, sf: 0, tb: 0, hr: 0, rbi: 0, sb: 0 };
  for (const s of stats) {
    a.g += 1;
    a.ab += num(s.atBats);
    a.h += num(s.hits);
    a.bb += num(s.baseOnBalls);
    a.hbp += num(s.hitByPitch);
    a.sf += num(s.sacFlies);
    a.hr += num(s.homeRuns);
    a.rbi += num(s.rbi);
    a.sb += num(s.stolenBases);
    a.tb += s.totalBases != null
      ? num(s.totalBases)
      : num(s.hits) + num(s.doubles) + 2 * num(s.triples) + 3 * num(s.homeRuns);
  }
  return a;
}

function hitRates(a: HitAgg) {
  const avg = a.ab ? a.h / a.ab : 0;
  const obpDen = a.ab + a.bb + a.hbp + a.sf;
  const obp = obpDen ? (a.h + a.bb + a.hbp) / obpDen : 0;
  const slg = a.ab ? a.tb / a.ab : 0;
  return { avg, obp, slg, ops: obp + slg };
}

function aggPitching(stats: any[]): PitchAgg {
  const a: PitchAgg = { g: 0, outs: 0, er: 0, h: 0, bb: 0, so: 0 };
  for (const s of stats) {
    a.g += 1;
    a.outs += ipToOuts(s.inningsPitched);
    a.er += num(s.earnedRuns);
    a.h += num(s.hits);
    a.bb += num(s.baseOnBalls);
    a.so += num(s.strikeOuts);
  }
  return a;
}

function pitchRates(a: PitchAgg) {
  const ip = a.outs / 3;
  const era = ip ? (9 * a.er) / ip : 0;
  const whip = ip ? (a.bb + a.h) / ip : 0;
  return { ip, era, whip };
}

// --- per-player trend --------------------------------------------------------

interface SeedMatch {
  id: number;
  position: string;
  level: string;
  team: string;
}

async function computeMover(
  seed: (typeof PROSPECT_SEED)[number],
  match: SeedMatch,
  yr: string,
): Promise<Mover | null> {
  const pitcher = isPitcher(seed.position);
  const group = pitcher ? 'pitching' : 'hitting';
  const url = `${BASE}/people/${match.id}/stats?stats=gameLog&season=${yr}&group=${group}&sportIds=11,12,13,14,16`;

  let splits: any[];
  try {
    const data = await getJSON<{ stats?: { splits?: any[] }[] }>(url);
    splits = data.stats?.[0]?.splits ?? [];
  } catch {
    return null;
  }
  if (splits.length < MIN_SEASON_GAMES) return null;

  // Game logs come oldest-first; the recent window is the tail.
  const recent = splits.slice(-WINDOW);
  if (recent.length < MIN_WINDOW_GAMES) return null;

  const base = {
    id: prospectId(seed.name),
    name: seed.name,
    position: seed.position,
    isPitcher: pitcher,
    level: match.level,
    team: match.team,
    mlbamId: match.id,
    headshotUrl: headshotUrl(match.id),
    profileUrl: `https://www.mlb.com/player/${match.id}`,
    window: recent.length,
  };

  if (!pitcher) {
    const seasonR = hitRates(aggHitting(splits.map((s) => s.stat)));
    const recentR = hitRates(aggHitting(recent.map((s) => s.stat)));
    const diff = recentR.ops - seasonR.ops;
    const score = diff / 0.15; // ~150 pts of OPS ≈ one unit
    if (Math.abs(score) < SCORE_THRESHOLD) return null;
    const rA = aggHitting(recent.map((s) => s.stat));
    return {
      ...base,
      direction: score >= 0 ? 'riser' : 'slumper',
      metricLabel: 'OPS',
      recentMetric: fmt3(recentR.ops),
      seasonMetric: fmt3(seasonR.ops),
      delta: `${diff >= 0 ? '+' : '−'}${fmt3(Math.abs(diff))}`,
      score,
      recentLine: `${fmt3(recentR.avg)}/${fmt3(recentR.obp)}/${fmt3(recentR.slg)} · ${rA.hr} HR`,
      seasonLine: `${fmt3(seasonR.avg)}/${fmt3(seasonR.obp)}/${fmt3(seasonR.slg)}`,
    };
  }

  const seasonA = aggPitching(splits.map((s) => s.stat));
  const recentA = aggPitching(recent.map((s) => s.stat));
  const seasonR = pitchRates(seasonA);
  const recentR = pitchRates(recentA);
  const diff = seasonR.era - recentR.era; // positive = ERA dropped = hot
  const score = diff / 1.5;
  if (Math.abs(score) < SCORE_THRESHOLD) return null;
  return {
    ...base,
    direction: score >= 0 ? 'riser' : 'slumper',
    metricLabel: 'ERA',
    recentMetric: fmt2(recentR.era),
    seasonMetric: fmt2(seasonR.era),
    delta: `${diff >= 0 ? '−' : '+'}${fmt2(Math.abs(diff))}`,
    score,
    recentLine: `${fmt2(recentR.era)} ERA · ${fmt2(recentR.whip)} WHIP · ${recentA.so} K / ${outsToIp(recentA.outs)} IP`,
    seasonLine: `${fmt2(seasonR.era)} ERA · ${fmt2(seasonR.whip)} WHIP`,
  };
}

/**
 * Who's hot and who's cold among tracked prospects — recent form (last
 * {@link WINDOW} games) vs. season baseline, computed live from game logs.
 * No stored history required. Falls back to mock on failure.
 */
export async function getMovers(): Promise<MoversPayload> {
  if (useMock()) return mockMovers();

  try {
    const yr = season();
    const index = await buildRosterIndex(yr);

    const results = await Promise.all(
      PROSPECT_SEED.map(async (seed) => {
        const match = index.get(nameKey(seed.name)) ?? null;
        const id = seed.mlbamId ?? match?.id;
        if (!id) return null;
        return computeMover(
          seed,
          {
            id,
            position: match?.position ?? seed.position,
            level: match?.level ?? String(seed.level ?? ''),
            team: match?.team ?? '',
          },
          yr,
        );
      }),
    );

    const movers = results.filter((m): m is Mover => m !== null);
    const risers = movers
      .filter((m) => m.direction === 'riser')
      .sort((a, b) => b.score - a.score);
    const slumpers = movers
      .filter((m) => m.direction === 'slumper')
      .sort((a, b) => a.score - b.score);

    if (risers.length === 0 && slumpers.length === 0) {
      throw new Error('no movers computed');
    }
    return { risers, slumpers, windowSize: WINDOW, season: yr, isMock: false };
  } catch (err) {
    console.error('[movers] falling back to mock:', err);
    return mockMovers();
  }
}
