// Registry of all 30 MLB organizations. `id` is the parent-club team id in the
// MLB Stats API (used to resolve affiliates, schedules, transactions, etc.).
// Colors are [r, g, b] triplets mapped into three brand slots the UI themes on:
//   primary  – dominant dark surface color
//   accent   – bright highlight (kickers, live, buttons)
//   secondary– metallic/light secondary highlight (medallions, rings)

export type RGB = readonly [number, number, number];

export interface Team {
  slug: string;
  id: number;
  name: string;
  short: string;
  abbrev: string;
  colors: { primary: RGB; accent: RGB; secondary: RGB };
}

export const TEAMS: Team[] = [
  { slug: 'diamondbacks', id: 109, name: 'Arizona Diamondbacks', short: 'D-backs', abbrev: 'AZ', colors: { primary: [39, 37, 31], accent: [167, 25, 48], secondary: [227, 212, 173] } },
  { slug: 'braves', id: 144, name: 'Atlanta Braves', short: 'Braves', abbrev: 'ATL', colors: { primary: [19, 39, 79], accent: [206, 17, 65], secondary: [234, 170, 0] } },
  { slug: 'orioles', id: 110, name: 'Baltimore Orioles', short: 'Orioles', abbrev: 'BAL', colors: { primary: [39, 37, 31], accent: [223, 70, 1], secondary: [255, 184, 28] } },
  { slug: 'redsox', id: 111, name: 'Boston Red Sox', short: 'Red Sox', abbrev: 'BOS', colors: { primary: [13, 27, 42], accent: [189, 48, 57], secondary: [201, 125, 76] } },
  { slug: 'cubs', id: 112, name: 'Chicago Cubs', short: 'Cubs', abbrev: 'CHC', colors: { primary: [14, 51, 134], accent: [204, 52, 51], secondary: [204, 204, 204] } },
  { slug: 'whitesox', id: 145, name: 'Chicago White Sox', short: 'White Sox', abbrev: 'CWS', colors: { primary: [19, 19, 19], accent: [196, 206, 212], secondary: [196, 206, 212] } },
  { slug: 'reds', id: 113, name: 'Cincinnati Reds', short: 'Reds', abbrev: 'CIN', colors: { primary: [25, 25, 25], accent: [198, 1, 31], secondary: [196, 206, 212] } },
  { slug: 'guardians', id: 114, name: 'Cleveland Guardians', short: 'Guardians', abbrev: 'CLE', colors: { primary: [0, 56, 93], accent: [233, 0, 43], secondary: [196, 206, 212] } },
  { slug: 'rockies', id: 115, name: 'Colorado Rockies', short: 'Rockies', abbrev: 'COL', colors: { primary: [27, 27, 27], accent: [51, 0, 111], secondary: [196, 206, 212] } },
  { slug: 'tigers', id: 116, name: 'Detroit Tigers', short: 'Tigers', abbrev: 'DET', colors: { primary: [12, 35, 64], accent: [250, 70, 22], secondary: [196, 206, 212] } },
  { slug: 'astros', id: 117, name: 'Houston Astros', short: 'Astros', abbrev: 'HOU', colors: { primary: [0, 45, 98], accent: [235, 110, 31], secondary: [196, 206, 212] } },
  { slug: 'royals', id: 118, name: 'Kansas City Royals', short: 'Royals', abbrev: 'KC', colors: { primary: [0, 70, 135], accent: [189, 155, 96], secondary: [196, 206, 212] } },
  { slug: 'angels', id: 108, name: 'Los Angeles Angels', short: 'Angels', abbrev: 'LAA', colors: { primary: [25, 25, 25], accent: [186, 0, 33], secondary: [134, 38, 51] } },
  { slug: 'dodgers', id: 119, name: 'Los Angeles Dodgers', short: 'Dodgers', abbrev: 'LAD', colors: { primary: [0, 64, 120], accent: [239, 62, 66], secondary: [196, 206, 212] } },
  { slug: 'marlins', id: 146, name: 'Miami Marlins', short: 'Marlins', abbrev: 'MIA', colors: { primary: [0, 0, 0], accent: [0, 163, 224], secondary: [239, 51, 64] } },
  { slug: 'brewers', id: 158, name: 'Milwaukee Brewers', short: 'Brewers', abbrev: 'MIL', colors: { primary: [18, 40, 75], accent: [255, 197, 47], secondary: [196, 206, 212] } },
  { slug: 'twins', id: 142, name: 'Minnesota Twins', short: 'Twins', abbrev: 'MIN', colors: { primary: [0, 43, 92], accent: [211, 17, 69], secondary: [183, 146, 87] } },
  { slug: 'mets', id: 121, name: 'New York Mets', short: 'Mets', abbrev: 'NYM', colors: { primary: [0, 45, 114], accent: [252, 89, 16], secondary: [196, 206, 212] } },
  { slug: 'yankees', id: 147, name: 'New York Yankees', short: 'Yankees', abbrev: 'NYY', colors: { primary: [12, 35, 64], accent: [196, 206, 212], secondary: [142, 142, 142] } },
  { slug: 'athletics', id: 133, name: 'Athletics', short: 'Athletics', abbrev: 'ATH', colors: { primary: [0, 56, 49], accent: [239, 178, 30], secondary: [196, 206, 212] } },
  { slug: 'phillies', id: 143, name: 'Philadelphia Phillies', short: 'Phillies', abbrev: 'PHI', colors: { primary: [40, 42, 45], accent: [232, 24, 40], secondary: [40, 75, 145] } },
  { slug: 'pirates', id: 134, name: 'Pittsburgh Pirates', short: 'Pirates', abbrev: 'PIT', colors: { primary: [27, 27, 27], accent: [253, 184, 39], secondary: [196, 206, 212] } },
  { slug: 'padres', id: 135, name: 'San Diego Padres', short: 'Padres', abbrev: 'SD', colors: { primary: [47, 36, 29], accent: [255, 196, 37], secondary: [162, 170, 173] } },
  { slug: 'giants', id: 137, name: 'San Francisco Giants', short: 'Giants', abbrev: 'SF', colors: { primary: [27, 27, 27], accent: [253, 90, 30], secondary: [196, 206, 212] } },
  { slug: 'mariners', id: 136, name: 'Seattle Mariners', short: 'Mariners', abbrev: 'SEA', colors: { primary: [12, 44, 86], accent: [0, 92, 92], secondary: [196, 206, 212] } },
  { slug: 'cardinals', id: 138, name: 'St. Louis Cardinals', short: 'Cardinals', abbrev: 'STL', colors: { primary: [27, 27, 27], accent: [196, 30, 58], secondary: [255, 197, 47] } },
  { slug: 'rays', id: 139, name: 'Tampa Bay Rays', short: 'Rays', abbrev: 'TB', colors: { primary: [9, 44, 92], accent: [143, 188, 230], secondary: [242, 163, 0] } },
  { slug: 'rangers', id: 140, name: 'Texas Rangers', short: 'Rangers', abbrev: 'TEX', colors: { primary: [0, 50, 120], accent: [192, 17, 31], secondary: [196, 206, 212] } },
  { slug: 'bluejays', id: 141, name: 'Toronto Blue Jays', short: 'Blue Jays', abbrev: 'TOR', colors: { primary: [19, 74, 142], accent: [232, 41, 28], secondary: [196, 206, 212] } },
  { slug: 'nationals', id: 120, name: 'Washington Nationals', short: 'Nationals', abbrev: 'WSH', colors: { primary: [20, 34, 90], accent: [171, 0, 3], secondary: [196, 206, 212] } },
];

export const DEFAULT_TEAM_SLUG = 'braves';

const BY_SLUG = new Map(TEAMS.map((t) => [t.slug, t]));

export function getTeamBySlug(slug: string | undefined | null): Team {
  return (slug && BY_SLUG.get(slug)) || BY_SLUG.get(DEFAULT_TEAM_SLUG)!;
}

export const rgb = (c: RGB) => `${c[0]} ${c[1]} ${c[2]}`;
