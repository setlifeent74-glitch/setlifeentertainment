import { defineConfig, devices } from '@playwright/test';

/**
 * Phase 1 (§49) — harness points at the Next.js production build (`next
 * start`), matching what Vercel actually deploys. `npm run build` must run
 * first — the CI workflow does this as its own step; locally, run it once
 * before `npx playwright test`, or use `npm run test:e2e` which does both.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Playwright's bundled Chromium is an open-source build without H.264
    // decode support — the hero video's <video>/canPlayType reports
    // NETWORK_NO_SOURCE and play() hangs forever. Real Google Chrome (the
    // browser actual users run) supports it. Requires
    // `playwright install chrome`, not the default `chromium`.
    channel: 'chrome',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'desktop-1440',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-390',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
  ],
});
