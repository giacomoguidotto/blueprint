"use client";

import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
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

/**
 * Task Card Component
 *
 * Displays a single task with status, priority, and actions.
 * Supports real-time status updates and deletion via Convex mutations.
 */
export function TaskCard({ task }: TaskCardProps) {
  const t = useTranslations("tasks");
  const updateStatus = useMutation(api.tasks.updateTaskStatus);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const StatusIcon = STATUS_ICONS[task.status];

  const handleStatusChange = useCallback(
    async (newStatus: TaskStatus) => {
      setIsUpdating(true);
      try {
        await updateStatus({ taskId: task._id, status: newStatus });
      } catch (error) {
        console.error("Failed to update status:", error);
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
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsDeleting(false);
    }
  }, [deleteTask, task._id]);

  type NextableStatus = "in_progress" | "done";

  const getNextStatus = (current: TaskStatus): NextableStatus | null => {
    if (current === "todo") {
      return "in_progress";
    }
    if (current === "in_progress") {
      return "done";
    }
    return null;
  };

  const nextStatus = getNextStatus(task.status);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  const isOverdue =
    task.dueDate && task.status !== "done" && task.status !== "archived"
      ? task.dueDate < Date.now()
      : false;

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        task.status === "done" || task.status === "archived" ? "opacity-60" : ""
      } ${isOverdue ? "border-destructive/50" : ""}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div className="flex items-start gap-3">
          <Button
            aria-label={t(`status.${task.status}`)}
            className="mt-0.5"
            disabled={
              isUpdating || task.status === "done" || task.status === "archived"
            }
            onClick={() => nextStatus && handleStatusChange(nextStatus)}
            size="icon-xs"
            variant="ghost"
          >
            {isUpdating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <StatusIcon
                className={`size-4 ${task.status === "done" ? "text-green-500" : ""}`}
              />
            )}
          </Button>
          <div className="space-y-1">
            <CardTitle
              className={`text-base ${task.status === "done" ? "line-through" : ""}`}
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
            {task.status !== "todo" && (
              <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
                <Circle className="size-4" />
                {t("actions.markTodo")}
              </DropdownMenuItem>
            )}
            {task.status !== "in_progress" && (
              <DropdownMenuItem
                onClick={() => handleStatusChange("in_progress")}
              >
                <Clock className="size-4" />
                {t("actions.markInProgress")}
              </DropdownMenuItem>
            )}
            {task.status !== "done" && (
              <DropdownMenuItem onClick={() => handleStatusChange("done")}>
                <CheckCircle2 className="size-4" />
                {t("actions.markDone")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {task.status !== "archived" && (
              <DropdownMenuItem onClick={() => handleStatusChange("archived")}>
                {t("actions.archive")}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="size-4" />
              {t("actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Badge */}
          <Badge className={PRIORITY_COLORS[task.priority]} variant="secondary">
            {t(`priority.${task.priority}`)}
          </Badge>

          {/* Status Badge */}
          <Badge variant="outline">{t(`status.${task.status}`)}</Badge>

          {/* Due Date */}
          {task.dueDate && (
            <Badge
              className={isOverdue ? "bg-destructive/10 text-destructive" : ""}
              variant="outline"
            >
              <Calendar className="mr-1 size-3" />
              {formatDate(task.dueDate)}
            </Badge>
          )}

          {/* Tags */}
          {task.tags?.map((tag) => (
            <Badge className="bg-primary/10" key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}

          {/* Quick action for next status */}
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
  );
}
