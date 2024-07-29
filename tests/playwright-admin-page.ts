import { expect, type Locator, type Page } from "@playwright/test";

export class AdminPage {
  readonly page: Page;
  readonly createEventButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createEventButton = page.getByRole("button", { name: "Add Event" });
  }

  async goto() {
    await this.page.goto("/admin");
    await expect(this.page).toHaveURL("/admin");
  }

  async createEvent() {
    await this.createEventButton.click();
    await expect(
      this.page.getByRole("dialog", { name: "Create Event" })
    ).toBeVisible();
  }
}
