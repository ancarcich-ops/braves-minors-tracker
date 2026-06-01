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
