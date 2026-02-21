"use client";

import { api } from "convex/_generated/api";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spotlight } from "@/components/ui/spotlight";
import { cardHover } from "@/lib/motion";
import { useTracedMutation } from "@/lib/telemetry/use-traced-mutation";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "../types";

interface TaskCardProps {
  task: Task;
}

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

type NextableStatus = "in_progress" | "done";

function getNextStatus(current: TaskStatus): NextableStatus | null {
  if (current === "todo") {
    return "in_progress";
  }
  if (current === "in_progress") {
    return "done";
  }
  return null;
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate) {
    return false;
  }
  if (task.status === "done" || task.status === "archived") {
    return false;
  }
  return task.dueDate < Date.now();
}

function isTaskCompleted(status: TaskStatus): boolean {
  return status === "done" || status === "archived";
}

/**
 * Task Card Component
 *
 * Displays a single task with status, priority, and actions.
 * Features glassmorphism styling with spring-based Motion animations.
 */
export function TaskCard({ task }: TaskCardProps) {
  const t = useTranslations("tasks");
  const updateStatus = useTracedMutation(
    api.tasks.updateTaskStatus,
    "user.action.updateTaskStatus",
    { "task.id": task._id }
  );
  const deleteTask = useTracedMutation(
    api.tasks.deleteTask,
    "user.action.deleteTask",
    { "task.id": task._id }
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const StatusIcon = STATUS_ICONS[task.status];
  const nextStatus = getNextStatus(task.status);
  const isOverdue = isTaskOverdue(task);
  const isCompleted = isTaskCompleted(task.status);

  const handleStatusChange = useCallback(
    async (newStatus: TaskStatus) => {
      setIsUpdating(true);
      try {
        await updateStatus({ taskId: task._id, status: newStatus });
      } finally {
        setIsUpdating(false);
      }
    },
    [updateStatus, task._id]
  );

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteTask({ taskId: task._id });
    } catch {
      setIsDeleting(false);
    }
  }, [deleteTask, task._id]);

  return (
    <motion.div
      initial="rest"
      variants={cardHover}
      whileHover="hover"
      whileTap="tap"
    >
      <Spotlight className="rounded-xl">
        <Card
          className={cn(
            "shadow-brutal transition-all hover:shadow-elevated",
            task.priority === "high" && "priority-high",
            task.priority === "medium" && "priority-medium",
            task.priority === "low" && "priority-low",
            isCompleted && "opacity-60",
            isOverdue && "border-destructive/50"
          )}
        >
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
            <div className="flex items-start gap-3">
              <motion.div whileTap={{ scale: 0.85, rotate: -15 }}>
                <Button
                  aria-label={t(`status.${task.status}`)}
                  className="mt-0.5"
                  disabled={isUpdating || isCompleted}
                  onClick={() => nextStatus && handleStatusChange(nextStatus)}
                  size="icon-xs"
                  variant="ghost"
                >
                  {isUpdating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <StatusIcon
                      className={cn(
                        "size-4",
                        task.status === "done" && "text-green-500"
                      )}
                    />
                  )}
                </Button>
              </motion.div>
              <div className="space-y-1">
                <CardTitle
                  className={cn(
                    "font-mono text-base",
                    task.status === "done" && "line-through"
                  )}
                >
                  {task.title}
                </CardTitle>
                {task.description && (
                  <p className="line-clamp-2 text-muted-foreground text-sm">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            <TaskCardMenu
              isDeleting={isDeleting}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              status={task.status}
              t={t}
            />
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex flex-wrap items-center gap-2">
              <motion.div
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Badge
                  className={PRIORITY_COLORS[task.priority]}
                  variant="secondary"
                >
                  {t(`priority.${task.priority}`)}
                </Badge>
              </motion.div>

              <Badge variant="outline">{t(`status.${task.status}`)}</Badge>

              {task.dueDate && (
                <Badge
                  className={
                    isOverdue ? "bg-destructive/10 text-destructive" : ""
                  }
                  variant="outline"
                >
                  <Calendar className="mr-1 size-3" />
                  {formatDate(task.dueDate)}
                </Badge>
              )}

              {task.tags?.map((tag) => (
                <Badge className="bg-primary/10" key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}

              {nextStatus && (
                <Button
                  className="ml-auto"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(nextStatus)}
                  size="xs"
                  variant="ghost"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      {t(`actions.moveTo.${nextStatus}`)}
                      <ArrowRight />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Spotlight>
    </motion.div>
  );
}

/**
 * Dropdown menu for task actions
 */
function TaskCardMenu({
  status,
  isDeleting,
  onStatusChange,
  onDelete,
  t,
}: {
  status: TaskStatus;
  isDeleting: boolean;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
  t: ReturnType<typeof useTranslations<"tasks">>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={t("actions.menu")}
          disabled={isDeleting}
          size="icon-xs"
          variant="ghost"
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MoreVertical className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== "todo" && (
          <DropdownMenuItem onClick={() => onStatusChange("todo")}>
            <Circle className="size-4" />
            {t("actions.markTodo")}
          </DropdownMenuItem>
        )}
        {status !== "in_progress" && (
          <DropdownMenuItem onClick={() => onStatusChange("in_progress")}>
            <Clock className="size-4" />
            {t("actions.markInProgress")}
          </DropdownMenuItem>
        )}
        {status !== "done" && (
          <DropdownMenuItem onClick={() => onStatusChange("done")}>
            <CheckCircle2 className="size-4" />
            {t("actions.markDone")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {status !== "archived" && (
          <DropdownMenuItem onClick={() => onStatusChange("archived")}>
            {t("actions.archive")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          {t("actions.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
