import { withAuth } from "@workos-inc/authkit-nextjs";
import { api } from "convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { Effect } from "effect";
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
  const program = Effect.gen(function* () {
    const { accessToken } = yield* Effect.tryPromise(() =>
      withAuth({ ensureSignedIn: true })
    );

    const preloadedTasks = yield* Effect.tryPromise(() =>
      preloadQuery(api.tasks.getTasks, {}, { token: accessToken })
    );

    return preloadedTasks;
  }).pipe(Effect.withSpan("tasks.page.load"));

  const preloadedTasks = await Effect.runPromise(program);

  return <TasksClient preloadedTasks={preloadedTasks} />;
}
