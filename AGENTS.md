This file provides **strict** guidance when working with this repository. Follow these rules without exception.

## Workflow Requirements

### Before Writing Any Code

1. **Read first, code second** — Never propose changes to code you haven't read. Use `Read` to understand existing patterns.
2. **Check existing components** — Before creating any UI, check `src/components/ui/` for existing shadcn/ui components.
3. **Understand the feature structure** — Review `src/features/` to understand how features are organized.
4. **Research before coding** — Search for relevant official docs, GitHub issues, changelogs, or known bugs for any library or API you are about to use. Use `WebSearch` or `WebFetch` to verify current best practices, especially for Convex, Next.js, WorkOS, and shadcn/ui.

### After Every Code Change

1. **Run lint/format** — Execute `bunx ultracite fix` after every edit. No exceptions.
2. **Run CodeRabbit review** — If available, invoke `/coderabbit:review` or `/coderabbit:code-review` to get AI code review feedback before finalizing changes.
3. **Verify types** — Ensure TypeScript compiles without errors.

### Code Review Checklist

Before considering any task complete:

- [ ] Lint passes (`bunx ultracite fix`)
- [ ] TypeScript compiles without errors
- [ ] No `any` types introduced (use `unknown` if truly unknown)
- [ ] No `console.log` or `debugger` statements
- [ ] All UI uses shadcn/ui components
- [ ] Convex functions have `args`, `returns`, and `handler`
- [ ] Indexes used instead of `.filter()` in Convex queries

---

## Build & Development Commands

```bash
bun dev          # Start Next.js + Convex dev servers concurrently
bun dev:fe       # Start only Next.js dev server
bun dev:be       # Start only Convex dev server
bun build        # Build for production
bun lint         # Lint & check code (Biome)
bun format       # Format code (Biome)
```

### Devenv Environment

This project uses **devenv** for reproducible development. **NEVER assume `bun`, `node`, or any dev tool is globally available.** Always test for availability and, if not any tool was not found, activate devenv:

```bash
export PATH=".devenv/profile/bin:$PATH"
```

---

## Architecture Overview

### Stack

- **Frontend**: Next.js 16 (App Router) + React 19 with React Compiler
- **Backend**: Convex (real-time database, serverless functions)
- **Auth**: WorkOS AuthKit (JWT-based, synced to Convex via webhook)
- **Styling**: Tailwind CSS 4 + **shadcn/ui components (MANDATORY)**
- **i18n**: next-intl with locale prefix routing
- **State**: Jotai for client-side state, Convex for server state

### Directory Structure

```
convex/                  # Backend: schema, queries, mutations, actions
  schema.ts              # Database schema (single source of truth for types)
  http.ts                # HTTP routes including auth webhook
src/
  app/[locale]/          # Next.js App Router pages with i18n
  features/[name]/       # Feature modules (components, types, store, hooks)
  lib/[domain]/          # Domain libraries (telemetry, utils, motion…)
  components/ui/         # shadcn/ui components
  components/providers/  # Context providers (Convex, Theme, i18n)
  i18n/routing.ts        # Locale configuration (single source of truth)
  instrumentation.ts     # Next.js instrumentation hook (boots telemetry runtime)
  proxy.ts               # Middleware: auth + i18n + CSP
messages/                # Translation JSON files per locale
```

### Co-location over type-based folders

**Do not create generic folders named by file type** (`hooks/`, `utils/`, `helpers/`). Place every file next to the domain it belongs to:

- A hook that wraps telemetry → `src/lib/telemetry/use-traced-mutation.ts`
- A hook specific to a feature → `src/features/[name]/use-[name].ts`
- Only `src/components/ui/` is an exception because shadcn/ui mandates it

The rule of thumb: if moving a file would break nothing conceptually except the folder name, the folder is wrong.

### Shared scaffolding components (`src/components/[domain]/`)

Components that have **no single feature owner** and are mounted at the app-shell level (header, nav, global controls) live in `src/components/[domain]/`. These subdirectories are **domain-named** (not type-named) and are expected to stay small and stable — they are not a dumping ground.

- `src/components/auth/` — auth UI mounted in the shell (user menu, sign-in/out buttons)
- `src/components/controls/` — global controls (theme toggle, language selector)
- `src/components/errors/` — shared error boundary UI (used across multiple routes)
- `src/components/layout/` — structural chrome (header, nav)

**Do not** put feature-specific components here. If a component is only rendered within a feature route, it belongs in `src/features/[name]/`.

---

## UI Component Rules (STRICT)

### Always Use shadcn/ui

**MANDATORY**: All UI must be built on top of shadcn/ui components from `src/components/ui/`.

- **DO**: Use `<Button>`, `<Card>`, `<Dialog>`, `<Input>`, etc. from shadcn/ui
- **DO NOT**: Create custom buttons, inputs, cards, or modals from scratch
- **DO NOT**: Use raw HTML elements when a shadcn/ui component exists

### Before Creating Any UI Component

1. Check `src/components/ui/` for existing components
2. If a component doesn't exist, add it via `bunx shadcn@latest add <component>`
3. Compose complex UI from existing shadcn/ui primitives

### Component Patterns

```typescript
// CORRECT: Using shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// WRONG: Custom implementations
<button className="...">Click me</button>  // NO
<div className="rounded border p-4">...</div>  // NO — use Card
```

### Styling Rules

- Use Tailwind CSS utility classes
- Follow the existing design system (check `src/app/globals.css` for CSS variables)
- Use semantic HTML with ARIA attributes for accessibility
- Use Next.js `<Image>` component, never `<img>`
- Add `rel="noopener"` with `target="_blank"`

---

## Convex Guidelines (STRICT)

### Function Syntax — ALWAYS Use This Format

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { userId: v.id("users") },
  returns: v.object({ name: v.string() }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return { name: user?.name ?? "Unknown" };
  },
});
```

**REQUIRED**: Every function must have `args`, `returns`, and `handler`. Use `returns: v.null()` for void functions.

### Function Types

| Type | Registration | Visibility | Use Case |
|------|--------------|------------|----------|
| `query` | Public | Client-accessible | Read data |
| `mutation` | Public | Client-accessible | Write data |
| `action` | Public | Client-accessible | External APIs |
| `internalQuery` | Private | Convex-only | Internal reads |
| `internalMutation` | Private | Convex-only | Internal writes |
| `internalAction` | Private | Convex-only | Internal external calls |

### Function References

- Use `api.filename.functionName` for public functions
- Use `internal.filename.functionName` for internal functions
- Add type annotation when calling functions in same file to avoid circularity

### Query Rules

```typescript
// CORRECT: Use withIndex
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
  .order("desc")
  .take(10);

// WRONG: Never use filter
const messages = await ctx.db
  .query("messages")
  .filter((q) => q.eq(q.field("channelId"), args.channelId))  // NO
  .collect();
```

- **NEVER use `.filter()`** — define indexes and use `.withIndex()`
- Use `.unique()` for single document queries
- Use `.order("asc")` or `.order("desc")` for ordering
- Collect results before deleting (no chained `.delete()`)

### Schema Rules

- Define schema in `convex/schema.ts`
- Index name must include all fields: `by_user_and_status` for `["userId", "status"]`
- Index fields must be queried in definition order
- System fields `_id` and `_creationTime` are automatic

### Actions

- Add `"use node";` at top of files using Node.js modules
- Actions cannot access `ctx.db` — use `ctx.runQuery`/`ctx.runMutation`
- Minimize query/mutation calls to avoid race conditions

### HTTP Endpoints

```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();
http.route({
  path: "/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    return new Response(null, { status: 200 });
  }),
});
export default http;
```

---

## TypeScript Rules (STRICT)

### Type Safety

- **NEVER use `any`** — use `unknown` if type is genuinely unknown
- Use `as const` for string literals and immutable values
- Use `Id<"tableName">` for Convex document IDs, not `string`
- Prefer type narrowing over type assertions

### Modern Patterns

```typescript
// CORRECT
const value = obj?.nested?.prop ?? "default";
for (const item of items) { /* ... */ }
const doubled = numbers.map((n) => n * 2);

// WRONG
const value = obj && obj.nested && obj.nested.prop || "default";  // NO
items.forEach((item, i) => { /* ... */ });  // NO — use for...of
```

### Variable Declarations

- Use `const` by default
- Use `let` only when reassignment is needed
- **NEVER use `var`**

### Async/Await

- Always `await` promises in async functions
- Use `async/await` over promise chains
- Handle errors with try-catch blocks
- Don't use async functions as Promise executors

---

## React Rules (STRICT)

### Component Patterns

- Function components only — no class components
- Hooks at top level only — never conditionally
- Complete dependency arrays — no missing deps, no unnecessary deps
- Use `key` prop with unique IDs — never array indices

### Accessibility

- Provide meaningful `alt` text for images
- Use proper heading hierarchy (h1 → h2 → h3)
- Add labels for form inputs
- Include keyboard handlers alongside mouse events
- Use semantic elements (`<button>`, `<nav>`) not divs with roles

### Next.js Specific

- Use `<Image>` from `next/image`, not `<img>`
- Use App Router metadata API for head elements
- Use Server Components for data fetching

---

## Code Style (Ultracite/Biome)

### Formatting

Run after every edit:

```bash
bunx ultracite fix
```

Check for issues:

```bash
bunx ultracite check
```

### Enforced Rules

- 2-space indentation
- Double quotes for strings
- Trailing commas in multiline
- Semicolons required
- Sorted imports

### Forbidden Patterns

- `console.log`, `debugger`, `alert` in production code
- Throwing non-Error values
- `eval()` or direct `document.cookie` assignment
- Spread syntax in loop accumulators
- Barrel files (index re-exports)
- Components defined inside other components

---

## Git Commits (Conventional Commits)

**MANDATORY**: All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Use Case |
|------|----------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |
| `ci` | CI/CD configuration |
| `revert` | Reverting a previous commit |

### Rules

- **Type is required** — always start with a type
- **Lowercase** — type and description in lowercase
- **No period** — don't end the description with a period
- **Imperative mood** — "add feature" not "added feature"
- **Short description** — 50 characters or less for the first line
- **Scope is optional** — use to specify the area (e.g., `feat(auth):`, `fix(convex):`)

### Examples

```bash
# Feature
feat: add user profile page
feat(auth): implement password reset flow

# Bug fix
fix: resolve race condition in message loading
fix(ui): correct button alignment on mobile

# Documentation
docs: update API documentation
docs(readme): add deployment instructions

# Refactor
refactor: extract validation logic into helper
refactor(convex): simplify query structure

# Chore
chore: update dependencies
chore(deps): bump convex to 1.17.0
```

### Breaking Changes

For breaking changes, add `!` after the type or use `BREAKING CHANGE:` in the footer:

```bash
feat!: remove deprecated API endpoints

feat(api): change response format

BREAKING CHANGE: response now returns array instead of object
```

---

## Auth Flow

1. WorkOS AuthKit handles sign-in/sign-up (`src/app/[locale]/sign-in/` and `/sign-up/`)
2. Auth callback at `/callback` exchanges code for session
3. ConvexClientProvider wraps app with `ConvexProviderWithAuth` using WorkOS tokens
4. Convex backend validates JWT and looks up user via `authId` (WorkOS subject)

Unauthenticated routes are configured in `src/proxy.ts` via `unauthenticatedPaths` array.

---

## Adding Features

### Workflow

1. Define entities in `convex/schema.ts`
2. Create backend functions in `convex/[feature].ts`
3. Create frontend in `src/features/[feature]/` (components, types, store)
4. Add routes in `src/app/[locale]/`
5. Run `bunx ultracite fix`
6. Run CodeRabbit review if available

### Adding Locales

1. Add locale to `src/i18n/routing.ts` in `locales` array and `localeNativeName` record
2. Create `messages/[locale].json` matching structure of `messages/en.json`

---

## Error Handling

- Throw `Error` objects with descriptive messages
- Use early returns for error cases
- Don't catch errors just to rethrow them
- Validate at system boundaries (user input, external APIs)

---

## Security

- Add `rel="noopener"` with `target="_blank"`
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't expose internal functions as public (`query`, `mutation`, `action`)
- Validate and sanitize all user input
- Never commit secrets or credentials

---

## Performance

- Use indexes for all Convex queries
- Avoid spread in loop accumulators
- Use specific imports, not namespace imports
- Use Next.js `<Image>` for automatic optimization
- Prefer Server Components for data fetching

---

## What NOT To Do

- ❌ Create custom UI when shadcn/ui component exists
- ❌ Use `.filter()` in Convex queries
- ❌ Use `any` type
- ❌ Skip lint/format step
- ❌ Leave `console.log` in production code
- ❌ Use `var` or skip `await`
- ❌ Create Convex functions without `args`/`returns`/`handler`
- ❌ Assume dev tools are globally available (use devenv)
