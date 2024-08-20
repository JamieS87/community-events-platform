import { test as baseTest, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

import playwrightConfig from "@/playwright.config";
import { LoginPage } from "@/tests/playwright-login-page";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/dbtypes";

async function acquireAccount(id: number) {
  const supabaseAdmin = createClient<Database>(
    process.env.SUPABASE_API_URL!!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!!,
    { auth: { persistSession: false, detectSessionInUrl: false } }
  );

  const email = `testuser${id}@dev.com`;
  const password = email;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw error;
  }
  return { email, password, userId: data.user.id };
}

// async function acquireAccount(id: number) {
//   const accounts = [
//     {
//       email: "eventfan@dev.com",
//       password: "eventfan@dev.com",
//     },
//     { email: "eventfan2@dev.com", password: "eventfan2@dev.com" },
//     { email: "eventfan3@dev.com", password: "eventfan3@dev.com" },
//   ];
//   return accounts[id];
// }

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
        `.auth/${id}.json`
      );
      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({
        storageState: undefined,
        baseURL: playwrightConfig.use?.baseURL,
      });

      // Acquire a unique account, for example create a new one.
      // Alternatively, you can have a list of precreated accounts for testing.
      // Make sure that accounts are unique, so that multiple team members
      // can run tests at the same time without interference.
      const account = await acquireAccount(id);

      // Perform authentication steps
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(account.email, account.password);

      await page.waitForURL("/");
      await expect(page.getByTestId("auth-avatar")).toBeVisible();

      // End of authentication steps.

      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: "worker" },
  ],
});
