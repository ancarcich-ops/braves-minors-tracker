import type {
  Game,
  Level,
  Prospect,
  ProspectsPayload,
  Scoreboard,
  Transaction,
  TransactionsFeed,
} from './types';
import { PROSPECT_SEED, isPitcher, prospectId } from './prospectSeed';

// Offline / fallback dataset. Lets the UI render in network-restricted
// sandboxes and during local dev without hitting the live MLB Stats API.
// Values are illustrative, not real results.

function game(g: Partial<Game> & Pick<Game, 'gamePk' | 'level' | 'affiliateName' | 'home' | 'away'>): Game {
  return {
    state: 'final',
    detailedState: 'Final',
    startTimeUTC: null,
    inning: 'F',
    ...g,
  };
}

export function mockScoreboard(date: string): Scoreboard {
  const games: Game[] = [
    game({
      gamePk: 900001,
      level: 'AAA',
      affiliateName: 'Gwinnett Stripers',
      home: { name: 'Gwinnett Stripers', abbreviation: 'GWN', runs: 6, isBraves: true },
      away: { name: 'Durham Bulls', abbreviation: 'DUR', runs: 4, isBraves: false },
    }),
    {
      gamePk: 900002,
      state: 'live',
      detailedState: 'In Progress',
      startTimeUTC: null,
      inning: 'Top 7',
      level: 'AA',
      affiliateName: 'Columbus Clingstones',
      home: { name: 'Columbus Clingstones', abbreviation: 'COL', runs: 2, isBraves: true },
      away: { name: 'Biloxi Shuckers', abbreviation: 'BLX', runs: 3, isBraves: false },
    },
    game({
      gamePk: 900003,
      level: 'High-A',
      affiliateName: 'Rome Emperors',
      home: { name: 'Greensboro Grasshoppers', abbreviation: 'GBO', runs: 1, isBraves: false },
      away: { name: 'Rome Emperors', abbreviation: 'ROM', runs: 5, isBraves: true },
    }),
    {
      gamePk: 900004,
      state: 'scheduled',
      detailedState: 'Scheduled',
      startTimeUTC: `${date}T23:05:00Z`,
      inning: '',
      level: 'Low-A',
      affiliateName: 'Augusta GreenJackets',
      home: { name: 'Augusta GreenJackets', abbreviation: 'AUG', runs: null, isBraves: true },
      away: { name: 'Charleston RiverDogs', abbreviation: 'CHS', runs: null, isBraves: false },
    },
    game({
      gamePk: 900005,
      level: 'Rookie',
      affiliateName: 'FCL Braves',
      home: { name: 'FCL Braves', abbreviation: 'ATL', runs: 8, isBraves: true },
      away: { name: 'FCL Phillies', abbreviation: 'PHI', runs: 7, isBraves: false },
    }),
  ];

  return { date, games, isMock: true };
}

// ---------------------------------------------------------------------------
// Prospects mock
// ---------------------------------------------------------------------------

// Affiliate label per level, mirroring the real 2026 Braves system.
const LEVEL_TEAM: Record<Level, string> = {
  AAA: 'Gwinnett Stripers',
  AA: 'Columbus Clingstones',
  'High-A': 'Rome Emperors',
  'Low-A': 'Augusta GreenJackets',
  Rookie: 'FCL Braves',
  DSL: 'DSL Braves',
};

// Map a seeded ETA to a plausible current level (closer ETA = higher level).
function levelForEta(eta: string | undefined): Level {
  switch (eta) {
    case '2026':
      return 'AAA';
    case '2027':
      return 'AA';
    case '2028':
      return 'High-A';
    case '2029':
      return 'Low-A';
    default:
      return 'Rookie';
  }
}

// Tiny deterministic PRNG so the same prospect always gets the same line.
function seeded(n: number): () => number {
  let s = n * 2654435761;
  return () => {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    return s / 0xffffffff;
  };
}

const three = (v: number) => v.toFixed(3).replace(/^0/, '');
const two = (v: number) => v.toFixed(2);

/** Illustrative — NOT real results. Lets the board render fully offline. */
export function mockProspects(): ProspectsPayload {
  const season = process.env.SEASON || String(new Date().getUTCFullYear());

  const prospects: Prospect[] = PROSPECT_SEED.map((seed, i) => {
    const pitcher = isPitcher(seed.position);
    const level = levelForEta(seed.eta);
    const rand = seeded(seed.rank);

    let hitting = null;
    let pitching = null;
    if (pitcher) {
      const games = 8 + Math.floor(rand() * 16);
      const ip = 30 + rand() * 60;
      pitching = {
        games,
        w: Math.floor(rand() * 7),
        l: Math.floor(rand() * 5),
        era: two(2 + rand() * 3),
        whip: two(1 + rand() * 0.4),
        ip: ip.toFixed(1),
        so: Math.floor(ip * (0.9 + rand() * 0.5)),
        bb: Math.floor(ip * (0.25 + rand() * 0.2)),
      };
    } else {
      const games = 30 + Math.floor(rand() * 60);
      const avg = 0.23 + rand() * 0.07;
      const obp = avg + 0.06 + rand() * 0.04;
      const slg = avg + 0.12 + rand() * 0.13;
      hitting = {
        games,
        avg: three(avg),
        obp: three(obp),
        slg: three(slg),
        ops: three(obp + slg),
        hr: Math.floor(rand() * 18),
        rbi: Math.floor(games * (0.3 + rand() * 0.3)),
        sb: Math.floor(rand() * 25),
      };
    }

    return {
      id: prospectId(seed.name),
      rank: seed.rank,
      name: seed.name,
      position: seed.position,
      isPitcher: pitcher,
      bats: seed.bats,
      throws: seed.throws,
      age: 18 + ((i * 7) % 6) + (seed.eta === '2026' ? 4 : 0),
      eta: seed.eta,
      level,
      team: LEVEL_TEAM[level],
      mlbamId: undefined,
      headshotUrl: undefined,
      profileUrl: undefined,
      note: seed.note,
      hitting,
      pitching,
    };
  });

  return { prospects, season, isMock: true };
}

// ---------------------------------------------------------------------------
// Transactions mock
// ---------------------------------------------------------------------------

/** Illustrative roster moves so the feed renders offline. Not real moves. */
export function mockTransactions(startDate: string, endDate: string): TransactionsFeed {
  // Space a handful of moves across the window, newest first.
  const day = (back: number) => {
    const d = new Date(`${endDate}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - back);
    return d.toISOString().slice(0, 10);
  };

  const raw: Array<Omit<Transaction, 'id'>> = [
    {
      date: day(1),
      player: 'Didier Fuentes',
      typeCode: 'RCL',
      typeDesc: 'Recalled',
      description: 'Atlanta Braves recalled RHP Didier Fuentes from Gwinnett Stripers.',
      fromTeam: 'Gwinnett Stripers',
      toTeam: 'Atlanta Braves',
      category: 'promotion',
    },
    {
      date: day(2),
      player: 'JR Ritchie',
      typeCode: 'ASG',
      typeDesc: 'Assigned',
      description: 'RHP JR Ritchie assigned to Gwinnett Stripers from Columbus Clingstones.',
      fromTeam: 'Columbus Clingstones',
      toTeam: 'Gwinnett Stripers',
      category: 'promotion',
    },
    {
      date: day(4),
      player: 'Owen Murphy',
      typeCode: 'SC',
      typeDesc: 'Status Change',
      description: 'Columbus Clingstones activated RHP Owen Murphy from the 7-day injured list.',
      fromTeam: undefined,
      toTeam: 'Columbus Clingstones',
      category: 'activation',
    },
    {
      date: day(6),
      player: 'Cam Caminiti',
      typeCode: 'SC',
      typeDesc: 'Status Change',
      description: 'Rome Emperors placed LHP Cam Caminiti on the 7-day injured list.',
      fromTeam: 'Rome Emperors',
      toTeam: undefined,
      category: 'injury',
    },
    {
      date: day(9),
      player: 'Garrett Baumann',
      typeCode: 'ASG',
      typeDesc: 'Assigned',
      description: 'RHP Garrett Baumann assigned to Columbus Clingstones from Rome Emperors.',
      fromTeam: 'Rome Emperors',
      toTeam: 'Columbus Clingstones',
      category: 'promotion',
    },
    {
      date: day(12),
      player: 'Tate Southisene',
      typeCode: 'ASG',
      typeDesc: 'Assigned',
      description: 'SS Tate Southisene assigned to Rome Emperors from Augusta GreenJackets.',
      fromTeam: 'Augusta GreenJackets',
      toTeam: 'Rome Emperors',
      category: 'promotion',
    },
    {
      date: day(15),
      player: 'Hayden Harris',
      typeCode: 'OPT',
      typeDesc: 'Optioned',
      description: 'Atlanta Braves optioned LHP Hayden Harris to Gwinnett Stripers.',
      fromTeam: 'Atlanta Braves',
      toTeam: 'Gwinnett Stripers',
      category: 'demotion',
    },
    {
      date: day(18),
      player: 'Diego Tornes',
      typeCode: 'SFA',
      typeDesc: 'Signed',
      description: 'Augusta GreenJackets signed OF Diego Tornes.',
      fromTeam: undefined,
      toTeam: 'Augusta GreenJackets',
      category: 'signing',
    },
    {
      date: day(22),
      player: 'Jhancarlos Lara',
      typeCode: 'SC',
      typeDesc: 'Status Change',
      description: 'Columbus Clingstones placed RHP Jhancarlos Lara on the 60-day injured list.',
      fromTeam: 'Columbus Clingstones',
      toTeam: undefined,
      category: 'injury',
    },
    {
      date: day(27),
      player: 'Carlos Rodriguez',
      typeCode: 'REL',
      typeDesc: 'Released',
      description: 'Augusta GreenJackets released C Carlos Rodriguez.',
      fromTeam: 'Augusta GreenJackets',
      toTeam: undefined,
      category: 'release',
    },
  ];

  const transactions: Transaction[] = raw.map((t, i) => ({
    id: `mock-${i}`,
    profileUrl: undefined,
    playerId: undefined,
    ...t,
  }));

  return { startDate, endDate, transactions, isMock: true };
}
