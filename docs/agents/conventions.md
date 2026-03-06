
# Conventions

## TypeScript

- Strict mode enabled, target ES2017
- Path aliases: `@/*` → `src/*`, `convex/*` → `convex/*`
- Use `type` imports for type-only imports (`import type { Foo }`)
- Derive types from Convex schema (`Doc<"table">`, `Id<"table">`) rather than duplicating

## Linting & Formatting

- **Biome** — not ESLint or Prettier. Config: `biome.json`
- Extends `ultracite/biome/core` and `ultracite/biome/next`
- 2-space indent, auto-organized imports
- Check before committing: `bun run lint`
- CI runs `bunx ultracite check`

## Naming

- Components: PascalCase (`TaskList.tsx`)
- Utilities/hooks: camelCase (`useTranslations`, `taskFilterAtom`)
- Test files: co-located as `*.test.ts` (unit) or `*.spec.ts` (E2E in `e2e/`)
- Constants: SCREAMING_SNAKE_CASE (`TASK_STATUSES`, `TASK_PRIORITIES`)

## Validation

- Use Zod v4 (`zod/v4`) for form and input validation
- Co-locate schemas with their feature (`src/features/[feature]/schemas.ts`)
- Export inferred types: `type Foo = z.infer<typeof fooSchema>`
