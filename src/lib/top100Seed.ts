// A seeded, editable global Top-100 prospect board, reconstructed from MLB
// Pipeline's 2026 coverage. This is a best-effort starting point (ranks and
// the depth of the list are meant to be reconciled against an authoritative
// source); each entry is enriched with live stats at request time.

export interface Top100Seed {
  rank: number;
  name: string;
  position: string;
  /** Team slug from src/lib/teams.ts. */
  team: string;
  eta?: string;
}

export const TOP100_SEED: Top100Seed[] = [
  { rank: 1, name: 'Konnor Griffin', position: 'SS', team: 'pirates', eta: '2027' },
  { rank: 2, name: 'Kevin McGonigle', position: 'SS', team: 'tigers', eta: '2026' },
  { rank: 3, name: 'Jesus Made', position: 'SS', team: 'brewers', eta: '2028' },
  { rank: 4, name: 'Leo De Vries', position: 'SS', team: 'athletics', eta: '2027' },
  { rank: 5, name: 'JJ Wetherholt', position: '2B', team: 'cardinals', eta: '2026' },
  { rank: 6, name: 'Nolan McLean', position: 'RHP', team: 'mets', eta: '2026' },
  { rank: 7, name: 'Seth Hernandez', position: 'RHP', team: 'pirates', eta: '2028' },
  { rank: 8, name: 'Eli Willits', position: 'SS', team: 'nationals', eta: '2028' },
  { rank: 9, name: 'Colt Emerson', position: 'SS', team: 'mariners', eta: '2027' },
  { rank: 10, name: 'Max Clark', position: 'OF', team: 'tigers', eta: '2027' },
  { rank: 11, name: 'Kade Anderson', position: 'LHP', team: 'mariners', eta: '2027' },
  { rank: 12, name: 'Trey Yesavage', position: 'RHP', team: 'bluejays', eta: '2026' },
  { rank: 13, name: 'Sebastian Walcott', position: 'SS', team: 'rangers', eta: '2026' },
  { rank: 14, name: 'Samuel Basallo', position: 'C', team: 'orioles', eta: '2026' },
  { rank: 15, name: 'Josue De Paula', position: 'OF', team: 'dodgers', eta: '2027' },
  { rank: 16, name: 'Walker Jenkins', position: 'OF', team: 'twins', eta: '2026' },
  { rank: 17, name: 'Thomas White', position: 'LHP', team: 'marlins', eta: '2027' },
  { rank: 18, name: 'Carter Jensen', position: 'C', team: 'royals', eta: '2026' },
  { rank: 19, name: 'Payton Tolle', position: 'LHP', team: 'redsox', eta: '2026' },
  { rank: 20, name: 'Ethan Salas', position: 'C', team: 'padres', eta: '2027' },
  { rank: 21, name: 'Bryce Eldridge', position: '1B', team: 'giants', eta: '2026' },
  { rank: 22, name: 'Braden Montgomery', position: 'OF', team: 'whitesox', eta: '2027' },
  { rank: 23, name: 'Franklin Arias', position: 'SS', team: 'redsox', eta: '2028' },
  { rank: 24, name: 'Travis Bazzana', position: '2B', team: 'guardians', eta: '2026' },
  { rank: 25, name: 'Charlie Condon', position: 'OF', team: 'rockies', eta: '2027' },
  { rank: 26, name: 'Chase Burns', position: 'RHP', team: 'reds', eta: '2026' },
  { rank: 27, name: 'Jac Caglianone', position: '1B', team: 'royals', eta: '2026' },
  { rank: 28, name: 'Owen Caissie', position: 'OF', team: 'cubs', eta: '2026' },
  { rank: 29, name: 'Andrew Painter', position: 'RHP', team: 'phillies', eta: '2026' },
  { rank: 30, name: 'Bubba Chandler', position: 'RHP', team: 'pirates', eta: '2026' },
  { rank: 31, name: 'Aidan Miller', position: 'SS', team: 'phillies', eta: '2027' },
  { rank: 32, name: 'Cam Caminiti', position: 'LHP', team: 'braves', eta: '2028' },
  { rank: 33, name: 'Zyhir Hope', position: 'OF', team: 'dodgers', eta: '2028' },
  { rank: 34, name: 'JR Ritchie', position: 'RHP', team: 'braves', eta: '2026' },
  { rank: 35, name: 'Eduardo Quintero', position: 'OF', team: 'dodgers', eta: '2028' },
  { rank: 36, name: 'Emil Morales', position: 'SS', team: 'dodgers', eta: '2029' },
  { rank: 37, name: 'Tink Hence', position: 'RHP', team: 'cardinals', eta: '2026' },
  { rank: 38, name: 'Jett Williams', position: 'SS', team: 'mets', eta: '2026' },
  { rank: 39, name: 'George Lombard Jr.', position: 'SS', team: 'yankees', eta: '2027' },
  { rank: 40, name: 'Bryce Rainer', position: 'SS', team: 'tigers', eta: '2028' },
];
