import { test as baseTest, expect } from '@playwright/test';
import config from '../playwright.config';
import fs from 'fs';
import path from 'path';

async function acquireAccount(id: number) {
  const accounts = [{
    email: 'eventfan@dev.com',
    password: 'eventfan@dev.com'
  }, {email: 'eventfan2@dev.com', password: 'eventfan2@dev.com'}, { email: 'eventfan3@dev.com', password: 'eventfan3@dev.com'}];
  return accounts[id];
}

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [async ({ browser }, use) => {
    // Use parallelIndex as a unique identifier for each worker.
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);
    if (fs.existsSync(fileName)) {
      // Reuse existing authentication state if any.
      await use(fileName);
      return;
    }

    // Important: make sure we authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });

    // Acquire a unique account, for example create a new one.
    // Alternatively, you can have a list of precreated accounts for testing.
    // Make sure that accounts are unique, so that multiple team members
    // can run tests at the same time without interference.
    const account = await acquireAccount(id);

    const baseURL = config.use?.baseURL ?? 'http://localhost:3000';

    // Perform authentication steps. Replace these actions with your own.
    await page.goto(`${baseURL}/login`);
    await page.getByRole('textbox', { name: 'Email'}).click();
    await page.getByRole('textbox', { name: 'Email'}).fill(account.email);
    await page.getByRole('textbox', { name: 'Password'}).fill(account.password);
    await page.getByTestId('signin').click();
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL(baseURL);
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

    // End of authentication steps.

    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});