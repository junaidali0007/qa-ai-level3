import { test as base } from '@playwright/test';
import { AccountsApiClient, type TestAccountInput } from '../api/accounts.js';
import { ProductsApiClient } from '../api/products.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';

interface FrameworkFixtures {
  homePage: HomePage;
  productsPage: ProductsPage;
  loginPage: LoginPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  accountsApi: AccountsApiClient;
  productsApi: ProductsApiClient;
  provisionedAccount: TestAccountInput;
}

function buildUniqueAccount(workerIndex: number): TestAccountInput {
  const uniqueSuffix = `${Date.now()}_${workerIndex}_${Math.floor(Math.random() * 10000)}`;
  return {
    name: `QA User ${uniqueSuffix}`,
    email: `qa.capstone.${uniqueSuffix}@example.com`,
    password: `Pass!${uniqueSuffix}`,
    firstname: 'QA',
    lastname: `Tester${workerIndex}`,
    address1: '123 Test Automation Lane',
    country: 'Canada',
    zipcode: 'M5V2T6',
    state: 'Ontario',
    city: 'Toronto',
    mobile_number: '4165550199',
  };
}

export const test = base.extend<FrameworkFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  accountsApi: async ({}, use) => {
    await use(new AccountsApiClient());
  },

  productsApi: async ({}, use) => {
    await use(new ProductsApiClient());
  },

  provisionedAccount: async ({ accountsApi }, use, testInfo) => {
    const account = buildUniqueAccount(testInfo.workerIndex);
    await accountsApi.createAccount(account).catch(() => {
      // If the external site blocks API creation during a challenge/outage, let the test or RCA handle it cleanly.
    });

    try {
      await use(account);
    } finally {
      await accountsApi.deleteAccount(account.email, account.password).catch(() => {
        // Best-effort cleanup so teardown never masks a real test assertion failure.
      });
    }
  },
});

export { expect } from '@playwright/test';