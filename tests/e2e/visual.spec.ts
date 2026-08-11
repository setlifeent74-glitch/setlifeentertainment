import { test, expect } from '@playwright/test';

/**
 * Visual regression baseline (§49.1 table: "Playwright screenshots at
 * 1440x900 and 390x844 — every PR"). Runs only in the two viewport projects
 * defined in playwright.config.ts.
 *
 * First run: `npm run test:e2e:update-snapshots` to commit the baselines.
 */
const routes = ['index.html', 'issues.html', 'about.html', 'submit.html', 'contact.html'];

for (const route of routes) {
  test(`${route} matches visual baseline`, async ({ page }) => {
    await page.goto(`/${route}`);
    // Hero video autoplay + marquee animation make full-page screenshots
    // nondeterministic; freeze animations and pin the video to one frame
    // for a stable comparison.
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }`,
    });
    const heroVideo = page.locator('#heroVideo');
    if (await heroVideo.count()) {
      await heroVideo.evaluate((v: HTMLVideoElement) => {
        v.pause();
        v.currentTime = 0;
      });
    }
    await expect(page).toHaveScreenshot(`${route.replace('.html', '')}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
}
