import { test, expect } from "@playwright/test";

test("Users can create new accounts", async ({ page }) => {
  await page.goto('/signup');
  await page.waitForURL('/signup');
  await page.getByTestId('firstname').fill('Tormund');
  await page.getByTestId('lastname').fill('Giantsbane');
  await page.getByTestId('email').fill('newuser@dev.com');
  await page.getByTestId('password').fill('newuser@dev.com');
  await page.getByTestId('password-repeat').fill('newuser@dev.com');
  await page.getByTestId('signup-submit').click();
  await expect(page).toHaveURL('/signup/confirm?email=newuser@dev.com');
});