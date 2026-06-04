// Core game rules for 162-0, a baseball take on 82-0: each spin lands on a
// team + decade, and you draft one player from that club in that era to fill
// an open position. Every decade can be used only once, so a great team in a
// decade you've already spent is gone — choose which position to spend each
// era on. Fill all nine spots, then simulate a 162-game season.

import { PLAYERS, type Decade, type Player, type Position } from './players';

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

export const DECADES: Decade[] = [
  '1930s',
  '1940s',
  '1950s',
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  '2000s',
  '2010s',
];

// A drafted roster slot.
export interface Pick {
  position: Position;
  player: Player;
}

/** A team+decade the slot machine lands on, with its draftable players. */
export interface Combo {
  team: string;
  decade: Decade;
  players: Player[]; // open-position, unpicked players, best first
}

/**
 * Every team+decade still in play: decade not yet used, at least one unpicked
 * player at an open position. Players are deduped by name to their best season
 * and sorted best-to-worst.
 */
export function eligibleCombos(
  usedDecades: Set<Decade>,
  openPositions: Set<Position>,
  pickedNames: Set<string>,
): Combo[] {
  const byKey = new Map<string, Map<string, Player>>();
  for (const pl of PLAYERS) {
    if (usedDecades.has(pl.decade)) continue;
    if (!openPositions.has(pl.pos)) continue;
    if (pickedNames.has(pl.name)) continue;
    const key = `${pl.team}|${pl.decade}`;
    let names = byKey.get(key);
    if (!names) {
      names = new Map();
      byKey.set(key, names);
    }
    const cur = names.get(pl.name);
    if (!cur || pl.ovr > cur.ovr) names.set(pl.name, pl);
  }

  const combos: Combo[] = [];
  for (const [key, names] of byKey) {
    const [team, decade] = key.split('|') as [string, Decade];
    combos.push({
      team,
      decade,
      players: [...names.values()].sort((a, b) => b.ovr - a.ovr),
    });
  }
  return combos;
}

/** Spin to land on a random eligible team+decade. */
export function spin(
  usedDecades: Set<Decade>,
  openPositions: Set<Position>,
  pickedNames: Set<string>,
  rand: () => number = Math.random,
): Combo | null {
  const combos = eligibleCombos(usedDecades, openPositions, pickedNames);
  if (combos.length === 0) return null;
  return combos[Math.floor(rand() * combos.length)];
}
