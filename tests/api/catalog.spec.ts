import { test, expect } from "../../src/fixtures/testFixtures.js";

test.describe("Catalog API Contracts @api", () => {
  test("@AE-06 @api lists products and validates schema fields", async ({
    productsApi,
  }) => {
    const result = await productsApi.listProducts();

    expect(result.responseCode).toBe(200);
    expect(result.products.length).toBeGreaterThan(0);

    const firstProduct = result.products[0];
    expect(Number.isFinite(firstProduct.id)).toBe(true);
    expect(firstProduct.id).toBeGreaterThan(0);
    expect(firstProduct.name.trim().length).toBeGreaterThan(0);
    expect(firstProduct.price.trim().length).toBeGreaterThan(0);
  });

  test("@AE-07 @api searches products by keyword and returns matching items", async ({
    productsApi,
  }) => {
    const query = "Top";
    const result = await productsApi.searchProducts(query);

    expect(result.responseCode).toBe(200);
    expect(Array.isArray(result.products)).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);

    const hasMatchingNameOrCategory = result.products.some(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.category?.category ?? "")
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    expect(hasMatchingNameOrCategory).toBe(true);
  });
  //@AE-08 @api searches products without passing search_product parameter and expects 400 response code
  test("@AE-08 @api searches products without passing search_product parameter and expects 400 response code", async ({
    request,
  }) => {
    const response = await request.post("/api/searchProduct");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.responseCode).toBe(400);
  });
  //@AE-10 @api All brands
  test("@AE-10 @api get all brands", async ({ productsApi }) => {
    const result = await productsApi.listBrands();
    expect(result.responseCode).toBe(200);
    expect(result.brands.length).toBeGreaterThan(0);
    expect(result.brands[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        brand: expect.any(String),
      }),
    );
  });
});
