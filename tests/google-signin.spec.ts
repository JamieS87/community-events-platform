import { test, expect } from "@playwright/test";

test("login page has a sign in with google button", async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in with Google'}).click();
  await page.waitForURL(/\/accounts\.google\.com/, { timeout: 30000})
  await expect(page).toHaveURL(/\/accounts\.google\.com/);
});