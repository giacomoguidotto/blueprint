import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";
const continueButton = /continue/i;
const signInButton = /sign in/i;
const unauthenticatedPattern = /sign-in|callback/;

setup("authenticate", async ({ page }) => {
  setup.setTimeout(90_000);

  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!(email && password)) {
    throw new Error(
      "E2E_USER_EMAIL and E2E_USER_PASSWORD must be set to run authenticated tests"
    );
  }

  await page.goto("/en/sign-in", { waitUntil: "networkidle" });

  // Email step — wait for the input to be stable before interacting
  const emailInput = page.getByLabel("Email");
  await emailInput.waitFor({ state: "visible", timeout: 15_000 });
  await emailInput.fill(email);
  await page.getByRole("button", { name: continueButton }).click();

  // Password step — explicitly wait for the field to confirm page transition completed
  const passwordInput = page.getByLabel("Password");
  await passwordInput.waitFor({ state: "visible", timeout: 15_000 });
  await passwordInput.fill(password);
  await page.getByRole("button", { name: signInButton }).click();

  // Wait for redirect chain to settle: WorkOS → /callback → app home
  // Match any local URL that is not the sign-in page or the callback route
  await page.waitForURL(
    (url) =>
      url.hostname === "localhost" &&
      !unauthenticatedPattern.test(url.pathname),
    { timeout: 30_000 }
  );

  await page.context().storageState({ path: authFile });
});
