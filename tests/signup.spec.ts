import { createSupabaseServiceClient } from "@/supabase/utils/supabase";
import { test, expect } from "@playwright/test";

test.beforeEach(async () => {
  const supabase = createSupabaseServiceClient();
  const { data: { users }, error: listUsersError } = await supabase.auth.admin.listUsers();
  if(listUsersError) throw listUsersError;
  const targetUser = users.find((user) => {
    return user.email === 'newuser@dev.com';
  });
  if(targetUser) {
  const { error } = await supabase.auth.admin.deleteUser(targetUser.id);
  if(error) throw error;
  }
});

test.afterEach(async () => {
  const supabase = createSupabaseServiceClient();
  const { data: { users }, error: listUsersError } = await supabase.auth.admin.listUsers();
  if(listUsersError) throw listUsersError;
  const targetUser = users.find((user) => {
    return user.email === 'newuser@dev.com';
  });
  if(targetUser) {
  const { error } = await supabase.auth.admin.deleteUser(targetUser.id);
  if(error) throw error;
  }
});

test("Users can create new accounts", async ({ page }) => {
  await page.goto('/signup');
  await page.waitForURL('/signup');
  await page.getByTestId('firstname').click();
  await page.getByTestId('firstname').fill('Tormund');
  await page.getByTestId('lastname').fill('Giantsbane');
  await page.getByTestId('email').fill('newuser@dev.com');
  await page.getByTestId('password').fill('newuser@dev.com');
  await page.getByTestId('password-repeat').fill('newuser@dev.com');
  await expect(page.getByTestId('firstname')).toHaveValue('Tormund');
  await page.getByTestId('signup-submit').click();
  await expect(page).toHaveURL('/signup/confirm?email=newuser@dev.com');
});

test("Attempting to create an account that already exists with a confirmed email address shows a message", async ({ page }) => {
  await page.goto('/signup');
  await page.getByTestId('firstname').click();
  await page.getByTestId('firstname').fill('Tormund');
  await page.getByTestId('lastname').fill('Giantsbane');
  await page.getByTestId('email').fill('eventfan@dev.com');
  await page.getByTestId('password').fill('supersecret');
  await page.getByTestId('password-repeat').fill('supersecret');
  await expect(page.getByTestId('firstname')).toHaveValue('Tormund');
  await page.getByTestId('signup-submit').click();
  await expect(page.getByText('User already registered')).toBeVisible();
});