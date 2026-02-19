"use client";

import type { api } from "convex/_generated/api";
import type { Preloaded } from "convex/react";
import { useAtom } from "jotai";
import { ListTodo, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskList } from "@/features/tasks/components/task-list";
import { isCreateFormOpenAtom } from "@/features/tasks/store/atoms";
import { fadeUp, scaleIn, spring } from "@/lib/motion";

interface TasksClientProps {
  preloadedTasks: Preloaded<typeof api.tasks.getTasks>;
}

/**
 * Tasks Page Client Component
 *
 * Receives preloaded tasks from server for instant render,
 * then handles real-time updates via Convex subscriptions.
 *
 * Features glassmorphism styling with spring-based Motion animations.
 */
export function TasksClient({ preloadedTasks }: TasksClientProps) {
  const t = useTranslations("tasks");
  const [isFormOpen, setIsFormOpen] = useAtom(isCreateFormOpenAtom);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page Header */}
        <motion.div
          animate="show"
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial="hidden"
          variants={fadeUp}
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
              animate="show"
              initial="hidden"
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="shadow-brutal-sm"
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
              animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
              exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
              initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
              style={{ overflow: "hidden" }}
              transition={spring.gentle}
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

        {/* Task List with preloaded data */}
        <TaskList preloadedTasks={preloadedTasks} />

        {/* Convex Features Info */}
        <motion.div
          className="rounded-lg border bg-muted/30 p-4 shadow-soft"
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView="show"
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
