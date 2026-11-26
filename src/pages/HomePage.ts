import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly productsLink: Locator;
  readonly signupLoginLink: Locator;
  readonly cartLink: Locator;
  readonly contactUsLink: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscriptionSuccessMessage: Locator;
  readonly recommendedItemsHeading: Locator;
  readonly recommendedItemsCarousel: Locator;
  readonly recommendedItemCards: Locator;
  readonly recommendedItemNames: Locator;
  readonly recommendedItemPrices: Locator;
  readonly recommendedItemAddToCartButtons: Locator;
  readonly recommendedItemsPreviousButton: Locator;
  readonly recommendedItemsNextButton: Locator;

  constructor(private readonly page: Page) {
    this.productsLink = page.getByRole("link", { name: /products/i });
    this.signupLoginLink = page.getByRole("link", { name: /signup \/ login/i });
    this.cartLink = page.getByRole("link", { name: /cart/i });
    this.contactUsLink = page.getByRole("link", { name: /contact us/i });
    this.subscriptionEmailInput = page.locator("#footer #susbscribe_email");
    this.subscribeButton = page.locator("#footer #subscribe");
    this.subscriptionSuccessMessage = page.locator(
      "#success-subscribe .alert-success",
    );
    this.recommendedItemsHeading = page.locator(".recommended_items > h2");
    this.recommendedItemsCarousel = page.locator("#recommended-item-carousel");
    this.recommendedItemCards = this.recommendedItemsCarousel.locator(
      ".product-image-wrapper",
    );
    this.recommendedItemNames =
      this.recommendedItemCards.locator(".productinfo p");
    this.recommendedItemPrices =
      this.recommendedItemCards.locator(".productinfo h2");
    this.recommendedItemAddToCartButtons =
      this.recommendedItemsCarousel.locator("a.add-to-cart");
    this.recommendedItemsPreviousButton = this.recommendedItemsCarousel.locator(
      "a.recommended-item-control.left",
    );
    this.recommendedItemsNextButton = this.recommendedItemsCarousel.locator(
      "a.recommended-item-control.right",
    );
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

  async viewCartFromAddToCartModal(): Promise<void> {
    await this.page
      .locator(".modal-content")
      .getByRole("link", { name: /view cart/i })
      .click();
  }

  async openContactUs(): Promise<void> {
    await this.contactUsLink.first().click();
  }
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscribeButton.click();
    await this.subscriptionSuccessMessage.waitFor({ state: "visible" });
    await expect(this.subscriptionSuccessMessage).toContainText(
      /you have been successfully subscribed!/i,
    );
  }

  recommendedItemAddToCartButton(productId: number): Locator {
    return this.recommendedItemsCarousel.locator(
      `a.add-to-cart[data-product-id="${productId}"]`,
    );
  }
  //Method to add a recommended item to the cart by product ID
  async addRecommendedItemToCartByIdAndReturnNameAndPrice(
    productId: number,
  ): Promise<{ productName: string; productPrice: string }> {
    const addToCartButton = this.recommendedItemAddToCartButton(productId);
    await addToCartButton.scrollIntoViewIfNeeded();
    await addToCartButton.click();
    //get the product name and price for verification
    const productCard = this.recommendedItemsCarousel.locator(
      `.product-image-wrapper:has(a.add-to-cart[data-product-id="${productId}"])`,
    );
    const productName = await productCard.locator(".productinfo p").innerText();
    const productPrice = await productCard
      .locator(".productinfo h2")
      .innerText();
    //return the product name and price for verification
    return { productName, productPrice };
  }

  // Method to verify the recommended items section is visible and contains at least one item
  async verifyRecommendedItemsSection(): Promise<void> {
    await expect(this.recommendedItemsHeading).toBeVisible();
    await expect(this.recommendedItemsCarousel).toBeVisible();
    const itemCount = await this.recommendedItemCards.count();
    expect(itemCount).toBeGreaterThan(0);
  }
}
