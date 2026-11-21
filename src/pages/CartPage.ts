import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly proceedToCheckoutButton: Locator;
  readonly cartRows: Locator;

  constructor(private readonly page: Page) {
    this.proceedToCheckoutButton = page.getByText(/proceed to checkout/i);
    this.cartRows = page.locator('#cart_info_table tbody tr');
  }

  async rowCount(): Promise<number> {
    return this.cartRows.count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  removeItemButtonForRow(rowIndex: number): Locator {
    return this.cartRows.nth(rowIndex).locator('.cart_quantity_delete');
  }

  async removeItemAt(rowIndex: number): Promise<void> {
    await this.removeItemButtonForRow(rowIndex).click();
  }
}