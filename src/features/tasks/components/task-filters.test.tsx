import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, createStore } from "jotai";
import { describe, expect, it, vi } from "vitest";
import { searchQueryAtom, statusFilterAtom } from "../store/atoms";
import { TaskFilters } from "./task-filters";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "search.placeholder": "Search tasks...",
      "filter.all": "All",
      "filter.todo": "To Do",
      "filter.in_progress": "In Progress",
      "filter.done": "Done",
      "filter.archived": "Archived",
    };
    return translations[key] ?? key;
  },
}));

function renderWithStore(store = createStore()) {
  const result = render(
    <Provider store={store}>
      <TaskFilters />
    </Provider>
  );
  return { ...result, store };
}

describe("TaskFilters", () => {
  it("renders search input and all filter tabs", () => {
    renderWithStore();

    expect(
      screen.getByPlaceholderText("Search tasks...")
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "To Do" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "In Progress" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Done" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Archived" })
    ).toBeInTheDocument();
  });

  it("updates search query atom on input", async () => {
    const user = userEvent.setup();
    const store = createStore();
    renderWithStore(store);

    const input = screen.getByPlaceholderText("Search tasks...");
    await user.type(input, "hello");

    expect(store.get(searchQueryAtom)).toBe("hello");
  });

  it("updates status filter atom on tab click", async () => {
    const user = userEvent.setup();
    const store = createStore();
    renderWithStore(store);

    expect(store.get(statusFilterAtom)).toBe("all");

    await user.click(screen.getByRole("tab", { name: "To Do" }));
    expect(store.get(statusFilterAtom)).toBe("todo");

    await user.click(screen.getByRole("tab", { name: "Done" }));
    expect(store.get(statusFilterAtom)).toBe("done");

    await user.click(screen.getByRole("tab", { name: "All" }));
    expect(store.get(statusFilterAtom)).toBe("all");
  });

  it("shows 'All' tab as selected by default", () => {
    renderWithStore();
    const allTab = screen.getByRole("tab", { name: "All" });
    expect(allTab).toHaveAttribute("data-state", "active");
  });
});
