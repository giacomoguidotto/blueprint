import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export type TaskStatus = "todo" | "in_progress" | "done" | "archived";

/**
 * Valid status transitions for the task lifecycle.
 *
 * todo → in_progress → done → archived
 * with reopening: in_progress → todo, done → todo
 */
export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ["in_progress"],
  in_progress: ["done", "todo"],
  done: ["archived", "todo"],
  archived: [],
};

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Convex Schema Definition
 *
 * This schema defines the structure of your database tables and provides
 * end-to-end type safety throughout your application.
 *
 * Add your tables here as your application grows.
 */
export default defineSchema({
  /**
   * Users table
   *
   * Stores user profile information synchronized with WorkOS Auth.
   */
  users: defineTable({
    // WorkOS user ID (matches identity.subject from JWT)
    authId: v.string(),
    // User email (synced from WorkOS)
    email: v.optional(v.string()),
    // Optional avatar image (Convex file storage)
    avatarId: v.optional(v.id("_storage")),
    // User notification preferences (per event type)
    preferences: v.optional(
      v.object({
        notifyOnShare: v.boolean(),
        notifyOnComment: v.boolean(),
        notifyOnDueDate: v.boolean(),
      })
    ),
  })
    .index("by_auth_id", ["authId"])
    .index("by_email", ["email"]),

  /**
   * Example: Tasks table
   *
   * Demonstrates a simple task management system with user relationships.
   * Remove or modify this based on your application needs.
   */
  tasks: defineTable({
    // Task title
    title: v.string(),
    // Optional task description
    description: v.optional(v.string()),
    // Task status
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("archived")
    ),
    // Priority level
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    // Reference to the user who created the task
    userId: v.id("users"),
    // Optional due date (stored as timestamp)
    dueDate: v.optional(v.number()),
    // Optional tags for categorization
    tags: v.optional(v.array(v.string())),
    // Checklist items (embedded value objects)
    checklistItems: v.optional(
      v.array(
        v.object({
          key: v.string(),
          title: v.string(),
          checked: v.boolean(),
        })
      )
    ),
    // Optional cover image (Convex file storage)
    imageId: v.optional(v.id("_storage")),
  })
    // Index to get all tasks for a specific user
    .index("by_user", ["userId"])
    // Compound index for filtering by user and status
    .index("by_user_and_status", ["userId", "status"])
    // Index for tasks by due date
    .index("by_due_date", ["dueDate"])
    // Search index for full-text search on task titles
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId"],
    }),

  /**
   * Collaborators table
   *
   * Join table between tasks and users for shared access.
   * Carries metadata about who shared and when.
   */
  collaborators: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    addedAt: v.number(),
    addedBy: v.id("users"),
  })
    .index("by_task", ["taskId"])
    .index("by_task_and_user", ["taskId", "userId"])
    .index("by_user", ["userId"]),

  /**
   * Activity entries table
   *
   * Append-only log of events on a task. Includes both system-generated
   * entries (status changes, etc.) and user-generated comments.
   */
  activityEntries: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    type: v.union(
      v.literal("status_changed"),
      v.literal("priority_changed"),
      v.literal("due_date_changed"),
      v.literal("collaborator_added"),
      v.literal("collaborator_removed"),
      v.literal("checklist_item_added"),
      v.literal("checklist_item_completed"),
      v.literal("checklist_item_uncompleted"),
      v.literal("comment")
    ),
    body: v.optional(v.string()),
    metadata: v.optional(v.any()),
  }).index("by_task", ["taskId"]),

  /**
   * Notifications table
   *
   * Records of sent notification emails for delivery tracking
   * and deduplication (e.g., due date reminders).
   */
  notifications: defineTable({
    taskId: v.id("tasks"),
    recipientId: v.id("users"),
    type: v.union(
      v.literal("task_shared"),
      v.literal("comment_added"),
      v.literal("due_date_approaching")
    ),
    sentAt: v.number(),
  })
    .index("by_task_and_type", ["taskId", "type"])
    .index("by_recipient", ["recipientId"]),
});

/**
 * Schema Best Practices:
 *
 * 1. Use indexes for fields you'll frequently query
 * 2. Use v.optional() for nullable fields
 * 3. Use v.union() with v.literal() for enums
 * 4. Use v.id("tableName") for references to other tables
 * 5. Document your schema with comments
 * 6. Keep document sizes reasonable (<1MB)
 * 7. Use compound indexes for common multi-field queries
 *
 * System Fields (automatically added):
 * - _id: Unique document identifier
 * - _creationTime: Timestamp when document was created
 *
 * Learn more: https://docs.convex.dev/database/schemas
 */
