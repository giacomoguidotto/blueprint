import { expect, test } from "@playwright/test";

const titlePattern = /Blueprint/i;

test.describe("Home page", () => {
  test("renders the page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(titlePattern);
  });

  test("displays hero heading", async ({ page }) => {
    await page.goto("/");
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
  });

  test("has sign-in link", async ({ page }) => {
    await page.goto("/");
    const signInLink = page.locator('a[href*="sign-in"]').first();
    await expect(signInLink).toBeVisible();
  });

  test("has sign-up link", async ({ page }) => {
    await page.goto("/");
    const signUpLink = page.locator('a[href*="sign-up"]').first();
    await expect(signUpLink).toBeVisible();
  });
});
