import { withAuth } from "@workos-inc/authkit-nextjs";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TaskDetailSkeleton } from "@/features/tasks/components/task-detail";
import { TaskDetailClient } from "./task-detail-client";

interface Props {
  params: Promise<{ taskId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskId } = await params;
  const { accessToken } = await withAuth({ ensureSignedIn: true });

  const task = await fetchQuery(
    api.tasks.getTask,
    { taskId: taskId as Id<"tasks"> },
    { token: accessToken }
  );

  if (!task) {
    return { title: "Task Not Found" };
  }

  return {
    title: task.title,
    description: task.description ?? "Task details",
  };
}

export default async function TaskDetailPage({ params }: Props) {
  const { taskId } = await params;
  const { accessToken } = await withAuth({ ensureSignedIn: true });

  const task = await fetchQuery(
    api.tasks.getTask,
    { taskId: taskId as Id<"tasks"> },
    { token: accessToken }
  );

  if (!task) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Suspense fallback={<TaskDetailSkeleton />}>
          <TaskDetailClient taskId={taskId as Id<"tasks">} />
        </Suspense>
      </div>
    </div>
  );
}
