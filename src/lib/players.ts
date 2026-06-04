// Player dataset for the 162-0 draft game.
//
// Each player is tagged with a position, the franchise + decade they're most
// associated with, a representative real-life stat line (shown to the player),
// and an internal `ovr` rating (1-100) used only to sort the board and drive
// the season simulation — it is never displayed.
//
// Stats are factual, drawn from a signature season or career-typical line:
//   hitters  ->  "AVG / HR / RBI"
//   pitchers ->  "W-L / ERA / K"
//
// Coverage invariant: every (decade x position) cell has at least one player,
// so the team+decade spin can always complete a full nine-man lineup.

export type Position = 'SP' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF';

export type Decade =
  | '1930s'
  | '1940s'
  | '1950s'
  | '1960s'
  | '1970s'
  | '1980s'
  | '1990s'
  | '2000s'
  | '2010s';

export interface Player {
  id: string;
  name: string;
  pos: Position;
  team: string; // franchise abbreviation, see TEAM_NAMES
  decade: Decade;
  ovr: number; // internal only
  stat: string; // displayed
}

export const TEAM_NAMES: Record<string, string> = {
  NYY: 'New York Yankees',
  BOS: 'Boston Red Sox',
  NYM: 'New York Mets',
  LAD: 'Los Angeles Dodgers',
  BRO: 'Brooklyn Dodgers',
  NYG: 'New York Giants',
  SF: 'San Francisco Giants',
  STL: 'St. Louis Cardinals',
  CHC: 'Chicago Cubs',
  CIN: 'Cincinnati Reds',
  PIT: 'Pittsburgh Pirates',
  PHI: 'Philadelphia Phillies',
  PHA: 'Philadelphia Athletics',
  ATL: 'Atlanta Braves',
  MLN: 'Milwaukee Braves',
  BSN: 'Boston Braves',
  WSH: 'Washington Senators',
  WSN: 'Washington Nationals',
  BAL: 'Baltimore Orioles',
  CLE: 'Cleveland Guardians',
  DET: 'Detroit Tigers',
  CWS: 'Chicago White Sox',
  MIN: 'Minnesota Twins',
  KC: 'Kansas City Royals',
  OAK: 'Oakland Athletics',
  HOU: 'Houston Astros',
  TEX: 'Texas Rangers',
  SEA: 'Seattle Mariners',
  LAA: 'Los Angeles Angels',
  CAL: 'California Angels',
  TOR: 'Toronto Blue Jays',
  MON: 'Montreal Expos',
  COL: 'Colorado Rockies',
  ARI: 'Arizona Diamondbacks',
  SD: 'San Diego Padres',
  MIA: 'Miami Marlins',
  MIL: 'Milwaukee Brewers',
};

const p = (
  name: string,
  pos: Position,
  team: string,
  decade: Decade,
  ovr: number,
  stat: string,
): Player => ({
  id: `${name}-${decade}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  pos,
  team,
  decade,
  ovr,
  stat,
});

export const PLAYERS: Player[] = [
  // ================= 1930s =================
  // Yankees
  p('Lou Gehrig', '1B', 'NYY', '1930s', 98, '.363 / 49 / 165'),
  p('Bill Dickey', 'C', 'NYY', '1930s', 88, '.362 / 29 / 133'),
  p('Tony Lazzeri', '2B', 'NYY', '1930s', 80, '.294 / 14 / 109'),
  p('Joe DiMaggio', 'CF', 'NYY', '1930s', 92, '.346 / 46 / 167'),
  p('Red Ruffing', 'SP', 'NYY', '1930s', 84, '21-7 / 2.98 / 190'),
  p('Lefty Gomez', 'SP', 'NYY', '1930s', 85, '26-5 / 2.33 / 158'),
  // Athletics
  p('Jimmie Foxx', '1B', 'PHA', '1930s', 96, '.356 / 58 / 169'),
  p('Al Simmons', 'LF', 'PHA', '1930s', 89, '.390 / 36 / 165'),
  p('Mickey Cochrane', 'C', 'PHA', '1930s', 85, '.357 / 23 / 112'),
  p('Lefty Grove', 'SP', 'PHA', '1930s', 96, '31-4 / 2.06 / 175'),
  // Tigers
  p('Hank Greenberg', '1B', 'DET', '1930s', 91, '.328 / 58 / 146'),
  p('Charlie Gehringer', '2B', 'DET', '1930s', 90, '.371 / 19 / 108'),
  // Cardinals
  p('Dizzy Dean', 'SP', 'STL', '1930s', 90, '30-7 / 2.66 / 195'),
  p('Joe Medwick', 'LF', 'STL', '1930s', 88, '.374 / 31 / 154'),
  p('Frankie Frisch', '2B', 'STL', '1930s', 81, '.305 / 4 / 60'),
  // Cubs
  p('Gabby Hartnett', 'C', 'CHC', '1930s', 85, '.344 / 37 / 122'),
  p('Stan Hack', '3B', 'CHC', '1930s', 81, '.301 / 4 / 57'),
  p('Billy Herman', '2B', 'CHC', '1930s', 82, '.341 / 8 / 93'),
  // Giants
  p('Carl Hubbell', 'SP', 'NYG', '1930s', 93, '23-12 / 1.66 / 159'),
  p('Mel Ott', 'RF', 'NYG', '1930s', 92, '.328 / 42 / 151'),
  // Pirates
  p('Arky Vaughan', 'SS', 'PIT', '1930s', 89, '.385 / 19 / 99'),
  p('Paul Waner', 'RF', 'PIT', '1930s', 87, '.362 / 8 / 131'),
  p('Pie Traynor', '3B', 'PIT', '1930s', 80, '.298 / 2 / 58'),
  // Senators / Red Sox
  p('Joe Cronin', 'SS', 'WSH', '1930s', 85, '.318 / 13 / 119'),
  p('Earl Averill', 'CF', 'CLE', '1930s', 84, '.378 / 32 / 142'),

  // ================= 1940s =================
  // Red Sox
  p('Ted Williams', 'LF', 'BOS', '1940s', 98, '.406 / 37 / 120'),
  p('Bobby Doerr', '2B', 'BOS', '1940s', 86, '.288 / 27 / 120'),
  p('Dom DiMaggio', 'CF', 'BOS', '1940s', 80, '.298 / 7 / 73'),
  // Cardinals
  p('Stan Musial', 'LF', 'STL', '1940s', 95, '.376 / 39 / 131'),
  p('Enos Slaughter', 'RF', 'STL', '1940s', 84, '.318 / 18 / 130'),
  p('Marty Marion', 'SS', 'STL', '1940s', 80, '.267 / 6 / 63'),
  p('Mort Cooper', 'SP', 'STL', '1940s', 83, '22-7 / 1.78 / 152'),
  // Yankees
  p('Joe DiMaggio', 'CF', 'NYY', '1940s', 94, '.357 / 30 / 125'),
  p('Joe Gordon', '2B', 'NYY', '1940s', 85, '.322 / 30 / 103'),
  p('Charlie Keller', 'RF', 'NYY', '1940s', 82, '.286 / 33 / 122'),
  // Indians
  p('Bob Feller', 'SP', 'CLE', '1940s', 94, '27-11 / 2.18 / 348'),
  p('Lou Boudreau', 'SS', 'CLE', '1940s', 88, '.355 / 18 / 106'),
  p('Ken Keltner', '3B', 'CLE', '1940s', 78, '.273 / 31 / 119'),
  // Tigers
  p('Hal Newhouser', 'SP', 'DET', '1940s', 90, '29-9 / 1.81 / 212'),
  // Giants / Braves / Dodgers / Reds
  p('Johnny Mize', '1B', 'NYG', '1940s', 90, '.305 / 51 / 137'),
  p('Bob Elliott', '3B', 'BSN', '1940s', 82, '.317 / 22 / 113'),
  p('Pee Wee Reese', 'SS', 'BRO', '1940s', 84, '.284 / 5 / 73'),
  p('Dixie Walker', 'RF', 'BRO', '1940s', 80, '.319 / 9 / 124'),
  p('Ernie Lombardi', 'C', 'CIN', '1940s', 82, '.330 / 10 / 95'),
  p('Walker Cooper', 'C', 'STL', '1940s', 78, '.318 / 13 / 81'),
  p('Phil Cavarretta', '1B', 'CHC', '1940s', 79, '.355 / 6 / 97'),

  // ================= 1950s =================
  // Yankees
  p('Mickey Mantle', 'CF', 'NYY', '1950s', 96, '.353 / 52 / 130'),
  p('Yogi Berra', 'C', 'NYY', '1950s', 92, '.322 / 30 / 125'),
  p('Whitey Ford', 'SP', 'NYY', '1950s', 90, '18-6 / 2.47 / 137'),
  p('Hank Bauer', 'RF', 'NYY', '1950s', 78, '.296 / 26 / 84'),
  p('Gil McDougald', '2B', 'NYY', '1950s', 77, '.285 / 14 / 63'),
  // Dodgers (Brooklyn)
  p('Jackie Robinson', '2B', 'BRO', '1950s', 90, '.338 / 19 / 88'),
  p('Roy Campanella', 'C', 'BRO', '1950s', 90, '.312 / 41 / 142'),
  p('Duke Snider', 'CF', 'BRO', '1950s', 91, '.341 / 43 / 136'),
  p('Gil Hodges', '1B', 'BRO', '1950s', 86, '.304 / 42 / 130'),
  p('Pee Wee Reese', 'SS', 'BRO', '1950s', 84, '.309 / 10 / 84'),
  p('Don Newcombe', 'SP', 'BRO', '1950s', 86, '27-7 / 3.06 / 139'),
  // Giants
  p('Willie Mays', 'CF', 'NYG', '1950s', 97, '.345 / 51 / 127'),
  // Braves (Milwaukee)
  p('Hank Aaron', 'RF', 'MLN', '1950s', 95, '.355 / 44 / 132'),
  p('Eddie Mathews', '3B', 'MLN', '1950s', 92, '.302 / 47 / 135'),
  p('Warren Spahn', 'SP', 'MLN', '1950s', 94, '23-7 / 2.10 / 191'),
  // Indians
  p('Larry Doby', 'CF', 'CLE', '1950s', 86, '.326 / 32 / 126'),
  p('Bob Lemon', 'SP', 'CLE', '1950s', 87, '23-11 / 2.82 / 170'),
  p('Early Wynn', 'SP', 'CLE', '1950s', 86, '23-11 / 3.17 / 184'),
  p('Al Rosen', '3B', 'CLE', '1950s', 85, '.336 / 43 / 145'),
  // White Sox
  p('Nellie Fox', '2B', 'CWS', '1950s', 84, '.306 / 2 / 70'),
  p('Minnie Minoso', 'LF', 'CWS', '1950s', 84, '.320 / 20 / 116'),
  p('Luis Aparicio', 'SS', 'CWS', '1950s', 80, '.266 / 6 / 56'),
  // Red Sox / Cardinals / Reds / Pirates
  p('Ted Williams', 'LF', 'BOS', '1950s', 95, '.388 / 38 / 87'),
  p('Stan Musial', '1B', 'STL', '1950s', 95, '.330 / 35 / 126'),
  p('Ernie Banks', 'SS', 'CHC', '1950s', 91, '.313 / 47 / 129'),
  p('Ted Kluszewski', '1B', 'CIN', '1950s', 83, '.314 / 49 / 141'),
  p('Robin Roberts', 'SP', 'PHI', '1950s', 91, '28-7 / 2.59 / 198'),
  p('Al Kaline', 'RF', 'DET', '1950s', 87, '.340 / 27 / 102'),
  p('Richie Ashburn', 'CF', 'PHI', '1950s', 82, '.338 / 2 / 37'),

  // ================= 1960s =================
  // Cardinals
  p('Bob Gibson', 'SP', 'STL', '1960s', 95, '22-9 / 1.12 / 268'),
  p('Lou Brock', 'LF', 'STL', '1960s', 84, '.297 / 21 / 81'),
  p('Curt Flood', 'CF', 'STL', '1960s', 80, '.302 / 11 / 70'),
  p('Tim McCarver', 'C', 'STL', '1960s', 76, '.295 / 14 / 69'),
  // Dodgers
  p('Sandy Koufax', 'SP', 'LAD', '1960s', 98, '27-9 / 1.73 / 317'),
  p('Don Drysdale', 'SP', 'LAD', '1960s', 89, '25-9 / 2.83 / 246'),
  p('Maury Wills', 'SS', 'LAD', '1960s', 82, '.299 / 6 / 48'),
  // Giants
  p('Willie Mays', 'CF', 'SF', '1960s', 96, '.317 / 52 / 141'),
  p('Willie McCovey', '1B', 'SF', '1960s', 92, '.320 / 45 / 126'),
  p('Orlando Cepeda', '1B', 'SF', '1960s', 88, '.311 / 46 / 142'),
  p('Juan Marichal', 'SP', 'SF', '1960s', 92, '25-8 / 2.23 / 240'),
  // Orioles
  p('Brooks Robinson', '3B', 'BAL', '1960s', 90, '.317 / 28 / 118'),
  p('Frank Robinson', 'RF', 'BAL', '1960s', 94, '.316 / 49 / 122'),
  p('Jim Palmer', 'SP', 'BAL', '1960s', 86, '16-4 / 2.34 / 147'),
  p('Boog Powell', '1B', 'BAL', '1960s', 82, '.304 / 37 / 121'),
  // Twins
  p('Harmon Killebrew', '1B', 'MIN', '1960s', 90, '.276 / 49 / 140'),
  p('Tony Oliva', 'RF', 'MIN', '1960s', 84, '.323 / 25 / 98'),
  // Tigers
  p('Al Kaline', 'RF', 'DET', '1960s', 88, '.312 / 29 / 101'),
  p('Bill Freehan', 'C', 'DET', '1960s', 82, '.262 / 25 / 84'),
  p('Norm Cash', '1B', 'DET', '1960s', 80, '.361 / 41 / 132'),
  // Cubs
  p('Ernie Banks', '1B', 'CHC', '1960s', 84, '.269 / 37 / 104'),
  p('Ron Santo', '3B', 'CHC', '1960s', 89, '.313 / 30 / 123'),
  p('Billy Williams', 'LF', 'CHC', '1960s', 88, '.322 / 33 / 98'),
  p('Fergie Jenkins', 'SP', 'CHC', '1960s', 85, '21-15 / 2.80 / 273'),
  // Reds / Pirates / Braves / Red Sox / Yankees
  p('Pete Rose', 'RF', 'CIN', '1960s', 86, '.335 / 16 / 82'),
  p('Roberto Clemente', 'RF', 'PIT', '1960s', 94, '.357 / 23 / 110'),
  p('Willie Stargell', 'LF', 'PIT', '1960s', 84, '.315 / 33 / 102'),
  p('Bill Mazeroski', '2B', 'PIT', '1960s', 78, '.271 / 19 / 82'),
  p('Hank Aaron', 'RF', 'MLN', '1960s', 96, '.355 / 44 / 130'),
  p('Joe Torre', 'C', 'MLN', '1960s', 85, '.321 / 36 / 101'),
  p('Carl Yastrzemski', 'LF', 'BOS', '1960s', 92, '.326 / 44 / 121'),
  p('Joe Morgan', '2B', 'HOU', '1960s', 83, '.275 / 15 / 56'),

  // ================= 1970s =================
  // Reds (Big Red Machine)
  p('Johnny Bench', 'C', 'CIN', '1970s', 96, '.293 / 45 / 148'),
  p('Joe Morgan', '2B', 'CIN', '1970s', 96, '.327 / 27 / 111'),
  p('Pete Rose', 'RF', 'CIN', '1970s', 88, '.338 / 10 / 64'),
  p('Tony Perez', '1B', 'CIN', '1970s', 86, '.283 / 40 / 129'),
  p('Dave Concepcion', 'SS', 'CIN', '1970s', 82, '.281 / 14 / 69'),
  p('George Foster', 'LF', 'CIN', '1970s', 84, '.320 / 52 / 149'),
  // Athletics
  p('Reggie Jackson', 'RF', 'OAK', '1970s', 92, '.293 / 47 / 118'),
  p('Catfish Hunter', 'SP', 'OAK', '1970s', 86, '25-13 / 2.49 / 196'),
  p('Sal Bando', '3B', 'OAK', '1970s', 80, '.286 / 31 / 113'),
  p('Bert Campaneris', 'SS', 'OAK', '1970s', 78, '.290 / 8 / 46'),
  // Orioles
  p('Jim Palmer', 'SP', 'BAL', '1970s', 92, '23-11 / 2.40 / 193'),
  p('Brooks Robinson', '3B', 'BAL', '1970s', 84, '.276 / 18 / 88'),
  p('Bobby Grich', '2B', 'BAL', '1970s', 84, '.290 / 19 / 82'),
  // Pirates
  p('Willie Stargell', 'LF', 'PIT', '1970s', 90, '.295 / 48 / 119'),
  p('Dave Parker', 'RF', 'PIT', '1970s', 86, '.338 / 21 / 88'),
  // Red Sox
  p('Carl Yastrzemski', 'LF', 'BOS', '1970s', 86, '.296 / 28 / 102'),
  p('Jim Rice', 'LF', 'BOS', '1970s', 87, '.315 / 46 / 139'),
  p('Fred Lynn', 'CF', 'BOS', '1970s', 86, '.331 / 21 / 105'),
  p('Carlton Fisk', 'C', 'BOS', '1970s', 87, '.293 / 26 / 71'),
  // Phillies
  p('Mike Schmidt', '3B', 'PHI', '1970s', 93, '.286 / 38 / 107'),
  p('Steve Carlton', 'SP', 'PHI', '1970s', 94, '27-10 / 1.97 / 310'),
  // Royals / Angels / Twins / Yankees / Twins
  p('George Brett', '3B', 'KC', '1970s', 88, '.333 / 23 / 107'),
  p('Nolan Ryan', 'SP', 'CAL', '1970s', 91, '22-16 / 2.89 / 383'),
  p('Rod Carew', '1B', 'MIN', '1970s', 92, '.388 / 14 / 100'),
  p('Tom Seaver', 'SP', 'NYM', '1970s', 96, '22-9 / 1.76 / 289'),
  p('Thurman Munson', 'C', 'NYY', '1970s', 84, '.318 / 17 / 105'),
  p('Robin Yount', 'SS', 'MIL', '1970s', 84, '.293 / 8 / 49'),
  p('Cesar Cedeno', 'CF', 'HOU', '1970s', 84, '.320 / 22 / 82'),
  p('Gaylord Perry', 'SP', 'CLE', '1970s', 88, '24-16 / 1.92 / 234'),
  p('Dave Winfield', 'RF', 'SD', '1970s', 86, '.308 / 25 / 97'),

  // ================= 1980s =================
  // Tigers
  p('Alan Trammell', 'SS', 'DET', '1980s', 87, '.343 / 28 / 105'),
  p('Lou Whitaker', '2B', 'DET', '1980s', 86, '.320 / 28 / 85'),
  p('Jack Morris', 'SP', 'DET', '1980s', 85, '21-8 / 3.27 / 232'),
  p('Lance Parrish', 'C', 'DET', '1980s', 82, '.286 / 32 / 98'),
  p('Kirk Gibson', 'RF', 'DET', '1980s', 81, '.287 / 29 / 97'),
  // Mets
  p('Dwight Gooden', 'SP', 'NYM', '1980s', 90, '24-4 / 1.53 / 268'),
  p('Darryl Strawberry', 'RF', 'NYM', '1980s', 86, '.284 / 39 / 104'),
  p('Keith Hernandez', '1B', 'NYM', '1980s', 86, '.311 / 15 / 94'),
  p('Gary Carter', 'C', 'NYM', '1980s', 90, '.281 / 32 / 100'),
  // Cardinals
  p('Ozzie Smith', 'SS', 'STL', '1980s', 89, '.303 / 6 / 75'),
  p('Willie McGee', 'CF', 'STL', '1980s', 80, '.353 / 10 / 82'),
  // Brewers
  p('Robin Yount', 'SS', 'MIL', '1980s', 90, '.331 / 29 / 114'),
  p('Paul Molitor', '3B', 'MIL', '1980s', 86, '.353 / 16 / 75'),
  // Orioles
  p('Cal Ripken Jr.', 'SS', 'BAL', '1980s', 93, '.318 / 27 / 102'),
  p('Eddie Murray', '1B', 'BAL', '1980s', 90, '.306 / 33 / 124'),
  // Yankees
  p('Don Mattingly', '1B', 'NYY', '1980s', 89, '.343 / 35 / 145'),
  p('Rickey Henderson', 'LF', 'OAK', '1980s', 96, '.325 / 28 / 74'),
  p('Dave Winfield', 'RF', 'NYY', '1980s', 88, '.322 / 32 / 116'),
  // Red Sox
  p('Wade Boggs', '3B', 'BOS', '1980s', 92, '.368 / 8 / 71'),
  p('Roger Clemens', 'SP', 'BOS', '1980s', 93, '24-4 / 2.48 / 238'),
  p('Jim Rice', 'LF', 'BOS', '1980s', 84, '.309 / 39 / 126'),
  // Cubs / Padres / Braves / Royals / Expos
  p('Ryne Sandberg', '2B', 'CHC', '1980s', 91, '.314 / 40 / 100'),
  p('Andre Dawson', 'CF', 'CHC', '1980s', 87, '.287 / 49 / 137'),
  p('Tony Gwynn', 'RF', 'SD', '1980s', 92, '.370 / 7 / 54'),
  p('Dale Murphy', 'CF', 'ATL', '1980s', 90, '.302 / 36 / 121'),
  p('George Brett', '3B', 'KC', '1980s', 91, '.390 / 24 / 118'),
  p('Bret Saberhagen', 'SP', 'KC', '1980s', 84, '23-6 / 2.16 / 173'),
  p('Tim Raines', 'LF', 'MON', '1980s', 90, '.334 / 9 / 62'),
  p('Carlton Fisk', 'C', 'CWS', '1980s', 84, '.289 / 37 / 107'),
  p('Nolan Ryan', 'SP', 'HOU', '1980s', 89, '16-8 / 2.76 / 270'),
  p('Mike Schmidt', '3B', 'PHI', '1980s', 96, '.286 / 48 / 121'),

  // ================= 1990s =================
  // Braves
  p('Greg Maddux', 'SP', 'ATL', '1990s', 98, '19-2 / 1.63 / 181'),
  p('Tom Glavine', 'SP', 'ATL', '1990s', 90, '22-6 / 2.47 / 192'),
  p('John Smoltz', 'SP', 'ATL', '1990s', 89, '24-8 / 2.94 / 276'),
  p('Chipper Jones', '3B', 'ATL', '1990s', 92, '.319 / 45 / 110'),
  p('Fred McGriff', '1B', 'ATL', '1990s', 86, '.297 / 27 / 93'),
  p('David Justice', 'RF', 'ATL', '1990s', 80, '.275 / 40 / 120'),
  // Yankees
  p('Derek Jeter', 'SS', 'NYY', '1990s', 88, '.349 / 24 / 102'),
  p('Bernie Williams', 'CF', 'NYY', '1990s', 84, '.342 / 25 / 115'),
  p('Paul O’Neill', 'RF', 'NYY', '1990s', 80, '.359 / 21 / 117'),
  // Indians
  p('Albert Belle', 'LF', 'CLE', '1990s', 88, '.317 / 50 / 126'),
  p('Manny Ramirez', 'RF', 'CLE', '1990s', 90, '.333 / 45 / 165'),
  p('Jim Thome', '1B', 'CLE', '1990s', 88, '.291 / 49 / 123'),
  p('Kenny Lofton', 'CF', 'CLE', '1990s', 86, '.349 / 14 / 67'),
  p('Roberto Alomar', '2B', 'CLE', '1990s', 92, '.323 / 24 / 120'),
  p('Omar Vizquel', 'SS', 'CLE', '1990s', 78, '.333 / 5 / 66'),
  // Mariners
  p('Ken Griffey Jr.', 'CF', 'SEA', '1990s', 98, '.304 / 56 / 147'),
  p('Alex Rodriguez', 'SS', 'SEA', '1990s', 92, '.358 / 42 / 124'),
  p('Edgar Martinez', '3B', 'SEA', '1990s', 88, '.356 / 29 / 113'),
  p('Randy Johnson', 'SP', 'SEA', '1990s', 96, '20-4 / 2.48 / 294'),
  // Astros / White Sox / Giants / Red Sox / Rangers / Padres / Rockies
  p('Jeff Bagwell', '1B', 'HOU', '1990s', 92, '.368 / 39 / 116'),
  p('Craig Biggio', '2B', 'HOU', '1990s', 90, '.325 / 22 / 88'),
  p('Frank Thomas', '1B', 'CWS', '1990s', 94, '.347 / 41 / 128'),
  p('Barry Bonds', 'LF', 'SF', '1990s', 98, '.336 / 46 / 123'),
  p('Pedro Martinez', 'SP', 'BOS', '1990s', 97, '23-4 / 2.07 / 313'),
  p('Nomar Garciaparra', 'SS', 'BOS', '1990s', 86, '.357 / 35 / 122'),
  p('Mo Vaughn', '1B', 'BOS', '1990s', 82, '.337 / 44 / 143'),
  p('Ivan Rodriguez', 'C', 'TEX', '1990s', 92, '.332 / 35 / 113'),
  p('Juan Gonzalez', 'RF', 'TEX', '1990s', 84, '.318 / 47 / 157'),
  p('Mike Piazza', 'C', 'LAD', '1990s', 94, '.362 / 40 / 124'),
  p('Tony Gwynn', 'RF', 'SD', '1990s', 91, '.394 / 12 / 64'),
  p('Larry Walker', 'RF', 'COL', '1990s', 90, '.366 / 49 / 130'),
  p('Barry Larkin', 'SS', 'CIN', '1990s', 88, '.319 / 33 / 89'),
  p('Sammy Sosa', 'RF', 'CHC', '1990s', 88, '.308 / 66 / 158'),

  // ================= 2000s =================
  // Cardinals
  p('Albert Pujols', '1B', 'STL', '2000s', 98, '.359 / 47 / 135'),
  p('Scott Rolen', '3B', 'STL', '2000s', 86, '.314 / 34 / 124'),
  p('Jim Edmonds', 'CF', 'STL', '2000s', 88, '.311 / 42 / 111'),
  p('Yadier Molina', 'C', 'STL', '2000s', 78, '.304 / 7 / 56'),
  p('Chris Carpenter', 'SP', 'STL', '2000s', 84, '21-5 / 2.83 / 213'),
  // Red Sox
  p('David Ortiz', '1B', 'BOS', '2000s', 90, '.300 / 54 / 137'),
  p('Manny Ramirez', 'LF', 'BOS', '2000s', 92, '.349 / 43 / 130'),
  p('Pedro Martinez', 'SP', 'BOS', '2000s', 95, '20-4 / 2.22 / 206'),
  p('Curt Schilling', 'SP', 'BOS', '2000s', 86, '21-6 / 2.95 / 316'),
  // Yankees
  p('Alex Rodriguez', '3B', 'NYY', '2000s', 95, '.314 / 54 / 156'),
  p('Derek Jeter', 'SS', 'NYY', '2000s', 90, '.343 / 23 / 97'),
  p('Jorge Posada', 'C', 'NYY', '2000s', 84, '.338 / 22 / 90'),
  p('Hideki Matsui', 'LF', 'NYY', '2000s', 78, '.305 / 31 / 116'),
  // Phillies
  p('Chase Utley', '2B', 'PHI', '2000s', 90, '.332 / 32 / 103'),
  p('Ryan Howard', '1B', 'PHI', '2000s', 82, '.313 / 58 / 149'),
  p('Jimmy Rollins', 'SS', 'PHI', '2000s', 84, '.296 / 30 / 94'),
  p('Cole Hamels', 'SP', 'PHI', '2000s', 80, '15-5 / 3.39 / 196'),
  // Astros / Angels / Twins / Mariners / Giants / Brewers / Rockies / Braves
  p('Lance Berkman', '1B', 'HOU', '2000s', 86, '.315 / 45 / 136'),
  p('Roy Oswalt', 'SP', 'HOU', '2000s', 84, '20-10 / 2.94 / 206'),
  p('Vladimir Guerrero', 'RF', 'LAA', '2000s', 92, '.337 / 39 / 126'),
  p('Joe Mauer', 'C', 'MIN', '2000s', 90, '.365 / 28 / 96'),
  p('Johan Santana', 'SP', 'MIN', '2000s', 92, '20-6 / 2.61 / 245'),
  p('Ichiro Suzuki', 'RF', 'SEA', '2000s', 92, '.372 / 8 / 60'),
  p('Barry Bonds', 'LF', 'SF', '2000s', 99, '.362 / 73 / 137'),
  p('Todd Helton', '1B', 'COL', '2000s', 90, '.372 / 49 / 146'),
  p('Andruw Jones', 'CF', 'ATL', '2000s', 88, '.263 / 51 / 128'),
  p('Carlos Beltran', 'CF', 'NYM', '2000s', 90, '.275 / 41 / 116'),
  p('Roy Halladay', 'SP', 'TOR', '2000s', 93, '22-7 / 2.78 / 204'),
  p('Miguel Tejada', 'SS', 'OAK', '2000s', 84, '.308 / 34 / 150'),
  p('David Wright', '3B', 'NYM', '2000s', 86, '.325 / 30 / 107'),

  // ================= 2010s =================
  // Astros
  p('Jose Altuve', '2B', 'HOU', '2010s', 90, '.346 / 24 / 96'),
  p('Carlos Correa', 'SS', 'HOU', '2010s', 84, '.315 / 24 / 96'),
  p('George Springer', 'CF', 'HOU', '2010s', 84, '.283 / 34 / 85'),
  p('Justin Verlander', 'SP', 'HOU', '2010s', 92, '21-6 / 2.52 / 290'),
  p('Alex Bregman', '3B', 'HOU', '2010s', 84, '.296 / 41 / 112'),
  // Dodgers
  p('Clayton Kershaw', 'SP', 'LAD', '2010s', 98, '21-3 / 1.77 / 239'),
  p('Corey Seager', 'SS', 'LAD', '2010s', 84, '.308 / 26 / 72'),
  p('Justin Turner', '3B', 'LAD', '2010s', 80, '.322 / 27 / 71'),
  // Angels
  p('Mike Trout', 'CF', 'LAA', '2010s', 99, '.326 / 41 / 111'),
  // Tigers
  p('Miguel Cabrera', '1B', 'DET', '2010s', 96, '.348 / 44 / 139'),
  p('Max Scherzer', 'SP', 'DET', '2010s', 90, '21-3 / 2.90 / 240'),
  // Nationals
  p('Bryce Harper', 'RF', 'WSN', '2010s', 90, '.330 / 42 / 99'),
  p('Anthony Rendon', '3B', 'WSN', '2010s', 86, '.319 / 34 / 126'),
  p('Stephen Strasburg', 'SP', 'WSN', '2010s', 84, '18-6 / 3.46 / 242'),
  // Red Sox
  p('Mookie Betts', 'RF', 'BOS', '2010s', 94, '.346 / 32 / 80'),
  p('Dustin Pedroia', '2B', 'BOS', '2010s', 84, '.307 / 21 / 84'),
  p('Chris Sale', 'SP', 'BOS', '2010s', 90, '17-8 / 2.90 / 308'),
  // Cubs / Indians / Yankees / Rockies / Marlins / Brewers / Reds / Mets / Pirates / Blue Jays
  p('Kris Bryant', '3B', 'CHC', '2010s', 84, '.292 / 39 / 102'),
  p('Anthony Rizzo', '1B', 'CHC', '2010s', 86, '.292 / 32 / 109'),
  p('Francisco Lindor', 'SS', 'CLE', '2010s', 88, '.277 / 38 / 92'),
  p('Jose Ramirez', '3B', 'CLE', '2010s', 88, '.270 / 39 / 105'),
  p('Corey Kluber', 'SP', 'CLE', '2010s', 88, '18-4 / 2.25 / 245'),
  p('Aaron Judge', 'RF', 'NYY', '2010s', 90, '.284 / 52 / 114'),
  p('Nolan Arenado', '3B', 'COL', '2010s', 90, '.297 / 41 / 133'),
  p('Troy Tulowitzki', 'SS', 'COL', '2010s', 86, '.315 / 30 / 95'),
  p('Giancarlo Stanton', 'RF', 'MIA', '2010s', 88, '.281 / 59 / 132'),
  p('Christian Yelich', 'LF', 'MIL', '2010s', 90, '.329 / 36 / 110'),
  p('Joey Votto', '1B', 'CIN', '2010s', 92, '.326 / 37 / 113'),
  p('Jacob deGrom', 'SP', 'NYM', '2010s', 92, '11-8 / 1.70 / 269'),
  p('Andrew McCutchen', 'CF', 'PIT', '2010s', 90, '.317 / 21 / 96'),
  p('Buster Posey', 'C', 'SF', '2010s', 90, '.336 / 24 / 103'),
  p('Yadier Molina', 'C', 'STL', '2010s', 82, '.319 / 22 / 80'),
  p('Paul Goldschmidt', '1B', 'ARI', '2010s', 90, '.321 / 36 / 125'),
  p('Robinson Cano', '2B', 'SEA', '2010s', 88, '.314 / 25 / 103'),
  p('Salvador Perez', 'C', 'KC', '2010s', 80, '.268 / 27 / 80'),
  p('J.T. Realmuto', 'C', 'MIA', '2010s', 82, '.277 / 21 / 74'),
  p('Freddie Freeman', '1B', 'ATL', '2010s', 90, '.319 / 38 / 121'),
  p('Adrian Beltre', '3B', 'TEX', '2010s', 88, '.324 / 32 / 105'),
];
