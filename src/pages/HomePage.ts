import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly productsLink: Locator;
  readonly signupLoginLink: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.productsLink = page.getByRole('link', { name: /products/i });
    this.signupLoginLink = page.getByRole('link', { name: /signup \/ login/i });
    this.cartLink = page.getByRole('link', { name: /cart/i });
  }

  async openProducts(): Promise<void> {
    await this.productsLink.first().click();
  }

  async openSignupLogin(): Promise<void> {
    await this.signupLoginLink.first().click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.first().click();
  }
}
