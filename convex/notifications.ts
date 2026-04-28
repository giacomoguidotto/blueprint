import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { resend } from "./email";

const DEFAULT_PREFS = {
  notifyOnShare: true,
  notifyOnComment: true,
  notifyOnDueDate: true,
};

type NewPrefs = typeof DEFAULT_PREFS;

function getUserPrefs(user: {
  preferences?: NewPrefs | { notifications: boolean } | null;
}): NewPrefs {
  const p = user.preferences;
  if (!p) {
    return DEFAULT_PREFS;
  }
  // Old shape: map single boolean to all three
  if ("notifications" in p) {
    return {
      notifyOnShare: p.notifications,
      notifyOnComment: p.notifications,
      notifyOnDueDate: p.notifications,
    };
  }
  return p;
}

/**
 * Send a "task shared with you" notification
 */
export const notifyTaskShared = internalMutation({
  args: {
    taskId: v.id("tasks"),
    recipientId: v.id("users"),
    sharedByEmail: v.string(),
    taskTitle: v.string(),
  },
  handler: async (ctx, { taskId, recipientId, sharedByEmail, taskTitle }) => {
    const recipient = await ctx.db.get(recipientId);
    if (!recipient?.email) {
      return;
    }

    const prefs = getUserPrefs(recipient);
    if (!prefs.notifyOnShare) {
      return;
    }

    await resend.sendEmail(ctx, {
      from: "Blueprint <notifications@guidotto.dev>",
      to: recipient.email,
      subject: `${sharedByEmail} shared a task with you`,
      html: `<p><strong>${sharedByEmail}</strong> shared the task <strong>"${taskTitle}"</strong> with you.</p>`,
    });

    await ctx.db.insert("notifications", {
      taskId,
      recipientId,
      type: "task_shared",
      sentAt: Date.now(),
    });
  },
});

/**
 * Send a "comment added" notification to all other participants
 */
export const notifyCommentAdded = internalMutation({
  args: {
    taskId: v.id("tasks"),
    commenterId: v.id("users"),
    commenterEmail: v.string(),
    taskTitle: v.string(),
    commentBody: v.string(),
  },
  handler: async (
    ctx,
    { taskId, commenterId, commenterEmail, taskTitle, commentBody }
  ) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      return;
    }

    // Gather all participants (owner + collaborators) except commenter
    const recipientIds: Set<string> = new Set();
    if (task.userId !== commenterId) {
      recipientIds.add(task.userId);
    }

    const collaborators = await ctx.db
      .query("collaborators")
      .withIndex("by_task", (q) => q.eq("taskId", taskId))
      .collect();

    for (const c of collaborators) {
      if (c.userId !== commenterId) {
        recipientIds.add(c.userId);
      }
    }

    for (const recipientId of recipientIds) {
      const recipient = await ctx.db.get(recipientId as typeof task.userId);
      if (!recipient?.email) {
        continue;
      }

      const prefs = getUserPrefs(recipient);
      if (!prefs.notifyOnComment) {
        continue;
      }

      await resend.sendEmail(ctx, {
        from: "Blueprint <notifications@guidotto.dev>",
        to: recipient.email,
        subject: `New comment on "${taskTitle}"`,
        html: `<p><strong>${commenterEmail}</strong> commented on <strong>"${taskTitle}"</strong>:</p><blockquote>${commentBody}</blockquote>`,
      });

      await ctx.db.insert("notifications", {
        taskId,
        recipientId: recipient._id,
        type: "comment_added",
        sentAt: Date.now(),
      });
    }
  },
});

/**
 * Send due date reminder notifications for a single task
 */
export const sendDueDateReminder = internalMutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, { taskId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      return;
    }

    // Gather all participants (owner + collaborators)
    const recipientIds: Set<string> = new Set([task.userId]);

    const collaborators = await ctx.db
      .query("collaborators")
      .withIndex("by_task", (q) => q.eq("taskId", taskId))
      .collect();

    for (const c of collaborators) {
      recipientIds.add(c.userId);
    }

    for (const recipientId of recipientIds) {
      const recipient = await ctx.db.get(recipientId as typeof task.userId);
      if (!recipient?.email) {
        continue;
      }

      const prefs = getUserPrefs(recipient);
      if (!prefs.notifyOnDueDate) {
        continue;
      }

      if (!task.dueDate) {
        continue;
      }
      const dueDate = new Date(task.dueDate).toLocaleDateString();

      await resend.sendEmail(ctx, {
        from: "Blueprint <notifications@guidotto.dev>",
        to: recipient.email,
        subject: `Reminder: "${task.title}" is due ${dueDate}`,
        html: `<p>Your task <strong>"${task.title}"</strong> is due on <strong>${dueDate}</strong>.</p>`,
      });

      await ctx.db.insert("notifications", {
        taskId,
        recipientId: recipient._id,
        type: "due_date_approaching",
        sentAt: Date.now(),
      });
    }
  },
});
