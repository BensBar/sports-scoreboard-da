# Contributing Guide

Thank you for your interest in improving the Sports Scoreboard Dashboard.

## Development Setup
1. Clone the repository:
```bash
git clone https://github.com/BensBar/sports-scoreboard-da.git
```
2. Install dependencies:
```bash
npm install
```
3. Start dev server:
```bash
npm run dev
```
4. Open the local URL (shown in terminal) on an iPad or responsive emulator for layout checks.

## Scripts (Planned Additions)
- `npm run dev` – Start development server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run typecheck` – TypeScript noEmit validation
- (Future) `npm run lint` – Lint sources
- (Future) `npm test` – Run unit tests
- (Future) `npm run verify` – Aggregate (typecheck + lint + test)

## Code Structure (Target Layout)
```
src/
  api/           # Data fetching + provider abstractions
  domain/        # Core types (Game, Team, Status)
  components/    # UI components (GameCard, LeagueToggle, Indicators)
  features/      # Bundled feature logic
  hooks/         # Reusable stateful logic (useGames, useRefreshLoop)
  utils/         # Pure helpers (time formatting, diffing)
  styles/        # Global styles / token bridge
  tests/         # Unit/component tests (future)
```

## Coding Conventions
- TypeScript strict mode
- Prefer functional components
- Separate domain types from API transport shapes
- Pure transforms first; side effects isolated
- Avoid implicit mutations; explicit state transitions

## Commit Message Style
Conventional Commits (recommended):
```
feat: add live game diff engine
fix: correct clock formatting for halftime
docs: expand README architecture section
chore: bump dependencies
refactor: normalize possession handling
```

## Branch Naming
```
feature/<short-description>
fix/<issue-or-bug>
chore/<task>
docs/<scope>
```

## Adding Features
1. Open or reference an issue (tie to PRD items when possible).
2. Discuss edge cases (API gaps, latency concerns) if unclear.
3. Implement with minimal regression risk.
4. Add/update tests (once harness exists).
5. Submit PR including:
   - Summary
   - Screenshots (UI changes)
   - Config implications

## Runtime Configuration
`runtime.config.json` is a non-secret runtime override file. Future environment-specific values may migrate to environment variables or a served JSON endpoint. Do not commit secrets.

## Accessibility Expectations
- No critical info conveyed solely by color.
- Live updates avoid disruptive layout shifts.
- Planned: `aria-live` regions for score deltas.

## Performance Principles
- Diff incoming vs current state; avoid whole-list re-renders.
- Batch state updates per refresh cycle.
- Defer heavy parsing until needed (e.g., expanded play details).

## Testing Philosophy (Planned)
- Domain logic: deterministic unit tests.
- Components: render + state transition tests.
- E2E (later): scoreboard load + league toggle smoke test.

## License
By contributing you agree your contributions are licensed under the MIT License.
