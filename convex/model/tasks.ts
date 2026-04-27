import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel, Doc, Id } from "../_generated/dataModel";

type Role = "owner" | "collaborator";

type Ctx = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>;

/**
 * Authenticate the current user from the request context.
 * Throws if not authenticated or user not found.
 */
export async function getAuthUser(ctx: Ctx): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
    .unique();
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Get a task and the current user's role on it.
 * Returns the task and role ("owner" or "collaborator").
 * Throws if the user has no access.
 */
export async function getTaskWithAccess(
  ctx: Ctx,
  taskId: Id<"tasks">,
  userId: Id<"users">
): Promise<{ task: Doc<"tasks">; role: Role }> {
  const task = await ctx.db.get(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  if (task.userId === userId) {
    return { task, role: "owner" };
  }

  const collaborator = await ctx.db
    .query("collaborators")
    .withIndex("by_task_and_user", (q) =>
      q.eq("taskId", taskId).eq("userId", userId)
    )
    .unique();

  if (!collaborator) {
    throw new Error("Unauthorized");
  }

  return { task, role: "collaborator" };
}
