import { expect, test } from "@playwright/test";

const E2E_TASK_TITLE = "E2E Test Task";
const E2E_TASK_DESCRIPTION = "Created by Playwright";
const signInPattern = /sign-in/;
const myTasksPattern = /my tasks/i;

// shadcn Card renders with data-slot="card" — use it to scope all interactions
// to the full card element instead of walking up the DOM with fragile ".." chains.
function taskCard(
  page: Parameters<typeof test>[1] extends { page: infer P } ? P : never
) {
  return page
    .locator('[data-slot="card"]')
    .filter({ hasText: E2E_TASK_TITLE })
    .first();
}

test.describe("Tasks (authenticated)", () => {
  test.describe.configure({ mode: "serial" });

  // Clean up any leftover E2E test tasks before the suite runs.
  // Necessary because serial+retries re-runs beforeAll + "can create" on each retry.
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/en/tasks");

    // "All" tab is the default and shows every status — delete in a loop
    // until no more E2E tasks are visible (Convex updates are real-time)
    const card = () =>
      page
        .locator('[data-slot="card"]')
        .filter({ hasText: E2E_TASK_TITLE })
        .first();

    for (let i = 0; i < 20; i++) {
      const visible = await card()
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      if (!visible) {
        break;
      }
      await card().getByRole("button", { name: "Task actions" }).click();
      await page.getByRole("menuitem", { name: "Delete" }).click();
      // Wait for Convex real-time removal before checking again
      await card().waitFor({ state: "hidden", timeout: 5000 });
    }

    await page.close();
  });

  test("can view tasks page", async ({ page }) => {
    await page.goto("/en/tasks");
    await expect(page).not.toHaveURL(signInPattern);
    await expect(
      page.getByRole("heading", { name: myTasksPattern })
    ).toBeVisible();
  });

  test("can create a new task", async ({ page }) => {
    await page.goto("/en/tasks");

    await page.getByRole("button", { name: "Add Task" }).click();
    await page.locator("#title").fill(E2E_TASK_TITLE);
    await page.locator("#description").fill(E2E_TASK_DESCRIPTION);
    await page.getByRole("button", { name: "Create Task" }).click();

    await expect(page.getByText(E2E_TASK_TITLE)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("can mark a task as done", async ({ page }) => {
    await page.goto("/en/tasks");

    const card = taskCard(page);

    // todo → in_progress
    await card.getByRole("button", { name: "Start" }).click();
    // Wait for Convex real-time update: "Start" disappears, "Complete" appears
    await expect(card.getByRole("button", { name: "Start" })).toBeHidden({
      timeout: 10_000,
    });

    // in_progress → done
    await card.getByRole("button", { name: "Complete" }).click();
    await expect(card.getByRole("button", { name: "Complete" })).toBeHidden({
      timeout: 10_000,
    });

    // Verify it shows in the Done tab
    await page.getByRole("tab", { name: "Done" }).click();
    await expect(page.getByText(E2E_TASK_TITLE)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("can delete a task", async ({ page }) => {
    await page.goto("/en/tasks");

    // The task is in "done" status — switch to that tab
    await page.getByRole("tab", { name: "Done" }).click();

    const card = taskCard(page);
    await card.getByRole("button", { name: "Task actions" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();

    await expect(page.getByText(E2E_TASK_TITLE)).toBeHidden({
      timeout: 10_000,
    });
  });
});
