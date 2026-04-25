import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Id } from "convex/_generated/dataModel";
import { describe, expect, it, vi } from "vitest";
import type { Task } from "../types";
import { TaskCard } from "./task-card";

const mockUpdateStatus = Object.assign(vi.fn().mockResolvedValue(undefined), {
  withOptimisticUpdate: () => mockUpdateStatus,
});

const mockDeleteTask = vi.fn().mockResolvedValue(undefined);

vi.mock("convex/react", () => ({
  useMutation: () => mockUpdateStatus,
  useQuery: () => null,
}));

vi.mock("@/lib/telemetry/use-traced-mutation", () => ({
  useTracedMutation: () => mockDeleteTask,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "status.todo": "To Do",
      "status.in_progress": "In Progress",
      "status.done": "Done",
      "status.archived": "Archived",
      "priority.low": "Low",
      "priority.medium": "Medium",
      "priority.high": "High",
      "actions.menu": "Task actions",
      "actions.markTodo": "Mark as To Do",
      "actions.markInProgress": "Mark as In Progress",
      "actions.markDone": "Mark as Done",
      "actions.archive": "Archive",
      "actions.delete": "Delete",
      "actions.moveTo.in_progress": "Start",
      "actions.moveTo.done": "Complete",
    };
    return translations[key] ?? key;
  },
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const baseTask: Task = {
  _id: "task123" as Id<"tasks">,
  _creationTime: Date.now(),
  title: "Test task",
  description: "A test description",
  status: "todo",
  priority: "medium",
  userId: "user123" as Id<"users">,
};

describe("TaskCard", () => {
  it("renders task title and description", () => {
    render(<TaskCard task={baseTask} />);

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.getByText("A test description")).toBeInTheDocument();
  });

  it("displays correct priority badge", () => {
    render(<TaskCard task={baseTask} />);
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("displays correct status badge", () => {
    render(<TaskCard task={baseTask} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("shows tags when present", () => {
    render(<TaskCard task={{ ...baseTask, tags: ["work", "urgent"] }} />);
    expect(screen.getByText("work")).toBeInTheDocument();
    expect(screen.getByText("urgent")).toBeInTheDocument();
  });

  it("shows 'Start' button for todo tasks", () => {
    render(<TaskCard task={baseTask} />);
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("shows 'Complete' button for in-progress tasks", () => {
    render(<TaskCard task={{ ...baseTask, status: "in_progress" }} />);
    expect(
      screen.getByRole("button", { name: "Complete" })
    ).toBeInTheDocument();
  });

  it("does not show advance button for done tasks", () => {
    render(<TaskCard task={{ ...baseTask, status: "done" }} />);
    expect(
      screen.queryByRole("button", { name: "Start" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Complete" })
    ).not.toBeInTheDocument();
  });

  it("links task title to detail page", () => {
    render(<TaskCard task={baseTask} />);
    const link = screen.getByRole("link", { name: "Test task" });
    expect(link).toHaveAttribute("href", "/tasks/task123");
  });

  it("opens dropdown menu on menu button click", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={baseTask} />);

    await user.click(screen.getByRole("button", { name: "Task actions" }));

    expect(screen.getByText("Mark as In Progress")).toBeInTheDocument();
    expect(screen.getByText("Mark as Done")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
