import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

/**
 * Update user avatar
 */
export const updateAvatar = mutation({
  args: { avatarId: v.id("_storage") },
  handler: async (ctx, { avatarId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Delete old avatar if it exists
    if (user.avatarId) {
      await ctx.storage.delete(user.avatarId);
    }

    await ctx.db.patch(user._id, { avatarId });
  },
});

/**
 * Remove user avatar
 */
export const removeAvatar = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.avatarId) {
      await ctx.storage.delete(user.avatarId);
    }

    await ctx.db.patch(user._id, { avatarId: undefined });
  },
});

/**
 * Update notification preferences (per event type)
 */
export const updateNotificationPreferences = mutation({
  args: {
    notifyOnShare: v.boolean(),
    notifyOnComment: v.boolean(),
    notifyOnDueDate: v.boolean(),
  },
  handler: async (ctx, preferences) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, { preferences });
  },
});
