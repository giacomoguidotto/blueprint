"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { use } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TaskDetail,
  TaskDetailSkeleton,
} from "@/features/tasks/components/task-detail";
import { useRouter } from "@/i18n/routing";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default function TaskModalPage({ params }: Props) {
  const { taskId } = use(params);
  const router = useRouter();
  const task = useQuery(api.tasks.getTask, {
    taskId: taskId as Id<"tasks">,
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
      open
    >
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono">
            {task?.title ?? "..."}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Task details
          </DialogDescription>
        </DialogHeader>
        {task === undefined && <TaskDetailSkeleton />}
        {task === null && (
          <p className="text-muted-foreground">Task not found</p>
        )}
        {task != null && <TaskDetail task={task} />}
      </DialogContent>
    </Dialog>
  );
}
