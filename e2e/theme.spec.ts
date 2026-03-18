import { expect, test } from "@playwright/test";

const darkClassPattern = /dark/;

async function openThemeMenu(page: import("@playwright/test").Page) {
  const toggle = page.locator('button[aria-label="Toggle theme"]').first();
  // Ensure any previously open menu is fully closed before opening again.
  // Radix DropdownMenu fires a document click on close; without this wait the
  // close event from the previous selection can dismiss the newly opened menu.
  await expect(page.getByRole("menu"))
    .toBeHidden({ timeout: 3000 })
    .catch(() => undefined);
  await toggle.click();
  // Confirm the menu opened before callers try to interact with items
  await expect(page.getByRole("menu")).toBeVisible({ timeout: 5000 });
}

test.describe("Theme toggle", () => {
  test("switches to dark mode via dropdown", async ({ page }) => {
    await page.goto("/");

    const themeToggle = page
      .locator('button[aria-label="Toggle theme"]')
      .first();

    if (!(await themeToggle.isVisible().catch(() => false))) {
      test.skip();
      return;
    }

    await openThemeMenu(page);
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(darkClassPattern);
  });

  test("switches back to light mode via dropdown", async ({ page }) => {
    await page.goto("/");

    const themeToggle = page
      .locator('button[aria-label="Toggle theme"]')
      .first();

    if (!(await themeToggle.isVisible().catch(() => false))) {
      test.skip();
      return;
    }

    // Switch to dark first
    await openThemeMenu(page);
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(darkClassPattern);

    // Switch back to light — wait for menu to fully close before reopening
    await openThemeMenu(page);
    await page.getByRole("menuitem", { name: "Light" }).click();
    await expect(page.locator("html")).not.toHaveClass(darkClassPattern);
  });
});
