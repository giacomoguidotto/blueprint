import { describe, expect, it } from "vitest";
import { createTaskSchema } from "./schemas";

describe("createTaskSchema", () => {
  it("validates a minimal valid task", () => {
    const result = createTaskSchema.safeParse({
      title: "Test task",
      priority: "medium",
    });
    expect(result.success).toBe(true);
  });

  it("validates a fully populated task", () => {
    const result = createTaskSchema.safeParse({
      title: "Full task",
      description: "A description",
      priority: "high",
      dueDate: "2026-03-01",
      tags: "work, urgent",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createTaskSchema.safeParse({
      title: "",
      priority: "low",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title over 100 characters", () => {
    const result = createTaskSchema.safeParse({
      title: "a".repeat(101),
      priority: "low",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description over 500 characters", () => {
    const result = createTaskSchema.safeParse({
      title: "Task",
      description: "a".repeat(501),
      priority: "low",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all priority values", () => {
    for (const priority of ["low", "medium", "high"] as const) {
      const result = createTaskSchema.safeParse({ title: "Task", priority });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid priority", () => {
    const result = createTaskSchema.safeParse({
      title: "Task",
      priority: "critical",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional fields to be omitted", () => {
    const result = createTaskSchema.safeParse({
      title: "Task",
      priority: "medium",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeUndefined();
      expect(result.data.dueDate).toBeUndefined();
      expect(result.data.tags).toBeUndefined();
    }
  });
});
