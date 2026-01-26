/**
 * Jotai Atoms for Task State Management
 *
 * Manages local UI state for the tasks feature.
 * Convex handles server state; these atoms handle UI-only concerns.
 */
import { atom } from "jotai";
import type { TaskFilter, TaskId, TaskStatus } from "../types";

/**
 * Filter state for task list
 * Persists the selected status filter
 */
export const taskFilterAtom = atom<TaskFilter>({
  status: "all",
});

/**
 * Derived atom for getting just the status filter
 */
export const statusFilterAtom = atom(
  (get) => get(taskFilterAtom).status,
  (get, set, status: TaskStatus | "all") => {
    set(taskFilterAtom, { ...get(taskFilterAtom), status });
  }
);

/**
 * Currently selected task for detail view or editing
 */
export const selectedTaskIdAtom = atom<TaskId | null>(null);

/**
 * Controls visibility of the create task form
 */
export const isCreateFormOpenAtom = atom(false);

/**
 * Search query for filtering tasks by title
 */
export const searchQueryAtom = atom("");
