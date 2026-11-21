import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly deliveryAddressBox: Locator;
  readonly billingAddressBox: Locator;
  readonly orderCommentTextarea: Locator;
  readonly placeOrderButton: Locator;

  constructor(private readonly page: Page) {
    this.deliveryAddressBox = page.locator('#address_delivery');
    this.billingAddressBox = page.locator('#address_invoice');
    this.orderCommentTextarea = page.locator('#ordermsg textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: /place order/i });
  }

  async enterCommentAndPlaceOrder(comment: string): Promise<void> {
    if (comment.trim().length > 0) {
      await this.orderCommentTextarea.fill(comment);
    }
    await this.placeOrderButton.click();
  }
}