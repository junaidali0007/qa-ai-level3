import { test, expect } from '../../src/fixtures/testFixtures.js';
import { gotoAndVerify, assertNoInterstitialBlock } from '../../src/utils/navigation.js';
import { ProductsPage } from '../../src/pages/ProductsPage.js';
import { ProductDetailsPage } from '../../src/pages/ProductDetailsPage.js';

/**
 * AE-24 — UI / API consistency (P1, source refs: API 1 productsList, API 3 brandsList).
 *
 * Oracle: the API is the source of truth. For a product the API reports, the rendered
 * product-details page must agree on name, price, brand and category; and the brand
 * sidebar must list exactly the brands the API reports. A mismatch is a genuine
 * cross-layer defect, not a locator problem, because both layers are read in one run.
 */

/** "Rs. 500" / "Rs.500" / "500" -> 500. Throws rather than silently returning NaN. */
function parsePrice(raw: string): number {
  const value = Number(raw.replace(/[^\d.]/g, '').trim());
  if (!Number.isFinite(value)) {
    throw new Error(`Unparseable price string: ${JSON.stringify(raw)}`);
  }
  return value;
}

/** "/brand_products/Polo" -> "Polo"; handles URL-encoded names such as "H%26M". */
function brandFromHref(href: string): string {
  return decodeURIComponent(href.split('/brand_products/')[1] ?? '').trim();
}

test.describe('UI / API consistency @integration @ui @api', () => {
  test('@AE-24 @P1 product details page agrees with productsList API', async ({
    page,
    productsApi,
  }) => {
    // --- Source of truth -------------------------------------------------
    const apiResult = await productsApi.listProducts();
    expect(apiResult.responseCode).toBe(200);
    expect(apiResult.products.length).toBeGreaterThan(0);

    // Pick the first product the API fully describes, so the comparison is not
    // weakened by optional fields being absent.
    const apiProduct = apiResult.products.find(
      (p) => p.brand && p.category?.category && p.category?.usertype?.usertype,
    );

    if (!apiProduct) {
      throw new Error(
        'productsList returned no product carrying brand + category + usertype; ' +
        'cannot assert full cross-layer consistency. Investigate the API payload ' +
        'before weakening this assertion.',
      );
    }

    // --- Rendered view ---------------------------------------------------
    await gotoAndVerify(page, `/product_details/${apiProduct.id}`);
    const details = new ProductDetailsPage(page);
    await expect(details.productName).toBeVisible();

    // --- Compare ---------------------------------------------------------
    await expect(details.productName).toHaveText(apiProduct.name.trim());

    const uiPrice = parsePrice((await details.price.innerText()).trim());
    expect(
      uiPrice,
      `UI price for product ${apiProduct.id} ("${apiProduct.name}") must equal the API price`,
    ).toBe(parsePrice(apiProduct.price));

    await expect(details.brand).toContainText(apiProduct.brand!);
    await expect(details.category).toContainText(apiProduct.category!.category!);
    await expect(details.category).toContainText(
      apiProduct.category!.usertype!.usertype!,
    );
  });

  test('@AE-24 @P1 brand sidebar lists exactly the brands returned by brandsList API', async ({
    page,
    productsApi,
  }) => {
    // --- Source of truth -------------------------------------------------
    const { responseCode, brands } = await productsApi.listBrands();
    expect(responseCode).toBe(200);
    expect(brands.length).toBeGreaterThan(0);

    // --- Rendered view ---------------------------------------------------
    await gotoAndVerify(page, '/products');
    await assertNoInterstitialBlock(page);

    const productsPage = new ProductsPage(page);
    await expect(productsPage.allProductsHeading).toBeVisible();

    const brandLinks = page.locator('.brands-name a');
    await expect(brandLinks.first()).toBeVisible();

    const hrefs = await brandLinks.evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('href') ?? ''),
    );
    const uiBrands = hrefs.map(brandFromHref).filter((b) => b.length > 0);

    // --- Compare as sets, so sidebar ordering is not asserted -------------
    const apiBrandNames = [...new Set(brands.map((b) => b.brand.trim()))].sort();
    const uiBrandNames = [...new Set(uiBrands)].sort();


    expect(
      uiBrandNames,
      'Brand sidebar must match brandsList API exactly; a difference means the UI ' +
      'and API disagree on the catalogue, not that a selector drifted',
    ).toEqual(apiBrandNames);

    // Each sidebar entry must also *display* its brand name, not merely link to it.
    for (const brand of uiBrands) {
      await expect(
        page.locator('.brands-name a', { hasText: brand }).first(),
      ).toBeVisible();
    }
  });
});
