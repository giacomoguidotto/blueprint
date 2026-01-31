# Blueprint

A production-ready Next.js starter template with modern tooling and best practices built-in.

## ✨ Features

🚀 Optimized for performance ([React Compiler](https://reactjs.org/), [Next.js](https://nextjs.org/))

🔒 Modern authentication ([WorkOS AuthKit](https://workos.com/authkit)) with protected routes

⚡ Real-time database ([Convex](https://www.convex.dev/)) with type-safe React hooks

🌍 Multi-language, type-safe i18n ([next-intl](https://next-intl-docs.vercel.app/))

🎨 [shadcn/ui](https://ui.shadcn.com/) component library & [Tailwind CSS 4](https://tailwindcss.com/)

🌓 Dark mode & accessible, responsive design

🛡️ Security best practices (CSP, headers, env validation)

🧑‍💻 Fast linting/formatting ([Biome](https://biomejs.dev/)), reproducible dev env ([devenv](https://devenv.sh/))

## 🚀 Quickstart

### 0. Prerequisites

You can choose to use [devenv](https://devenv.sh/getting-started/) to take advantage of the environment already set up in `devenv.nix`.  
Otherwise, make sure you have:
- the latest LTS of [Node.js](https://nodejs.org/en/download/) installed.
- the latest version of [Bun](https://bun.sh/docs/installation) runtime installed.

You'll then need to setup a WorkOS account. You can [start here](https://dashboard.workos.com/get-started). After the entire setup process, you should have the following credentials:
- `WORKOS_API_KEY`
- `WORKOS_CLIENT_ID`

### 1. Installation

Create a new GitHub repository from this template and clone it. 

Then, install dependencies:
```bash
bun install
```

### 2. Deploy in Convex

Setup a convex dev deployment by running:
```bash
bun run dev:be
```
Read more [here](https://docs.convex.dev/cli#configure) to understand how to navigate through the `convex dev` prompts.

TL;DR: Login; select 'create a new project'.  
**Important**: when prompted: 'Create a WorkOS team and enable automatic AuthKit environment provisioning for team "\<your-team>"?', answer **'no'** and let it exit.

This will setup a new project in the [Convex dashboard](https://dashboard.convex.dev/), and generate a `.env.local` file with the following variables:

```env
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=dev:<your-deployment> # team: <your-team>, project: <your-project>

NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud

NEXT_PUBLIC_CONVEX_SITE_URL=https://<your-deployment>.convex.site
```

### 3. Setup WorkOS webhooks

Now that you have a CONVEX_SITE_URL, you can setup WorkOS webhooks following this [section of the docs](https://www.convex.dev/components/workos-authkit#configure-webhooks).

You should end up with a `WORKOS_WEBHOOK_SECRET` variable in your Convex environment variables.

### 4. Setup WorkOS environment variables

Generate a password for the WorkOS cookie at least 32 characters long.

Go in the `environment variables` settings of your project on the [Convex dashboard](https://dashboard.convex.dev/).

Add the following variables:
- `WORKOS_API_KEY` from the [WorkOS dashboard](https://dashboard.workos.com/)
- `WORKOS_CLIENT_ID` from the [WorkOS dashboard](https://dashboard.workos.com/)
- `WORKOS_COOKIE_PASSWORD` with the password you generated earlier

### 5. Setup WorkOS redirect URI

Go in the `redirects` page on the [WorkOS dashboard](https://dashboard.workos.com/). Setup a new redirect URI with the value `http://localhost:3000/callback`

Add that URI in the `.env.local` file:
```env
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
```

### 6. Copy the Convex env to your local env

Run:
```bash
bunx convex env list
```

to get all the environment variables for your deployment. Add them to your `.env.local` file.

**Your `.env.local` file should look like the one in `.env.example`.**

### 7. Running the development server

Run both the Next.js frontend and the Convex backend:
```bash
bun dev
```

## 📦 Deploy



## 🔍 Preview

- set default environment variables on convex
- set environment variables on vercel

## 🛠️ Build your project on top of Blueprint

### Configure the app metadata

Configure the app metadata in `src/app/[locale]/layout.tsx`

Learn more: [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)


### Configure the authenticated routes

All routes are protected by authentication by default. To add an unauthenticated route, add it to the `unauthenticatedPaths` array in `src/proxy.ts`

Learn more: [WorkOS AuthKit Documentation](https://workos.com/docs)

### Add a new feature

The usual workflow:

1. Add the entities definitions in `convex/schema.ts`
2. Create all the feature-specific backend functions in `convex/[feature].ts`
3. Create the feature-specific frontend components in `src/features/[feature]/`
4. Extend the app routing, making sure to handle also the loading state and the error boundaries

### Add a new locale

First, register the locale in `src/i18n/routing.ts` and add its native name:

```typescript
export const routing = defineRouting({
  locales: ["en", "it", "es"], // Add your locale
  defaultLocale: "en",
  localePrefix: "always",
});

export const localeNativeName: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  es: "Español", // Add its native name here
};
```

Then, create the translation file in `messages/[locale].json` using the same structure as `messages/en.json`:

```json
{
  "common": {
    "signIn": "Iniciar sesión",
    "signUp": "Registrarse"
  },
  "home": {
    "title": "Blueprint"
  }
}
```

Learn more: [next-intl Documentation](https://next-intl-docs.vercel.app/)

## 🎯 Best Practices Followed

This project embeds production-grade patterns and architectural decisions:

- **Feature-based folder structure** (`src/features/[feature]/`): co-locates components, types, and state per feature for better maintainability and scalability
- **Single source of truth**: configuration (routing, locales, auth) defined once and imported everywhere, eliminating drift and duplication
- **shadcn/ui first**: composable, accessible components that you own and customize, not a rigid library dependency
- **Separation of concerns**: clear frontend/backend boundaries (Next.js/Convex), avoiding tangled logic and improving testability
- **Zero code duplication**: shared UI components (`src/components/ui/`), reusable layouts, and centralized utilities

**Why these choices?** They reduce cognitive load, prevent common bugs, make onboarding faster, and ensure the codebase scales cleanly from prototype to production.

## 🚧 Roadmap

### ✅ Completed
- [x] **Framework**: Next.js 16, React 19, TypeScript
- [x] **Backend**: Convex (database, auth, real-time)
- [x] **Auth**: WorkOS AuthKit
- [x] **Styling**: Tailwind CSS 4, shadcn/ui, next-themes
- [x] **i18n**: next-intl
- [x] **Code Quality**: Biome, Ultracite, Husky
- [x] **Dev Env**: devenv, direnv

### 🚧 Planned / To Do
- [ ] Vitest + Playwright for testing
- [ ] Axiom for observability
- [ ] Sentry for error tracking
- [ ] Database migrations tooling
- [ ] Email service integration
- [ ] Effect integration
