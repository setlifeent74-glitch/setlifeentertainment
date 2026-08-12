import { test, expect } from '@playwright/test';

/**
 * §9 VERIFY — content readiness gates.
 *
 * Fully testable against supabase/seed.sql's known, deterministic counts,
 * which exercise both branches of the met/unmet boolean and the shortfall
 * arithmetic. An earlier version of this file additionally inserted/deleted
 * live fixture rows to watch a gate "flip" — cut after it proved racy
 * against this file's own read assertions running in a different
 * Playwright project (desktop/mobile) concurrently against the same shared
 * local Supabase instance. It didn't cover anything the static seed-data
 * cases below don't already prove.
 */

test.describe('§9 gate status — known seed data', () => {
  test('admin page reports the exact met/unmet state seed.sql produces, zero console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/admin/gates');

    // Met: §22 (3 today posts), §23 (1 current issue), §26 (3 crew posts),
    // §27 (4 fresh faces), §35 (1 published product).
    for (const id of ['today', 'current_issue', 'below_the_line', 'fresh_face', 'shop']) {
      await expect(page.locator(`tr[data-gate-id="${id}"]`)).toHaveAttribute('data-gate-met', 'true');
    }

    // Unmet: everything else falls short of its §9 minimum with this seed data.
    for (const id of [
      'spotlight_feature',
      'call_sheet',
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

  test('spotlight_feature shortfall is exactly minimum minus current (1 - 0 = 1)', async ({ page }) => {
    await page.goto('/admin/gates');
    const row = page.locator('tr[data-gate-id="spotlight_feature"]');
    await expect(row).toContainText('needs 1 more');
    await expect(row.locator('td').nth(2)).toHaveText('0');
    await expect(row.locator('td').nth(3)).toHaveText('1');
  });

  test('call_sheet: count meets the minimum but the newest item is stale — gate still unmet, with a staleness note', async ({
    page,
  }) => {
    await page.goto('/admin/gates');
    const row = page.locator('tr[data-gate-id="call_sheet"]');
    await expect(row).toHaveAttribute('data-gate-met', 'false');
    // Count (5) already satisfies the raw minimum (5) — proves this is
    // specifically the staleness rule rejecting it, not a shortfall.
    await expect(row.locator('td').nth(2)).toHaveText('5');
    await expect(row).toContainText(/\d+ days old/);
  });
});
