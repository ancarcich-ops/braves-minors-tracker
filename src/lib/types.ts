// Shared domain types for the Braves minor-league tracker.

export type Level = 'AAA' | 'AA' | 'High-A' | 'Low-A' | 'Rookie' | 'DSL';

export interface Affiliate {
  teamId: number;
  name: string;
  level: Level;
  sportId: number;
}

export type GameState = 'scheduled' | 'live' | 'final' | 'other';

export interface GameSide {
  name: string;
  abbreviation: string;
  runs: number | null;
  isBraves: boolean;
}

export interface Game {
  gamePk: number;
  state: GameState;
  detailedState: string;
  startTimeUTC: string | null;
  /** e.g. "Top 7", "Bot 3", "F", "F/10". Empty for scheduled games. */
  inning: string;
  level: Level;
  affiliateName: string;
  home: GameSide;
  away: GameSide;
}

export interface Scoreboard {
  date: string; // YYYY-MM-DD
  games: Game[];
  /** True when the data came from the offline mock instead of the live API. */
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Prospects
// ---------------------------------------------------------------------------

/**
 * A hand-maintained Top-30 entry. This is the *seed*: rank + scouting bio that
 * the app ships with and that users can re-rank. Live data (ids, level, stats)
 * is layered on top at request time.
 */
export interface ProspectSeed {
  rank: number;
  name: string;
  /** Primary position abbreviation, e.g. 'SS', 'OF', 'RHP', 'LHP', 'C'. */
  position: string;
  bats?: string; // 'L' | 'R' | 'S'
  throws?: string; // 'L' | 'R'
  age?: number;
  /** Expected MLB arrival, e.g. '2027'. */
  eta?: string;
  /** Seeded current level; refined from the live roster when available. */
  level?: Level | string;
  /** MLB Stats API person id, when known. Otherwise resolved by name. */
  mlbamId?: number;
  /** One-line scouting note. */
  note?: string;
}

export interface HittingStats {
  games: number;
  avg: string;
  obp: string;
  slg: string;
  ops: string;
  hr: number;
  rbi: number;
  sb: number;
}

export interface PitchingStats {
  games: number;
  w: number;
  l: number;
  era: string;
  whip: string;
  ip: string;
  so: number;
  bb: number;
}

/** A seed enriched with live identity + season stats (or mock equivalents). */
export interface Prospect {
  /** Stable slug used as a React key and for persisted re-ordering. */
  id: string;
  rank: number;
  name: string;
  position: string;
  isPitcher: boolean;
  bats?: string;
  throws?: string;
  age?: number;
  eta?: string;
  level?: Level | string;
  team?: string;
  mlbamId?: number;
  headshotUrl?: string;
  profileUrl?: string;
  note?: string;
  hitting: HittingStats | null;
  pitching: PitchingStats | null;
}

export interface ProspectsPayload {
  prospects: Prospect[];
  season: string;
  /** True for a hand-curated Top-30; false for a roster-derived fallback list. */
  curated?: boolean;
  /** True when stats/identity came from the offline mock instead of the API. */
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

/** Normalized buckets we color-code the feed by. */
export type TransactionCategory =
  | 'promotion'
  | 'demotion'
  | 'injury'
  | 'activation'
  | 'signing'
  | 'release'
  | 'trade'
  | 'other';

export interface Transaction {
  id: string;
  /** Effective date, YYYY-MM-DD. */
  date: string;
  player: string;
  playerId?: number;
  profileUrl?: string;
  /** MLB Stats API type code, e.g. 'OPT', 'RCL', 'SC'. */
  typeCode: string;
  typeDesc: string;
  description: string;
  fromTeam?: string;
  toTeam?: string;
  category: TransactionCategory;
}

export interface TransactionsFeed {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  transactions: Transaction[];
  /** True when the data came from the offline mock instead of the live API. */
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Risers & Slumpers
// ---------------------------------------------------------------------------

export type MoverDirection = 'riser' | 'slumper';

/**
 * A tracked player whose recent stretch diverges from their season baseline.
 * Computed from game-by-game logs (no stored history needed).
 */
export interface Mover {
  id: string;
  name: string;
  position: string;
  isPitcher: boolean;
  level?: Level | string;
  team?: string;
  mlbamId?: number;
  headshotUrl?: string;
  profileUrl?: string;
  direction: MoverDirection;
  /** Number of games in the recent window actually used. */
  window: number;
  /** Headline metric we trend on: 'OPS' for hitters, 'ERA' for pitchers. */
  metricLabel: string;
  recentMetric: string;
  seasonMetric: string;
  /** Signed, formatted delta of the headline metric (recent vs season). */
  delta: string;
  /** Unitless, direction-aware trend score; positive = hot, negative = cold. */
  score: number;
  /** Compact slash/rate line for the recent window. */
  recentLine: string;
  /** Compact slash/rate line for the season. */
  seasonLine: string;
}

export interface MoversPayload {
  risers: Mover[];
  slumpers: Mover[];
  /** Size of the rolling recent window, in games. */
  windowSize: number;
  season: string;
  /** True when the data came from the offline mock instead of the live API. */
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Prospect Watch (notable performances in today's games)
// ---------------------------------------------------------------------------

export interface ProspectPerformance {
  id: string;
  name: string;
  /** Seed Top-30 rank. */
  rank: number;
  position: string;
  isPitcher: boolean;
  level: Level | string;
  team: string;
  opponent?: string;
  /** Compact game line, e.g. "3-4, HR, 2B, 3 RBI" or "6.0 IP, 1 ER, 8 K". */
  line: string;
  profileUrl?: string;
  headshotUrl?: string;
  /** Direct video/recap link when one is available. */
  highlightUrl?: string;
  /** Always-available fallback link to the game. */
  gamedayUrl: string;
}

export interface ProspectWatch {
  date: string; // YYYY-MM-DD
  performances: ProspectPerformance[];
  /** True when the data came from the offline mock instead of the live API. */
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Global Top 100
// ---------------------------------------------------------------------------

export interface Top100Prospect {
  id: string;
  rank: number;
  name: string;
  position: string;
  isPitcher: boolean;
  teamSlug: string;
  teamShort: string;
  level?: Level | string;
  eta?: string;
  mlbamId?: number;
  headshotUrl?: string;
  profileUrl?: string;
  hitting: HittingStats | null;
  pitching: PitchingStats | null;
}

export interface Top100Payload {
  prospects: Top100Prospect[];
  season: string;
  isMock: boolean;
}
