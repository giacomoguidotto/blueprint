import { TasksClient } from "./tasks-client";

/**
 * Tasks Page (Server Component)
 *
 * Protected by the (authenticated) layout which uses
 * server-side auth check via `withAuth({ ensureSignedIn: true })`.
 *
 * Task data is loaded client-side via usePaginatedQuery for
 * pagination, search, and real-time subscription support.
 */
export default function TasksPage() {
  return <TasksClient />;
}
