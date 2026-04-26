# Contributing

Thanks for wanting to contribute to Blueprint! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

## Setup

1. Fork and clone the repo, then install dependencies:

    ```sh
    bun install
    ```

    > **Optional:** If you use [mise](https://mise.jdx.dev), run `mise install` first to
    > provision the pinned `node` and `bun` versions from `mise.toml`.

2. Start the dev server (Next.js + Convex):

    ```sh
    bun run dev
    ```

3. Before pushing, run the full CI check locally:

    ```sh
    bun run ci
    ```

    This runs lint, typecheck, test, and build — the same pipeline as CI.

## Tooling

- **Runtime / package manager**: [Bun](https://bun.sh)
- **Backend**: [Convex](https://convex.dev) — never edit `convex/_generated/`
- **Linting & formatting**: [Biome](https://biomejs.dev) via ultracite — not ESLint or Prettier
- **Tests**: [Vitest](https://vitest.dev) (unit, co-located `*.test.ts`) / [Playwright](https://playwright.dev) (E2E, `e2e/*.spec.ts`)
- **i18n**: `messages/` directory (en, it)

## Conventions

- Branch names: `feat/`, `fix/`, `docs/`, etc.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
- Components: PascalCase — Utilities/hooks: camelCase — Constants: SCREAMING_SNAKE_CASE
- All UI must use shadcn/ui components (`src/components/ui/`)
- Convex functions must have `args`, `returns`, and `handler`
- Use Zod v4 (`zod/v4`) for validation
