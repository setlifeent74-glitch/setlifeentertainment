import { test, expect } from '@playwright/test';

/**
 * §17 VERIFY #4 — hero video controls, and the regression this harness exists
 * to prevent (§49.1): a prior production defect let a full-width transparent
 * nav overlay swallow pointer events intended for these buttons.
 */
test.describe('Hero video controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    // Autoplay video needs a moment to actually start in a headless browser.
    await page.locator('#heroVideo').evaluate((v: HTMLVideoElement) =>
      v.play().catch(() => {})
    );
  });

  test('restart sets currentTime to 0 and resumes playback', async ({ page }) => {
    const video = page.locator('#heroVideo');
    await video.evaluate((v: HTMLVideoElement) => {
      v.currentTime = 2;
    });

    await page.locator('#heroRestartBtn').click();

    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBeLessThan(0.5);
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
      .toBe(false);
  });

  test('pause stops playback', async ({ page }) => {
    const video = page.locator('#heroVideo');
    await page.locator('#heroPauseBtn').click();

    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
      .toBe(true);
  });

  test('mute toggle flips muted state and aria-pressed', async ({ page }) => {
    const video = page.locator('#heroVideo');
    const muteBtn = page.locator('#heroMuteToggle');

    await expect(video).toHaveJSProperty('muted', true);
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'false');

    await muteBtn.click();

    await expect(video).toHaveJSProperty('muted', false);
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('no element intercepts pointer events on the controls', async ({ page }) => {
    // Regression guard: elementFromPoint at each button's center must resolve
    // to the button (or a descendant), never an overlay sitting on top of it.
    for (const id of ['heroRestartBtn', 'heroPauseBtn', 'heroMuteToggle']) {
      const btn = page.locator(`#${id}`);
      const box = await btn.boundingBox();
      if (!box) throw new Error(`#${id} has no bounding box — not visible`);

      const hitId = await page.evaluate(
        ({ x, y }) => {
          const el = document.elementFromPoint(x, y);
          return el ? el.closest('button')?.id ?? el.id ?? el.tagName : null;
        },
        { x: box.x + box.width / 2, y: box.y + box.height / 2 }
      );

      expect(hitId).toBe(id);
    }
  });
});
