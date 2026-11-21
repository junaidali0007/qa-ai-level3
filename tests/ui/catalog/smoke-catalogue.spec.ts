import { test, expect } from '../../../src/fixtures/testFixtures.js';
import { assertNoInterstitialBlock, gotoAndVerify } from '../../../src/utils/navigation.js';

test.describe('Catalog Smoke @ui @catalog @smoke', () => {
  test('loads products catalog and displays product cards', async ({
    page,
    homePage,
  }) => {
    await gotoAndVerify(page, '/');

    await homePage.openProducts();
    await assertNoInterstitialBlock(page);

    await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible();
    await expect(page.locator('.features_items .product-image-wrapper').first()).toBeVisible();
  });
});