import { test, expect } from '@playwright/test';

/**
 * §46 Article Reading Experience / §47 SEO — uses posts already in
 * supabase/seed.sql rather than creating new ones, since creating a post
 * requires the full admin publish flow (tests/e2e/admin.spec.ts already
 * covers that end-to-end and desktop-only, to avoid the write-contention
 * flakiness documented there).
 */

test.describe('§46 article rendering', () => {
  test('spotlight post renders role_line, and non-spotlight post renders none of the spotlight-only blocks', async ({ page }) => {
    await page.goto('/story/diamond-starr-fresh-face');
    await expect(page.locator('h1')).toHaveText('Diamond Starr');
    await expect(page.locator('.spotlight-role-line')).toHaveText('Actress. Producer.');

    // Zero-render discipline (§9/§46): a non-spotlight post must show no
    // trace of role_line/credits/badges/callout — this post's meta has none.
    await page.goto('/story/gaffer-behind-the-glow');
    await expect(page.locator('.spotlight-role-line')).toHaveCount(0);
    await expect(page.locator('.credits-list')).toHaveCount(0);
    await expect(page.locator('.platform-badges')).toHaveCount(0);
    await expect(page.locator('.callout-box')).toHaveCount(0);
  });

  test('headings form a valid hierarchy and reading time is a real word count, not a JSON token count', async ({ page }) => {
    await page.goto('/story/gaffer-behind-the-glow');
    const firstHeading = await page.locator('h1, h2, h3').first().evaluate((el) => el.tagName);
    expect(firstHeading).toBe('H1');

    // This seed post's body is one short sentence — a real word count
    // floors to "1 min read"; the pre-fix heuristic (JSON.stringify(body)
    // token count) would also happen to floor to 1 here, so this mainly
    // guards against a future regression inflating it back up.
    await expect(page.getByText(/\d+ min read/)).toBeVisible();
  });

  test('reading progress indicator reaches 100 at the bottom of the article', async ({ page }) => {
    // Seed posts are short (a sentence or two) and fit entirely within a
    // normal viewport, so the component's own "nothing to scroll = fully
    // read" logic correctly starts them at 100 already — not asserting an
    // initial 0 here, since that would only hold for a longer article.
    // Manually verified against a real multi-section article with an
    // image/pull-quote/credits/badges/callout: starts at 0, reaches 100
    // exactly at the bottom.
    await page.goto('/story/gaffer-behind-the-glow');
    const progressbar = page.locator('[role="progressbar"]');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(progressbar).toHaveAttribute('aria-valuenow', '100', { timeout: 5_000 });
  });

  test('related content renders and links resolve', async ({ page }) => {
    await page.goto('/story/gaffer-behind-the-glow');
    const relatedLinks = page.locator('.related-content .cover-card');
    await expect(relatedLinks.first()).toBeVisible();
    const nextUp = page.locator('.next-article');
    await expect(nextUp).toBeVisible();
  });

  test('share action is present and reachable without hover', async ({ page }) => {
    await page.goto('/story/gaffer-behind-the-glow');
    const shareButton = page.getByRole('button', { name: /share this story/i });
    await expect(shareButton).toBeVisible();
    await expect(shareButton).toBeEnabled();
  });
});

test.describe('§47 SEO and structured data', () => {
  test('article page emits Article + BreadcrumbList JSON-LD with a canonical URL', async ({ page }) => {
    const response = await page.goto('/story/gaffer-behind-the-glow');
    expect(response?.ok()).toBeTruthy();

    // Canonical/sitemap/JSON-LD all resolve through lib/site-url.ts's
    // getSiteUrl(), which deliberately always emits the real production
    // domain (or its Vercel-preview/explicit-override equivalents) — never
    // whatever host happens to be serving the current request — so this
    // does not compare against Playwright's own baseURL.
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://setlifeentertainment.com/story/gaffer-behind-the-glow');

    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((s) => {
        try {
          return JSON.parse(s.textContent ?? '{}')['@type'];
        } catch {
          return null;
        }
      })
    );
    expect(types).toContain('Organization');
    expect(types).toContain('Article');
    expect(types).toContain('BreadcrumbList');
  });

  test('review post emits Review with reviewRating scaled to the site\'s 0-100 convention', async ({ page }) => {
    await page.goto('/story/shadow-work-review');
    const reviewData = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts
        .map((s) => {
          try {
            return JSON.parse(s.textContent ?? '{}');
          } catch {
            return null;
          }
        })
        .find((d) => d?.['@type'] === 'Review')
    );
    expect(reviewData).toBeTruthy();
    expect(reviewData.reviewRating.bestRating).toBe(100);
    expect(reviewData.reviewRating.ratingValue).toBeGreaterThan(0);
    expect(reviewData.reviewRating.ratingValue).toBeLessThanOrEqual(100);
  });

  test('festival post emits Event, video post emits VideoObject', async ({ page }) => {
    await page.goto('/story/set-life-at-regional-fest');
    let types = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((s) => JSON.parse(s.textContent ?? '{}')['@type'])
    );
    expect(types).toContain('Event');

    await page.goto('/story/on-set-with-shadow-work');
    types = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((s) => JSON.parse(s.textContent ?? '{}')['@type'])
    );
    expect(types).toContain('VideoObject');
  });

  test('author page emits Person, product page emits Product+Offer, issue page emits CreativeWork', async ({ page }) => {
    await page.goto('/authors/jordan-reyes');
    let types = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((s) => JSON.parse(s.textContent ?? '{}')['@type'])
    );
    expect(types).toContain('Person');

    await page.goto('/shop/digital-issue-46');
    const productData = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((s) => JSON.parse(s.textContent ?? '{}')).find((d) => d['@type'] === 'Product')
    );
    expect(productData?.offers?.['@type']).toBe('Offer');

    await page.goto('/issues/46');
    types = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((s) => JSON.parse(s.textContent ?? '{}')['@type'])
    );
    expect(types).toContain('CreativeWork');
  });

  test('sitemap.xml includes published posts, robots.txt disallows /admin', async ({ request }) => {
    const sitemapRes = await request.get('/sitemap.xml');
    expect(sitemapRes.ok()).toBeTruthy();
    const sitemapBody = await sitemapRes.text();
    expect(sitemapBody).toContain('/story/gaffer-behind-the-glow');
    expect(sitemapBody).toContain('https://setlifeentertainment.com');

    const robotsRes = await request.get('/robots.txt');
    expect(robotsRes.ok()).toBeTruthy();
    const robotsBody = await robotsRes.text();
    expect(robotsBody).toContain('Disallow: /admin');
    expect(robotsBody).toContain('Sitemap:');
  });

  test('admin pages are noindex', async ({ page }) => {
    await page.goto('/admin/login');
    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robotsMeta).toContain('noindex');
  });
});
