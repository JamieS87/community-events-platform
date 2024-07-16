import { test, expect } from "@playwright/test";

test("Users can log in, and are redicted to the homepage on success", async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login').click();
  await page.waitForURL('/login');
  await page.getByTestId('email').fill('eventfan@dev.com');
  await page.getByTestId('password').fill('eventfan@dev.com');
  await page.getByTestId('signin').click();
  await expect(page).toHaveURL('/');
});