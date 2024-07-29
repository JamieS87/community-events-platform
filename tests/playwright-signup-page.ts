import { expect, type Locator, type Page } from "@playwright/test";

export class SignupPage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly passwordRepeatField: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.getByRole("textbox", { name: "First name" });
    this.lastNameField = page.getByRole("textbox", { name: "Last name" });
    this.emailField = page.getByRole("textbox", { name: "Email" });
    this.passwordField = page.getByTestId("password");
    this.passwordRepeatField = page.getByTestId("password-repeat");
    this.signUpButton = page.getByTestId("signup-submit");
  }

  async goto() {
    await this.page.goto("/signup");
    await expect(this.page).toHaveURL("/signup");
  }

  async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordRepeat: string
  ) {
    await this.firstNameField.click();
    await this.firstNameField.fill(firstName);
    await this.lastNameField.click();
    await this.lastNameField.fill(lastName);
    await this.emailField.click();
    await this.emailField.fill(email);
    await this.passwordField.click();
    await this.passwordField.fill(password);
    await this.passwordRepeatField.click();
    await this.passwordRepeatField.fill(passwordRepeat);
    await this.signUpButton.click();
  }
}
