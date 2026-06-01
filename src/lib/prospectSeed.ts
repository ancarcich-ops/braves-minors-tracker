import type { ProspectSeed } from './types';

// Pure, dependency-free seed + helpers. Lives apart from prospects.ts so the
// mock dataset can reuse it without creating an import cycle.

const PITCHER_POSITIONS = new Set(['P', 'RHP', 'LHP', 'SP', 'RP']);
export const isPitcher = (position: string) => PITCHER_POSITIONS.has(position.toUpperCase());

/** Stable slug for React keys and persisted re-ordering. */
export function prospectId(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Loose name key for matching seeds against live roster entries. */
export function nameKey(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\b(jr|sr|ii|iii|iv)\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Seeded Braves Top-30. Reconstructed from MLB Pipeline's 2026 coverage; this
 * is a *starting point* meant to be re-ranked in-app (and easily replaced
 * wholesale). Ranks/positions are best-effort and editable — the live layer
 * fills in ids, current level, and season stats from the MLB Stats API.
 */
export const PROSPECT_SEED: ProspectSeed[] = [
  { rank: 1, name: 'Cam Caminiti', position: 'LHP', throws: 'L', eta: '2028', note: 'Projectable lefty; the system headliner on the mound.' },
  { rank: 2, name: 'JR Ritchie', position: 'RHP', throws: 'R', eta: '2026', note: 'Polished strike-thrower closing in on the bigs.' },
  { rank: 3, name: 'Didier Fuentes', position: 'RHP', throws: 'R', eta: '2026', note: 'Top-100 stuff; was rushed up last year out of need.' },
  { rank: 4, name: 'Tate Southisene', position: 'SS', bats: 'R', throws: 'R', eta: '2029', note: 'Prep first-rounder with surprising in-game power.' },
  { rank: 5, name: 'Alex Lodise', position: 'SS', bats: 'R', throws: 'R', eta: '2028', note: 'Advanced college bat, glove fits at short.' },
  { rank: 6, name: 'Garrett Baumann', position: 'RHP', throws: 'R', eta: '2027', note: 'Towering righty whose velo keeps climbing.' },
  { rank: 7, name: 'Owen Murphy', position: 'RHP', throws: 'R', eta: '2027', note: 'Back strong from Tommy John; high spin, big projection.' },
  { rank: 8, name: 'Diego Tornes', position: 'OF', bats: 'R', throws: 'R', eta: '2029', note: 'Toolsy international outfielder with loud raw power.' },
  { rank: 9, name: 'Lucas Braun', position: 'RHP', throws: 'R', eta: '2026', note: 'Strike-throwing depth arm climbing quickly.' },
  { rank: 10, name: 'John Gil', position: 'SS', bats: 'R', throws: 'R', eta: '2028', note: 'Smooth defender developing his offensive game.' },
  { rank: 11, name: 'Conor Essenburg', position: 'OF', bats: 'L', throws: 'L', eta: '2029', note: 'Lefty bat with a patient approach.' },
  { rank: 12, name: 'Drue Hackenberg', position: 'RHP', throws: 'R', eta: '2027', note: 'Durable college arm with a deep mix.' },
  { rank: 13, name: 'Blake Burkhalter', position: 'RHP', throws: 'R', eta: '2027', note: 'Former closer stretched back into starting.' },
  { rank: 14, name: 'Luke Sinnard', position: 'RHP', throws: 'R', eta: '2027', note: 'Breakout sleeper; big frame, swing-and-miss stuff.' },
  { rank: 15, name: 'Jose Perdomo', position: 'SS', bats: 'R', throws: 'R', eta: '2029', note: 'High-upside international infielder, very young.' },
  { rank: 16, name: 'Rolddy Munoz', position: 'RHP', throws: 'R', eta: '2027', note: 'Electric arm with late-inning upside.' },
  { rank: 17, name: 'Herick Hernandez', position: 'LHP', throws: 'L', eta: '2028', note: 'Lefty with feel for spin.' },
  { rank: 18, name: 'Adam Maier', position: 'RHP', throws: 'R', eta: '2028', note: 'Sharp breaking ball, attacks the zone.' },
  { rank: 19, name: 'Isaiah Drake', position: 'OF', bats: 'R', throws: 'R', eta: '2029', note: 'Plus-plus runner; speed and center-field range.' },
  { rank: 20, name: 'Cade Kuehler', position: 'RHP', throws: 'R', eta: '2027', note: 'Compact righty with a deep arsenal.' },
  { rank: 21, name: 'Carter Holton', position: 'LHP', throws: 'L', eta: '2028', note: 'Prep lefty with a polished delivery.' },
  { rank: 22, name: 'Hayden Harris', position: 'LHP', throws: 'L', eta: '2026', note: 'Big-strikeout reliever knocking on the door.' },
  { rank: 23, name: 'Dixon Williams', position: '2B', bats: 'R', throws: 'R', eta: '2028', note: 'Up-the-middle infielder with sneaky pop.' },
  { rank: 24, name: 'Eric Hartman', position: 'OF', bats: 'R', throws: 'R', eta: '2029', note: 'Late-round find swinging a hot bat.' },
  { rank: 25, name: 'Ethan Bagwell', position: 'RHP', throws: 'R', eta: '2029', note: 'Projectable arm in the lower minors.' },
  { rank: 26, name: 'Robert Gonzalez', position: 'OF', bats: 'L', throws: 'L', eta: '2030', note: 'Young outfielder with bat-to-ball feel.' },
  { rank: 27, name: 'Douglas Glod', position: 'OF', bats: 'L', throws: 'L', eta: '2029', note: 'Athletic outfielder with developing power.' },
  { rank: 28, name: 'Jhancarlos Lara', position: 'RHP', throws: 'R', eta: '2027', note: 'Big velocity; command is the swing skill.' },
  { rank: 29, name: 'Yenager Tavarez', position: 'RHP', throws: 'R', eta: '2030', note: 'Big-framed international arm, triple-digit upside.' },
  { rank: 30, name: 'Carlos Rodriguez', position: 'C', bats: 'R', throws: 'R', eta: '2029', note: 'Defensive-minded catcher rising through the lower levels.' },
];
