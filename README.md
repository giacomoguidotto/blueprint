# Blueprint

A production-ready Next.js starter template with modern tooling and best practices built-in.

## ✨ Features

🚀 Optimized for performance ([React Compiler](https://reactjs.org/), [Next.js](https://nextjs.org/))

🔒 Modern authentication ([WorkOS AuthKit](https://workos.com/authkit)) with protected routes

⚡ Real-time database ([Convex](https://www.convex.dev/)) with type-safe React hooks

🌍 Multi-language, type-safe i18n ([next-intl](https://next-intl-docs.vercel.app/))

🎨 [shadcn/ui](https://ui.shadcn.com/) component library & [Tailwind CSS 4](https://tailwindcss.com/)

🌓 Dark mode & accessible, responsive design

📡 Full-stack observability ([Effect](https://effect.website/) + [OpenTelemetry](https://opentelemetry.io/) + [Axiom](https://axiom.co/))

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

Optionally, you can also setup an Axiom account in their [platform](https://app.axiom.co/register) to provide observability to your project.

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

### 4. Setup the WorkOS variables on Convex

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

### 7. Setup Axiom connection (optional)

If no token is provided, then this functionality will not be enabled.

Create two dataset on the [Axiom dashboard](https://app.axiom.co), one for traces, one for metrics. Put the chosen names on the `AXIOM_DATASET` and `AXIOM_METRICS_DATASET` environment variables in `.env.example`.

Depending on which edge server these datasets are deployed, write the right domain in `AXIOM_DOMAIN`. You can find the list in the [Axiom docs](https://axiom.co/docs/reference/edge-deployments#available-edge-deployments).

Copy all Axiom-related variables from `.env.example` to `.env.local`. Finally, generate a token for your account in the [Axiom dashboard](https://app.axiom.co) and put it in the `AXIOM_TOKEN` environment variable in `.env.local`.

**Your `.env.local` file now should look exactly like the one in `.env.example`.**

### 8. Running the development server

Run both the Next.js frontend and the Convex backend:
```bash
bun dev
```

## 📦 Deploy

The following deployment guide uses Vercel as the deployment platform, and should cost nothing under the current Convex/WorkOS/Vercel pricing plans, at the time of writing.

### 1. Provision a WorkOS production environment

If you didn't already create a WorkOS production environment for another project, create a new one from the [WorkOS dashboard](https://dashboard.workos.com/). You'll need to add billing information, but if you use only AuthKit under the current [pricing plan](https://workos.com/pricing), you'll be fine.

Go to the `authentication` -> `methods` page and activate whatever method you want to use. **Watch out**: "Enterprise SSO in AuthKit" is a paid feature.

Optionally, go to the `authentication` -> `providers` page to configure the SSO providers you want to use.

### 2. Provision a Convex production deployment

Go to the [Convex dashboard](https://dashboard.convex.dev/) and provision a new production deployment.

You should find the `CONVEX_SITE_URL`, useful for the next step, in the `settings` page of your project. It should look like `https://<your-deployment>.convex.site`.

### 3. Configure the WorkOS webhooks

Now that you have a CONVEX_SITE_URL, you can setup WorkOS webhooks for the production environment following this [section of the docs](https://www.convex.dev/components/workos-authkit#configure-webhooks).

Copy the webhook secret and add it to your Convex production environment variables as `WORKOS_WEBHOOK_SECRET`.

### 4. Setup the WorkOS variable on Convex

Generate a password for the WorkOS cookie at least 32 characters long.

Add the following variables to your Convex production environment variables:
- `WORKOS_API_KEY` from the [WorkOS dashboard](https://dashboard.workos.com/)
- `WORKOS_CLIENT_ID` from the [WorkOS dashboard](https://dashboard.workos.com/)
- `WORKOS_COOKIE_PASSWORD` with the password you generated earlier

### 5. Setup the WorkOS redirect URI on Convex

Go in the `redirects` page on the [WorkOS dashboard](https://dashboard.workos.com/). Setup a new redirect URI with the value `https://<your-domain>/callback`

This value will be needed in the last step when creating the Vercel project, so keep it handy. If you don't have a domain yet, you can do this step after creating the Vercel project.

### 6. Create a deploy key in Convex

Go to the `settings` page on the [Convex dashboard](https://dashboard.convex.dev/) and create a new deploy key.

This value will be needed in the last step when creating the Vercel project, so keep it handy.

### 7. Create a new Vercel project

Create a new Vercel project from the [Vercel dashboard](https://vercel.com/new). Choose the "Import" option and select the repository you cloned from this template.

The build command should already be automatically set to `bunx convex deploy --cmd 'bun run build'`.

Configure the environment variables for Vercel as follows:
1. Copy all variable from your Convex production environment and paste them.
2. Add the redirect URI in the form of `https://<your-domain>/callback` as `NEXT_PUBLIC_WORKOS_REDIRECT_URI`.
3. Add the deploy key from the previous step as `CONVEX_DEPLOY_KEY`.

At the end you should have the following environment variables:
- `WORKOS_API_KEY`
- `WORKOS_CLIENT_ID`
- `WORKOS_COOKIE_PASSWORD`
- `WORKOS_WEBHOOK_SECRET`
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI`
- `CONVEX_DEPLOY_KEY`
- `AXIOM_API_TOKEN`
- `AXIOM_DATASET`
- `AXIOM_METRICS_DATASET`

This values should be only for production.

**Click deploy and pray**.

If everything went well, do one last thing: add your domain as a custom domain in the Vercel project in order to match the redirect URI you set up in WorkOS.

### Small caveat

A WorkOS account works only with a single platform, meaning that if you want to have multiple projects linked to the same WorkOS account, with different redirect URIs, on the first login of a user, they will be redirected to the URI marked as "default" in the WorkOS dashboard.

On subsequent, already logged in sessions, the user will be redirected to the correct project.

## 🔍 Preview

When working on a git branch different from `main`, Vercel will automatically generate a preview deployment. You need to configure both Convex and Vercel to be able to automatically deploy correctly.

### 1. Configure the Convex preview deployments

Copy all the environment variables from your Convex development environment.

Go to the `settings` -> `project settings` page on the [Convex dashboard](https://dashboard.convex.dev/) and paste them in the `Default Environment Variables` field.

### 2. Generate a preview deployment key

Go to the `settings` -> `project settings` page on the [Convex dashboard](https://dashboard.convex.dev/) and generate a new preview deployment key. It should look like `preview:<your-team>:<your-project>|eyJ2...`.

### 3. Configure the Vercel preview deployments

Add the key from the previous step to your Vercel environment variables as `CONVEX_DEPLOY_KEY`, **only for Preview**.

Copy the following environment variables from your `.env.local` file:
- `WORKOS_API_KEY`
- `WORKOS_CLIENT_ID`
- `WORKOS_WEBHOOK_SECRET`
- `WORKOS_COOKIE_PASSWORD`
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI`
Add them **only for Preview**.

Not you can work on your branch with no worries.

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

Learn more: [next-intl docs](https://next-intl-docs.vercel.app/)

### Adding traces to new code

Use `Effect.withSpan` and run through the managed runtime:

```typescript
import { Effect } from "effect";
import { telemetryRuntime } from "@/lib/telemetry/runtime";

const program = Effect.tryPromise(() => fetchSomething())
  .pipe(Effect.withSpan("myFeature.load"));

const result = await telemetryRuntime.runPromise(program);
```

Learn more: [Effect docs](https://effect.website/docs/observability/tracing/)

## 🎯 Best Practices Followed

This project embeds production-grade patterns and architectural decisions:

- **Feature-based folder structure** (`src/features/[feature]/`): co-locates components, types, and state per feature for better maintainability and scalability
- **Single source of truth**: configuration (routing, locales, auth) defined once and imported everywhere, eliminating drift and duplication
- **shadcn/ui first**: composable, accessible components that you own and customize, not a rigid library dependency
- **Separation of concerns**: clear frontend/backend boundaries (Next.js/Convex), avoiding tangled logic and improving testability
- **Zero code duplication**: shared UI components (`src/components/ui/`), reusable layouts, and centralized utilities
- **Observable by default**: Effect-based telemetry with OpenTelemetry traces and metrics exported to Axiom, graceful no-op when unconfigured

**Why these choices?** They reduce cognitive load, prevent common bugs, make onboarding faster, and ensure the codebase scales cleanly from prototype to production.

## 🚧 Roadmap

### ✅ Completed
- [x] **Framework**: Next.js 16, React 19, TypeScript
- [x] **Backend**: Convex (database, auth, real-time)
- [x] **Auth**: WorkOS AuthKit
- [x] **Styling**: Tailwind CSS 4, shadcn/ui, next-themes
- [x] **i18n**: next-intl
- [x] **Observability**: Effect + OpenTelemetry + Axiom (traces, metrics, error reporting)
- [x] **Code Quality**: Biome, Ultracite, Husky
- [x] **Dev Env**: devenv, direnv

### 🚧 Planned / To Do
- [ ] Vitest + Playwright for testing
- [ ] Database migrations tooling
- [ ] Email service integration
