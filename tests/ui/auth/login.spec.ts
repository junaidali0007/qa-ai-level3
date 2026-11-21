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
});