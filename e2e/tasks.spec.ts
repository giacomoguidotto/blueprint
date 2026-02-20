import { test } from "@playwright/test";

/**
 * Authenticated task management E2E tests.
 *
 * These tests require a logged-in session via Playwright's `storageState`.
 * To enable:
 * 1. Create an `e2e/.auth/user.json` storage state file
 * 2. Add `use: { storageState: "e2e/.auth/user.json" }` to this test config
 * 3. Remove the `.skip` calls below
 */
test.describe("Tasks (authenticated)", () => {
  // biome-ignore lint/suspicious/noSkippedTests: placeholder for future auth setup
  test.skip("can create a new task", async ({ page }) => {
    await page.goto("/en/tasks");
  });

  // biome-ignore lint/suspicious/noSkippedTests: placeholder for future auth setup
  test.skip("can mark a task as done", async ({ page }) => {
    await page.goto("/en/tasks");
  });

  // biome-ignore lint/suspicious/noSkippedTests: placeholder for future auth setup
  test.skip("can delete a task", async ({ page }) => {
    await page.goto("/en/tasks");
  });
});
