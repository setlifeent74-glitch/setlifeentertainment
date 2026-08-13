import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * §45 VERIFY — admin CMS. Uses the storageState the `setup` project
 * produces (tests/e2e/auth.setup.ts, logged in with the local-dev seeded
 * credential from supabase/seed.sql).
 *
 * Scope note: §45's VERIFY also asks to confirm role_line/credits/pull
 * quote/platform badges "render correctly on the public page." That
 * rendering is §46's job (Phase 10 — full editorial reading experience,
 * not yet built). This phase's admin editor does save/persist those meta
 * fields correctly (asserted below via the round-trip on the edit page);
 * their public-page rendering is verified once Phase 10 builds it.
 */

const IMAGE_FIXTURE = path.resolve(__dirname, '../../public/assets/IMG_1875.jpg');

test.describe('§45 admin CMS — access control', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('unauthenticated /admin redirects to login, no content leakage', async ({ page }) => {
    const response = await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('.admin-tile-grid')).toHaveCount(0);
  });

  test('unauthenticated /admin/posts redirects to login', async ({ page }) => {
    await page.goto('/admin/posts');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('§45 admin CMS — full editorial workflow', () => {
  test('create, publish, edit, unpublish a Fresh Faces post; revision history captured', async ({ page }, testInfo) => {
    // Desktop-only: this isn't testing responsive layout, and running the
    // same write-heavy sequence from both viewport projects concurrently
    // against the one shared local Supabase instance is racy (the same
    // class of flakiness noted in gates.spec.ts's own comment) — confirmed
    // directly, this test is reliable solo and flaky only when both
    // projects run it at once.
    test.skip(testInfo.project.name !== 'desktop-1440', 'admin workflow verified once, desktop-only, to avoid concurrent-write contention on shared local Supabase');
    // This is a long, many-step sequential workflow (image upload, several
    // form fields, two full save round-trips) — give it more headroom than
    // the 30s default so it isn't borderline on a loaded CI runner.
    test.setTimeout(60_000);

    const unique = Date.now();
    const title = `E2E Fresh Face ${unique}`;

    await page.goto('/admin');
    await expect(page.locator('.admin-tile-grid')).toBeVisible();

    const freshFacesTile = page.locator('.admin-tile', { hasText: 'Fresh Faces' });
    await freshFacesTile.getByRole('link', { name: 'Add to this section' }).click();
    await expect(page).toHaveURL(/\/admin\/posts\/new\?placement=fresh_face&category=spotlight/);

    await page.locator('.admin-editor-title').fill(title);
    await page.locator('#post-dek').fill('E2E test dek.');

    const editorBody = page.locator('.admin-editor-body .ProseMirror');
    const h2Button = page.locator('.admin-editor-toolbar button', { hasText: 'H2' });

    // Type all three blocks as plain paragraphs first, then click back into
    // the first two individually to convert them to H2 — StarterKit's
    // TrailingNode extension (always keeps an editable paragraph after a
    // heading) moves the cursor unpredictably if you toggle the heading
    // before typing into it, so heading-ifying after the fact, per block,
    // is the reliable sequence (confirmed by direct DOM inspection).
    await editorBody.click();
    await page.keyboard.insertText('First Section Header');
    await page.keyboard.press('Enter');
    await page.keyboard.insertText('Second Section Header');
    await page.keyboard.press('Enter');
    await page.keyboard.insertText('Body paragraph for the E2E test post.');

    await editorBody.getByText('First Section Header', { exact: true }).click();
    await h2Button.click();
    await editorBody.getByText('Second Section Header', { exact: true }).click();
    await h2Button.click();

    // Inline image upload via the toolbar's file input (drag-and-drop isn't
    // simulable through Playwright's input events the same way).
    await page.locator('.admin-editor-image-btn input[type="file"]').setInputFiles(IMAGE_FIXTURE);
    await expect(editorBody.locator('img')).toBeVisible({ timeout: 15_000 });

    // Spotlight meta fields — role_line, 3+ credits, 2+ platform badges.
    await page.getByLabel(/Role Line/).fill('Actress. Producer.');
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: '+ Add Credit' }).click();
    }
    const creditRows = page.locator('.admin-credits-row');
    await expect(creditRows).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await creditRows.nth(i).locator('input').nth(0).fill(`Project ${i + 1}`);
      await creditRows.nth(i).locator('input').nth(1).fill('2026');
    }
    await page.getByLabel('Tubi').check();
    await page.getByLabel('Prime Video').check();

    await page.getByRole('button', { name: 'Publish' }).click();
    // Allow 60 s — save + publish each call revalidatePath("/") which triggers
    // a full cache invalidation pass on a loaded CI runner. 30 s proved
    // insufficient (Saving… → Publishing… seen but not resolving to Published).
    await expect(page.locator('.admin-editor-status')).toHaveText('Published', { timeout: 60_000 });
    await expect(page).toHaveURL(/\/admin\/posts\/[0-9a-f-]+$/);
    await expect(page.locator('.admin-status-badge')).toHaveText('Published');

    const url = page.url();
    const postId = url.split('/').pop()!;

    // Live on the homepage in its section.
    await page.goto('/');
    await expect(page.getByText(title)).toBeVisible({ timeout: 15_000 });

    // Live at /story/[slug] — slug was auto-derived from the title.
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await page.goto(`/story/${slug}`);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.getByText('First Section Header')).toBeVisible();
    await expect(page.getByText('Second Section Header')).toBeVisible();
    await expect(page.getByText('Body paragraph for the E2E test post.')).toBeVisible();
    await expect(page.locator('article img').first()).toBeVisible();

    // Edit — confirm propagation.
    await page.goto(`/admin/posts/${postId}`);
    const editedTitle = `${title} EDITED`;
    await page.locator('.admin-editor-title').fill(editedTitle);
    await page.getByRole('button', { name: 'Save Draft' }).click();
    await expect(page.locator('.admin-editor-status')).toHaveText('Saved', { timeout: 10_000 });

    await page.goto(`/story/${slug}`);
    await expect(page.locator('h1')).toHaveText(editedTitle);

    // Meta fields round-trip — role_line/credits/badges persisted correctly
    // (public rendering of these is §46/Phase 10, not yet built).
    await page.goto(`/admin/posts/${postId}`);
    await expect(page.getByLabel(/Role Line/)).toHaveValue('Actress. Producer.');
    await expect(page.locator('.admin-credits-row')).toHaveCount(3);
    await expect(page.getByLabel('Tubi')).toBeChecked();
    await expect(page.getByLabel('Prime Video')).toBeChecked();

    // Revision history captured on every save (create + edit = 2+ entries).
    await expect(page.locator('.admin-revision-list li')).toHaveCount(2, { timeout: 5_000 });

    // Unpublish — confirm removal from both surfaces.
    await page.getByRole('button', { name: 'Unpublish' }).click();
    await expect(page.locator('.admin-editor-status')).toHaveText('Unpublished', { timeout: 10_000 });
    await expect(page.locator('.admin-status-badge')).toHaveText('Draft');

    await page.goto('/');
    await expect(page.getByText(editedTitle)).toHaveCount(0);

    const storyResponse = await page.goto(`/story/${slug}`);
    expect(storyResponse?.status()).toBe(404);
  });
});

test.describe('§45.1 admin editor sidebar — fieldset overflow regression', () => {
  test('News category Details panel does not overflow the sidebar at 1440x900, and shares edges with Hero Image / SEO', async ({
    page,
  }) => {
    // §45.1 real bug, fixed twice: a <fieldset> (.admin-meta-panel) carries
    // a browser-default min-width sized to its own content, which
    // width:100% alone does not override inside a flex column — News has
    // the longest known category-hint label, so it's the one that actually
    // exercises the bug (a short-labeled category could pass without the
    // fix present). First fix attempt (width:100%/box-sizing:border-box
    // alone) did not resolve it; min-width:0 + overflow-wrap on the label
    // did. Separately found in the same audit: fieldsets also carry a
    // browser-default margin, which misaligned this panel from its
    // non-fieldset sibling (.admin-hero-upload) by a couple of pixels even
    // after the overflow itself was fixed — reset to margin:0 too.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/admin/posts/new?category=news');

    const sidebar = page.locator('.admin-editor-sidebar');
    const heroUpload = page.locator('.admin-hero-upload');
    const detailsPanel = page.locator('.admin-meta-panel').first();
    const seoPanel = page.locator('.admin-meta-panel').last();
    await expect(detailsPanel.locator('legend')).toHaveText('Details');
    await expect(seoPanel.locator('legend')).toHaveText('SEO');

    const sidebarBox = await sidebar.boundingBox();
    const heroBox = await heroUpload.boundingBox();
    const detailsBox = await detailsPanel.boundingBox();
    const seoBox = await seoPanel.boundingBox();
    if (!sidebarBox || !heroBox || !detailsBox || !seoBox) throw new Error('one or more sidebar boxes not found');

    const EPS = 1;
    expect(Math.abs(heroBox.x - detailsBox.x)).toBeLessThanOrEqual(EPS);
    expect(Math.abs(detailsBox.x - seoBox.x)).toBeLessThanOrEqual(EPS);
    expect(Math.abs(heroBox.x + heroBox.width - (detailsBox.x + detailsBox.width))).toBeLessThanOrEqual(EPS);
    expect(Math.abs(detailsBox.x + detailsBox.width - (seoBox.x + seoBox.width))).toBeLessThanOrEqual(EPS);
    expect(detailsBox.x + detailsBox.width).toBeLessThanOrEqual(sidebarBox.x + sidebarBox.width + EPS);
    expect(detailsBox.x).toBeGreaterThanOrEqual(sidebarBox.x - EPS);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
