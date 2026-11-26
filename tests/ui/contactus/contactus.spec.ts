import { test, expect } from '../../../src/fixtures/testFixtures.js';
import { assertNoInterstitialBlock, gotoAndVerify } from '../../../src/utils/navigation.js';


test.describe('Contact Us', () => {
    test('@AE-19 @ui @contactussubmits the contact us form successfully', async ({ page, contactUsPage }) => {
        await gotoAndVerify(page, '/contact_us');
        await assertNoInterstitialBlock(page);
        await contactUsPage.fillContactFormAndSubmit('Test User', 'test.user@example.com',
            'Question about an order', 'I would like to ask a question about my order.',
            'C:/Users/HP/Desktop/testfile.txt');
        await contactUsPage.verifySuccessMessage();
    });
});
