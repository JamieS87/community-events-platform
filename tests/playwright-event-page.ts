import { expect, type Locator, type Page } from "@playwright/test";

export class FreeEventPage {
  readonly page: Page;
  readonly buyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buyButton = page.getByRole("button", { name: "Buy" });
  }

  async goto(path: string) {
    await this.page.goto(path);
    await expect(
      this.page.locator("div", { hasText: /^Free$/i })
    ).toBeVisible();
  }

  async clickBuy() {
    await this.buyButton.click();
  }
}

export class PaidEventPage {
  readonly page: Page;
  readonly buyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buyButton = page.getByRole("button", { name: "Buy" });
  }

  async goto(path: string) {
    await this.page.goto(path);
    await expect(
      this.page.locator("div", { hasText: /^Paid$/i })
    ).toBeVisible();
  }

  async clickBuy() {
    await this.buyButton.click();
  }
}

export class PAYFEventPage {
  readonly page: Page;
  readonly buyButton: Locator;
  readonly priceInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buyButton = page.getByRole("button", { name: "Buy" });
    this.priceInput = page.getByRole("spinbutton", { name: "Price" });
  }

  async goto(path: string) {
    await this.page.goto(path);
    await expect(
      this.page.locator("div", { hasText: /^Payf$/i })
    ).toBeVisible();
  }

  async clickBuy(price: string) {
    await this.priceInput.fill(price);
    await this.buyButton.click();
  }
}
