"use client";

import { useAtom } from "jotai";
import { ListTodo, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskList } from "@/features/tasks/components/task-list";
import { isCreateFormOpenAtom } from "@/features/tasks/store/atoms";

/**
 * Tasks Page (Authenticated only)
 *
 * This page is protected by the (authenticated) layout which uses
 * server-side auth check via `withAuth({ ensureSignedIn: true })`.
 *
 * Features Neo-Brutalist styling with Motion animations.
 */
export default function TasksPage() {
  const t = useTranslations("tasks");
  const [isFormOpen, setIsFormOpen] = useAtom(isCreateFormOpenAtom);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          <div>
            <h1 className="flex items-center gap-2 font-bold font-mono text-3xl tracking-tight">
              <ListTodo className="size-8" />
              {t("heading")}
            </h1>
            <p className="mt-1 text-muted-foreground">{t("subheading")}</p>
          </div>
          {!isFormOpen && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <Button
                className="border-brutal shadow-brutal-sm"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus />
                {t("addTask")}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Create Task Form with animation */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
              transition={{ duration: 0.2 }}
            >
              <TaskForm
                onCancel={() => setIsFormOpen(false)}
                onSuccess={() => setIsFormOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <TaskFilters />

        {/* Task List */}
        <TaskList />

        {/* Convex Features Info */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-brutal bg-muted/30 p-4 shadow-brutal-sm"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.2, duration: 0.15 }}
        >
          <h2 className="mb-2 font-mono font-semibold text-sm">
            {t("convexFeatures.title")}
          </h2>
          <ul className="space-y-1 text-muted-foreground text-sm">
            <li>• {t("convexFeatures.realtime")}</li>
            <li>• {t("convexFeatures.typeSafe")}</li>
            <li>• {t("convexFeatures.transactions")}</li>
            <li>• {t("convexFeatures.indexes")}</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
