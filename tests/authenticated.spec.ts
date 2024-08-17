import { test, expect } from "@/playwright/fixtures";

import {
  FreeEventPage,
  PaidEventPage,
  PAYFEventPage,
} from "./playwright-event-page";

//Profile page
test("Authenticated users have a profile page where they can view their details", async ({
  page,
}) => {
  await page.goto("/profile");
  const userInfo = page.getByTestId("profile-user");
  await expect(userInfo.filter({ hasText: /@dev\.com/ })).toBeVisible();
  const purchasedEvents = page.getByTestId("purchased-events");
  if (
    await purchasedEvents.filter({ has: page.getByRole("list") }).isVisible()
  ) {
    //Test purchased events
  } else {
    await expect(
      purchasedEvents.filter({ hasText: "No purchased events to display" })
    ).toBeVisible();
  }
});
//End Profile Page

//Event purchasing
test("Authenticated users can purchase free events", async ({ page }) => {
  const freeEventPage = new FreeEventPage(page);
  await freeEventPage.goto("/events/1");
  await freeEventPage.clickBuy();
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000 });
  await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000 });

  const emailInput = page.locator('[name="email"]');
  if (await emailInput.isVisible()) {
    await emailInput.fill("eventfan@dev.com");
  }

  await page.getByTestId("hosted-payment-submit-button").click();
  await expect(page).toHaveURL(/events\/checkout\/success/, { timeout: 60000 });
});

test("Authenticated users can purchase paid events", async ({ page }) => {
  const paidEventPage = new PaidEventPage(page);
  await paidEventPage.goto("/events/2");
  await paidEventPage.clickBuy();
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000 });
  await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000 });

  const emailInput = page.locator('[name="email"]');
  if (await emailInput.isVisible()) {
    await emailInput.fill("eventfan@dev.com");
  }

  await page
    .getByRole("textbox", { name: "Card number" })
    .fill("4242 4242 4242 4242");
  await page.getByRole("textbox", { name: "Expiration" }).fill("0174");
  await page.getByRole("textbox", { name: "CVC" }).fill("174");
  await page.getByRole("textbox", { name: "Cardholder name" }).fill("Tormund");
  await page.getByRole("textbox", { name: "Postal code" }).fill("SB42 OTH");
  await page.getByTestId("hosted-payment-submit-button").click();
  await expect(page).toHaveURL(/events\/checkout\/success/, { timeout: 60000 });
});

test("Authenticated users can purchase pay as you feel events", async ({
  page,
}) => {
  const payfEventPage = new PAYFEventPage(page);
  await payfEventPage.goto("/events/4");
  await payfEventPage.goto("/events/4");
  await payfEventPage.clickBuy("0.3");
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000 });
  await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000 });

  const emailInput = page.locator('[name="email"]');
  if (await emailInput.isVisible()) {
    await emailInput.fill("eventfan@dev.com");
  }

  await page
    .getByRole("textbox", { name: "Card number" })
    .fill("4242 4242 4242 4242");
  await page.getByRole("textbox", { name: "Expiration" }).fill("0174");
  await page.getByRole("textbox", { name: "CVC" }).fill("174");
  await page.getByRole("textbox", { name: "Cardholder name" }).fill("Tormund");
  await page.getByRole("textbox", { name: "Postal code" }).fill("SB42 OTH");
  await page.getByTestId("hosted-payment-submit-button").click();
  await expect(page).toHaveURL(/events\/checkout\/success/, { timeout: 60000 });
});

test("Pressing the back link on the stripe checkout page for an event returns the user to the event page they came from", async ({
  page,
}) => {
  await page.goto("/events/1");
  await page.getByTestId("purchase-event").click();
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000 });
  await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000 });
  await page.getByRole("link", { name: "Back to" }).click();
  await expect(page).toHaveURL(/events\/1/, { timeout: 60000 });
});
//End Event Purchasing
