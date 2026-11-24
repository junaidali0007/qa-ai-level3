import { expect, type Locator, type Page } from "@playwright/test";

export class ProductsPage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly allProductsHeading: Locator;
  readonly firstProductCard: Locator;
  readonly firstProductViewLink: Locator;
  readonly productNameHeading: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly categoryHeading: Locator;
  readonly categorySidebar: Locator;
  readonly womenCategoryLink: Locator;
  readonly womenTopsLink: Locator;
  readonly menCategoryLink: Locator;
  readonly menJeansLink: Locator;
  readonly categoryProductsHeading: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByPlaceholder(/search product/i);
    this.searchButton = page.locator("#submit_search");
    this.continueShoppingButton = page.getByRole("button", {
      name: /continue shopping/i,
    });

    this.allProductsHeading = page.getByRole("heading", {
      name: /all products/i,
    });
    this.firstProductCard = page
      .locator(".features_items .product-image-wrapper")
      .first();
    this.firstProductViewLink = this.firstProductCard.getByRole("link", {
      name: /view product/i,
    });

    const productInfo = page.locator(".product-information");
    this.productNameHeading = productInfo.locator("h2");
    this.productCategory = productInfo
      .locator("p")
      .filter({ hasText: "Category:" });
    this.productPrice = productInfo
      .locator("span")
      .filter({ hasText: /^Rs\.\s*\d+$/ });
    this.productAvailability = productInfo
      .locator("p")
      .filter({ hasText: "Availability:" });
    this.productCondition = productInfo
      .locator("p")
      .filter({ hasText: "Condition:" });
    this.productBrand = productInfo.locator("p").filter({ hasText: "Brand:" });

    this.categoryHeading = page.getByRole("heading", {
      name: "Category",
      exact: true,
    });
    this.categorySidebar = page.locator(".left-sidebar .category-products");
    this.womenCategoryLink = this.categorySidebar.locator('a[href="#Women"]');
    this.womenTopsLink = page
      .locator("#Women")
      .getByRole("link", { name: "Tops", exact: true });
    this.menCategoryLink = this.categorySidebar.locator('a[href="#Men"]');
    this.menJeansLink = page
      .locator("#Men")
      .getByRole("link", { name: "Jeans", exact: true });
    this.categoryProductsHeading = page.locator(".features_items h2.title");
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  addToCartButtonForProductId(productId: number): Locator {
    return this.page
      .locator(`.add-to-cart[data-product-id="${productId}"]`)
      .first();
  }

  async clickContinueShoppingIfVisible(timeoutMs = 3000): Promise<void> {
    const appeared = await this.continueShoppingButton
      .waitFor({ state: "visible", timeout: timeoutMs })
      .then(() => true)
      .catch(() => false);

    if (appeared) {
      await this.continueShoppingButton.click();
      await this.continueShoppingButton
        .waitFor({ state: "hidden", timeout: timeoutMs })
        .catch(() => {});
    }
  }

  async verifyAllProductsAndProductDetailPage(): Promise<void> {
    await expect(this.allProductsHeading).toBeVisible();
    await expect(this.firstProductCard).toBeVisible();
    await this.firstProductViewLink.click();

    await expect(this.page).toHaveURL(/\/product_details\/\d+/);
    await expect(this.productNameHeading).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productAvailability).toBeVisible();
    await expect(this.productCondition).toBeVisible();
    await expect(this.productBrand).toBeVisible();
  }

  // @AE-09 @ui @catalog displays products for selected categories
  async verifyProductsForSelectedCategories(): Promise<void> {
    await expect(this.categoryHeading).toBeVisible();

    await this.womenCategoryLink.click();
    await this.womenTopsLink.click();
    await expect(this.categoryProductsHeading).toHaveText(
      /WOMEN\s*-\s*TOPS PRODUCTS/i,
    );

    await this.menCategoryLink.click();
    await this.menJeansLink.click();
    await expect(this.categoryProductsHeading).toHaveText(
      /MEN\s*-\s*JEANS PRODUCTS/i,
    );
  }
}
