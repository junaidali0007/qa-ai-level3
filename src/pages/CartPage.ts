import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly proceedToCheckoutButton: Locator;
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly emptyCartMessage: Locator;
  readonly continueShoppingLink: Locator;
  readonly cartProductNames: Locator;
  readonly cartProductPrices: Locator;
  readonly cartProductQuantities: Locator;
  readonly cartProductTotals: Locator;
  readonly removeItemButtons: Locator;

  constructor(private readonly page: Page) {
    this.proceedToCheckoutButton = page.locator("#cart_info .check_out");
    this.cartTable = page.locator("#cart_info_table");
    this.cartRows = this.cartTable.locator('tbody tr[id^="product-"]');
    this.emptyCartMessage = page.locator("#empty_cart p");
    this.continueShoppingLink = page.locator('#empty_cart a[href="/products"]');
    this.cartProductNames = this.cartRows.locator(".cart_description h4 a");
    this.cartProductPrices = this.cartRows.locator(".cart_price p");
    this.cartProductQuantities = this.cartRows.locator(".cart_quantity button");
    this.cartProductTotals = this.cartRows.locator(".cart_total p");
    this.removeItemButtons = this.cartRows.locator(".cart_quantity_delete");
  }

  async rowCount(): Promise<number> {
    return this.cartRows.count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  removeItemButtonForRow(rowIndex: number): Locator {
    return this.cartRows.nth(rowIndex).locator(".cart_quantity_delete");
  }

  async removeItemAt(rowIndex: number): Promise<void> {
    await this.removeItemButtonForRow(rowIndex).click();
  }

  private parseRupeeAmount(value: string): number {
    const amount = Number(value.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(amount)) {
      throw new Error(`Unable to parse rupee amount from "${value}".`);
    }
    return amount;
  }

  async verifyProductInCartByNameAndPrice(
    productName: string,
    productPrice: string,
  ): Promise<void> {
    const expectedPrice = this.parseRupeeAmount(productPrice);
    const rowCount = await this.rowCount();

    for (let i = 0; i < rowCount; i++) {
      const name = (await this.cartProductNames.nth(i).innerText()).trim();
      if (name !== productName.trim()) {
        continue;
      }

      const priceText = await this.cartProductPrices.nth(i).innerText();
      const price = this.parseRupeeAmount(priceText);
      if (price !== expectedPrice) {
        throw new Error(
          `Price for "${name}" does not match. Expected: ${productPrice}, actual: ${priceText}.`,
        );
      }

      const quantityText = await this.cartProductQuantities.nth(i).innerText();
      const quantity = Number(quantityText.trim());
      if (quantity !== 1) {
        throw new Error(
          `Quantity for "${name}" should be 1, but was "${quantityText.trim()}".`,
        );
      }

      const totalText = await this.cartProductTotals.nth(i).innerText();
      const total = this.parseRupeeAmount(totalText);
      if (total !== price * quantity) {
        throw new Error(
          `Total for "${name}" is incorrect. Expected: ${price * quantity}, actual: ${totalText}.`,
        );
      }
      return;
    }

    throw new Error(
      `Product "${productName}" with price "${productPrice}" and quantity "1" not found in cart.`,
    );
  }
}
