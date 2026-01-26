import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Example Convex Query
 *
 * Queries are read-only operations that fetch data from the database.
 * They automatically re-run when their data changes, enabling real-time updates.
 */
export const getTasks = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done"),
        v.literal("archived")
      )
    ),
  },
  handler: async (ctx, { status }) => {
    // Get the current user
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

    // Build the query
    let tasksQuery = ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    if (status) {
      // Optional: filter by status
      tasksQuery = ctx.db
        .query("tasks")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", user._id).eq("status", status)
        );
    }

    const tasks = await tasksQuery.collect();
    return tasks;
  },
});

/**
 * Example Convex Mutation
 *
 * Mutations are write operations that modify data in the database.
 * They run transactionally - either all changes succeed or none do.
 */
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Get the current user
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

    // Insert the new task
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      status: "todo",
      userId: user._id,
    });

    return taskId;
  },
});

/**
 * Update task status
 */
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, { taskId, status }) => {
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

    // Verify the task belongs to the user
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Update the task
    await ctx.db.patch(taskId, { status });
  },
});

/**
 * Delete a task
 */
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, { taskId }) => {
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

    // Verify ownership
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(taskId);
  },
});
