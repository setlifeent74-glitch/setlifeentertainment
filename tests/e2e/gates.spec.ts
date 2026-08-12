import { test, expect } from '@playwright/test';

/**
 * §9 VERIFY — content readiness gates.
 *
 * The homepage-composition half of VERIFY §9 ("assert the homepage renders
 * cleanly with only Hero, Newsletter, and Footer... raise one section above
 * threshold, assert it appears in correct sequence position") can't be
 * exercised yet — §22-38 (Phase 6-8) don't exist as components to compose.
 * Re-verify that half at the end of Phase 8.
 *
 * What Phase 5 actually ships — the gate computation itself, and the admin
 * status display reading it — is fully testable now against
 * supabase/seed.sql's known, deterministic counts, which already exercise
 * both branches of the met/unmet boolean (current_issue and shop clear
 * their minimum; every placement-driven gate falls short of it) and the
 * shortfall arithmetic. An earlier version of this file additionally
 * inserted/deleted live fixture rows to watch a gate "flip" — cut after it
 * proved racy against this file's own read assertions running in a
 * different Playwright project (desktop/mobile) concurrently against the
 * same shared local Supabase instance. It didn't cover anything the static
 * seed-data cases below don't already prove.
 */

test.describe('§9 gate status — known seed data', () => {
  test('admin page reports the exact met/unmet state seed.sql produces, zero console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/admin/gates');

    // Met: §23 (1 current issue) and §35 (1 published product).
    for (const id of ['current_issue', 'shop']) {
      await expect(page.locator(`tr[data-gate-id="${id}"]`)).toHaveAttribute('data-gate-met', 'true');
    }

    // Unmet: everything placement-driven falls short of its §9 minimum
    // with this seed data (0 or 1 post against thresholds of 1-5).
    for (const id of [
      'today',
      'spotlight_feature',
      'call_sheet',
      'below_the_line',
      'fresh_face',
      'production',
      'cut',
      'screening_room',
      'behind_the_lens',
      'opportunity',
      'festival',
      'set_life_100',
    ]) {
      await expect(page.locator(`tr[data-gate-id="${id}"]`)).toHaveAttribute('data-gate-met', 'false');
    }

    expect(errors, `console/page errors on /admin/gates: ${errors.join(', ')}`).toEqual([]);
  });

  test('below_the_line shortfall is exactly minimum minus current (3 - 1 = 2)', async ({ page }) => {
    await page.goto('/admin/gates');
    const row = page.locator('tr[data-gate-id="below_the_line"]');
    await expect(row).toContainText('needs 2 more');
    await expect(row.locator('td').nth(2)).toHaveText('1');
    await expect(row.locator('td').nth(3)).toHaveText('3');
  });
});
