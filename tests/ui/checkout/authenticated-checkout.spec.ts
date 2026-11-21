import { test, expect } from '../../../src/fixtures/testFixtures.js';
import { assertNoInterstitialBlock, gotoAndVerify } from '../../../src/utils/navigation.js';

test.describe('Authenticated Product Search & Checkout Flow @ui', () => {
  test('logs in with provisioned account, adds product to cart, and reaches checkout', async ({
    page,
    homePage,
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    provisionedAccount,
  }) => {
    await gotoAndVerify(page, '/');

    await homePage.openSignupLogin();
    await assertNoInterstitialBlock(page);
    await loginPage.login(provisionedAccount.email, provisionedAccount.password);

    await expect(
      page.getByText(new RegExp(`Logged in as ${provisionedAccount.name}`, 'i')),
    ).toBeVisible();

    await homePage.openProducts();
    await assertNoInterstitialBlock(page);
    await productsPage.searchFor('Top');

    await productsPage.addToCartButtonForProductId(1).click();
    await productsPage.clickContinueShoppingIfVisible();

    await homePage.openCart();
    await assertNoInterstitialBlock(page);
    expect(await cartPage.rowCount()).toBeGreaterThan(0);

    await cartPage.proceedToCheckout();
    await assertNoInterstitialBlock(page);

    await expect(checkoutPage.deliveryAddressBox).toContainText(provisionedAccount.firstname);
    await expect(checkoutPage.deliveryAddressBox).toContainText(provisionedAccount.city);
    await expect(checkoutPage.billingAddressBox).toContainText(provisionedAccount.address1);
    await expect(checkoutPage.placeOrderButton).toBeVisible();
  });
});