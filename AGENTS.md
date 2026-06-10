
# Blueprint

Next.js 16 starter template with Convex real-time backend, WorkOS auth, and OpenTelemetry observability.

## Quickstart

- **Package manager:** Bun (`bun install`, not `npm`)
- **Dev:** `bun run dev` (starts Next.js + Convex concurrently)
- **Lint/Format:** `bun run lint` / `bun run format` (Biome, not ESLint/Prettier)
- **Typecheck:** `bun run typecheck`
- **Test:** `bun run test` (Vitest) / `bun run test:e2e` (Playwright)
- **Build:** `bun run build`

## Structure

- `src/features/[feature]/` — domain modules (components, store, schemas, types)
- `src/components/` — shared UI (shadcn/ui in `ui/`)
- `convex/` — backend functions and schema (`_generated/` is auto-generated, never edit)
- `messages/` — i18n translation files (en, it)
- `e2e/` — Playwright E2E tests

## Agent guidelines

- [Conventions](docs/agents/conventions.md) — TypeScript, Biome, imports, naming
- [Testing](docs/agents/testing.md) — Vitest and Playwright patterns
- [Backend](docs/agents/backend.md) — Convex functions, schema, auth
- [Frontend](docs/agents/frontend.md) — Components, i18n, state, forms
- [Observability](docs/agents/observability.md) — Effect, OpenTelemetry, telemetry
