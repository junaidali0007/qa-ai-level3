import { test, expect } from '../../../src/fixtures/testFixtures.js';
import { assertNoInterstitialBlock, gotoAndVerify } from '../../../src/utils/navigation.js';

test.describe('Authentication Flow @ui @auth', () => {
  test('signs in with provisioned account credentials', async ({
    page,
    homePage,
    loginPage,
    provisionedAccount,
  }) => {
    await gotoAndVerify(page, '/');

    await homePage.openSignupLogin();
    await assertNoInterstitialBlock(page);

    await loginPage.login(provisionedAccount.email, provisionedAccount.password);
    await expect(
      page.getByText(new RegExp(`Logged in as ${provisionedAccount.name}`, 'i')),
    ).toBeVisible();
  });
  test('AE-AUTH-02 @ui @auth @negative shows error message for invalid login credentials', async ({
  page,
  homePage,
  loginPage,
}) => {
  await gotoAndVerify(page, '/');
  await homePage.openSignupLogin();

  await loginPage.login(`invalid_${Date.now()}@example.com`, 'IncorrectPass!99');

  await expect(page.getByText(/Your email or password is incorrect!/i)).toBeVisible();
  await expect(page).toHaveURL(/\/login/i);
});

test('AE-AUTH-03 @ui @auth @negative prevents signup when email already exists', async ({
  page,
  homePage,
  loginPage,
  provisionedAccount,
}) => {
  await gotoAndVerify(page, '/');
  await homePage.openSignupLogin();

  await loginPage.startSignup(provisionedAccount.name, provisionedAccount.email);

  await expect(page.getByText(/Email Address already exist!/i)).toBeVisible();
});
});