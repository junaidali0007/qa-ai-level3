import { test, expect } from '../../../src/fixtures/testFixtures.js';
import { assertNoInterstitialBlock, gotoAndVerify } from '../../../src/utils/navigation.js';

test.describe('Product Catalog Search @ui @catalog', () => {
  test('@AE-07 @ui @catalog searches catalog for matching products', async ({
    page,
    homePage,
    productsPage,
  }) => {
    await gotoAndVerify(page, '/');

    await homePage.openProducts();
    await assertNoInterstitialBlock(page);

    const searchTerm = 'Dress';
    await productsPage.searchFor(searchTerm);

    await expect(page.getByRole('heading', { name: /searched products/i })).toBeVisible();
    await expect(page.locator('.productinfo p').first()).toBeVisible();
  });
  test('@AE-08 @ui @catalog @negative displays zero product cards for unmatched search query', async ({
    page,
    homePage,
    productsPage,
  }) => {
    await gotoAndVerify(page, '/');
    await homePage.openProducts();

    await productsPage.searchFor(`ZZZ_NON_EXISTENT_SKU_${Date.now()}`);

    await expect(page.getByRole('heading', { name: /Searched Products/i })).toBeVisible();
    await expect(page.locator('.features_items .product-image-wrapper')).toHaveCount(0);
  });
  test('@AE-06 @ui @catalog verifies all products and a product detail page', async ({
    page,
    homePage,
    productsPage,
  }) => {
    await gotoAndVerify(page, '/');
    await homePage.openProducts();
    await assertNoInterstitialBlock(page);
    await productsPage.verifyAllProductsAndProductDetailPage();
  });

  //@AE-09 @ui @catalog displays products for selected categories
  test('@AE-09 @ui @catalog displays products for selected categories', async ({ page, homePage, productsPage }) => {
    await gotoAndVerify(page, '/');
    await homePage.openProducts();
    await assertNoInterstitialBlock(page);
    await productsPage.verifyProductsForSelectedCategories();
  });

  //@AE-10 @ui @catalog displays products for selected brands
  test('@AE-10 @ui @catalog displays products for selected brands', async ({ page, homePage, productsPage }) => {
    await gotoAndVerify(page, '/');
    await homePage.openProducts();
    await assertNoInterstitialBlock(page);
    await productsPage.verifyProductsForSelectedBrands();
  });
  //@AE-11 @ui @catalog add multiple products to cart and verify both products are in the cart
  test('@AE-11 @ui @catalog add multiple products to cart and verify both products are in the cart',
    async ({ page, homePage, productsPage, cartPage }) => {
      await gotoAndVerify(page, '/');
      await homePage.openProducts();
      await assertNoInterstitialBlock(page);
      await productsPage.addMultipleProductsToCartAndVerify([1, 2]);
      await assertNoInterstitialBlock(page);
      await homePage.openCart();
      expect(await cartPage.rowCount()).toBe(2);
    });
  //@AE-12 @ui @catallog click on first product using view product link, increase quantity on product_detail page, add to cart and verify the product quantity in the cart

});

test('@AE-14 Search product, Add to Cart, verify products in cart, login and verify products should remain in cart @ui @catalog'
  , async ({ page, homePage, productsPage, loginPage, provisionedAccount }) => {
    await test.step('Navigate to products page', async () => {
      await gotoAndVerify(page, '/');
      await homePage.openProducts();
      await assertNoInterstitialBlock(page);
    });
    await test.step('Search for a product and add to cart', async () => {
      await productsPage.searchProductAndAddToCart('Top', 1);
    });
    await test.step('Verify product is in cart', async () => {
      await homePage.openCart();
      await assertNoInterstitialBlock(page);
      expect(await page.locator('.cart_info .cart_product').count()).toBeGreaterThan(0);
    });
    await test.step('Login and verify product remains in cart', async () => {
      await homePage.openSignupLogin();
      await assertNoInterstitialBlock(page);
      await loginPage.login(provisionedAccount.email, provisionedAccount.password);
      await expect(
        page.getByText(new RegExp(`Logged in as ${provisionedAccount.name}`, 'i')),
      ).toBeVisible();
      await test.step('Verify product is still in cart after login', async () => {
        await homePage.openCart();
        await assertNoInterstitialBlock(page);
        expect(await page.locator('.cart_info .cart_product').count()).toBeGreaterThan(0);
      });

    });

  });
