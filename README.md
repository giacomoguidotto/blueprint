# Blueprint

A production-ready Next.js starter template with modern tooling and best practices built-in.

## ✨ Features

### Key Features

- 🔒 Modern authentication (WorkOS AuthKit) with protected routes
- ⚡ Real-time database (Convex) with type-safe React hooks
- 🌍 Multi-language, type-safe i18n (next-intl)
- 🎨 shadcn/ui component library & Tailwind CSS 4
- 🌓 Dark mode & accessible, responsive design
- 🛡️ Security best practices (CSP, headers, env validation)
- 🚀 Optimized for performance (React Compiler, Next.js)
- 🧑‍💻 Fast linting/formatting (Biome), reproducible dev env (devenv)

### Stack choices

| **Category**    | **Choice**                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------- |
| Framework       | [Next.js](https://nextjs.org/) 16 (App Router) + [React](https://react.dev/) 19             |
| Backend         | [Convex](https://www.convex.dev/) (real-time database & auth)                               |
| Authentication  | [WorkOS AuthKit](https://workos.com/authkit)                                                |
| Styling         | [Tailwind CSS](https://tailwindcss.com/) 4 + [shadcn/ui](https://ui.shadcn.com/) components |
| i18n            | [next-intl](https://next-intl-docs.vercel.app/)                                             |
| Type Safety     | [TypeScript](https://www.typescriptlang.org/) (strict mode)                                 |
| Code Quality    | [Biome](https://biomejs.dev/) (linting & formatting) + [Ultracite](https://ultracite.dev/)  |
| Runtime         | [Bun](https://bun.sh/)                                                                      |
| Dev Environment | [devenv](https://devenv.sh/) + [direnv](https://direnv.net/)                                |

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
- [ ] Effect integration
- [ ] Jotai for state management
- [ ] Vitest + Playwright for testing
- [ ] PostHog for analytics
- [ ] Sentry for error tracking
- [ ] CI/CD pipelines
- [ ] Renovate for dependency management
- [ ] CodeRabbit for AI code review
- [ ] Database migrations tooling
- [ ] Email service integration
- [ ] File upload handling

## 🚀 Quickstart

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

## 🛠️ Build your project on top of Blueprint

### Add a new feature

1. Add the entities definitions in `convex/schema.ts`
2. Create all the feature-specific backend functions in `convex/[feature].ts`
3. Expand the frontend using a **feature-based folder structure**.

### Add a new locale

1. **Register the locale** in `src/i18n/routing.ts` and add its native name:

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

2. **Create translation file** in `messages/[locale].json` using the same structure as `messages/en.json`:

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

**Best Practices**:
- Organize translations by page/feature namespace
- Use nested keys for better organization
- Keep translation keys descriptive
- Provide fallback values for missing translations
- Use parameters for dynamic content: `t("welcome", { name: "Jack" })`

Learn more: [next-intl Documentation](https://next-intl-docs.vercel.app/)


### Add a new UI component

Expand the components collection with shadcn/ui. 

Learn more: [shadcn/ui Documentation](https://ui.shadcn.com/)

### Configure the authenticated routes

Configure the authentication in `convex/auth.config.ts`

Learn more: [WorkOS AuthKit Documentation](https://workos.com/authkit)

## 📦 Deployment

Follow the various [Convex deployment guides](https://docs.convex.dev/production/hosting/) to deploy your app.
