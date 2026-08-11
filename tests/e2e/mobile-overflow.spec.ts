import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * §42 VERIFY — zero horizontal overflow at every specified mobile width.
 * Runs once per width regardless of project viewport, since it needs the
 * exact widths from the spec rather than the two project defaults.
 */
const widths = [430, 414, 393, 390, 375, 360];

for (const route of ROUTES) {
  for (const width of widths) {
    test(`${route.label} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route.path);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      expect(overflow.scrollWidth).toBe(overflow.innerWidth);
    });
  }
}
