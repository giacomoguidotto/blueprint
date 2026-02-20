import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("tasks backend", () => {
  describe("getTasks", () => {
    it("throws when not authenticated", async () => {
      const t = convexTest(schema, modules);
      await expect(t.query(api.tasks.getTasks, {})).rejects.toThrow(
        "Not authenticated"
      );
    });

    it("throws when user not found in db", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "unknown-user" });
      await expect(asUser.query(api.tasks.getTasks, {})).rejects.toThrow(
        "User not found"
      );
    });

    it("returns tasks for authenticated user", async () => {
      const t = convexTest(schema, modules);

      // Seed a user
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", { authId: "user-1" });
      });

      // Seed a task
      await t.run(async (ctx) => {
        await ctx.db.insert("tasks", {
          title: "My task",
          status: "todo",
          priority: "medium",
          userId,
        });
      });

      const asUser = t.withIdentity({ subject: "user-1" });
      const tasks = await asUser.query(api.tasks.getTasks, {});
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("My task");
    });

    it("filters tasks by status", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", { authId: "user-2" });
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("tasks", {
          title: "Todo task",
          status: "todo",
          priority: "low",
          userId,
        });
        await ctx.db.insert("tasks", {
          title: "Done task",
          status: "done",
          priority: "high",
          userId,
        });
      });

      const asUser = t.withIdentity({ subject: "user-2" });

      const todoTasks = await asUser.query(api.tasks.getTasks, {
        status: "todo",
      });
      expect(todoTasks).toHaveLength(1);
      expect(todoTasks[0].title).toBe("Todo task");

      const doneTasks = await asUser.query(api.tasks.getTasks, {
        status: "done",
      });
      expect(doneTasks).toHaveLength(1);
      expect(doneTasks[0].title).toBe("Done task");
    });
  });

  describe("createTask", () => {
    it("throws when not authenticated", async () => {
      const t = convexTest(schema, modules);
      await expect(
        t.mutation(api.tasks.createTask, {
          title: "Task",
          priority: "medium",
        })
      ).rejects.toThrow("Not authenticated");
    });

    it("creates a task with default status 'todo'", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        await ctx.db.insert("users", { authId: "user-3" });
      });

      const asUser = t.withIdentity({ subject: "user-3" });
      const taskId = await asUser.mutation(api.tasks.createTask, {
        title: "New task",
        priority: "high",
      });

      expect(taskId).toBeTruthy();

      const tasks = await asUser.query(api.tasks.getTasks, {});
      expect(tasks).toHaveLength(1);
      expect(tasks[0].status).toBe("todo");
      expect(tasks[0].priority).toBe("high");
    });
  });

  describe("updateTaskStatus", () => {
    it("throws when not authenticated", async () => {
      const t = convexTest(schema, modules);

      // Create a task to get a valid ID
      const taskId = await t.run(async (ctx) => {
        const userId = await ctx.db.insert("users", { authId: "owner" });
        return await ctx.db.insert("tasks", {
          title: "Task",
          status: "todo",
          priority: "low",
          userId,
        });
      });

      await expect(
        t.mutation(api.tasks.updateTaskStatus, {
          taskId,
          status: "done",
        })
      ).rejects.toThrow("Not authenticated");
    });

    it("prevents updating another user's task", async () => {
      const t = convexTest(schema, modules);

      const taskId = await t.run(async (ctx) => {
        const ownerId = await ctx.db.insert("users", { authId: "owner" });
        await ctx.db.insert("users", { authId: "other" });
        return await ctx.db.insert("tasks", {
          title: "Owner's task",
          status: "todo",
          priority: "medium",
          userId: ownerId,
        });
      });

      const asOther = t.withIdentity({ subject: "other" });
      await expect(
        asOther.mutation(api.tasks.updateTaskStatus, {
          taskId,
          status: "done",
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("updates status for own task", async () => {
      const t = convexTest(schema, modules);

      const taskId = await t.run(async (ctx) => {
        const userId = await ctx.db.insert("users", { authId: "user-4" });
        return await ctx.db.insert("tasks", {
          title: "My task",
          status: "todo",
          priority: "low",
          userId,
        });
      });

      const asUser = t.withIdentity({ subject: "user-4" });
      await asUser.mutation(api.tasks.updateTaskStatus, {
        taskId,
        status: "in_progress",
      });

      const tasks = await asUser.query(api.tasks.getTasks, {});
      expect(tasks[0].status).toBe("in_progress");
    });
  });

  describe("deleteTask", () => {
    it("throws when not authenticated", async () => {
      const t = convexTest(schema, modules);

      const taskId = await t.run(async (ctx) => {
        const userId = await ctx.db.insert("users", { authId: "owner" });
        return await ctx.db.insert("tasks", {
          title: "Task",
          status: "todo",
          priority: "low",
          userId,
        });
      });

      await expect(
        t.mutation(api.tasks.deleteTask, { taskId })
      ).rejects.toThrow("Not authenticated");
    });

    it("prevents deleting another user's task", async () => {
      const t = convexTest(schema, modules);

      const taskId = await t.run(async (ctx) => {
        const ownerId = await ctx.db.insert("users", { authId: "owner" });
        await ctx.db.insert("users", { authId: "intruder" });
        return await ctx.db.insert("tasks", {
          title: "Task",
          status: "todo",
          priority: "low",
          userId: ownerId,
        });
      });

      const asIntruder = t.withIdentity({ subject: "intruder" });
      await expect(
        asIntruder.mutation(api.tasks.deleteTask, { taskId })
      ).rejects.toThrow("Unauthorized");
    });

    it("deletes own task", async () => {
      const t = convexTest(schema, modules);

      const taskId = await t.run(async (ctx) => {
        const userId = await ctx.db.insert("users", { authId: "user-5" });
        return await ctx.db.insert("tasks", {
          title: "Delete me",
          status: "todo",
          priority: "low",
          userId,
        });
      });

      const asUser = t.withIdentity({ subject: "user-5" });
      await asUser.mutation(api.tasks.deleteTask, { taskId });

      const tasks = await asUser.query(api.tasks.getTasks, {});
      expect(tasks).toHaveLength(0);
    });
  });
});
