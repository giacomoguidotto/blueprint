import type { GenericMutationCtx } from "convex/server";
import type { DataModel, Id } from "../_generated/dataModel";

type MutationCtx = GenericMutationCtx<DataModel>;

type ActivityType =
  | "status_changed"
  | "priority_changed"
  | "due_date_changed"
  | "collaborator_added"
  | "collaborator_removed"
  | "checklist_item_added"
  | "checklist_item_completed"
  | "checklist_item_uncompleted"
  | "comment";

export async function recordActivity(
  ctx: MutationCtx,
  args: {
    taskId: Id<"tasks">;
    userId: Id<"users">;
    type: ActivityType;
    body?: string;
    metadata?: Record<string, unknown>;
  }
) {
  await ctx.db.insert("activityEntries", {
    taskId: args.taskId,
    userId: args.userId,
    type: args.type,
    body: args.body,
    metadata: args.metadata,
  });
}
