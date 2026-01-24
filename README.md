# Blueprint

A production-ready Next.js starter template with modern tooling and best practices built-in.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Backend**: Convex (real-time database & auth)
- **Authentication**: WorkOS AuthKit
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **i18n**: next-intl with English & Italian
- **Type Safety**: TypeScript (strict mode)
- **Code Quality**: Biome (linting & formatting) + Ultracite
- **Runtime**: Bun
- **Dev Environment**: devenv + direnv

## Features

### Core Setup
- ✅ Server & Client Components with proper data flow
- ✅ Type-safe environment with strict TypeScript
- ✅ Path aliases (`@/components`, `@/lib`, etc.)
- ✅ React Compiler enabled for automatic memoization

### Authentication & Data
- ✅ WorkOS AuthKit integration (SSO, magic links, OAuth)
- ✅ Convex real-time database with React hooks
- ✅ Protected routes with `<Authenticated>` / `<Unauthenticated>`
- ✅ User session management

### Internationalization
- ✅ Multi-language support (English, Italian)
- ✅ Type-safe translations with `next-intl`
- ✅ Language switcher component
- ✅ SEO-optimized with `hreflang` alternates

### UI/UX
- ✅ shadcn/ui component library (customizable)
- ✅ Dark mode with `next-themes`
- ✅ Modern design system with CSS variables
- ✅ Responsive layouts
- ✅ Accessible components (ARIA, keyboard navigation)
- ✅ Error boundaries (route & global level)
- ✅ Loading states with skeleton loaders

### Security
- ✅ Content Security Policy (CSP) with nonces
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Protected routes with authentication middleware
- ✅ Type-safe environment variables

### Developer Experience
- ✅ Biome for fast linting & formatting
- ✅ Pre-commit hooks with Husky (auto-format staged files)
- ✅ Hot reload for frontend & backend (`bun run dev`)
- ✅ Reproducible dev environment (devenv)
- ✅ VS Code & Zed settings included

### Performance
- ✅ React Compiler for optimized re-renders
- ✅ Next.js optimizations (fonts, images, code splitting)
- ✅ Modern CSS with Tailwind 4 (faster builds)

## Getting Started

### Prerequisites
- Bun runtime
- (Optional) devenv + direnv for reproducible environment
- a [WorkOS](https://workos.com/) account

### Installation

Clone and install dependencies
```bash
bun install
```

### Environment Variables

Set up environment variables
```bash
cp .env.example .env.local
```

Fill the missing `WORKOS_API_KEY` and `WORKOS_CLIENT_ID` in `.env.local` with your WorkOS credentials.

Generate the `WORKOS_COOKIE_PASSWORD` with a strong password of at least 32 characters.

Don't worry about the `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` variables, they will be set automatically by Convex during the first boot.

### Running the development server

Run dev servers (frontend + Convex backend)
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000)

### Available Commands

```bash
bun run dev       # Start Next.js + Convex dev servers
bun run dev:fe    # Start only Next.js dev server
bun run dev:be    # Start only Convex dev server
bun run build     # Build for production
bun run start     # Start production server
bun run lint      # Lint & check code
bun run format    # Format code
```

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # i18n routes
│   │   ├── sign-in/            # Sign in page
│   │   ├── sign-up/            # Sign up page
│   │   └── callback/           # Auth callback
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── providers/          # React context providers
│   ├── i18n/                   # Internationalization config
│   └── lib/                    # Utilities
├── convex/                     # Convex backend (DB + functions)
│   ├── schema.ts               # Database schema definition
│   ├── tasks.ts                # Example queries & mutations
│   └── auth.config.ts          # Auth configuration
├── messages/                   # Translation files (en, it)
├── public/                     # Static assets
└── .cursor/rules/              # AI assistant guidelines
```

## Configuration

### Customization

- **Colors**: Edit CSS variables in `src/app/globals.css`
- **Components**: Add shadcn/ui components with `bunx shadcn@latest add [component]`
- **Locales**: Add languages in `src/i18n/routing.ts` + create `messages/[locale].json`
- **Auth**: Configure providers in `convex/auth.config.ts`
- **Database**: Define tables in `convex/schema.ts` and create functions in `convex/*.ts`
- **Security**: Adjust CSP directives in `src/proxy.ts` as needed for your integrations

## Deployment

Follow the various [Convex deployment guides](https://docs.convex.dev/production/hosting/) to deploy your app.

## What's Included

| Category | Tools |
|----------|-------|
| Framework | Next.js 16, React 19, TypeScript |
| Backend | Convex (database, auth, real-time) |
| Auth | WorkOS AuthKit |
| Styling | Tailwind CSS 4, shadcn/ui, next-themes |
| i18n | next-intl |
| Code Quality | Biome, Ultracite, Husky |
| Testing | (Add Vitest/Playwright as needed) |
| Dev Env | devenv, direnv |

## What's Not Included

Add as needed based on your project:
- Testing framework (recommend Vitest + Playwright)
- Analytics (Vercel Analytics, PostHog, etc.)
- Error tracking (Sentry)
- CI/CD pipelines
- Database migrations tooling
- Email service integration
- File upload handling

## License

MIT (or your preference)

## Credits

Built with modern tools and community-driven patterns. Adjust and extend as needed.
