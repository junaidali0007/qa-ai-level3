import { test, expect } from '../../../src/fixtures/testFixtures.js';
import { assertNoInterstitialBlock, gotoAndVerify } from '../../../src/utils/navigation.js';

test.describe('Cart Item Add & Remove @ui @cart', () => {
  test('@AE-13 @UI @cart adds a product to cart and removes it', async ({
    page,
    homePage,
    productsPage,
    cartPage,
  }) => {
    await gotoAndVerify(page, '/');

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