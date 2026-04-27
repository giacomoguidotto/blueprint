import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

/**
 * Check for tasks due within 24 hours and send reminder emails.
 * Runs every hour. The notification logic deduplicates via the
 * notifications table to avoid sending multiple reminders.
 */
crons.interval(
  "due date reminders",
  { hours: 1 },
  internal.crons.checkDueDates
);

export default crons;

/**
 * Cron handler: find tasks due within 24 hours and schedule
 * reminder notifications for each one.
 */
export const checkDueDates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const in24Hours = now + 24 * 60 * 60 * 1000;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_due_date")
      .filter((q) =>
        q.and(
          q.gte(q.field("dueDate"), now),
          q.lte(q.field("dueDate"), in24Hours),
          q.neq(q.field("status"), "done"),
          q.neq(q.field("status"), "archived")
        )
      )
      .collect();

    for (const task of tasks) {
      const existing = await ctx.db
        .query("notifications")
        .withIndex("by_task_and_type", (q) =>
          q.eq("taskId", task._id).eq("type", "due_date_approaching")
        )
        .first();

      if (!existing) {
        await ctx.scheduler.runAfter(
          0,
          internal.notifications.sendDueDateReminder,
          { taskId: task._id }
        );
      }
    }
  },
});
