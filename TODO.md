# TODO

Deferred improvements from the April 2026 audit. These are valuable additions but were intentionally scoped out of the current work to keep the template focused.

## Email Sending

Add transactional email support using [Resend](https://resend.com/) (or similar modern provider). Natural integration point: task assignment notifications or due date reminders.

- [ ] Add `resend` dependency
- [ ] Create email templates (e.g., with `react-email`)
- [ ] Add a Convex action that sends email via Resend API
- [ ] Wire up a trigger (e.g., task assigned, task due soon)

## Rate Limiting on Server Actions

`reportClientError` and `reportClientSpan` accept client input with no throttling. An attacker could flood the telemetry backend.

- [ ] Add rate limiting utility (in-memory for single-instance, or [`@upstash/ratelimit`](https://github.com/upstash/ratelimit) for distributed/serverless)
- [ ] Apply to `src/app/actions/report-error.ts`
- [ ] Apply to `src/app/actions/report-span.ts`

## CSP Nonce Fix

`proxy.ts` generates a per-request nonce but never applies it to CSP directives. The policy falls back to `'unsafe-inline' 'unsafe-eval'`, which defeats the purpose of CSP.

- [ ] Use `'nonce-${nonce}'` in `script-src` and `style-src`
- [ ] Drop `'unsafe-inline'` in production
- [ ] Keep `'unsafe-eval'` only in dev mode (required for React hot reload)
- [ ] Pass nonce to `<Script>` components via `getNonce()` from `src/lib/security.ts`
