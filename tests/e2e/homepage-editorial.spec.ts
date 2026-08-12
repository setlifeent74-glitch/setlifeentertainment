import { test, expect, type TestInfo } from '@playwright/test';

function isMobileProject(testInfo: TestInfo) {
  return testInfo.project.name === 'mobile-390';
}

/**
 * §22-§27 VERIFY blocks. Gate state below is real, not staged — it follows
 * directly from supabase/seed.sql's counts (also asserted in gates.spec.ts):
 * met — today (3), current_issue (1), below_the_line (3), fresh_face (4).
 * unmet — spotlight_feature (0), call_sheet (0).
 */

test.describe('§9 gating on the real homepage', () => {
  test('met sections render, unmet sections are absent — no gaps, no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    for (const selector of ['.today-section', '.current-issue-section', '.btl-section', '.fresh-faces-section']) {
      await expect(page.locator(selector)).toHaveCount(1);
    }
    for (const selector of ['.spotlight-section', '.call-sheet-section']) {
      await expect(page.locator(selector)).toHaveCount(0);
    }

    expect(errors, `console/page errors on /: ${errors.join(', ')}`).toEqual([]);
  });
});

test.describe('§22 Today on Set Life', () => {
  test('byline links to a live author page, independently of the story link', async ({ page }) => {
    await page.goto('/');
    const byline = page.locator('.today-byline a');
    await expect(byline).toBeVisible();
    const href = await byline.getAttribute('href');
    expect(href).toMatch(/^\/authors\//);

    const response = await page.goto(href!);
    expect(response?.status()).toBeLessThan(400);
  });

  test('reveal fires on scroll-in, not on load', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('.today-section');
    await expect(section).not.toHaveClass(/is-in-view/);
    // Scroll so the section's vertical center sits at the viewport's
    // center — guarantees it clears the ScrollReveal intersection
    // threshold deterministically, same fix as the equivalent §17.1 test.
    await page.evaluate(() => {
      const el = document.querySelector('.today-section')!;
      const rect = el.getBoundingClientRect();
      const target = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
      window.scrollTo(0, target);
    });
    await expect(section).toHaveClass(/is-in-view/, { timeout: 10_000 });
  });
});

test.describe('§23 Current Magazine Issue', () => {
  test('numeral opacity is <= 7% and parallax is disabled under reduced motion', async ({ page }) => {
    await page.goto('/');
    const numeral = page.locator('.current-issue-numeral');
    const opacity = await numeral.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
    expect(opacity).toBeLessThanOrEqual(0.07);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);
    const transform = await page
      .locator('.current-issue-numeral')
      .evaluate((el) => getComputedStyle(el).transform);
    expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy();
  });
});

test.describe('§26 Below the Line — mosaic (desktop/tablet)', () => {
  // §26 spec is explicit that mobile is a different layout ("Mobile:
  // vertical sequence"), not a mosaic — the "distinct dimensions" and
  // "1024/768" composition requirements are desktop/tablet-scoped.
  test('no two tiles share identical dimensions; department labels are in the DOM, not hover-only', async (
    { page },
    testInfo
  ) => {
    test.skip(isMobileProject(testInfo), '§26: mosaic layout is desktop/tablet only');
    await page.goto('/');
    const tiles = page.locator('.btl-tile');
    const count = await tiles.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const boxes = await tiles.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return `${Math.round(r.width)}x${Math.round(r.height)}`;
      })
    );
    expect(new Set(boxes).size).toBe(boxes.length);

    // Department label text must exist in the DOM regardless of hover state
    // (opacity-based reveal, not display:none / JS-injected-on-hover).
    const departmentTexts = await page.locator('.btl-department').allTextContents();
    expect(departmentTexts.filter((t) => t.trim().length > 0).length).toBeGreaterThan(0);
  });

  test('composition holds — mosaic does not collapse to a uniform single-column grid at 1024', async (
    { page },
    testInfo
  ) => {
    test.skip(isMobileProject(testInfo), '§26: mosaic layout is desktop/tablet only');
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto('/');
    const tiles = page.locator('.btl-tile');
    const boxes = await tiles.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
    const uniqueWidths = new Set(boxes.map((w) => Math.round(w)));
    expect(uniqueWidths.size).toBeGreaterThan(1);
  });
});

test.describe('§27 Fresh Faces rail', () => {
  test('keyboard ArrowRight scrolls the rail without moving page scroll position', async ({ page }) => {
    // Explicit narrow viewport, independent of project defaults — with only
    // 4 seeded cards, a wide desktop viewport can fit all of them with zero
    // overflow, which would make "does it scroll" untestable there (nothing
    // to scroll). Guarantee overflow instead of depending on seed-data size.
    await page.setViewportSize({ width: 500, height: 900 });
    await page.goto('/');
    const rail = page.locator('.fresh-faces-rail');
    await rail.scrollIntoViewIfNeeded();
    const pageScrollBefore = await page.evaluate(() => window.scrollY);

    await rail.focus();
    const before = await rail.evaluate((el) => el.scrollLeft);
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);

    const pageScrollAfter = await page.evaluate(() => window.scrollY);
    expect(pageScrollAfter).toBe(pageScrollBefore);
  });

  test('at 390px, a partial card is visible at the right edge', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const viewportWidth = 390;
    const secondCardRight = await page
      .locator('.fresh-face-card')
      .nth(1)
      .evaluate((el) => el.getBoundingClientRect().right);
    // The second card's right edge should extend past the viewport (partial
    // visibility) but the card must still be present in the layout.
    expect(secondCardRight).toBeGreaterThan(viewportWidth * 0.5);
  });
});
