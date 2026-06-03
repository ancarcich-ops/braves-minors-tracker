// Core game rules for 162-0: round order, decades, and the slot-machine /
// eligibility logic that mirrors 82-0's "spin a team + decade, draft a player"
// loop with a one-player-per-decade constraint.

import { PLAYERS, type Decade, type Player, type Position } from './players';

// Roster is filled one position per round, in this order.
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

/** A team+decade pairing the slot machine can land on for the current round. */
export interface Combo {
  team: string;
  decade: Decade;
  players: Player[]; // eligible players at this team/decade/position
}

/**
 * Every team+decade combo that has at least one draftable player for the given
 * position, excluding decades already used and players already picked.
 */
export function eligibleCombos(
  position: Position,
  usedDecades: Set<Decade>,
  pickedIds: Set<string>,
): Combo[] {
  const byKey = new Map<string, Combo>();
  for (const pl of PLAYERS) {
    if (pl.pos !== position) continue;
    if (usedDecades.has(pl.decade)) continue;
    if (pickedIds.has(pl.id)) continue;
    const key = `${pl.team}|${pl.decade}`;
    let combo = byKey.get(key);
    if (!combo) {
      combo = { team: pl.team, decade: pl.decade, players: [] };
      byKey.set(key, combo);
    }
    combo.players.push(pl);
  }
  // Best players first within each combo.
  for (const combo of byKey.values()) combo.players.sort((a, b) => b.ovr - a.ovr);
  return [...byKey.values()];
}

/** Pick a random eligible combo for the slot machine to settle on. */
export function spin(
  position: Position,
  usedDecades: Set<Decade>,
  pickedIds: Set<string>,
  rand: () => number = Math.random,
): Combo | null {
  const combos = eligibleCombos(position, usedDecades, pickedIds);
  if (combos.length === 0) return null;
  return combos[Math.floor(rand() * combos.length)];
}
