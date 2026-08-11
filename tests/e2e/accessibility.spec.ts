import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ROUTES } from './routes';

/**
 * §40 VERIFY — axe-core on every route, zero critical/serious violations.
 * The numeric "score >= 95" framing in the spec is Lighthouse's; axe-core
 * itself reports a pass/fail violation list, so the enforceable form of the
 * same requirement is: zero violations at critical or serious impact.
 */
for (const route of ROUTES) {
  test(`${route.label} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(route.path);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (blocking.length) {
      const detail = blocking
        .map((v) => `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
        .join('\n');
      throw new Error(`Accessibility violations on ${route.label}:\n${detail}`);
    }
  });
}
