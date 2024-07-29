import { test as baseTest, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/dbtypes";

import { config as dotEnvConfig } from "dotenv";
import { LoginPage } from "@/tests/playwright-login-page";

dotEnvConfig({ path: ".env" });

async function acquireAccount(id: number) {
  const supabaseAdmin = createClient<Database>(
    process.env.SUPABASE_API_URL!!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!!,
    { auth: { persistSession: false, detectSessionInUrl: false } }
  );

  const email = `eventstaff${id}@dev.com`;
  const password = email;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  const { error: setIsStaffError } = await supabaseAdmin
    .from("profiles")
    .update({ is_staff: true })
    .eq("user_id", data.user.id);
  if (setIsStaffError) throw setIsStaffError;
  return { email, password, userId: data.user.id };
}

async function releaseAccount(userId: string) {
  const supabaseAdmin = createClient<Database>(
    process.env.SUPABASE_API_URL!!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!!,
    { auth: { persistSession: false, detectSessionInUrl: false } }
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId, false);
  if (error) {
    throw error;
  }
}

export * from "@playwright/test";
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex;
      const fileName = path.resolve(
        test.info().project.outputDir,
        `.auth/staff_${id}.json`
      );
      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({
        storageState: undefined,
        baseURL: "http://localhost:3000",
      });
      // Acquire a unique account, for example create a new one.
      // Alternatively, you can have a list of precreated accounts for testing.
      // Make sure that accounts are unique, so that multiple team members
      // can run tests at the same time without interference.
      const account = await acquireAccount(id);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(account.email, account.password);

      // // Perform authentication steps. Replace these actions with your own.
      // await page.goto(`${baseURL}/login`);
      // await page.getByRole("textbox", { name: "Email" }).click();
      // await page.getByRole("textbox", { name: "Email" }).fill(account.email);
      // await page
      //   .getByRole("textbox", { name: "Password" })
      //   .fill(account.password);
      // await page.getByTestId("signin").click();
      // // Wait until the page receives the cookies.
      // //
      // // Sometimes login flow sets cookies in the process of several redirects.
      // // Wait for the final URL to ensure that the cookies are actually set.
      // await page.waitForURL(baseURL);
      // Alternatively, you can wait until the page reaches a state where all cookies are set.
      await page.waitForURL("/", { timeout: 30000 });

      // End of authentication steps.

      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
      await releaseAccount(account.userId);
    },
    { scope: "worker" },
  ],
});
