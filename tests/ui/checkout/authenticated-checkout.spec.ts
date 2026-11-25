import { readFile } from "node:fs/promises";
import { test, expect } from "../../../src/fixtures/testFixtures.js";
import {
  assertNoInterstitialBlock,
  gotoAndVerify,
} from "../../../src/utils/navigation.js";

test.describe("E2E flow of customer purchase journey @ui @catalog @checkout", () => {
  test("logs in with provisioned account, adds product to cart, and reaches checkout", async ({
    page,
    homePage,
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    provisionedAccount,
    paymentPage,
    paymentDonePage,
  }, testInfo) => {
    await test.step("Log in with provisioned account", async () => {
      await gotoAndVerify(page, "/");
      await homePage.openSignupLogin();
      await assertNoInterstitialBlock(page);
      await loginPage.login(
        provisionedAccount.email,
        provisionedAccount.password,
      );

      await expect(
        page.getByText(
          new RegExp(`Logged in as ${provisionedAccount.name}`, "i"),
        ),
      ).toBeVisible();
    });

    await test.step("Search product, add to cart, and verify cart contents", async () => {
      await homePage.openProducts();
      await assertNoInterstitialBlock(page);
      await productsPage.searchFor("Top");

      await productsPage.addToCartButtonForProductId(1).click();
      await productsPage.clickContinueShoppingIfVisible();

      await homePage.openCart();
      await assertNoInterstitialBlock(page);
      expect(await cartPage.rowCount()).toBeGreaterThan(0);
    });

    await test.step("Proceed to checkout, verify address details, and place order", async () => {
      await cartPage.proceedToCheckout();
      await assertNoInterstitialBlock(page);

      await expect(checkoutPage.deliveryAddressBox).toContainText(
        provisionedAccount.firstname,
      );
      await expect(checkoutPage.deliveryAddressBox).toContainText(
        provisionedAccount.city,
      );
      await expect(checkoutPage.billingAddressBox).toContainText(
        provisionedAccount.address1,
      );
      await expect(checkoutPage.placeOrderButton).toBeVisible();

      await checkoutPage.enterCommentAndPlaceOrder(
        "Please deliver between 9 AM and 5 PM.",
      );
      await assertNoInterstitialBlock(page);
    });

    await test.step("Enter payment details and confirm order", async () => {
      await paymentPage.enterCardDetails(
        "John Doe",
        "4111111111111111",
        "123",
        "12",
        "2025",
      );
      await paymentPage.payAndConfirmOrder();
      await assertNoInterstitialBlock(page);
    });

    await test.step("Verify order confirmation and download invoice", async () => {
      await paymentDonePage.verifyOrderPlaced();

      const invoiceDownload = await paymentDonePage.downloadInvoice();
      const filename = invoiceDownload.suggestedFilename();
      expect(filename).toMatch(/invoice/i);
      expect(await invoiceDownload.failure()).toBeNull();

      const invoicePath = testInfo.outputPath(filename);
      await invoiceDownload.saveAs(invoicePath);
      const invoiceContents = await readFile(invoicePath);
      expect(invoiceContents.length).toBeGreaterThan(0);
    });
  });
});