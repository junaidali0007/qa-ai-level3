import { test, expect } from '../../src/fixtures/testFixtures.js';

test.describe('Catalog API Contracts @api', () => {
  test('lists products and validates schema fields', async ({ productsApi }) => {
    const result = await productsApi.listProducts();

    expect(result.responseCode).toBe(200);
    expect(result.products.length).toBeGreaterThan(0);

    const firstProduct = result.products[0];
    expect(Number.isFinite(firstProduct.id)).toBe(true);
    expect(firstProduct.id).toBeGreaterThan(0);
    expect(firstProduct.name.trim().length).toBeGreaterThan(0);
    expect(firstProduct.price.trim().length).toBeGreaterThan(0);
  });

  test('searches products by keyword and returns matching items', async ({ productsApi }) => {
    const query = 'Top';
    const result = await productsApi.searchProducts(query);

    expect(result.responseCode).toBe(200);
    expect(Array.isArray(result.products)).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);

    const hasMatchingNameOrCategory = result.products.some(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.category?.category ?? '').toLowerCase().includes(query.toLowerCase()),
    );
    expect(hasMatchingNameOrCategory).toBe(true);
  });
});