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

test("Users are show a message when providing unrecognized credentials", async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login').click();
  await page.waitForURL('/login');
  await page.getByTestId('email').fill('eventfan@dev.com');
  await page.getByTestId('password').fill('badpassword');
  await page.getByTestId('signin').click();
  await expect(page.getByTestId('signin-alert')).toHaveText('Invalid login credentials')
});

test("login page has a signup button that links to signup page", async ({ page }) => {
  await page.goto('/login');
  await page.getByText(/sign up/i).click();
  await expect(page).toHaveURL('/signup');
})