/**
 * Task Feature Types
 *
 * Leverages Convex generated types for end-to-end type safety.
 */
import type { Doc, Id } from "convex/_generated/dataModel";

export type Task = Doc<"tasks">;
export type TaskId = Id<"tasks">;

export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "done",
  "archived",
] as const;
export type TaskStatus = Task["status"];

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = Task["priority"];

export type ChecklistItem = NonNullable<Task["checklistItems"]>[number];

export interface CreateTaskInput {
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  tags?: string[];
  title: string;
}

export interface TaskFilter {
  status: TaskStatus | "all";
}
