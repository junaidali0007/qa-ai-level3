import type { Download, Locator, Page } from "@playwright/test";

export class PaymentDonePage {
  readonly orderPlacedHeading: Locator;
  readonly orderConfirmedMessage: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueLink: Locator;

  constructor(private readonly page: Page) {
    this.orderPlacedHeading = page.getByRole("heading", {
      name: "Order Placed!",
      exact: true,
    });
    this.orderConfirmedMessage = page.getByText(
      "Congratulations! Your order has been confirmed!",
      { exact: true },
    );
    this.downloadInvoiceLink = page.getByRole("link", {
      name: "Download Invoice",
    });
    this.continueLink = page.getByRole("link", {
      name: "Continue",
      exact: true,
    });
  }

  async downloadInvoice(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent("download");
    await this.downloadInvoiceLink.click();
    return downloadPromise;
  }

  async continueShopping(): Promise<void> {
    await this.continueLink.click();
  }
  async verifyOrderPlaced(): Promise<void> {
    await this.orderPlacedHeading.waitFor({ state: "visible" });
    await this.orderConfirmedMessage.waitFor({ state: "visible" });
  }
}
