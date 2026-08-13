import { test as setup, expect } from '@playwright/test';

/**
 * §45 — logs in once with the local-dev seeded admin credential
 * (supabase/seed.sql) and saves the session so every other spec that needs
 * an authenticated /admin/* view can reuse it via `storageState`, instead
 * of re-logging-in per test.
 */
const authFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill('admin@setlifeentertainment.local');
  await page.getByLabel('Password').fill('SetLifeAdminLocal2026!');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL('/admin');
  await page.context().storageState({ path: authFile });
});
