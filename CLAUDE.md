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

## Code Style

Uses **Ultracite** (Biome preset) for linting/formatting. Key rules:
- Prefer `for...of` over `.forEach()` and indexed loops
- Use `const` by default, `let` only when needed, never `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Function components only (no class components)
- Hooks at top level only, complete dependency arrays
- Remove console.log/debugger in production code
