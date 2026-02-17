import { withAuth } from "@workos-inc/authkit-nextjs";
import { api } from "convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { Effect } from "effect";
import { telemetryRuntime } from "@/lib/telemetry/runtime";
import { TasksClient } from "./tasks-client";

/**
 * Tasks Page (Server Component)
 *
 * This page is protected by the (authenticated) layout which uses
 * server-side auth check via `withAuth({ ensureSignedIn: true })`.
 *
 * Preloads tasks on the server for faster initial render.
 *
 * Note: `withAuth` must be called outside Effect.tryPromise so Next.js
 * can detect the dynamic server usage (headers) and skip static rendering.
 */
export default async function TasksPage() {
  const { accessToken } = await withAuth({ ensureSignedIn: true });

  const program = Effect.tryPromise(() =>
    preloadQuery(api.tasks.getTasks, {}, { token: accessToken })
  ).pipe(Effect.withSpan("tasks.page.load"));

  const preloadedTasks = await telemetryRuntime.runPromise(program);

  return <TasksClient preloadedTasks={preloadedTasks} />;
}
