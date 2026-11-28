import { test, expect } from "../../../src/fixtures/testFixtures.js";
import { CartPage } from "../../../src/pages/CartPage.js";
import {
  assertNoInterstitialBlock,
  gotoAndVerify,
} from "../../../src/utils/navigation.js";

test.describe("Cart Item Add & Remove @ui @cart", () => {
  test("@AE-13 @UI @cart adds a product to cart and removes it", async ({
    page,
    homePage,
    productsPage,
    cartPage,
  }) => {
    await gotoAndVerify(page, "/");

    await homePage.openProducts();
    await assertNoInterstitialBlock(page);

    await productsPage.addToCartButtonForProductId(1).click();
    await productsPage.clickContinueShoppingIfVisible();

    await homePage.openCart();
    await assertNoInterstitialBlock(page);

    const initialCount = await cartPage.rowCount();
    expect(initialCount).toBeGreaterThan(0);

    await cartPage.removeItemAt(0);
    await expect.poll(async () => cartPage.rowCount()).toBe(initialCount - 1);
  });
});
test.describe("Subscription from Cart Page @ui", () => {
  test("AE-20 @ui @home @smoke subscribes to newsletter and verifies success message", async ({
    page,
    homePage,
  }) => {
    await gotoAndVerify(page, "/");
    await homePage.openCart();
    await expect(page).toHaveURL(/\/view_cart/);
    await assertNoInterstitialBlock(page);
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await homePage.subscribeToNewsletter(uniqueEmail);
  });
});
