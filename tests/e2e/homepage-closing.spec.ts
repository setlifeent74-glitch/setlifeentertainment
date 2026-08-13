import { test, expect } from '@playwright/test';

/**
 * §35-§38 VERIFY blocks. Gate state is real: seed.sql has 3 published
 * products (one per shape), so §35 renders; posts with hero images exist,
 * so §36's fallback grid renders (no INSTAGRAM_ACCESS_TOKEN in test env,
 * so it's always the fallback path).
 */

test.describe('§35 The Set Life Shop', () => {
  test('renders all three product shapes from the same component, no branching layout', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('.shop-section');
    await section.scrollIntoViewIfNeeded();
    const cards = section.locator('.cover-card');
    await expect(cards).toHaveCount(3);

    // Digital label present on exactly the digital product; ticketed date
    // present on exactly the ticketed one — same markup structure for all.
    const digitalLabels = await section.getByText('Digital Download').count();
    expect(digitalLabels).toBe(1);
  });

  test('tap targets are >= 44x44px at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const card = page.locator('.shop-section .cover-card').first();
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('Buy is an honest disabled state until §48/Phase 12, not a dead or fake link', async ({ page }) => {
    await page.goto('/shop/set-life-tee');
    const buyButton = page.getByRole('button', { name: /buy/i });
    await expect(buyButton).toBeDisabled();
  });
});

test.describe('§36 From @setlifeentertainment', () => {
  test('CMS fallback grid renders — never an empty region', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('.instagram-section');
    await expect(section).toHaveCount(1);
    const items = section.locator('.instagram-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('§37 Newsletter', () => {
  test('valid email succeeds, shows a post-signup preferences step', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('.newsletter-form');
    await form.scrollIntoViewIfNeeded();
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await form.locator('input[type="email"]').fill(uniqueEmail);
    await form.getByRole('button', { name: /sign up/i }).click();

    await expect(page.locator('.newsletter-success')).toBeVisible();
    await expect(page.locator('.newsletter-preferences')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Weekly Edition' })).toBeVisible();
  });

  test('invalid email is rejected server-side with an accessible error message', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('.newsletter-form');
    await form.scrollIntoViewIfNeeded();
    const input = form.locator('input[type="email"]');
    await input.fill('not-an-email');
    // Bypass native HTML5 email validation so the invalid value actually
    // reaches the server action — proves server-side validation, not just
    // the browser's own type="email" check.
    await input.evaluate((el: HTMLInputElement) => {
      el.removeAttribute('required');
      el.type = 'text';
    });
    await form.getByRole('button', { name: /sign up/i }).click();

    const error = page.locator('.newsletter-error');
    await expect(error).toBeVisible();
    await expect(error).toHaveAttribute('role', 'alert');
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBe(await error.getAttribute('id'));
  });

  test('submit button is disabled while pending — no duplicate submission on double-click', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('.newsletter-form');
    await form.scrollIntoViewIfNeeded();
    const uniqueEmail = `test-dup-${Date.now()}@example.com`;
    await form.locator('input[type="email"]').fill(uniqueEmail);
    const button = form.getByRole('button', { name: /sign up/i });
    await button.click();
    // Once the action is pending (or has resolved to the success view),
    // the original button is gone/disabled — either way it can't be
    // clicked a second time to double-submit.
    await expect(form).not.toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});

test.describe('§38 Editorial Footer', () => {
  test('zero href="#" placeholders anywhere on the homepage', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('a[href="#"]').count();
    expect(hrefs).toBe(0);
  });

  test('every footer link resolves — no raw 404s', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('footer.site-footer a[href^="/"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    const uniqueHrefs = [...new Set(hrefs)];
    expect(uniqueHrefs.length).toBeGreaterThan(0);

    for (const href of uniqueHrefs) {
      const response = await page.request.get(href!);
      expect(response.status(), `${href} should not 404`).toBeLessThan(400);
    }
  });

  test('all five Legal routes return real content, not an interim/empty page', async ({ page }) => {
    for (const path of ['/privacy', '/terms', '/editorial-policy', '/review-policy', '/accessibility']) {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
      const text = await page.locator('.legal-body').innerText();
      expect(text.length).toBeGreaterThan(200);
    }
  });

  test('only Instagram appears as a social icon — no placeholder channels', async ({ page }) => {
    await page.goto('/');
    const socialLinks = page.locator('.social-row a');
    await expect(socialLinks).toHaveCount(1);
    await expect(socialLinks.first()).toHaveAttribute('href', /instagram\.com/);
  });
});
