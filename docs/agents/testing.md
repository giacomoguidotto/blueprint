
# Testing

## Vitest (unit/integration)

Config: `vitest.config.ts` — two projects:

| Project | Scope | Environment | Files |
|---------|-------|-------------|-------|
| `unit` | `src/**/*.test.{ts,tsx}` | happy-dom | Frontend tests |
| `convex` | `convex/**/*.test.ts` | node | Backend tests (uses `convex-test`) |

- Globals enabled (`describe`, `it`, `expect` — no imports needed)
- Setup file: `vitest.setup.ts`
- Run: `bun run test` (all), `bun run test:unit`, `bun run test:watch`

## Playwright (E2E)

Config: `playwright.config.ts` — three projects:

| Project | Purpose | Depends on |
|---------|---------|------------|
| `setup` | Runs auth flow, saves session to `e2e/.auth/user.json` | — |
| `public` | Tests unauthenticated pages (`*.spec.ts` except `tasks.spec.ts`) | — |
| `authenticated` | Tests logged-in flows (`tasks.spec.ts`) | `setup` |

- Tests live in `e2e/`
- Base URL: `http://localhost:3000`
- Dev server started automatically via `bun run dev:fe`
- Run: `bun run test:e2e`, `bun run test:e2e:ui` (with UI)
