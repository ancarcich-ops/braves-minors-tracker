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

/** The era the slot machine lands on, plus every player you can draft from it. */
export interface Combo {
  decade: Decade;
  players: Player[]; // every available player at the round's position in this decade
}

/** Every undrafted player at a position in a given decade, best first. */
export function availablePlayers(
  position: Position,
  decade: Decade,
  pickedIds: Set<string>,
): Player[] {
  return PLAYERS.filter(
    (pl) => pl.pos === position && pl.decade === decade && !pickedIds.has(pl.id),
  ).sort((a, b) => b.ovr - a.ovr);
}

/** Decades still in play that have at least one draftable player at a position. */
export function eligibleDecades(
  position: Position,
  usedDecades: Set<Decade>,
  pickedIds: Set<string>,
): Decade[] {
  return DECADES.filter(
    (d) => !usedDecades.has(d) && availablePlayers(position, d, pickedIds).length > 0,
  );
}

/**
 * Spin for the current position: land on a random eligible decade and surface
 * every player at that position from that era so there's a real choice to make.
 */
export function spin(
  position: Position,
  usedDecades: Set<Decade>,
  pickedIds: Set<string>,
  rand: () => number = Math.random,
): Combo | null {
  const decades = eligibleDecades(position, usedDecades, pickedIds);
  if (decades.length === 0) return null;
  const decade = decades[Math.floor(rand() * decades.length)];
  return { decade, players: availablePlayers(position, decade, pickedIds) };
}
