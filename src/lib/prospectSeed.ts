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
export const BRAVES_SEED: ProspectSeed[] = [
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

/**
 * Seeded Dodgers Top-30, reconstructed from MLB Pipeline's 2026 coverage. Same
 * caveat as the Braves list: a best-effort, fully editable starting point.
 */
export const DODGERS_SEED: ProspectSeed[] = [
  { rank: 1, name: 'Josue De Paula', position: 'OF', bats: 'L', throws: 'L', eta: '2027', note: 'Advanced lefty bat with power and patience; a Top-100 fixture.' },
  { rank: 2, name: 'Eduardo Quintero', position: 'OF', bats: 'R', throws: 'R', eta: '2028', note: 'Toolsy Venezuelan outfielder who impacts both sides of the ball.' },
  { rank: 3, name: 'Zyhir Hope', position: 'OF', bats: 'L', throws: 'R', eta: '2028', note: 'Explosive athlete with big upside across the board.' },
  { rank: 4, name: 'Emil Morales', position: 'SS', bats: 'R', throws: 'R', eta: '2029', note: 'Power-hitting shortstop with a loud offensive ceiling.' },
  { rank: 5, name: 'Mike Sirota', position: 'OF', bats: 'R', throws: 'R', eta: '2028', note: 'Polished hitter with a strong approach and center-field range.' },
  { rank: 6, name: 'Kendall George', position: 'OF', bats: 'L', throws: 'R', eta: '2028', note: 'Elite speed and contact; a table-setter profile.' },
  { rank: 7, name: 'Jackson Ferris', position: 'LHP', throws: 'L', eta: '2027', note: 'Big-bodied lefty with mid-rotation upside.' },
  { rank: 8, name: 'Patrick Copen', position: 'RHP', throws: 'R', eta: '2028', note: 'Power arsenal headlined by a wipeout slider.' },
  { rank: 9, name: 'Adam Serwinowski', position: 'LHP', throws: 'L', eta: '2028', note: 'Lefty with the best fastball in the system.' },
  { rank: 10, name: 'Peter Heubeck', position: 'RHP', throws: 'R', eta: '2027', note: 'Spin-heavy righty with a knockout curveball.' },
  { rank: 11, name: 'Eriq Swan', position: 'RHP', throws: 'R', eta: '2028', note: 'Big velocity, still refining command.' },
  { rank: 12, name: 'Payton Martin', position: 'RHP', throws: 'R', eta: '2027', note: 'Athletic righty with a deep, projectable mix.' },
  { rank: 13, name: 'Charlie Beilenson', position: 'RHP', throws: 'R', eta: '2027', note: 'Fast-moving reliever with late life.' },
  { rank: 14, name: 'Sterlin Thompson', position: '3B', bats: 'L', throws: 'R', eta: '2027', note: 'Hit-first infielder with a smooth lefty stroke.' },
  { rank: 15, name: 'Joendry Vargas', position: 'SS', bats: 'R', throws: 'R', eta: '2029', note: 'Projectable shortstop with power upside.' },
  { rank: 16, name: 'Chase Harlan', position: '3B', bats: 'R', throws: 'R', eta: '2029', note: 'Prep corner bat with raw power.' },
  { rank: 17, name: 'Christian Zazueta', position: 'RHP', throws: 'R', eta: '2028', note: 'Strike-thrower with advanced control.' },
  { rank: 18, name: 'Ryan Brown', position: 'RHP', throws: 'R', eta: '2027', note: 'Reliever with a plus changeup.' },
  { rank: 19, name: 'Sean Linan', position: 'RHP', throws: 'R', eta: '2029', note: 'Young arm with a fast-rising arrow.' },
  { rank: 20, name: 'Jerming Rosario', position: 'RHP', throws: 'R', eta: '2029', note: 'Live-armed international signing.' },
  { rank: 21, name: 'Logan Wagner', position: 'SS', bats: 'R', throws: 'R', eta: '2029', note: 'Up-the-middle defender developing his bat.' },
  { rank: 22, name: 'Jake Gelof', position: '3B', bats: 'R', throws: 'R', eta: '2027', note: 'Power-hitting corner infielder.' },
  { rank: 23, name: 'Maddux Bruns', position: 'LHP', throws: 'L', eta: '2028', note: 'High-octane lefty chasing command.' },
  { rank: 24, name: 'Wilman Diaz', position: 'SS', bats: 'R', throws: 'R', eta: '2028', note: 'Athletic shortstop with bat-speed.' },
  { rank: 25, name: 'Yeiner Fernandez', position: 'C', bats: 'R', throws: 'R', eta: '2028', note: 'Contact-oriented catcher with feel to hit.' },
  { rank: 26, name: 'Sammy Stafura', position: 'SS', bats: 'R', throws: 'R', eta: '2029', note: 'Defensive-minded infielder with speed.' },
  { rank: 27, name: 'Jordan Thompson', position: 'SS', bats: 'R', throws: 'R', eta: '2027', note: 'Glove-first shortstop nearing the upper minors.' },
  { rank: 28, name: 'Noah Miller', position: 'SS', bats: 'S', throws: 'R', eta: '2028', note: 'Switch-hitting defender with on-base skills.' },
  { rank: 29, name: 'Carson Hobbs', position: 'RHP', throws: 'R', eta: '2029', note: 'Projectable starter in the lower levels.' },
  { rank: 30, name: 'Brandon Neeck', position: 'LHP', throws: 'L', eta: '2027', note: 'Lefty with deception and strikes.' },
];

/** Back-compat alias: the default (Braves) seed used by the mock dataset. */
export const PROSPECT_SEED = BRAVES_SEED;

/** Curated Top-30 seeds, keyed by team slug. Teams not present fall back to a
 *  roster-derived list at request time. */
export const PROSPECT_SEEDS: Record<string, ProspectSeed[]> = {
  braves: BRAVES_SEED,
  dodgers: DODGERS_SEED,
};

export function getSeed(slug: string): ProspectSeed[] | null {
  return PROSPECT_SEEDS[slug] ?? null;
}
