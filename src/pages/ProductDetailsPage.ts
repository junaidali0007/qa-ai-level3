import { expect, Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
    readonly productImage: Locator;
    readonly productName: Locator;
    readonly category: Locator;
    readonly price: Locator;
    readonly availability: Locator;
    readonly condition: Locator;
    readonly brand: Locator;
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly writeReviewHeading: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextInput: Locator;
    readonly submitReviewButton: Locator;

    constructor(private readonly page: Page) {
        this.productImage = page.locator('.view-product img');
        this.productName = page.locator('.product-information h2');
        this.category = page.locator('.product-information p').filter({ hasText: 'Category:' });
        this.price = page.locator('.product-information span span');
        this.availability = page.locator('.product-information p').filter({ hasText: 'Availability:' });
        this.condition = page.locator('.product-information p').filter({ hasText: 'Condition:' });
        this.brand = page.locator('.product-information p').filter({ hasText: 'Brand:' });
        this.quantityInput = page.locator('#quantity');
        this.addToCartButton = page.locator('.product-information .cart');
        this.writeReviewHeading = page.getByText('Write Your Review', { exact: true });
        this.reviewNameInput = page.locator('#name');
        this.reviewEmailInput = page.locator('#email');
        this.reviewTextInput = page.locator('#review');
        this.submitReviewButton = page.locator('#button-review');
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/product_details\/\d+/);
        await expect(this.productName).toBeVisible();
    }

    async verifyProductDetails(expected?: {
        name?: string;
        brand?: string;
    }): Promise<void> {
        await this.expectLoaded();
        await expect(this.productImage).toBeVisible();
        await expect(this.category).toBeVisible();
        await expect(this.price).toBeVisible();
        await expect(this.availability).toBeVisible();
        await expect(this.condition).toBeVisible();
        await expect(this.brand).toBeVisible();

        if (expected?.name) {
            await expect(this.productName).toContainText(expected.name);
        }
        if (expected?.brand) {
            await expect(this.brand).toContainText(expected.brand);
        }
    }

   private parseRupeeAmount(rawText: string): number {
  const numericValue = Number(
    rawText.replace(/^Rs\.\s*/i, "").replace(/[^\d.]/g, "").trim(),
  );
  expect(Number.isFinite(numericValue)).toBe(true);
  return numericValue;
}

// @AE-12 @ui @catalog increase quantity on product detail page, add to cart and verify cart page quantity and total price
async addProductToCartAndVerify(p0: string, quantity = 3): Promise<void> {
  await this.expectLoaded();
  await expect(this.price).toBeVisible();

  const productName = (await this.productName.innerText()).trim();
  const unitPrice = this.parseRupeeAmount(await this.price.innerText());
  expect(unitPrice).toBeGreaterThan(0);

  await this.quantityInput.fill(String(quantity));
  await this.addToCartButton.click();

  await this.page
    .locator(".modal-content")
    .getByRole("link", { name: /view cart/i })
    .click();

  await expect(this.page).toHaveURL(/\/view_cart/);

  const cartRow = this.page
    .locator("#cart_info_table tbody tr[id^='product-']")
    .filter({ hasText: productName })
    .first();

  await expect(cartRow).toBeVisible();
  await expect(cartRow.locator(".cart_quantity button")).toHaveText(String(quantity));

  const total = this.parseRupeeAmount(
    await cartRow.locator(".cart_total p").innerText(),
  );
  expect(total).toBe(unitPrice * quantity);
}
}