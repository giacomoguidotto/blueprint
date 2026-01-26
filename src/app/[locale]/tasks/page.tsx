"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Authenticated, Unauthenticated } from "convex/react";
import { useAtom } from "jotai";
import { ArrowLeft, ListTodo, Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskList } from "@/features/tasks/components/task-list";
import { isCreateFormOpenAtom } from "@/features/tasks/store/atoms";
import { Link } from "@/i18n/routing";

/**
 * Tasks Page
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
  const t = useTranslations();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild size="icon-sm" variant="ghost">
              <Link aria-label={t("common.back")} href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">{t("tasks.title")}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Authenticated>
          <AuthenticatedTasksView />
        </Authenticated>
        <Unauthenticated>
          <UnauthenticatedView />
        </Unauthenticated>
      </main>
    </div>
  );
}

function AuthenticatedTasksView() {
  const t = useTranslations("tasks");
  const { signOut } = useAuth({ ensureSignedIn: true });
  const [isFormOpen, setIsFormOpen] = useAtom(isCreateFormOpenAtom);

  return (
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
        <div className="flex gap-2">
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus />
              {t("addTask")}
            </Button>
          )}
          <Button onClick={() => signOut()} variant="outline">
            {t("signOut")}
          </Button>
        </div>
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
  );
}

function UnauthenticatedView() {
  const t = useTranslations("tasks");

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <ListTodo className="size-8 text-primary" />
        </div>
      </div>
      <h1 className="mb-4 font-bold text-3xl tracking-tight">
        {t("unauthenticated.title")}
      </h1>
      <p className="mb-8 text-muted-foreground">
        {t("unauthenticated.description")}
      </p>
      <div className="flex justify-center gap-3">
        <Button asChild>
          <Link href="/sign-in">{t("unauthenticated.signIn")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-up">{t("unauthenticated.signUp")}</Link>
        </Button>
      </div>
    </div>
  );
}
