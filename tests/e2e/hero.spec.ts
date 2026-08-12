import { test, expect } from '@playwright/test';

/**
 * §17 Hero — Full Viewport, §17.1 Hero Intro, §43 Master Gate.
 * Viewport-specific assertions run once per Playwright project
 * (desktop-1440 / mobile-390 — see playwright.config.ts).
 */

test.describe('§17 hero — composition', () => {
  test('hero contains exactly video, nav, controls, scroll indicator — no copy over video', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('.hero-video');

    await expect(hero.locator('#heroVideo')).toBeVisible();
    await expect(hero.locator('[data-testid="global-nav"]')).toBeVisible();
    await expect(hero.locator('.hero-controls')).toBeVisible();
    await expect(hero.locator('.hero-scroll')).toBeVisible();

    // §17.1 VERIFY: zero text nodes in the hero beyond nav links, control
    // aria-labels, and the scroll cue.
    const strayText = await hero.evaluate((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      // §6.1 save-data play affordance is a functional control glyph, same
      // category as the three hero-controls icons — not editorial copy.
      const allowedAncestor = (node: Node) =>
        (node.parentElement?.closest(
          '[data-testid="global-nav"], .hero-controls, .hero-scroll, .hero-play-affordance'
        ) ?? null) !== null;
      const stray: string[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        const text = n.textContent?.trim();
        if (text && !allowedAncestor(n)) stray.push(text);
      }
      return stray;
    });
    expect(strayText, `unexpected text nodes directly in the hero: ${strayText.join(', ')}`).toEqual([]);
  });

  test('video fills the full viewport, no §17.1/§22 visible before scroll', async ({ page }) => {
    await page.goto('/');
    const videoBox = await page.locator('#heroVideo').boundingBox();
    const viewport = page.viewportSize()!;
    expect(videoBox).not.toBeNull();
    expect(Math.round(videoBox!.height)).toBeGreaterThanOrEqual(viewport.height - 2);
    expect(Math.round(videoBox!.width)).toBeGreaterThanOrEqual(viewport.width - 2);

    const introTop = await page.locator('.hero-intro').evaluate((el) => el.getBoundingClientRect().top);
    expect(introTop).toBeGreaterThanOrEqual(viewport.height - 2);
  });

  test('§17.1 reveal fires on scroll-in via intersection, not on load', async ({ page }) => {
    await page.goto('/');
    const intro = page.locator('.hero-intro');
    // Immediately after load, before any scroll, the block must not have
    // already revealed — it should still be off-screen and unrevealed.
    await expect(intro).not.toHaveClass(/is-in-view/);

    // Scroll so the block's vertical center sits at the viewport's center —
    // guarantees it clears the 0.3 IntersectionObserver threshold
    // deterministically, rather than relying on scrollIntoViewIfNeeded's
    // minimal "just barely visible" alignment.
    await page.evaluate(() => {
      const el = document.querySelector('.hero-intro')!;
      const rect = el.getBoundingClientRect();
      const target = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
      window.scrollTo(0, target);
    });
    await expect(intro).toHaveClass(/is-in-view/, { timeout: 10_000 });
  });
});

test.describe('§17 VERIFY #5 — playback begins on a throttled connection', () => {
  test('video reaches HAVE_CURRENT_DATA on Fast 3G without a full download', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'CDP network emulation is Chromium-only');
    const client = await page.context().newCDPSession(page);
    // Fast 3G, per Lighthouse's own throttling profile.
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150,
    });

    await page.goto('/');
    const video = page.locator('#heroVideo');
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState), { timeout: 15_000 })
      .toBeGreaterThanOrEqual(2); // HAVE_CURRENT_DATA
  });
});

test.describe('§43 Master Gate — first-screen acceptance', () => {
  test('screenshot immediately post-load contains only the permitted hero elements', async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }`,
    });
    const heroVideo = page.locator('#heroVideo');
    await heroVideo.evaluate((v: HTMLVideoElement) => v.pause());

    await expect(page).toHaveScreenshot('master-gate-first-screen.png', {
      clip: { x: 0, y: 0, width: page.viewportSize()!.width, height: page.viewportSize()!.height },
      maxDiffPixelRatio: 0.02,
      mask: [heroVideo],
    });
  });
});
