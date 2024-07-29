import { test, expect } from "../playwright/staffaccount";
import { AdminPage } from "./playwright-admin-page";

test("Staff users have an admin dashboard link in the auth menu", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("auth-avatar").click();
  await expect(
    page.getByRole("menuitem", { name: "Admin Dashboard" })
  ).toBeVisible();
});

test("Staff users can create events", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("auth-avatar").click();
  const adminDashboardLink = page.getByRole("menuitem", {
    name: "Admin Dashboard",
  });
  await expect(adminDashboardLink).toBeVisible();
  await adminDashboardLink.click();
  await page.waitForURL("/admin");
  const adminPage = new AdminPage(page);
  await adminPage.createEvent();
});
