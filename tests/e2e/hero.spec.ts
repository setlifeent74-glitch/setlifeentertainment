import { test, expect, type TestInfo } from '@playwright/test';

/**
 * §17 Hero — Full Viewport, §17.1 Hero Intro, §43 Master Gate.
 * Viewport-specific assertions run once per Playwright project
 * (desktop-1440 / mobile-390 — see playwright.config.ts).
 *
 * §42.1 — mobile portrait has a deliberately different hero contract:
 * the nav is in document flow (not overlaid on the video), the video
 * renders at native 16:9 ratio (not full-viewport-height), and §17.1
 * is visible without scrolling. The tests below branch on this where
 * the two contracts differ.
 */

function isMobile(testInfo: TestInfo) {
  return testInfo.project.name === 'mobile-390';
}

test.describe('§17 hero — composition', () => {
  test('hero contains exactly video, controls and (desktop) scroll indicator — no copy over video', async ({ page }, testInfo) => {
    await page.goto('/');
    const hero = page.locator('.hero-video');

    await expect(hero.locator('#heroVideo')).toBeVisible();
    await expect(hero.locator('.hero-controls')).toBeVisible();
    await expect(page.locator('[data-testid="global-nav"]')).toBeVisible();

    if (!isMobile(testInfo)) {
      // Desktop: nav is overlaid inside .hero-video; scroll indicator present.
      await expect(hero.locator('[data-testid="global-nav"]')).toBeVisible();
      await expect(hero.locator('.hero-scroll')).toBeVisible();
    }

    // §17.1 VERIFY: zero text nodes in the hero section that aren't
    // nav/control/scroll-cue content. The mobile panel (#mobile-nav-panel)
    // is a Fragment sibling of <header> but is rendered by GlobalNav which
    // lives inside .hero-video — its link text is navigation content, same
    // class as nav links, so it's in the allowed-ancestor list.
    const strayText = await hero.evaluate((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      // §6.1 save-data play affordance is a functional control glyph.
      const allowedAncestor = (node: Node) =>
        (node.parentElement?.closest(
          '[data-testid="global-nav"], #mobile-nav-panel, .hero-controls, .hero-scroll, .hero-play-affordance'
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

  test('desktop: video fills the full viewport, §17.1 not visible before scroll', async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), '§42.1 — mobile portrait has a different hero contract, tested separately below');
    await page.goto('/');
    const videoBox = await page.locator('#heroVideo').boundingBox();
    const viewport = page.viewportSize()!;
    expect(videoBox).not.toBeNull();
    expect(Math.round(videoBox!.height)).toBeGreaterThanOrEqual(viewport.height - 2);
    expect(Math.round(videoBox!.width)).toBeGreaterThanOrEqual(viewport.width - 2);

    const introTop = await page.locator('.hero-intro').evaluate((el) => el.getBoundingClientRect().top);
    expect(introTop).toBeGreaterThanOrEqual(viewport.height - 2);
  });

  test('§42.1 mobile portrait: video at native 16:9, nav opaque in flow, §17.1 visible without scroll', async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo), 'mobile portrait contract only — §17 full-bleed applies on desktop');
    await page.goto('/');
    const viewport = page.viewportSize()!;
    const videoBox = await page.locator('#heroVideo').boundingBox();
    expect(videoBox).not.toBeNull();

    // Video fills full width at native 16:9 — not full-viewport-height
    expect(Math.round(videoBox!.width)).toBeGreaterThanOrEqual(viewport.width - 2);
    const expectedHeight = Math.round(viewport.width * 9 / 16);
    expect(Math.round(videoBox!.height)).toBeGreaterThanOrEqual(expectedHeight - 4);
    expect(Math.round(videoBox!.height)).toBeLessThan(viewport.height - 10);

    // §42.1 — nav is `position:static` in document flow, not `position:absolute`
    // overlaid on the video. Confirm via computed style, not DOM position
    // (the header is still a DOM child of .hero-video, but CSS makes it in-flow).
    const navPosition = await page.locator('[data-testid="global-nav"]').evaluate(
      (el) => getComputedStyle(el).position
    );
    expect(navPosition).toBe('static');

    // Nav background is opaque (--black), not transparent
    const navBg = await page.locator('[data-testid="global-nav"]').evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    // rgb(10,10,10) = --black; must not be rgba(0,0,0,0) transparent
    expect(navBg).not.toBe('rgba(0, 0, 0, 0)');

    // §17.1 is visible without scrolling — by design under §42.1
    const introTop = await page.locator('.hero-intro').evaluate((el) => el.getBoundingClientRect().top);
    expect(introTop).toBeLessThan(viewport.height);
  });

  test('§17.1 reveal fires on scroll-in via intersection, not on load', async ({ page }, testInfo) => {
    // §42.1 — on mobile portrait §17.1 is immediately in-viewport by design
    // (the hero is ~220px tall, not full-screen), so the IntersectionObserver
    // fires on load. That is correct behaviour; this assertion only applies
    // on desktop where §17.1 starts below the fold.
    test.skip(isMobile(testInfo), '§42.1 — §17.1 is intentionally in-viewport on mobile portrait without scrolling');
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
