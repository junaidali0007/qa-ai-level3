import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly productsLink: Locator;
  readonly signupLoginLink: Locator;
  readonly cartLink: Locator;
  readonly contactUsLink: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscriptionSuccessMessage: Locator;

  constructor(private readonly page: Page) {
    this.productsLink = page.getByRole('link', { name: /products/i });
    this.signupLoginLink = page.getByRole('link', { name: /signup \/ login/i });
    this.cartLink = page.getByRole('link', { name: /cart/i });
    this.contactUsLink = page.getByRole('link', { name: /contact us/i });
    this.subscriptionEmailInput = page.locator('#footer #susbscribe_email');
    this.subscribeButton = page.locator('#footer #subscribe');
    this.subscriptionSuccessMessage = page.locator('#success-subscribe .alert-success');
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

  async openContactUs(): Promise<void> {
    await this.contactUsLink.first().click();
  }
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscribeButton.click();
    await this.subscriptionSuccessMessage.waitFor({ state: 'visible' });
    await expect(this.subscriptionSuccessMessage).toContainText(/you have been successfully subscribed!/i);
  }
}
