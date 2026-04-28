import { withAuth } from "@workos-inc/authkit-nextjs";
import { TasksClient } from "./tasks-client";

export default async function TasksPage() {
  await withAuth({ ensureSignedIn: true });
  return <TasksClient />;
}
