import { test, expect } from "../../../src/fixtures/testFixtures.js";
import {
  assertNoInterstitialBlock,
  gotoAndVerify,
} from "../../../src/utils/navigation.js";

test.describe("Home & Ancillary Navigation @ui @ancillary @smoke", () => {
  test("AE-01 @smoke @P0 loads home page and verifies primary navigation links", async ({
    page,
    homePage,
  }) => {
    await gotoAndVerify(page, "/");
    await expect(page).toHaveTitle(/Automation Exercise/i);

    await expect(homePage.productsLink).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();
    await expect(homePage.signupLoginLink).toBeVisible();
  });

  test("AE-02 @smoke navigates between Products, Cart, and Signup/Login views", async ({
    page,
    homePage,
  }) => {
    await gotoAndVerify(page, "/");

    await homePage.openProducts();
    await expect(page).toHaveURL(/\/products/i);

    await homePage.openCart();
    await expect(page).toHaveURL(/\/view_cart/i);

    await homePage.openSignupLogin();
    await expect(page).toHaveURL(/\/login/i);

    await homePage.openContactUs();
    await expect(page).toHaveURL(/\/contact_us/i);
  });
});

test.describe("Subscription from Home Page @ui", () => {
  test("AE-20 @ui @home @smoke subscribes to newsletter and verifies success message", async ({
    page,
    homePage,
  }) => {
    await gotoAndVerify(page, "/");
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await homePage.subscribeToNewsletter(uniqueEmail);
  });

  test("AE-21 @ui @home add a recommended item to cart and verify product name and price in the cart", async ({
    page,
    homePage,
    cartPage,
  }) => {
    await gotoAndVerify(page, "/");
    await assertNoInterstitialBlock(page);
    await homePage.verifyRecommendedItemsSection();
    const { productName, productPrice } =
      await homePage.addRecommendedItemToCartByIdAndReturnNameAndPrice(1);
    await homePage.viewCartFromAddToCartModal();
    await assertNoInterstitialBlock(page);
    await cartPage.verifyProductInCartByNameAndPrice(productName, productPrice);
  });
});
