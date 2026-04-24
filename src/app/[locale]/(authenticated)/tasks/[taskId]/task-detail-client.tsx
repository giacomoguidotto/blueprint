"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TaskDetail,
  TaskDetailSkeleton,
} from "@/features/tasks/components/task-detail";
import { Link } from "@/i18n/routing";

interface Props {
  taskId: Id<"tasks">;
}

/**
 * Client component for the full-page task detail view.
 *
 * Uses real-time Convex subscription for live updates
 * after the initial server-side render.
 */
export function TaskDetailClient({ taskId }: Props) {
  const t = useTranslations("tasks");
  const task = useQuery(api.tasks.getTask, { taskId });

  return (
    <div className="space-y-4">
      <Button asChild size="sm" variant="ghost">
        <Link href="/tasks">
          <ArrowLeft className="size-4" />
          {t("detail.backToTasks")}
        </Link>
      </Button>

      <Card className="shadow-brutal">
        <CardContent className="pt-6">
          {task === undefined ? (
            <TaskDetailSkeleton />
          ) : task === null ? (
            <p className="text-muted-foreground">{t("detail.notFound")}</p>
          ) : (
            <TaskDetail task={task} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
