import { createStore } from "jotai";
import { describe, expect, it } from "vitest";
import {
  isCreateFormOpenAtom,
  searchQueryAtom,
  selectedTaskIdAtom,
  statusFilterAtom,
  taskFilterAtom,
} from "./atoms";

describe("task atoms", () => {
  it("taskFilterAtom defaults to status 'all'", () => {
    const store = createStore();
    expect(store.get(taskFilterAtom)).toEqual({ status: "all" });
  });

  it("statusFilterAtom reads from taskFilterAtom", () => {
    const store = createStore();
    expect(store.get(statusFilterAtom)).toBe("all");
  });

  it("statusFilterAtom write updates taskFilterAtom", () => {
    const store = createStore();
    store.set(statusFilterAtom, "done");
    expect(store.get(taskFilterAtom)).toEqual({ status: "done" });
    expect(store.get(statusFilterAtom)).toBe("done");
  });

  it("statusFilterAtom supports all status values", () => {
    const store = createStore();
    for (const status of [
      "all",
      "todo",
      "in_progress",
      "done",
      "archived",
    ] as const) {
      store.set(statusFilterAtom, status);
      expect(store.get(statusFilterAtom)).toBe(status);
    }
  });

  it("selectedTaskIdAtom defaults to null", () => {
    const store = createStore();
    expect(store.get(selectedTaskIdAtom)).toBeNull();
  });

  it("isCreateFormOpenAtom defaults to false", () => {
    const store = createStore();
    expect(store.get(isCreateFormOpenAtom)).toBe(false);
  });

  it("isCreateFormOpenAtom can be toggled", () => {
    const store = createStore();
    store.set(isCreateFormOpenAtom, true);
    expect(store.get(isCreateFormOpenAtom)).toBe(true);
    store.set(isCreateFormOpenAtom, false);
    expect(store.get(isCreateFormOpenAtom)).toBe(false);
  });

  it("searchQueryAtom defaults to empty string", () => {
    const store = createStore();
    expect(store.get(searchQueryAtom)).toBe("");
  });

  it("searchQueryAtom can be updated", () => {
    const store = createStore();
    store.set(searchQueryAtom, "find me");
    expect(store.get(searchQueryAtom)).toBe("find me");
  });
});
