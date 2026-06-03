// Core game rules for 162-0: round order and the per-round "deal a hand of
// stars at this position, draft one" loop — a baseball take on 82-0's spin.

import { PLAYERS, type Player, type Position } from './players';

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

// How many candidates the slot machine deals each round.
export const HAND_SIZE = 6;

// A drafted roster slot.
export interface Pick {
  position: Position;
  player: Player;
}

/**
 * The pool of draftable players at a position: every undrafted player, deduped
 * by name to the highest-rated version (so a legend who peaked across two
 * decades shows once, at their best).
 */
export function positionPool(position: Position, pickedIds: Set<string>): Player[] {
  const byName = new Map<string, Player>();
  for (const pl of PLAYERS) {
    if (pl.pos !== position || pickedIds.has(pl.id)) continue;
    const cur = byName.get(pl.name);
    if (!cur || pl.ovr > cur.ovr) byName.set(pl.name, pl);
  }
  return [...byName.values()];
}

/**
 * Deal a shuffled hand of candidates for the round's position. Always offers a
 * real choice (up to HAND_SIZE players), drawn from across every era.
 */
export function dealHand(
  position: Position,
  pickedIds: Set<string>,
  rand: () => number = Math.random,
  size: number = HAND_SIZE,
): Player[] {
  const pool = positionPool(position, pickedIds);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(size, pool.length)).sort((a, b) => b.ovr - a.ovr);
}
