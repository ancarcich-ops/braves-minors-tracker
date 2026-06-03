// Season simulation: turn a 9-man roster into a 162-game record.
//
// The roster's average OVR feeds a logistic win-probability curve, then we
// play out all 162 games with a deterministic, roster-seeded RNG. Determinism
// means a given lineup always yields the same record (so results are
// shareable), while the per-game coin-flips give natural variance and leave a
// thin, thrilling chance at the mythical 162-0 for a truly stacked roster.

import type { Pick } from './game';

export interface SeasonResult {
  wins: number;
  losses: number;
  winPct: number; // per-game win probability used by the sim
  avgOvr: number;
  verdict: Verdict;
}

export interface Verdict {
  title: string;
  blurb: string;
  tone: 'perfect' | 'legendary' | 'great' | 'good' | 'mid' | 'poor';
}

// Deterministic 32-bit PRNG (mulberry32).
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(picks: Pick[]): number {
  let h = 2166136261;
  for (const { player } of picks) {
    for (const ch of player.id) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
  }
  return h >>> 0;
}

// Map average OVR -> per-game win probability. Calibrated to real play now that
// every era serves up its full slate of stars: casual drafting (~89 OVR) lands
// around 100 wins, a sharp roster (~92) pushes ~130, and only a near-optimal
// (~96+) lineup gets a genuine, thin shot at an unbeaten season.
function winProbability(avgOvr: number): number {
  const k = 0.2;
  const center = 88;
  const base = 1 / (1 + Math.exp(-k * (avgOvr - center)));
  // Top-end lift: only a stacked, ~94+ roster nudges into genuine (if thin)
  // perfect-season territory, keeping 162-0 the holy grail it should be.
  const lift = Math.max(0, avgOvr - 93) * 0.012;
  return Math.min(0.99, base + lift);
}

function verdictFor(wins: number): Verdict {
  if (wins === 162)
    return {
      title: 'PERFECT SEASON',
      blurb: '162-0. The unbeatable season. You built a team for the ages and the baseball gods blinked.',
      tone: 'perfect',
    };
  if (wins >= 150)
    return {
      title: 'Immortal',
      blurb: 'One of the greatest seasons ever imagined — a hair short of perfection.',
      tone: 'legendary',
    };
  if (wins >= 130)
    return {
      title: 'Legendary',
      blurb: 'A historic juggernaut. This club rolls through October.',
      tone: 'legendary',
    };
  if (wins >= 108)
    return {
      title: 'World Series Champion',
      blurb: 'Dominant wire to wire. Order the parade.',
      tone: 'great',
    };
  if (wins >= 95)
    return {
      title: 'Pennant Winner',
      blurb: 'A bona fide contender that played deep into the fall.',
      tone: 'great',
    };
  if (wins >= 87)
    return {
      title: 'Division Winner',
      blurb: 'Punched a playoff ticket and gave the league a scare.',
      tone: 'good',
    };
  if (wins >= 81)
    return {
      title: 'Wild Card',
      blurb: 'Snuck into October on the final weekend.',
      tone: 'good',
    };
  if (wins >= 70)
    return {
      title: 'Also-Rans',
      blurb: 'A .500-ish club that watched the playoffs on TV.',
      tone: 'mid',
    };
  return {
    title: 'Rebuilding Year',
    blurb: 'It was a long summer. There is always next season.',
    tone: 'poor',
  };
}

export function simulateSeason(picks: Pick[]): SeasonResult {
  const avgOvr =
    picks.reduce((sum, { player }) => sum + player.ovr, 0) / (picks.length || 1);
  const winPct = winProbability(avgOvr);
  const rand = mulberry32(seedFrom(picks));

  let wins = 0;
  for (let g = 0; g < 162; g++) {
    if (rand() < winPct) wins++;
  }
  const losses = 162 - wins;

  return { wins, losses, winPct, avgOvr, verdict: verdictFor(wins) };
}
