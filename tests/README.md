# CI Harness

Wires Playwright, axe-core, and Lighthouse CI to PR checks per BUILD-SPEC.md §49.1/§49.2. Established in Phase 0 against the static site; repointed at the Next.js production build (`next start`) in Phase 1.

## Running locally

```bash
npm install
npx playwright install chrome     # first time only — see "Why Chrome" below
npm run test:e2e:local            # builds Next.js, then runs the Playwright suite
npm run lhci                      # Lighthouse CI: mobile + desktop (builds separately)
```

### Why the Chrome channel, not Playwright's default Chromium

Playwright's bundled `chromium` browser is an open-source build without H.264 decode support — the hero video's `canPlayType()` reports empty and `<video>` never leaves `NETWORK_NO_SOURCE`, hanging `hero-controls.spec.ts` indefinitely. `channel: 'chrome'` in `playwright.config.ts` uses real Google Chrome instead, matching actual visitors' codec support. Install it explicitly: `npx playwright install --with-deps chrome`. This has no ARM64 Linux build — irrelevant for `ubuntu-latest` CI (x86_64), but means an Apple Silicon Docker container needs `--platform linux/amd64` to reproduce CI locally (see below).

Lighthouse CI is unaffected — it drives the system's installed Chrome (present by default on GitHub's `ubuntu-latest` runners), not a Playwright-managed browser.

### Updating visual baselines

CI runs on `ubuntu-latest` (x86_64). Playwright's screenshot baselines are OS/architecture-specific (font rendering differs), so baselines must be generated on Linux/amd64 — generating them on macOS produces `*-darwin.png` files CI will never match, reporting every visual test as "no baseline found." Generate them inside a matching container:

```bash
docker run --rm --platform linux/amd64 -v "$(pwd)":/work -w /work \
  mcr.microsoft.com/playwright:v1.62.1-jammy \
  bash -c "npm ci && npx playwright install --with-deps chrome && npm run build && CI=1 npx playwright test tests/e2e/visual.spec.ts --update-snapshots"
```

Commit the resulting `tests/e2e/visual.spec.ts-snapshots/*-linux.png` files. Keep the Docker image tag in sync with `@playwright/test`'s version in `package.json`. On Apple Silicon this runs under QEMU emulation — slower, and occasionally flaky on the first pass; a clean second run (without `--update-snapshots`) is worth doing to confirm determinism before committing.

## Suites

| File | Covers |
|---|---|
| `e2e/hero-controls.spec.ts` | §17 VERIFY #4 — restart/pause/mute, and the pointer-events regression guard (§49.1) |
| `e2e/accessibility.spec.ts` | §40 — axe-core, zero critical/serious violations, every route |
| `e2e/mobile-overflow.spec.ts` | §42 VERIFY — zero horizontal overflow at 430/414/393/390/375/360px |
| `e2e/visual.spec.ts` | §49.1 — full-page screenshot baseline at 1440×900 and 390×844 |
| `lighthouserc.mobile.json` / `lighthouserc.desktop.json` | §41 — Performance/Accessibility/Best Practices/SEO, LCP/CLS/TBT |

Routes are centralized in `e2e/routes.ts`.

## Enforcement — §49.2

Accessibility, best-practices, SEO, and visual regression have been **blocking (`error`)** since Phase 0.

Performance, LCP, CLS, and TBT were **non-blocking (`warn`)** through Phase 0, since the pre-migration static site failed them for a diagnosed, pre-existing reason (a render-blocking `style.css` `@import` with `display=swap`, causing swap-reflow on the hero headline) rather than a Phase-0 regression. Phase 1 replaced that font loading with `next/font` (self-hosted, no waterfall, size-adjusted fallback metrics).

Per §49.2, the flip only happens for assertions actually proven to pass — "a commitment, not a hope." What Phase 1 measured, after `next/font` and converting cover/logo images to `next/image` (which surfaced and fixed a real bug: the `sharp` optional dependency wasn't installed, so `next/image` was silently serving full-resolution originals unresized — a 900×1323 JPEG for a 384px-wide card thumbnail):

| Assertion | Desktop | Mobile | Status |
|---|---|---|---|
| `categories:performance` | ≥0.90 on all 5 routes | ≥0.80 on all 5 routes | **`error`** both configs |
| `cumulative-layout-shift` | ≤0.1 on all 5 | ≤0.1 on all 5 | **`error`** both configs |
| `total-blocking-time` | ≤200ms on all 5 | ≤200ms on all 5 | **`error`** both configs |
| `largest-contentful-paint` | ≤2.5s on all 5 | 2.68s–4.6s on 3/5 (home, issues, submit) | **`error`** desktop, **`warn`** mobile |

Mobile LCP improved enormously (`/issues` was 12.7s before the `sharp` fix, now ~3.2s) but three routes still land a few hundred milliseconds to ~2s over the 2.5s ceiling under Lighthouse's mobile throttling profile. Desktop clears every threshold on every route with zero exceptions, so desktop is fully blocking. Mobile LCP stays `warn` until that last gap closes — likely needs `priority`/preload tuning on whichever image actually wins "largest" per page (not necessarily the hero poster, which is already optimized per §6.1), not a new root cause. Flagged as follow-up, not swept under the non-blocking rug.
