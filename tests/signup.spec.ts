import { createSupabaseServiceClient } from "@/supabase/utils/supabase";
import { test, expect } from "@playwright/test";
import { SignupPage } from "./playwright-signup-page";

test.beforeEach(async () => {
  const supabase = createSupabaseServiceClient();
  const {
    data: { users },
    error: listUsersError,
  } = await supabase.auth.admin.listUsers();
  if (listUsersError) throw listUsersError;
  const targetUser = users.find((user) => {
    return user.email === "newuser@dev.com";
  });
  if (targetUser) {
    const { error } = await supabase.auth.admin.deleteUser(targetUser.id);
    if (error) throw error;
  }
});

test.afterEach(async () => {
  const supabase = createSupabaseServiceClient();
  const {
    data: { users },
    error: listUsersError,
  } = await supabase.auth.admin.listUsers();
  if (listUsersError) throw listUsersError;
  const targetUser = users.find((user) => {
    return user.email === "newuser@dev.com";
  });
  if (targetUser) {
    const { error } = await supabase.auth.admin.deleteUser(targetUser.id);
    if (error) throw error;
  }
});

test("Users can create new accounts", async ({ page }) => {
  const signupPage = new SignupPage(page);
  await signupPage.goto();
  await signupPage.signup(
    "Tormund",
    "Gianstbane",
    "newuser@dev.com",
    "1234567890",
    "1234567890"
  );
  await expect(signupPage.page).toHaveURL(
    `/signup/confirm?email=newuser@dev.com`
  );
});

test("Attempting to create an account that already exists with a confirmed email address shows a message", async ({
  page,
}) => {
  const signupPage = new SignupPage(page);
  await signupPage.goto();
  await signupPage.signup(
    "Tormund",
    "Gianstbane",
    "eventfan@dev.com",
    "1234567890",
    "1234567890"
  );
  await expect(
    signupPage.page.getByText("User already registered")
  ).toBeVisible();
});
