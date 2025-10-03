# Sports Scoreboard Dashboard

A real-time iPad-friendly dashboard for tracking live NCAAF and NFL games: scores, game state (quarter, clock, down & distance), timeouts, last play, and upcoming schedules—refreshing automatically every 10–15 seconds.

## Key Qualities
- Real-time: Near-live updates without manual refresh
- Comprehensive: Live, upcoming, and final game states
- Professional: Broadcast-style layout optimized for quick scanning

## Current Focus
- Live game cards (score, status, clock, down/distance, last play)
- Upcoming games section
- League toggle (NFL / NCAAF)
- Auto-refresh with efficient update cycle
- Graceful handling of stale or failed data

## Roadmap Snapshot
Planned (see PRD.md for full detail):
- Enhanced error + offline indicators
- Backoff for rate limiting
- Visual score-change highlights
- Accessibility refinements (ARIA live regions, contrast modes)
- Theming tokens integration

## Quick Start

Prerequisites: Node 18+

Install:
```bash
npm install
```
Development:
```bash
npm run dev
```
Type check:
```bash
npm run typecheck
```
Build:
```bash
npm run build
```
Preview production build:
```bash
npm run preview
```
(If tests and lint scripts are added later, they will appear here.)

## Configuration

`runtime.config.json` (runtime-level, not committed per-environment in prod deployments) – planned keys:
```json
{
  "refreshIntervalMs": 12000,
  "defaultLeague": "NFL"
}
```
Planned future keys (documented early):
- `apiBaseUrl`: Base URL for live data provider
- `websocketUrl`: Optional real-time channel (future)
- `maxConcurrentFetches`: Guardrail for scaling
- `retryBackoffMs`: Base backoff for transient errors

You can override via environment-injected variables or build-time defines later (see CONTRIBUTING.md once initialized).

## Architecture (High-Level)

Data Flow:
```
[Fetch Adapter] → [Parse/Normalize] → [In-Memory State] → [Render Components]
```
Primary Concepts:
- Game (league, teams, score, status, clock, possession, timeouts)
- GameStatus (upcoming | live | final)
- Refresh Engine (interval-based now; potential WebSocket later)

Update Loop:
1. Schedule interval
2. Fetch latest payload
3. Diff against current state (only mutate changed games)
4. Trigger re-render
5. Reschedule

Edge Cases (see PRD.md):
- API failure: retain last known + show degraded indicator
- No games: friendly empty state
- Network offline: passive offline badge
- Rate limiting: exponential backoff (planned)

## Design Principles
- Information density without clutter
- Consistent spacing (4-unit base grid)
- Accessible contrast (see PRD.md color ratios)
- Subtle motion to highlight state changes (score first, then other changes)

## Theming (Early Stub)
Tailwind + future token bridge (`theme.json`). Planned: tokens for color families, spacing scale, typography, elevations, motion timings.

## Accessibility (In Progress)
Planned:
- ARIA live regions for score changes
- Reduced-motion preference respect
- High-contrast theme toggle

## Documentation Map
- `PRD.md`: Product requirements & design direction
- `SECURITY.md`: Security reporting
- `CONTRIBUTING.md`: Development & contribution process
- `CHANGELOG.md`: Version history (starts once first release tagged)

## License
MIT – see `LICENSE`.

## Security
Please report vulnerabilities via the process in `SECURITY.md`.

## Status
Early scaffolding phase; implementation is being layered in alongside documentation and structure.

---

### Suggested Domain Types (Preview)
```ts
export interface Team {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  logoUrl?: string;
  record?: string;
  timeoutsRemaining?: number;
}

export type GamePhase = 'upcoming' | 'live' | 'final';

export interface Game {
  id: string;
  league: 'NFL' | 'NCAAF';
  home: Team;
  away: Team;
  homeScore: number;
  awayScore: number;
  status: GamePhase;
  quarter?: number;
  clock?: string;          // e.g. "12:34"
  downDistance?: string;   // e.g. "3rd & 4 at NYG 32"
  possessionTeamId?: string;
  lastPlay?: string;
  kickoffTime?: string;    // ISO
  updatedAt: string;       // ISO
}

export interface GameUpdatePayload {
  games: Game[];
  fetchedAt: string;
}
```
