import { expect, test } from "@playwright/test";

const localePattern = /\/(en|it)/;

test.describe("Internationalization", () => {
  test("redirects root to default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(localePattern);
  });

  test("loads English locale", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("loads Italian locale", async ({ page }) => {
    await page.goto("/it");
    await expect(page.locator("html")).toHaveAttribute("lang", "it");
  });
});
