import { test, expect } from '../../src/fixtures/testFixtures.js';

test.describe('Accounts & Auth API Contracts @api', () => {
  test('@AE-02 verifies provisioned account credentials via verifyLogin', async ({
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

  test('@AE-03 @negative returns 404 in payload for non-existent login credentials', async ({
    accountsApi,
  }) => {
    const result = await accountsApi.verifyLogin(
      `nonexistent_${Date.now()}@example.com`,
      'WrongPassword123!',
    );

    expect(result.responseCode).toBe(404);
    expect(result.message).toMatch(/User not found!/i);
  });

  test('@AE-03 @negative returns 400 in payload when email parameter is omitted from verifyLogin', async ({
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

  test('@AE-03 @negative returns 400 in payload when registering with an already existing email', async ({
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