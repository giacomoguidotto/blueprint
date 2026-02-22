/**
 * Task Feature Types
 *
 * Leverages Convex generated types for end-to-end type safety.
 */
import type { Doc, Id } from "convex/_generated/dataModel";

/**
 * Task document type from Convex schema
 */
export type Task = Doc<"tasks">;

/**
 * Task ID type
 */
export type TaskId = Id<"tasks">;

/**
 * Task status enum values
 */
export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "done",
  "archived",
] as const;
export type TaskStatus = Task["status"];

/**
 * Task priority enum values
 */
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = Task["priority"];

/**
 * Form input for creating a new task
 */
export interface CreateTaskInput {
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  tags?: string[];
  title: string;
}

/**
 * Filter state for task list
 */
export interface TaskFilter {
  status: TaskStatus | "all";
}
