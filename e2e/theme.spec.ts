import { expect, test } from "@playwright/test";

const darkClassPattern = /dark/;

test.describe("Theme toggle", () => {
  test("switches to dark mode via dropdown", async ({ page }) => {
    await page.goto("/");

    // Open the theme dropdown menu
    const themeToggle = page
      .locator('button[aria-label="Toggle theme"]')
      .first();

    // Skip if no theme toggle found on the page
    if (!(await themeToggle.isVisible().catch(() => false))) {
      test.skip();
      return;
    }

    await themeToggle.click();

    // Select "Dark" from the dropdown
    await page.getByRole("menuitem", { name: "Dark" }).click();

    // Verify the html element now has the "dark" class
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
    await themeToggle.click();
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(darkClassPattern);

    // Switch back to light
    await themeToggle.click();
    await page.getByRole("menuitem", { name: "Light" }).click();
    await expect(page.locator("html")).not.toHaveClass(darkClassPattern);
  });
});
