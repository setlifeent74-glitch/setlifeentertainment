# CI Harness — Phase 0 (`chore/ci-harness`)

Wires Playwright, axe-core, and Lighthouse CI to PR checks per BUILD-SPEC.md §49.1/§49.2, established against the current static site ahead of the Phase 1 Next.js migration.

## Running locally

```bash
npm install
npx playwright install chromium   # first time only
npm run test:e2e                  # Playwright: hero controls, accessibility, overflow, visual regression
npm run lhci                      # Lighthouse CI: mobile + desktop
```

### Updating visual baselines

CI runs on `ubuntu-latest`. Playwright's screenshot baselines are OS-specific (font rendering differs), so baselines must be generated on Linux — running `--update-snapshots` directly on macOS produces `*-darwin.png` files CI will never match, reporting every visual test as "no baseline found." Generate them inside the same image the workflow uses:

```bash
docker run --rm -v "$(pwd)":/work -w /work \
  mcr.microsoft.com/playwright:v1.62.1-jammy \
  bash -c "npm ci && CI=1 npx playwright test tests/e2e/visual.spec.ts --update-snapshots"
```

Commit the resulting `tests/e2e/visual.spec.ts-snapshots/*-linux.png` files. Keep the Docker image tag in sync with `@playwright/test`'s version in `package.json`.

## Suites

| File | Covers |
|---|---|
| `e2e/hero-controls.spec.ts` | §17 VERIFY #4 — restart/pause/mute, and the pointer-events regression guard (§49.1) |
| `e2e/accessibility.spec.ts` | §40 — axe-core, zero critical/serious violations, every route |
| `e2e/mobile-overflow.spec.ts` | §42 VERIFY — zero horizontal overflow at 430/414/393/390/375/360px |
| `e2e/visual.spec.ts` | §49.1 — full-page screenshot baseline at 1440×900 and 390×844 |
| `lighthouserc.mobile.json` / `lighthouserc.desktop.json` | §41 — Performance/Accessibility/Best Practices/SEO, LCP/CLS/TBT |

## Enforcement is staged — §49.2

Accessibility, best-practices, SEO, and visual regression are **blocking (`error`)** starting now — the current site already clears those bars.

Performance, LCP, CLS, and TBT are **non-blocking (`warn`)** in `lighthouserc.*.json` until Phase 1 merges. The current static site fails these (Performance 0.54–0.77 mobile; CLS ~0.53 on 4/5 pages; LCP 3.6s–7.4s), traced in Phase 0 to a render-blocking `style.css` `@import` loading Anton/Bebas Neue/Archivo with `display=swap` — a multi-hop request waterfall plus a swap-reflow of the 108px Anton hero headline. This is diagnosis only; Phase 0 does not remediate it. The fix is `next/font` in Phase 1 (self-hosted, no waterfall, size-adjusted fallback metrics), scoped explicitly in the §49 phase table.

**Flip point, recorded here so it isn't missed:** the moment the Phase 1 PR (`feat/nextjs-migration`) merges, change `"warn"` to `"error"` for `categories:performance`, `largest-contentful-paint`, `cumulative-layout-shift`, and `total-blocking-time` in both `lighthouserc.mobile.json` and `lighthouserc.desktop.json`. Per §49.2, the performance baseline is a floor to beat, not a regression target — Phase 1 must reach full §41 thresholds, not merely match the legacy numbers.
