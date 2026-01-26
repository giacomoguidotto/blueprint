import { type AuthFunctions, AuthKit } from "@convex-dev/workos-authkit";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

// Reference to internal functions exported by this file (enables webhook → event handler connection)
const authFunctions: AuthFunctions = internal.auth;

export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
  authFunctions,
});

export const { authKitEvent } = authKit.events({
  "user.created": async (ctx, event) => {
    await ctx.db.insert("users", {
      // Store WorkOS user ID - matches identity.subject from JWT
      authId: event.data.id,
    });
  },
  "user.deleted": async (ctx, event) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", event.data.id))
      .unique();
    if (!user) {
      console.warn(`User not found: ${event.data.id}`);
      return;
    }
    await ctx.db.delete(user._id);
  },
});
