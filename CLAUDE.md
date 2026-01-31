# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun dev          # Start Next.js + Convex dev servers concurrently
bun dev:fe       # Start only Next.js dev server
bun dev:be       # Start only Convex dev server
bun build        # Build for production
bun lint         # Lint & check code (Biome)
bun format       # Format code (Biome)
```

The project uses **devenv** for reproducible development environment. Only `git` and `docker` are globally available - all other tools (including `bun`) require devenv activation:
```bash
export PATH=".devenv/profile/bin:$PATH"
```

## Architecture Overview

### Stack
- **Frontend**: Next.js 16 (App Router) + React 19 with React Compiler
- **Backend**: Convex (real-time database, serverless functions)
- **Auth**: WorkOS AuthKit (JWT-based, synced to Convex via webhook)
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **i18n**: next-intl with locale prefix routing
- **State**: Jotai for client-side state, Convex for server state

### Key Directory Structure
```
convex/              # Backend: schema, queries, mutations, actions
  schema.ts          # Database schema (single source of truth for types)
  http.ts            # HTTP routes including auth webhook
src/
  app/[locale]/      # Next.js App Router pages with i18n
  features/[name]/   # Feature modules (components, types, store)
  components/ui/     # shadcn/ui components
  components/providers/  # Context providers (Convex, Theme, i18n)
  i18n/routing.ts    # Locale configuration (single source of truth)
  proxy.ts           # Middleware: auth + i18n + CSP
messages/            # Translation JSON files per locale
```

### Auth Flow
1. WorkOS AuthKit handles sign-in/sign-up (routes in `src/app/[locale]/sign-in/` and `/sign-up/`)
2. Auth callback at `/callback` exchanges code for session
3. ConvexClientProvider wraps app with `ConvexProviderWithAuth` using WorkOS tokens
4. Convex backend validates JWT and looks up user via `authId` (WorkOS subject)

### Middleware Chain (src/proxy.ts)
The middleware runs: i18n routing → WorkOS auth → CSP headers with nonce injection

Unauthenticated routes are configured in `src/proxy.ts` via `unauthenticatedPaths` array.

### Adding Features
1. Define entities in `convex/schema.ts`
2. Create backend functions in `convex/[feature].ts`
3. Create frontend in `src/features/[feature]/` (components, types, store)
4. Add routes in `src/app/[locale]/`

### Adding Locales
1. Add locale to `src/i18n/routing.ts` in `locales` array and `localeNativeName` record
2. Create `messages/[locale].json` matching structure of `messages/en.json`

## Convex Guidelines

### Function Syntax
Always use the new function syntax with explicit `args`, `returns`, and `handler`:
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

### Function Registration
- **Public functions**: `query`, `mutation`, `action` - exposed to clients
- **Internal functions**: `internalQuery`, `internalMutation`, `internalAction` - only callable from other Convex functions
- Always include argument and return validators. Use `returns: v.null()` for void functions

### Function References
- Use `api.filename.functionName` for public functions
- Use `internal.filename.functionName` for internal functions
- When calling functions in the same file, add type annotation to avoid circularity issues

### Query Guidelines
- **Never use `.filter()`** - define indexes in schema and use `.withIndex()` instead
- Use `.unique()` for single document queries
- Use `.order("asc")` or `.order("desc")` for ordering (defaults to ascending `_creationTime`)
- Convex queries don't support `.delete()` - collect results and delete individually

### Schema Guidelines
- Define schema in `convex/schema.ts`
- Include all index fields in index name (e.g., `by_user_and_status` for `["userId", "status"]`)
- Index fields must be queried in order they're defined
- System fields `_id` and `_creationTime` are automatic

### Actions
- Add `"use node";` at top of files using Node.js modules
- Actions cannot access `ctx.db` - use `ctx.runQuery`/`ctx.runMutation` instead
- Minimize query/mutation calls from actions to avoid race conditions

## Code Style

Uses **Ultracite** (Biome preset) for linting/formatting. **Run `bunx ultracite fix` after any edit** to auto-fix formatting and lint issues.

### JavaScript/TypeScript
- Prefer `for...of` over `.forEach()` and indexed loops
- Use `const` by default, `let` only when needed, never `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Prefer `unknown` over `any`, use `as const` for literals
- Always `await` promises in async functions

### React
- Function components only (no class components)
- Hooks at top level only, complete dependency arrays
- Use `key` prop with unique IDs (not array indices)
- Use semantic HTML and ARIA attributes for accessibility
- Use Next.js `<Image>` component, not `<img>`

### General
- Remove console.log/debugger in production code
- Throw `Error` objects with descriptive messages
- Add `rel="noopener"` with `target="_blank"`
