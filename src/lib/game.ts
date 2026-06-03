// Core game rules for 162-0, a baseball take on 82-0: spin a franchise, draft
// one player from it to fill one open position, then spin a new franchise and
// choose from the remaining positions — until all nine spots are filled. The
// catch: you only get one player per spin, so a stacked club forces you to
// decide which position to spend it on.

import { PLAYERS, TEAM_NAMES, type Player, type Position } from './players';

// The nine roster positions (display order in the lineup bar).
export const POSITIONS: Position[] = ['SP', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];

export const POSITION_NAMES: Record<Position, string> = {
  SP: 'Starting Pitcher',
  C: 'Catcher',
  '1B': 'First Base',
  '2B': 'Second Base',
  '3B': 'Third Base',
  SS: 'Shortstop',
  LF: 'Left Field',
  CF: 'Center Field',
  RF: 'Right Field',
};

// A drafted roster slot.
export interface Pick {
  position: Position;
  player: Player;
}

// Fold historical clubs into their modern franchise so a single spin spans the
// whole history (e.g. Koufax, Robinson, Piazza and Kershaw all "Dodgers").
const FRANCHISE: Record<string, string> = {
  BRO: 'LAD',
  NYG: 'SF',
  BSN: 'ATL',
  MLN: 'ATL',
  PHA: 'OAK',
  WSH: 'MIN',
  MON: 'WSN',
  CAL: 'LAA',
};

export function franchiseOf(team: string): string {
  return FRANCHISE[team] ?? team;
}

// Display names for canonical franchises (overrides the era-specific labels).
export const FRANCHISE_NAMES: Record<string, string> = {
  ...TEAM_NAMES,
  LAD: 'Dodgers',
  SF: 'Giants',
  ATL: 'Braves',
  OAK: 'Athletics',
  MIN: 'Twins',
  WSN: 'Nationals',
  LAA: 'Angels',
};

// Every franchise that has at least one player in the dataset.
export const FRANCHISE_CODES: string[] = [
  ...new Set(PLAYERS.map((p) => franchiseOf(p.team))),
];

/**
 * The players a franchise can offer right now: those at still-open positions
 * whose name hasn't already been drafted, deduped to each player's best season.
 */
export function franchiseRoster(
  franchise: string,
  openPositions: Set<Position>,
  pickedNames: Set<string>,
): Player[] {
  const byName = new Map<string, Player>();
  for (const pl of PLAYERS) {
    if (franchiseOf(pl.team) !== franchise) continue;
    if (!openPositions.has(pl.pos)) continue;
    if (pickedNames.has(pl.name)) continue;
    const cur = byName.get(pl.name);
    if (!cur || pl.ovr > cur.ovr) byName.set(pl.name, pl);
  }
  return [...byName.values()].sort((a, b) => b.ovr - a.ovr);
}

/** Franchises that can still fill at least one open position. */
export function fillableFranchises(
  openPositions: Set<Position>,
  pickedNames: Set<string>,
): string[] {
  return FRANCHISE_CODES.filter(
    (f) => franchiseRoster(f, openPositions, pickedNames).length > 0,
  );
}

/**
 * Spin for a franchise. Prefers clubs not yet used this game (so you keep
 * getting new teams), falling back to any fillable club if needed — which
 * guarantees the draft can always be completed.
 */
export function spinFranchise(
  openPositions: Set<Position>,
  pickedNames: Set<string>,
  usedFranchises: Set<string>,
  rand: () => number = Math.random,
): string | null {
  const fillable = fillableFranchises(openPositions, pickedNames);
  if (fillable.length === 0) return null;
  const fresh = fillable.filter((f) => !usedFranchises.has(f));
  const pool = fresh.length > 0 ? fresh : fillable;
  return pool[Math.floor(rand() * pool.length)];
}
