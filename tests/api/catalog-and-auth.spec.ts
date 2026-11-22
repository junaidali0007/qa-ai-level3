import { test, expect } from '../../src/fixtures/testFixtures.js';

test.describe('Catalog & Accounts API Contracts @api', () => {
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

  test('verifies provisioned account credentials via verifyLogin', async ({
    accountsApi,
    provisionedAccount,
  }) => {
    const loginResult = await accountsApi.verifyLogin(
      provisionedAccount.email,
      provisionedAccount.password,
    );

    expect(loginResult.responseCode).toBe(200);
    expect(loginResult.message.toLowerCase()).toContain('user exists');
  });
  test('AE-API-03 @api @negative returns 404 in payload for non-existent login credentials', async ({
  accountsApi,
}) => {
  const result = await accountsApi.verifyLogin(
    `nonexistent_${Date.now()}@example.com`,
    'WrongPassword123!'
  );

  expect(result.responseCode).toBe(404);
  expect(result.message).toMatch(/User not found!/i);
});

test('AE-API-04 @api @negative returns 400 in payload when email parameter is omitted from verifyLogin', async ({
  request,
}) => {
  const response = await request.post('/api/verifyLogin', {
    form: { password: 'SomePassword123!' },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.responseCode).toBe(400);
  expect(body.message).toMatch(/email or password parameter is missing/i);
});

test('AE-API-05 @api @negative returns 400 in payload when registering with an already existing email', async ({
  accountsApi,
  provisionedAccount,
}) => {
  const duplicateResponse = await accountsApi.createAccount({
    ...provisionedAccount,
    name: 'Duplicate User',
  });

  expect(duplicateResponse.responseCode).toBe(400);
  expect(duplicateResponse.message).toMatch(/Email already exists!/i);
});
});