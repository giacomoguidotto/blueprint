import { z } from "zod/v4";
import { TASK_PRIORITIES } from "./types";

/**
 * Zod schema for task creation form validation
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
