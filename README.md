# Farm System — MLB Minor-League Tracker

A daily-updating dashboard for **every MLB organization's** minor-league system —
scores, prospects, risers/slumpers, and transactions across every affiliate,
with a team switcher at the top plus a global Top-100 board.

> Self-contained app. It lives in this folder and shares nothing with the
> golf app at the repository root. Easy to extract into its own repo later.

## Status

| Feature | State |
| --- | --- |
| All 30 teams + team switcher | ✅ v1 |
| Daily scores across all affiliates | ✅ v1 |
| Prospect Watch (good games today, on the dashboard) | ✅ v1 |
| Prospects (seeded Top-30, editable) | ✅ v1 (curated: Braves, Dodgers; others roster-derived) |
| Top 100 prospects (global) | ✅ v1 (seeded, editable) |
| Transactions feed | ✅ v1 |
| Risers & Slumpers (game-log trend engine) | ✅ v1 |
| Per-team theming + dynamic background | ✅ v1 |

## Stack

- **Next.js 14** (App Router, server components)
- **Tailwind CSS**
- **MLB Stats API** (`statsapi.mlb.com`) — free, no key, covers all minor levels
- _(coming)_ Prisma + Postgres for snapshots & prospect rankings; a daily
  Vercel Cron job for ingestion.

## Run it

```bash
cd braves-tracker
npm install
npm run dev          # http://localhost:3000
```

### Network-restricted environments

The live MLB API may be blocked (e.g. sandboxes with a host allowlist). Set:

```bash
USE_MOCK_DATA=1 npm run dev
```

to render the UI from the built-in sample dataset. With the API reachable,
leave it unset — the app fetches live and only falls back to mock on error.

## How the data works

- **Affiliates are resolved dynamically** from the API
  (`/teams/affiliates?teamIds=144`) rather than hardcoded, so relocations and
  rebrands (Mississippi → Columbus Clingstones, Rome Braves → Emperors) are
  picked up automatically.
- **Scores** come from `/schedule` hydrated with `linescore`, filtered to the
  Braves' affiliate team ids.
- **Prospects** start from a seeded Top-30 (`src/lib/prospectSeed.ts`,
  reconstructed from MLB Pipeline's 2026 list and easy to replace). At request
  time each player is matched against the live affiliate rosters to resolve an
  MLB id, current level, and headshot, then their season line is pulled from
  `/people/{id}/stats`. Re-rankings are saved per-browser (localStorage);
  DB-backed persistence is a later milestone.
- **Transactions** come from `/transactions` for the parent club (id 144) plus
  every affiliate over a trailing 30-day window, de-duplicated and sorted
  newest-first, then bucketed (promotion / option / IL / signing / release /
  trade) for color-coding.
- **Risers & Slumpers** is computed live from each tracked prospect's
  game-by-game logs (`stats=gameLog`) — recent last-15 form vs. season rates,
  hitters on OPS and pitchers on ERA, with min-sample filters. No stored
  history required (so it works without a database).
- **Prospect Watch** on the dashboard scans today's affiliate boxscores, flags
  tracked Top-30 prospects who had a notable game (with their rank + line), and
  links to a player-keyed video highlight from `/game/{pk}/content` when one
  exists, falling back to the game's Gameday page.

## Multi-team

- Every MLB org lives in `src/lib/teams.ts` (parent-club id + brand colors).
  The selected team is stored in a cookie (`TeamSwitcher` → `getSelectedTeam`),
  and all data fetchers take the org id, so scores, transactions, movers, and
  prospect-watch work for any club. Brand colors flow through CSS variables, so
  the whole UI (and the animated background) recolors per team.
- **Prospects** uses a curated Top-30 seed where one exists
  (`src/lib/prospectSeed.ts` — Braves & Dodgers today); for every other club it
  auto-derives a Top-30 from the org's affiliate rosters (youngest at the
  highest levels), clearly labeled, until a curated seed is dropped in.
- **Top 100** (`/top100`) is a global seeded board (`src/lib/top100Seed.ts`),
  enriched with each player's live id, level, and season stats.

## Look & feel

Glassmorphic dark UI on the Braves palette (navy / red / gold) with a dynamic,
slowly-crossfading animated background (`BackgroundFX`), Framer Motion reveals,
a sticky icon nav (labels collapse to icons on small screens), and Geist type.
Honors `prefers-reduced-motion`.

## Deploy

Deploys cleanly to Vercel as its own project (set the **root directory** to
`braves-tracker`). The live API works from Vercel's network.
