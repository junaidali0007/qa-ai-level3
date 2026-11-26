import { expect, test } from "../../../src/fixtures/testFixtures.js";
import { assertNoInterstitialBlock, gotoAndVerify } from "../../../src/utils/navigation.js";
import { ProductsPage } from "../../../src/pages/ProductsPage.js";

test.describe("Product Detail page @ui @catalog", () => {
  test(
    "@AE-12 @ui @catalog open first product details, increase quantity, add to cart and verify cart quantity and total",
    async ({ page }) => {
      await gotoAndVerify(page, "/products");
      await assertNoInterstitialBlock(page);

      const productsPage = new ProductsPage(page);
      const productDetailsPage = await productsPage.openFirstProductDetails();

      await productDetailsPage.verifyProductDetails();
      await productDetailsPage.addProductToCartAndVerify("1", 3);
    },
  );

  test("@AE-18 @ui @catalog submit product review and verify success message", async ({
    page,
  }) => {
    await gotoAndVerify(page, "/products");
    await assertNoInterstitialBlock(page);

    const productsPage = new ProductsPage(page);
    const productDetailsPage = await productsPage.openFirstProductDetails();

    const confirmationText = await productDetailsPage.submitReviewAndVerify(
      "Junaid Ali",
      "junaid@example.com",
      "Great fit and fabric quality for everyday wear.",
    );
    expect(confirmationText).toMatch(/thank you for your review/i);
  });
});
