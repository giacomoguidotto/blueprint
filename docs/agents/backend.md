
# Backend (Convex)

## Schema

Defined in `convex/schema.ts` using `defineSchema` / `defineTable`.

- Use `v.optional()` for nullable fields
- Use `v.union(v.literal(...))` for enums
- Use `v.id("tableName")` for foreign keys
- Add indexes for fields you query frequently
- System fields `_id` and `_creationTime` are automatic

## Functions

All backend functions live in `convex/*.ts`. Three types:

- **Queries** (`query({...})`) — read-only, auto-rerun on data change (real-time)
- **Mutations** (`mutation({...})`) — transactional writes
- **Actions** (`action({...})`) — side effects (external APIs, non-transactional)

Import from `convex/_generated/server`:
```ts
import { mutation, query } from "./_generated/server";
```

## Auth pattern

Every function that needs auth follows this pattern:

```ts
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Not authenticated");

const user = await ctx.db
  .query("users")
  .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
  .unique();
if (!user) throw new Error("User not found");
```

## Auth setup

- WorkOS AuthKit handles OAuth (configured in `convex/auth.config.ts`)
- User lifecycle events (create/delete) handled in `convex/auth.ts`
- Webhook endpoint in `convex/http.ts`

## Important

- Never edit files in `convex/_generated/` — they are auto-generated
- Convex functions run in a separate runtime, not in Next.js
- Test Convex functions with `convex-test` (node environment, not happy-dom)
