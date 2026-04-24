"use client";

import { api } from "convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useAtomValue } from "jotai";
import { ClipboardList, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { fadeUp, listItemExit, spring } from "@/lib/motion";
import { searchQueryAtom, statusFilterAtom } from "../store/atoms";
import type { Task, TaskStatus } from "../types";
import { TaskCard } from "./task-card";

const PAGE_SIZE = 10;

/**
 * Task List Component
 *
 * Displays tasks from Convex with pagination and real-time updates.
 * Uses server-side search via Convex search index and
 * status filtering via compound index.
 */
export function TaskList() {
  const t = useTranslations("tasks");
  const statusFilter = useAtomValue(statusFilterAtom);
  const rawSearch = useAtomValue(searchQueryAtom);
  const debouncedSearch = useDebounce(rawSearch, 300);

  const { results, status, loadMore } = usePaginatedQuery(
    api.tasks.listTasks,
    {
      status: statusFilter === "all" ? undefined : statusFilter,
      search: debouncedSearch || undefined,
    },
    { initialNumItems: PAGE_SIZE }
  );

  // Sort tasks: by status priority, then by creation time
  const sortedTasks = useMemo(() => {
    if (!results) {
      return null;
    }

    const statusOrder: Record<TaskStatus, number> = {
      in_progress: 0,
      todo: 1,
      done: 2,
      archived: 3,
    };

    return [...results].sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) {
        return statusDiff;
      }
      return b._creationTime - a._creationTime;
    });
  }, [results]);

  // Loading state
  if (status === "LoadingFirstPage") {
    return <TaskListSkeleton />;
  }

  // Empty state
  if (!sortedTasks || sortedTasks.length === 0) {
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
          {debouncedSearch
            ? t("empty.noResults")
            : statusFilter === "all"
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

      {status === "CanLoadMore" && (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex justify-center pt-2"
          initial={{ opacity: 0 }}
        >
          <Button
            onClick={() => loadMore(PAGE_SIZE)}
            size="sm"
            variant="outline"
          >
            {t("loadMore")}
          </Button>
        </motion.div>
      )}

      {status === "LoadingMore" && (
        <div className="flex justify-center pt-2">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
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
