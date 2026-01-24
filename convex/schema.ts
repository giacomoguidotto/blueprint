import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    // WorkOS token identifier for authentication
    tokenIdentifier: v.string(),
    // User's full name
    name: v.string(),
    // User's email address
    email: v.string(),
    // Optional profile picture URL
    avatarUrl: v.optional(v.string()),
    // Optional bio/description
    bio: v.optional(v.string()),
    // User preferences
    preferences: v.optional(
      v.object({
        locale: v.union(v.literal("en"), v.literal("it")),
        theme: v.union(
          v.literal("light"),
          v.literal("dark"),
          v.literal("system")
        ),
        notifications: v.boolean(),
      })
    ),
  })
    // Index for fast lookups by authentication token
    .index("by_token", ["tokenIdentifier"])
    // Index for email lookups (e.g., for search/invites)
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
  })
    // Index to get all tasks for a specific user
    .index("by_user", ["userId"])
    // Compound index for filtering by user and status
    .index("by_user_and_status", ["userId", "status"])
    // Index for tasks by due date
    .index("by_due_date", ["dueDate"]),
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
