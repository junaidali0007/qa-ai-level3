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

  /* test('@AE-09 @ui @catalog displays products for selected categories', async ({ page }) => {
    await gotoAndVerify(page, '/');

    const categories = page.locator('.left-sidebar .category-products');
    await expect(categories).toBeVisible();
    await expect(categories.getByText('Category', { exact: true })).toBeVisible();

    await categories.getByRole('link', { name: 'Women', exact: true }).click();
    await categories.getByRole('link', { name: 'Tops', exact: true }).click();
    await expect(page.getByRole('heading', { name: /WOMEN\s*-\s*TOPS PRODUCTS/i })).toBeVisible();

    await categories.getByRole('link', { name: 'Men', exact: true }).click();
    await categories.getByRole('link', { name: 'Jeans', exact: true }).click();
    await expect(page.getByRole('heading', { name: /MEN\s*-\s*JEANS PRODUCTS/i })).toBeVisible();
  }); */

  //@AE-09 @ui @catalog displays products for selected categories
test('@AE-09 @ui @catalog displays products for selected categories', async ({ page, homePage, productsPage }) => {
  await gotoAndVerify(page, '/');
  await homePage.openProducts();
  await assertNoInterstitialBlock(page);
  await productsPage.verifyProductsForSelectedCategories();
   });
});