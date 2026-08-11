import { test, expect } from '@playwright/test';

/**
 * §42 VERIFY — zero horizontal overflow at every specified mobile width.
 * Runs once per width regardless of project viewport, since it needs the
 * exact widths from the spec rather than the two project defaults.
 */
const widths = [430, 414, 393, 390, 375, 360];
const routes = ['index.html', 'issues.html', 'about.html', 'submit.html', 'contact.html'];

for (const route of routes) {
  for (const width of widths) {
    test(`${route} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/${route}`);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      expect(overflow.scrollWidth).toBe(overflow.innerWidth);
    });
  }
}
