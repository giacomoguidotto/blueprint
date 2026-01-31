import { withAuth } from "@workos-inc/authkit-nextjs";
import { api } from "convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { TasksClient } from "./tasks-client";

/**
 * Tasks Page (Server Component)
 *
 * This page is protected by the (authenticated) layout which uses
 * server-side auth check via `withAuth({ ensureSignedIn: true })`.
 *
 * Preloads tasks on the server for faster initial render.
 */
export default async function TasksPage() {
  const { accessToken } = await withAuth({ ensureSignedIn: true });

  // Preload all tasks (without status filter) on the server
  // Client will handle filtering for real-time updates
  const preloadedTasks = await preloadQuery(
    api.tasks.getTasks,
    {},
    { token: accessToken }
  );

  return <TasksClient preloadedTasks={preloadedTasks} />;
}
