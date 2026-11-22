import { test, expect } from '../../../src/fixtures/testFixtures.js';
import { assertNoInterstitialBlock, gotoAndVerify } from '../../../src/utils/navigation.js';

test.describe('Product Catalog Search @ui @catalog', () => {
  test('searches catalog for matching products', async ({
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
  test('AE-CAT-03 @ui @catalog @negative displays zero product cards for unmatched search query', async ({
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
});