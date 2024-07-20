import { test, expect } from "../playwright/fixtures";

test("Authenticated users have a profile page where they can view their details", async ({ page }) => {
  await page.goto('/profile');
  const userInfo = page.getByTestId('profile-user');
  await expect(userInfo.filter({ hasText: /@dev\.com/})).toBeVisible();
  const userAvatar = page.getByTestId('profile-avatar');
  await expect(userAvatar).toBeVisible();
  const purchasedEvents = page.getByTestId('purchased-events');
  if(await purchasedEvents.filter({ has: page.getByRole('list')}).isVisible()) {
    //Test purchased events
  } else {
    await expect(purchasedEvents.filter({ hasText: 'No purchased events to display'})).toBeVisible();
  }
});
