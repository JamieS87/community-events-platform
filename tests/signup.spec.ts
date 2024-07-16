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
  await page.waitForURL('**/signup');
  await expect(page).toHaveURL('/signup/confirm?email=newuser@dev.com');
});

test("Attempting to create an already existing account shows a message", async ({ page }) => {
  await page.goto('/signup');
  await page.waitForURL('/signup');
  await page.getByTestId('firstname').fill('Tormund');
  await page.getByTestId('lastname').fill('Giantsbane');
  await page.getByTestId('email').fill('eventfan@dev.com');
  await page.getByTestId('password').fill('supersecret');
  await page.getByTestId('password-repeat').fill('supersecret');
  await page.getByTestId('signup-submit').click();
  await expect(page.getByText('User already registered')).toBeVisible();
});