import { test, expect } from "../playwright/fixtures";

test("Authenticated users can purchase free events", async ({ page }) => {
  await page.goto('/events/1');
  await page.getByTestId('purchase-event').click();
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000});
  await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000});

  const emailInput = page.locator('[name="email"]');
  if(await emailInput.isVisible()) {
    await emailInput.fill('eventfan@dev.com');
  }

  await page.getByTestId('hosted-payment-submit-button').click();
  await expect(page).toHaveURL(/events\/checkout\/success/, { timeout: 60000});
});

test("Authenticated users can purchase paid events", async ({ page }) => {
  await page.goto('/events/2');
  await page.getByTestId('purchase-event').click();
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000});
  await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000});

  const emailInput = page.locator('[name="email"]');
  if(await emailInput.isVisible()) {
    await emailInput.fill('eventfan@dev.com');
  }

  await page.getByRole('textbox', { name: 'Card number'}).fill('4242 4242 4242 4242');
  await page.getByRole('textbox', { name: 'Expiration'}).fill('0174');
  await page.getByRole('textbox', { name: 'CVC'}).fill('174');
  await page.getByRole('textbox', { name: 'Cardholder name'}).fill('Tormund');
  await page.getByRole('textbox', { name: 'Postal code'}).fill('SB42 OTH');
  await page.getByTestId('hosted-payment-submit-button').click();
  await expect(page).toHaveURL(/events\/checkout\/success/, { timeout: 60000});
});

test("Authenticated users can purchase pay as you feel events", async ({ page }) => {
  await page.goto('/events/4');
  await page.getByRole('spinbutton', { name: 'PAYF price'}).fill("0.3");
  await page.getByTestId('purchase-event').click();
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000});
  await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000});

  const emailInput = page.locator('[name="email"]');
  if(await emailInput.isVisible()) {
    await emailInput.fill('eventfan@dev.com');
  }

  await page.getByRole('textbox', { name: 'Card number'}).fill('4242 4242 4242 4242');
  await page.getByRole('textbox', { name: 'Expiration'}).fill('0174');
  await page.getByRole('textbox', { name: 'CVC'}).fill('174');
  await page.getByRole('textbox', { name: 'Cardholder name'}).fill('Tormund');
  await page.getByRole('textbox', { name: 'Postal code'}).fill('SB42 OTH');
  await page.getByTestId('hosted-payment-submit-button').click();
  await expect(page).toHaveURL(/events\/checkout\/success/, { timeout: 60000});
});

test("Pressing the back link on the stripe checkout page for an event returns the user to the event page they came from", async ({ page }) => {
  await page.goto('/events/1');
  await page.getByTestId('purchase-event').click();
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000});
  await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000});
  await page.getByRole('link', { name: 'Back to'}).click();
  await expect(page).toHaveURL(/events\/1/, { timeout: 60000});
});