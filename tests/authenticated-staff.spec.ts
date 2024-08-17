import { test, expect } from "../playwright/staffaccount";
import { AdminPage } from "./playwright-admin-page";

test.describe.configure({ mode: "serial" });

test("Staff users have an admin dashboard link in the auth menu", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("auth-avatar").click();
  await expect(page.getByRole("menuitem", { name: "Admin" })).toBeVisible();
});

test("Staff users can create events", async ({ page, browserName }) => {
  await page.goto("/");
  await page.getByTestId("auth-avatar").click();
  const adminDashboardLink = page.getByRole("menuitem", {
    name: "Admin",
  });
  await expect(adminDashboardLink).toBeVisible();
  await adminDashboardLink.click();
  await page.waitForURL("/admin");
  const adminPage = new AdminPage(page);
  const eventsList = adminPage.page.getByTestId("admin-events-list");
  await expect(eventsList).toBeVisible();
  await adminPage.clickCreateEvent();
  await adminPage.page
    .getByRole("textbox", { name: "Name" })
    .fill(browserName + " test event");
  const thumbnailInput = adminPage.page.locator('input[name="thumbnail"]');
  await thumbnailInput.click();
  await thumbnailInput.setInputFiles("./tests/images/test-thumbnail.jfif");
  await adminPage.page.getByRole("button", { name: "Save" }).click();
  await expect(
    eventsList.locator("li", { hasText: browserName + " test event" })
  ).toBeVisible();
});

test("Staff users can delete events", async ({ page, browserName }) => {
  await page.goto("/");
  await page.getByTestId("auth-avatar").click();
  const adminDashboardLink = page.getByRole("menuitem", {
    name: "Admin",
  });
  await expect(adminDashboardLink).toBeVisible();
  await adminDashboardLink.click();
  await page.waitForURL("/admin");
  const adminPage = new AdminPage(page);
  const eventsList = adminPage.page.getByTestId("admin-events-list");
  await expect(eventsList).toBeVisible();
  const eventItem = eventsList.locator("li", {
    hasText: browserName + " test event",
  });
  await eventItem.getByRole("button", { name: "Actions" }).click();
  await adminPage.page.getByRole("menuitem", { name: "Delete" }).click();
  await adminPage.page.getByRole("button", { name: "Delete" }).click();
  await expect(eventItem).not.toBeVisible();
});
