import type { Locator, Page } from '@playwright/test';

export class ProductsPage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(private readonly page: Page) {
        this.searchInput = page.getByPlaceholder(/search product/i);
        this.searchButton = page.locator('#submit_search');
        this.continueShoppingButton = page.getByRole('button', { name: /continue shopping/i });
    }

    async searchFor(query: string): Promise<void> {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }

    addToCartButtonForProductId(productId: number): Locator {
        return this.page.locator(`.add-to-cart[data-product-id="${productId}"]`).first();
    }

    /* async clickContinueShoppingIfVisible(): Promise<void> {
      if (await this.continueShoppingButton.isVisible().catch(() => false)) {
        await this.continueShoppingButton.click();
      } 
    } */
    async clickContinueShoppingIfVisible(timeoutMs = 3000): Promise<void> {
        const appeared = await this.continueShoppingButton
            .waitFor({ state: 'visible', timeout: timeoutMs })
            .then(() => true)
            .catch(() => false);

        if (appeared) {
            await this.continueShoppingButton.click();
            await this.continueShoppingButton
                .waitFor({ state: 'hidden', timeout: timeoutMs })
                .catch(() => { });
        }
    }
}
