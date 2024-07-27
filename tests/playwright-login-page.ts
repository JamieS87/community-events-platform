import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly signInWithGoogle: Locator;
  readonly email: Locator;
  readonly password: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.getByTestId("signin");
    this.signUpButton = page.getByRole("link", { name: "Sign Up" });
    this.signInWithGoogle = page.getByRole("button", {
      name: "Sign in with Google",
    });
    this.email = page.getByRole("textbox", { name: "Email" });
    this.password = page.getByRole("textbox", { name: "Password" });
  }

  async goto() {
    await this.page.goto("/login");
    await expect(this.page).toHaveURL("/login");
  }

  async login(email: string, password: string) {
    await this.email.click();
    await this.email.fill(email);
    await this.password.click();
    await this.password.fill(password);
    await this.signInButton.click();
    await expect(this.page).toHaveURL("/");
  }
}
