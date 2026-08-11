import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * Visual regression baseline (§49.1 table: "Playwright screenshots at
 * 1440x900 and 390x844 — every PR"). Runs only in the two viewport projects
 * defined in playwright.config.ts.
 *
 * First run: `npm run test:e2e:update-snapshots` to commit the baselines.
 */
for (const route of ROUTES) {
  test(`${route.label} matches visual baseline`, async ({ page }) => {
    await page.goto(route.path);
    // Marquee animation makes full-page screenshots nondeterministic; freeze it.
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }`,
    });
    const heroVideo = page.locator('#heroVideo');
    const mask = [];
    if (await heroVideo.count()) {
      // Pinning currentTime to an exact frame isn't reliable across
      // environments — seek timing and keyframe rounding differ between
      // local runs and the CI runner (confirmed: passed locally and in a
      // matching Docker container, then failed on GitHub Actions with a
      // 3-4% pixel diff isolated to index.html). Mask the video out of the
      // comparison instead, as is standard for video/canvas content in
      // visual regression — everything else on the page still gets a real
      // pixel diff.
      await heroVideo.evaluate((v: HTMLVideoElement) => v.pause());
      mask.push(heroVideo);
    }
    await expect(page).toHaveScreenshot(`${route.label}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      mask,
    });
  });
}
