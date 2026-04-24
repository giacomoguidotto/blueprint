"use client";

import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "../types";

const STATUS_ICONS: Record<TaskStatus, typeof Circle> = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  archived: CheckCircle2,
};

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  low: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  high: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

interface TaskDetailProps {
  task: Task;
}

export function TaskDetail({ task }: TaskDetailProps) {
  const t = useTranslations("tasks");
  const imageUrl = useQuery(
    api.tasks.getStorageUrl,
    task.imageId ? { storageId: task.imageId } : "skip"
  );
  const StatusIcon = STATUS_ICONS[task.status];
  const isCompleted = task.status === "done" || task.status === "archived";

  return (
    <div className="space-y-6">
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            alt={task.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 600px"
            src={imageUrl}
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <StatusIcon
            className={cn(
              "mt-1 size-5",
              task.status === "done" && "text-green-500"
            )}
          />
          <h2
            className={cn(
              "font-bold font-mono text-2xl",
              isCompleted && "line-through opacity-60"
            )}
          >
            {task.title}
          </h2>
        </div>

        {task.description && (
          <p className="text-muted-foreground">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge
            className={PRIORITY_COLORS[task.priority]}
            variant="secondary"
          >
            {t(`priority.${task.priority}`)}
          </Badge>
          <Badge variant="outline">{t(`status.${task.status}`)}</Badge>
          {task.dueDate && (
            <Badge variant="outline">
              <Calendar className="mr-1 size-3" />
              {formatDate(task.dueDate)}
            </Badge>
          )}
          {task.tags?.map((tag) => (
            <Badge className="bg-primary/10" key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-muted-foreground text-xs">
          {t("detail.created", {
            date: formatDate(task._creationTime),
          })}
        </p>
      </div>
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
