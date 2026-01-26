"use client";

import { useAtom } from "jotai";
import { ListTodo, Plus } from "lucide-react";
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
 * Showcases Convex capabilities:
 * - Real-time queries with automatic re-fetching on data changes
 * - Transactional mutations for creating, updating, and deleting tasks
 * - Type-safe API with generated types from schema
 * - Optimistic updates for responsive UI
 *
 * Also demonstrates:
 * - react-hook-form with zod validation
 * - jotai for local UI state management
 * - Feature-based folder structure
 */
export default function TasksPage() {
  const t = useTranslations("tasks");
  const [isFormOpen, setIsFormOpen] = useAtom(isCreateFormOpenAtom);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
              <ListTodo className="size-8" />
              {t("heading")}
            </h1>
            <p className="mt-1 text-muted-foreground">{t("subheading")}</p>
          </div>
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus />
              {t("addTask")}
            </Button>
          )}
        </div>

        {/* Create Task Form */}
        {isFormOpen && (
          <TaskForm
            onCancel={() => setIsFormOpen(false)}
            onSuccess={() => setIsFormOpen(false)}
          />
        )}

        {/* Filters */}
        <TaskFilters />

        {/* Task List */}
        <TaskList />

        {/* Convex Features Info */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h2 className="mb-2 font-semibold text-sm">
            {t("convexFeatures.title")}
          </h2>
          <ul className="space-y-1 text-muted-foreground text-sm">
            <li>• {t("convexFeatures.realtime")}</li>
            <li>• {t("convexFeatures.typeSafe")}</li>
            <li>• {t("convexFeatures.transactions")}</li>
            <li>• {t("convexFeatures.indexes")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
