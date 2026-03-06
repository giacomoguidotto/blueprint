
# Frontend

## Component organization

- **Shared components:** `src/components/` (auth, controls, layout, providers, errors)
- **shadcn/ui components:** `src/components/ui/` — owned, customizable (new-york style, Radix primitives)
  - Add new ones via `bunx shadcn@latest add <component>`
- **Feature components:** `src/features/[feature]/components/`

## Feature modules

Each feature is self-contained in `src/features/[feature]/`:

```
src/features/tasks/
├── components/    # Feature-specific UI
├── store/         # Jotai atoms (UI state only)
├── schemas.ts     # Zod validation schemas
├── schemas.test.ts
└── types.ts       # Types derived from Convex schema
```

## State management

- **Server state:** Convex queries/mutations (real-time, no caching needed)
- **UI state:** Jotai atoms in `store/atoms.ts` (filters, selections, form visibility)
- Don't duplicate server state in client atoms

## Forms

- react-hook-form + Zod schema validation
- Schemas co-located in feature's `schemas.ts`

## i18n

- Library: next-intl
- Locales: `en`, `it` (defined in `src/i18n/routing.ts`)
- Translation files: `messages/{locale}.json`
- Use `useTranslations("namespace")` hook in components
- All routes are locale-prefixed (`/en/...`, `/it/...`)
- Routing helpers exported from `src/i18n/routing.ts`: `Link`, `redirect`, `usePathname`, `useRouter`

## Routing

- Next.js App Router with locale prefix: `src/app/[locale]/`
- Protected routes: `src/app/[locale]/(authenticated)/`
- Auth middleware in `src/proxy.ts` (WorkOS AuthKit + next-intl combined)
- Unauthenticated paths: `/`, `/:locale`, `/:locale/sign-in`, `/:locale/sign-up`

## Styling

- Tailwind CSS 4
- CSS variables for theming (dark mode via next-themes)
- Animations via Motion library
- Icons: lucide-react
