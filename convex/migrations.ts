import { internalMutation } from "./_generated/server";

/**
 * One-off migration: convert user preferences from old shape
 * { notifications: boolean } to new shape { notifyOnShare, notifyOnComment, notifyOnDueDate }.
 *
 * Run with: bunx convex run migrations:migrateUserPreferences
 */
export const migrateUserPreferences = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let migrated = 0;

    for (const user of users) {
      if (
        user.preferences &&
        "notifications" in user.preferences &&
        !("notifyOnShare" in user.preferences)
      ) {
        const enabled = (user.preferences as { notifications: boolean })
          .notifications;
        await ctx.db.patch(user._id, {
          preferences: {
            notifyOnShare: enabled,
            notifyOnComment: enabled,
            notifyOnDueDate: enabled,
          },
        });
        migrated++;
      }
    }

    return { migrated, total: users.length };
  },
});
