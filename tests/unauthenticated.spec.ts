import { test, expect } from "@playwright/test";
import { LoginPage } from "./playwright-login-page";

//Login
test("Users can log in, and are redirected to the homepage on success", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("eventfan@dev.com", "eventfan@dev.com");
  await expect(loginPage.page).toHaveURL("/");
});

test("Users are shown a message when providing unrecognized credentials", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("eventfan@dev.com", "badpassword");
  await expect(loginPage.page.getByTestId("signin-alert")).toHaveText(
    "Invalid login credentials"
  );
});

test("login page has a signup button that links to signup page", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(loginPage.signUpButton).toBeVisible();
  await loginPage.signUpButton.click();
  await expect(loginPage.page).toHaveURL("/signup");
});
