import { test, expect, type Page, type TestInfo } from '@playwright/test';

/**
 * §16 Global Navigation — VERIFY block.
 */

// WCAG relative-luminance contrast ratio from two "rgb(r, g, b)" strings.
function contrastRatio(fg: string, bg: string): number {
  const parse = (c: string) => c.match(/\d+(\.\d+)?/g)!.map(Number);
  const luminance = ([r, g, b]: number[]) => {
    const chan = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
  };
  const L1 = luminance(parse(fg));
  const L2 = luminance(parse(bg));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function isMobileProject(testInfo: TestInfo) {
  return testInfo.project.name === 'mobile-390';
}

async function primaryLinks(page: Page) {
  return page.locator('.nav-primary a, .nav-mega-trigger');
}

test.describe('§16 nav — link map resolves, no dead links', () => {
  const linkMap: Array<[string, string]> = [
    ['Magazine', '/issues'],
    ['Film & TV', '/category/article'],
    ['Spotlights', '/category/spotlight'],
    ['Reviews', '/category/review'],
    ['Watch', '/category/video'],
    ['Industry News', '/category/news'],
    ['Opportunities', '/opportunities'],
    ['Festivals', '/festivals'],
    ['Production', '/category/production'],
    ['Shop', '/shop'],
    ['Search', '/search'],
    ['Submit', '/submit'],
  ];

  for (const [label, path] of linkMap) {
    test(`${label} -> ${path} resolves, not a 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should not 404`).toBeLessThan(400);
      const body = await page.locator('body').innerText();
      expect(body.toLowerCase()).not.toContain('this page could not be found');
    });
  }
});

test.describe('§16 nav — scroll transition (homepage, desktop)', () => {
  test('transparent over video at scroll 0, opaque + shorter at scroll 200', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo), '§16: mobile nav is a fixed 72px bar, no scroll transition');
    await page.goto('/');
    const nav = page.locator('[data-testid="global-nav"]');
    const inner = page.locator('.top-nav-inner');
    const navScroll = () => nav.evaluate((el) => Number(getComputedStyle(el).getPropertyValue('--nav-scroll').trim() || '0'));

    // Hydration runs asynchronously after `load`; poll rather than assume
    // the effect has applied by the time goto() resolves.
    await expect.poll(navScroll, { timeout: 5000 }).toBeLessThan(0.2);
    const heightAtTop = await inner.evaluate((el) => el.getBoundingClientRect().height);
    expect(heightAtTop).toBeGreaterThan(80); // ~92px hero-state height

    await page.evaluate(() => window.scrollTo(0, 200));
    await expect.poll(navScroll, { timeout: 5000 }).toBeGreaterThan(0.9);

    const heightScrolled = await inner.evaluate((el) => el.getBoundingClientRect().height);
    expect(heightScrolled).toBeLessThan(heightAtTop);
  });
});

test.describe('§16 nav — desktop keyboard, focus, contrast, active state', () => {
  test('every primary nav link is reachable by Tab with a visible focus ring', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo), 'desktop nav row is hidden on mobile — see mobile menu describe block');
    await page.goto('/issues'); // solid nav, no hero video to fight for focus order
    const links = await primaryLinks(page);
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await link.focus();
      await expect(link).toBeFocused();
      const outline = await link.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(outline).not.toBe('none');
    }
  });

  test('Industry mega menu opens on click/Enter, traps Tab, closes on Escape and restores focus', async (
    { page },
    testInfo
  ) => {
    test.skip(isMobileProject(testInfo), 'mega menu only exists on desktop — mobile flattens Industry into the list');
    await page.goto('/issues');
    const trigger = page.locator('.nav-mega-trigger');
    await trigger.focus();
    await page.keyboard.press('Enter');

    const panel = page.locator('.nav-mega-panel');
    await expect(panel).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const links = panel.locator('a');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    await expect(links.first()).toBeFocused();

    // Shift+Tab from the first link should wrap to the last (focus trap).
    await page.keyboard.press('Shift+Tab');
    await expect(links.last()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('scrolled-state nav label contrast is >= 4.5:1 against nav ground', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo), 'color tokens are breakpoint-independent — checked once on desktop');
    await page.goto('/issues'); // always-solid nav
    const link = page.locator('.nav-primary a').first();
    const { fg, bg } = await link.evaluate((el) => {
      const style = getComputedStyle(el);
      const navEl = el.closest('.top-nav') as HTMLElement;
      return { fg: style.color, bg: getComputedStyle(navEl).backgroundColor };
    });
    const ratio = contrastRatio(fg, bg === 'rgba(0, 0, 0, 0)' ? 'rgb(10, 10, 10)' : bg);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('active state is carried by the underline, not color alone', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo), 'desktop nav row only — mobile active state checked separately');
    await page.goto('/issues');
    const activeLink = page.locator('.nav-primary a.active');
    await expect(activeLink).toHaveCount(1);
    const activeScaleX = await activeLink.evaluate((el) => getComputedStyle(el, '::after').transform);
    // scaleX(1) resolves to a non-identity matrix; scaleX(0) collapses to
    // matrix(0, 0, 0, 1, 0, 0) — either way this must not be "none".
    expect(activeScaleX).not.toBe('none');

    const inactiveLink = page.locator('.nav-primary a:not(.active)').first();
    const inactiveScaleX = await inactiveLink.evaluate((el) => getComputedStyle(el, '::after').transform);
    expect(inactiveScaleX).not.toBe(activeScaleX);
  });
});

test.describe('§16 nav — mobile full-screen menu', () => {
  test('hamburger opens a full-screen menu; Escape closes and restores focus', async ({ page }, testInfo) => {
    test.skip(!isMobileProject(testInfo), 'mobile-only surface');
    await page.goto('/issues');
    const toggle = page.locator('.nav-mobile-toggle');
    await expect(toggle).toBeVisible();
    await toggle.focus();
    await page.keyboard.press('Enter');

    const panel = page.locator('#mobile-nav-panel');
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.width).toBeGreaterThanOrEqual(viewport.width - 1);
    expect(box!.height).toBeGreaterThanOrEqual(viewport.height - 1);

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('every link map label is present and reachable in the mobile menu', async ({ page }, testInfo) => {
    test.skip(!isMobileProject(testInfo), 'mobile-only surface');
    await page.goto('/issues');
    await page.locator('.nav-mobile-toggle').click();
    const panel = page.locator('#mobile-nav-panel');
    for (const label of ['Magazine', 'Film & TV', 'Spotlights', 'Reviews', 'Watch', 'Industry News', 'Opportunities', 'Festivals', 'Production', 'Shop', 'Search', 'Submit']) {
      await expect(panel.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  });
});
