import type { Page } from '@playwright/test';

export async function assertNoInterstitialBlock(page: Page): Promise<void> {
  const title = await page.title().catch(() => '');
  const bodySnippet = await page
    .locator('body')
    .innerText({ timeout: 9000 })
    .catch(() => '');

  if (
    /one moment, please/i.test(title) ||
    /one moment, please/i.test(bodySnippet) ||
    /checking your browser/i.test(bodySnippet)
  ) {
    throw new Error(
      'EXTERNAL_INTERSTITIAL_BLOCK: Target site served anti-bot challenge screen before application load.',
    );
  }
}

export async function gotoAndVerify(page: Page, path: string = '/'): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await assertNoInterstitialBlock(page);
}