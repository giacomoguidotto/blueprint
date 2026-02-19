"use client";

import type { api } from "convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useAtomValue } from "jotai";
import { ClipboardList } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp, listItemExit, spring } from "@/lib/motion";
import { statusFilterAtom } from "../store/atoms";
import type { Task, TaskStatus } from "../types";
import { TaskCard } from "./task-card";

interface TaskListProps {
  preloadedTasks: Preloaded<typeof api.tasks.getTasks>;
}

/**
 * Task List Component
 *
 * Displays tasks from Convex with real-time updates.
 * Uses preloaded tasks for instant initial render, then subscribes
 * for real-time updates. Filters are applied client-side for instant UX.
 * Features glassmorphism styling with spring-based Motion animations.
 */
export function TaskList({ preloadedTasks }: TaskListProps) {
  const t = useTranslations("tasks");
  const statusFilter = useAtomValue(statusFilterAtom);

  // Use preloaded tasks - automatically upgrades to live subscription
  const allTasks = usePreloadedQuery(preloadedTasks);

  // Filter tasks client-side for instant filter changes
  const tasks =
    statusFilter === "all"
      ? allTasks
      : allTasks.filter((task) => task.status === statusFilter);

  // Sort tasks: by status priority, then by creation time
  const sortedTasks = useMemo(() => {
    if (!tasks) {
      return null;
    }

    const statusOrder: Record<TaskStatus, number> = {
      in_progress: 0,
      todo: 1,
      done: 2,
      archived: 3,
    };

    return [...tasks].sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) {
        return statusDiff;
      }
      // More recent tasks first within same status
      return b._creationTime - a._creationTime;
    });
  }, [tasks]);

  // Loading state
  if (sortedTasks === null) {
    return <TaskListSkeleton />;
  }

  // Empty state
  if (sortedTasks.length === 0) {
    return (
      <motion.div
        animate="show"
        className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
        initial="hidden"
        variants={fadeUp}
      >
        <ClipboardList className="mb-4 size-12 text-muted-foreground/50" />
        <h3 className="mb-1 font-medium font-mono text-lg">
          {t("empty.title")}
        </h3>
        <p className="text-muted-foreground text-sm">
          {statusFilter === "all"
            ? t("empty.description")
            : t("empty.filtered")}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task: Task) => (
          <motion.div
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={listItemExit}
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            key={task._id}
            layout="position"
            transition={spring.gentle}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Loading skeleton for task list
 */
const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"] as const;

function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {SKELETON_KEYS.map((key) => (
        <div className="rounded-lg border p-4" key={key}>
          <div className="flex items-start gap-3">
            <Skeleton className="size-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
