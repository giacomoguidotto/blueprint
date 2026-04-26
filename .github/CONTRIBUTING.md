# Contributing

Welcome to Blueprint! We're thrilled that you'd like to contribute. Your help is essential for making it better.

## Prerequisites

- [Bun](https://bun.sh) (package manager and runtime)
- [Node.js](https://nodejs.org) v20+
- A [Convex](https://convex.dev) account (for backend development)

## Getting Started

Before you start contributing, please make sure you have read and understood our [Code of Conduct](CODE_OF_CONDUCT.md).

1. Fork the [repository](https://github.com/giacomoguidotto/blueprint) to your own GitHub account.

2. Clone your fork:

    ```sh
    git clone https://github.com/<your-username>/blueprint.git
    ```

3. Navigate to the project directory:

    ```sh
    cd blueprint
    ```

4. Install dependencies:

    ```sh
    bun install
    ```

5. Create a new branch for your feature or bug fix:

    ```sh
    git checkout -b feat/feature-branch
    ```

6. Start the development server (Next.js + Convex):

    ```sh
    bun run dev
    ```

7. Make your changes, then verify everything works:

    ```sh
    bun run ci
    ```

    This runs the same checks as CI: lint, typecheck, test, and build. You can also run them individually:

    ```sh
    bun run lint        # Biome linter
    bun run typecheck   # TypeScript strict mode
    bun run test        # Vitest unit tests
    bun run build       # Next.js production build
    ```

8. Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

    ```sh
    git add .
    git commit -m "feat: description of your changes"
    ```

9. Push your changes to your fork:

    ```sh
    git push origin feat/feature-branch
    ```

10. Open a Pull Request against the `main` branch.

## Project Structure

- `src/features/[feature]/` — domain modules (components, store, schemas, types)
- `src/components/` — shared UI (shadcn/ui in `ui/`)
- `convex/` — backend functions and schema (`_generated/` is auto-generated, never edit)
- `messages/` — i18n translation files (en, it)
- `e2e/` — Playwright E2E tests

## Code Style

- **Linting & formatting**: [Biome](https://biomejs.dev) via [ultracite](https://github.com/haydenbleasel/ultracite) — not ESLint or Prettier
- **Check**: `bun run lint`
- **Auto-fix**: `bun run format`
- **CI runs**: `bunx ultracite check`

## Naming Conventions

- Components: PascalCase (`TaskList.tsx`)
- Utilities/hooks: camelCase (`useTranslations`, `taskFilterAtom`)
- Test files: co-located as `*.test.ts` (unit) or `*.spec.ts` (E2E in `e2e/`)
- Constants: SCREAMING_SNAKE_CASE (`TASK_STATUSES`)

## Testing

- **Unit tests**: `bun run test` (Vitest with Testing Library)
- **E2E tests**: `bun run test:e2e` (Playwright)
- Place unit tests next to the code they test (`*.test.ts`)
- Place E2E tests in the `e2e/` directory (`*.spec.ts`)

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `test:` — adding or updating tests
- `chore:` — maintenance tasks
