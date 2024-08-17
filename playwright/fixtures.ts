import { test as baseTest, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

import playwrightConfig from "@/playwright.config";
import { LoginPage } from "@/tests/playwright-login-page";

async function acquireAccount(id: number) {
  const accounts = [
    {
      email: "eventfan@dev.com",
      password: "eventfan@dev.com",
    },
    { email: "eventfan2@dev.com", password: "eventfan2@dev.com" },
    { email: "eventfan3@dev.com", password: "eventfan3@dev.com" },
  ];
  return accounts[id];
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
