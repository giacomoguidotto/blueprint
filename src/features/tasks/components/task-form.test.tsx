import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { describe, expect, it, vi } from "vitest";
import { TaskForm } from "./task-form";

const TITLE_REQUIRED_REGEX = /title is required/i;

const mockMutate = vi.fn().mockResolvedValue("task-id-123");

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: "New Task",
      description: "Create a new task to track your work",
      titleLabel: "Title",
      titlePlaceholder: "What needs to be done?",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Add more details...",
      priorityLabel: "Priority",
      priorityPlaceholder: "Select priority",
      dueDateLabel: "Due Date",
      tagsLabel: "Tags",
      tagsPlaceholder: "work, personal",
      tagsHint: "Separate tags with commas",
      imageLabel: "Cover Image",
      submit: "Create Task",
      cancel: "Cancel",
      "priority.low": "Low",
      "priority.medium": "Medium",
      "priority.high": "High",
    };
    return translations[key] ?? key;
  },
}));

vi.mock("@/lib/telemetry/use-traced-mutation", () => ({
  useTracedMutation: () => mockMutate,
}));

vi.mock("@/components/ui/image-upload", () => ({
  ImageUpload: () => <div data-testid="image-upload">Image Upload</div>,
}));

function renderForm(props = {}) {
  return render(
    <Provider>
      <TaskForm {...props} />
    </Provider>
  );
}

describe("TaskForm", () => {
  it("renders all form fields", () => {
    renderForm();

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Tags")).toBeInTheDocument();
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Task" })
    ).toBeInTheDocument();
  });

  it("shows validation error when title is empty", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => {
      expect(screen.getByText(TITLE_REQUIRED_REGEX)).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("submits with valid data", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderForm({ onSuccess });

    await user.type(screen.getByLabelText("Title"), "My new task");

    await user.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My new task",
          priority: "medium",
        })
      );
    });
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderForm({ onCancel });

    const cancelButtons = screen.getAllByRole("button", { name: "Cancel" });
    // Click the text Cancel button (not the icon X button)
    await user.click(cancelButtons.at(-1) as HTMLElement);

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
