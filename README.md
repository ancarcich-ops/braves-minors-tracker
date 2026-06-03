# Braves Minors Tracker

A daily-updating dashboard for the **Atlanta Braves minor-league system** —
scores, prospects, risers/slumpers, and transactions across every affiliate.

> Self-contained app. It lives in this folder and shares nothing with the
> golf app at the repository root. Easy to extract into its own repo later.

## Also in here: **162-0** — the perfect-season game

A standalone browser game lives alongside the tracker at **`/162-0`** (a
baseball take on [82-0.com](https://82-0.com)). Each round a slot machine spins
a **franchise + decade**; you draft the best player from that team and era to
fill one of nine lineup spots — using **one player per decade**. Then a season
sim plays out 162 games and hands you a record. Nobody's gone 162-0 yet.

It's a separate route group, so it shares zero UI with the tracker:

- `src/app/162-0/` — the game (client) + its full-screen layout
- `src/app/(tracker)/` — the tracker routes (`/`, `/prospects`, `/movers`, `/transactions`)
- `src/lib/players.ts` · `game.ts` · `sim.ts` — game data, draft rules, season simulation

## Status

| Feature | State |
| --- | --- |
| Daily scores across all affiliates | ✅ v1 |
| Prospects (seeded Top-30, editable) | 🔜 next |
| Risers & Slumpers (trend engine) | 🔜 needs nightly snapshots |
| Transactions feed | 🔜 next |

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

## Deploy

Deploys cleanly to Vercel as its own project (set the **root directory** to
`braves-tracker`). The live API works from Vercel's network.
