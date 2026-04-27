import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser, getTaskWithAccess } from "./model/tasks";
import { canTransition } from "./schema";

/**
 * Get a single task by ID
 */
export const getTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const user = await getAuthUser(ctx);
    const { task } = await getTaskWithAccess(ctx, taskId, user._id);
    return task;
  },
});

/**
 * List tasks with pagination and optional search/status filter
 */
export const listTasks = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done"),
        v.literal("archived")
      )
    ),
  },
  handler: async (ctx, { paginationOpts, search, status }) => {
    const user = await getAuthUser(ctx);

    // Full-text search path
    if (search) {
      const results = await ctx.db
        .query("tasks")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("userId", user._id)
        )
        .paginate(paginationOpts);

      if (status) {
        return {
          ...results,
          page: results.page.filter((t) => t.status === status),
        };
      }
      return results;
    }

    // Index-based path
    if (status) {
      return ctx.db
        .query("tasks")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", user._id).eq("status", status)
        )
        .paginate(paginationOpts);
    }

    return ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(paginationOpts);
  },
});

/**
 * Legacy query — kept for server preloading (non-paginated)
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
    const user = await getAuthUser(ctx);

    if (status) {
      return ctx.db
        .query("tasks")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", user._id).eq("status", status)
        )
        .collect();
    }

    return ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

/**
 * Create a new task
 */
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const taskId = await ctx.db.insert("tasks", {
      ...args,
      status: "todo",
      userId: user._id,
    });

    return taskId;
  },
});

/**
 * Update task status (enforces valid transitions)
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
    const user = await getAuthUser(ctx);
    const { task } = await getTaskWithAccess(ctx, taskId, user._id);

    if (!canTransition(task.status, status)) {
      throw new Error(`Invalid status transition: ${task.status} → ${status}`);
    }

    await ctx.db.patch(taskId, { status });
  },
});

/**
 * Delete a task (owner only) and its image + collaborator records
 */
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, { taskId }) => {
    const user = await getAuthUser(ctx);
    const { role } = await getTaskWithAccess(ctx, taskId, user._id);

    if (role !== "owner") {
      throw new Error("Only the task owner can delete");
    }

    const task = await ctx.db.get(taskId);
    if (task?.imageId) {
      await ctx.storage.delete(task.imageId);
    }

    // Clean up collaborator records
    const collaborators = await ctx.db
      .query("collaborators")
      .withIndex("by_task", (q) => q.eq("taskId", taskId))
      .collect();
    for (const c of collaborators) {
      await ctx.db.delete(c._id);
    }

    await ctx.db.delete(taskId);
  },
});

/**
 * Add a checklist item to a task
 */
export const addChecklistItem = mutation({
  args: {
    taskId: v.id("tasks"),
    key: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { taskId, key, title }) => {
    const user = await getAuthUser(ctx);
    await getTaskWithAccess(ctx, taskId, user._id);

    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const items = task.checklistItems ?? [];
    await ctx.db.patch(taskId, {
      checklistItems: [...items, { key, title, checked: false }],
    });
  },
});

/**
 * Toggle a checklist item's checked state
 */
export const toggleChecklistItem = mutation({
  args: {
    taskId: v.id("tasks"),
    key: v.string(),
  },
  handler: async (ctx, { taskId, key }) => {
    const user = await getAuthUser(ctx);
    await getTaskWithAccess(ctx, taskId, user._id);

    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const items = task.checklistItems ?? [];
    await ctx.db.patch(taskId, {
      checklistItems: items.map((item) =>
        item.key === key ? { ...item, checked: !item.checked } : item
      ),
    });
  },
});

/**
 * Remove a checklist item from a task
 */
export const removeChecklistItem = mutation({
  args: {
    taskId: v.id("tasks"),
    key: v.string(),
  },
  handler: async (ctx, { taskId, key }) => {
    const user = await getAuthUser(ctx);
    await getTaskWithAccess(ctx, taskId, user._id);

    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const items = task.checklistItems ?? [];
    await ctx.db.patch(taskId, {
      checklistItems: items.filter((item) => item.key !== key),
    });
  },
});

/**
 * Reorder checklist items by providing the new ordered list of keys
 */
export const reorderChecklistItems = mutation({
  args: {
    taskId: v.id("tasks"),
    keys: v.array(v.string()),
  },
  handler: async (ctx, { taskId, keys }) => {
    const user = await getAuthUser(ctx);
    await getTaskWithAccess(ctx, taskId, user._id);

    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const items = task.checklistItems ?? [];
    const byKey = new Map(items.map((item) => [item.key, item]));
    const reordered = keys.flatMap((key) => {
      const item = byKey.get(key);
      return item ? [item] : [];
    });

    await ctx.db.patch(taskId, { checklistItems: reordered });
  },
});

/**
 * Share a task with another user by email (owner only)
 */
export const shareTask = mutation({
  args: {
    taskId: v.id("tasks"),
    email: v.string(),
  },
  handler: async (ctx, { taskId, email }) => {
    const user = await getAuthUser(ctx);
    const { role } = await getTaskWithAccess(ctx, taskId, user._id);

    if (role !== "owner") {
      throw new Error("Only the task owner can share");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (!targetUser) {
      throw new Error("No user found with that email");
    }

    if (targetUser._id === user._id) {
      throw new Error("Cannot share a task with yourself");
    }

    // Check if already shared
    const existing = await ctx.db
      .query("collaborators")
      .withIndex("by_task_and_user", (q) =>
        q.eq("taskId", taskId).eq("userId", targetUser._id)
      )
      .unique();
    if (existing) {
      throw new Error("Task already shared with this user");
    }

    await ctx.db.insert("collaborators", {
      taskId,
      userId: targetUser._id,
      addedAt: Date.now(),
      addedBy: user._id,
    });
  },
});

/**
 * Remove a collaborator from a task (owner only)
 */
export const unshareTask = mutation({
  args: {
    taskId: v.id("tasks"),
    userId: v.id("users"),
  },
  handler: async (ctx, { taskId, userId }) => {
    const user = await getAuthUser(ctx);
    const { role } = await getTaskWithAccess(ctx, taskId, user._id);

    if (role !== "owner") {
      throw new Error("Only the task owner can manage sharing");
    }

    const collaborator = await ctx.db
      .query("collaborators")
      .withIndex("by_task_and_user", (q) =>
        q.eq("taskId", taskId).eq("userId", userId)
      )
      .unique();

    if (!collaborator) {
      throw new Error("User is not a collaborator on this task");
    }

    await ctx.db.delete(collaborator._id);
  },
});

/**
 * Get collaborators for a task
 */
export const getCollaborators = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const user = await getAuthUser(ctx);
    await getTaskWithAccess(ctx, taskId, user._id);

    const collaborators = await ctx.db
      .query("collaborators")
      .withIndex("by_task", (q) => q.eq("taskId", taskId))
      .collect();

    // Enrich with user data
    return Promise.all(
      collaborators.map(async (c) => {
        const collaboratorUser = await ctx.db.get(c.userId);
        return {
          ...c,
          user: collaboratorUser,
        };
      })
    );
  },
});

/**
 * Generate an upload URL for Convex file storage
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getAuthUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Get a URL for a stored file
 */
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => await ctx.storage.getUrl(storageId),
});
