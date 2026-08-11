# SET LIFE ENTERTAINMENT
## Platform Build Specification — v4.1

**Classification:** Authoritative build document
**Scope:** Editorial homepage · multi-contributor CMS · commerce · publication infrastructure
**Standard:** Zero-defect delivery. Every section ships verified or does not ship.
**Companion:** Growth Roadmap — Deferred Capability Register (out of scope for this build)

---

## OPERATING PROTOCOL

Read this document completely before writing any code.

**This specification is authoritative.** Where it states a value, use that value. Where it states a constraint, the constraint is absolute. Do not substitute judgment for specification. Where the specification is genuinely silent, ask.

**Sequential delivery, gated.** Work proceeds in numbered phases (§45). One branch, one pull request per phase. No phase begins until the prior phase passes its verification gate and the owner confirms the preview deployment.

**Definition of Done.** A section is complete when — and only when — every assertion in its VERIFY block passes. A failing assertion is a blocker, not a note.

**Regression is failure.** The live production site works today. Any change degrading existing behavior — visual, performance, or functional — is a defect regardless of what it enables.

**Scope discipline.** Features not in this document are not in this build. A separate Growth Roadmap governs future expansion. Do not implement from it.

---

# PART I — FOUNDATION

## §1 Editorial Thesis — The North Star

> **Celebrate the stars, but own the set.**

Black entertainment media covers talent and celebrity. Almost no publication sustains coverage of the people who physically make films — gaffers, grips, assistant directors, sound mixers, editors, production designers, costume designers, cinematographers, location managers, composers.

That territory is unclaimed, it is the only reading under which the name *Set Life* is literal rather than decorative, and it produces a more loyal audience than celebrity coverage: working professionals return for recognition and for work, not for gossip.

**This thesis governs design and editorial arbitration.** When two approaches compete, the one that better serves the working filmmaker wins. §26 — Below the Line — is not one section among seventeen. It is the differentiator. Treat it accordingly.

The site must read as a publication capable of covering an Oscar-winning director and a first-time gaffer with equal seriousness.

## §2 Team & Operating Capacity

Distributed editorial team: **5 contributors** across Memphis, Atlanta, Orlando, and Los Angeles. Additional Houston capacity in prospect (3–4).

This is a functioning newsroom, and it drives three architectural requirements:

1. **Multi-contributor CMS with roles and an approval workflow** (§40). Not single-admin.
2. **Author attribution and author profile pages** (§41). Bylines matter to a distributed team and compound SEO value.
3. **Shared media library** (§40). Multiple people uploading concurrently.

Geographic distribution across two major production hubs — Atlanta and Los Angeles — plus three regional markets is a genuine editorial asset. Regional festival and production coverage is achievable without travel budget.

## §3 Current State

Static HTML/CSS/JS. No build step, no framework.

```
index.html · issues.html · about.html · submit.html · contact.html
style.css      Single shared stylesheet. Brand system defined here.
script.js      Hero video controls, nav interaction, filters, forms.
assets/        Logo (3 variants), 21 magazine covers, hero video, favicon.
```

## §4 Brand Constants — Immutable

Fixed for the duration of this build. Every color and typeface in the platform derives from this table.

**Palette**

| Token | Value | Role |
|---|---|---|
| `--black` | `#0a0a0a` | Primary dark ground |
| `--black-2` | `#131313` | Elevated dark surface |
| `--black-3` | `#1c1c1c` | Charcoal surface |
| `--off-white` | `#f4f1ea` | Primary light ground; body text on dark |
| `--white` | `#ffffff` | Reserved — type on `--red` grounds only (§37) |
| `--red` | `#d81f27` | Primary action, active state, emphasis |
| `--red-dark` | `#9c1017` | Action hover, gradient terminus |
| `--gold` | `#d9a441` | Secondary accent, eyebrows, metadata, focus rings |
| `--gray` | `#8a8a86` | Supporting text |
| `--line` | `#2a2a2a` | Dividers, borders |

**Typography**

| Family | Application |
|---|---|
| **Anton** | Display — headlines, names, oversized numerals |
| **Bebas Neue** | Uppercase utility — eyebrows, navigation, metadata, category labels, buttons. Tracking 0.10–0.22em by size. |
| **Archivo** | Body — paragraphs, decks, form fields, UI copy |

All three load via Google Fonts, already imported at the head of `style.css`.

**Existing components — extend, never replace**

`.btn` · `.btn-primary` · `.btn-gold` · `.eyebrow` · `.accent-red` · `.accent-gold` · `.pill` / `.pill-row` · `.top-nav` / `.top-nav--overlay` · `.cta-band` · `.stat-strip` · `.footer-grid` · `.nav-pulse`

**On restraint.** Gold signals significance; it does not decorate. Use it for eyebrows, metadata, deadlines, focus states, and genuine emphasis. Cultural identity is communicated through photography, subjects, and editorial voice — not through ornament.

**VERIFY §4** — Before visual work: extract every color and font declaration from the codebase. Assert zero values outside this table. Any hardcoded hex not in the palette is a defect.

## §5 Infrastructure — Existing, Reuse

| System | Detail |
|---|---|
| Repository | `github.com/setlifeent74-glitch/setlifeentertainment` · public · branch `main` |
| Host | Vercel · project `setlifeentertainment` · team "Seal of the King" · Hobby · auto-deploy on push to `main` |
| Domain | `setlifeentertainment.com` → 308 → `www.setlifeentertainment.com` · live · SSL provisioned · GoDaddy DNS → Vercel |

**Deploy constraint — Hobby plan.** Deployment is blocked if the commit author identity does not match the connected GitHub account. Author all commits as:

```
setlifeent74-glitch <315593387+setlifeent74-glitch@users.noreply.github.com>
```

**Escalate:** a 5–9 person team requires multiple contributors pushing. Hobby-plan collaboration limits will become binding. Raise the Pro upgrade question during Phase 1.

**VERIFY §5** — After first push: deployment status `Ready`, not `Blocked`. A blocked deploy halts all work.

## §6 Hero Video — Protected Asset

`assets/hero-video.mp4` — 1920×1080, 30fps, H.264, ~6.5 Mbps, ~40 MB, faststart (moov atom at head).

Deliberately transcoded from a 3840×2160/60fps/54 Mbps/324 MB master that stalled in-browser and could not begin playback without near-complete download. **Do not replace with a higher-bitrate or higher-resolution encode.** Not tracked in Git LFS by explicit `.gitattributes` override, to remain outside GitHub's 1 GB/month LFS bandwidth ceiling.

Replacement transcode:

```bash
ffmpeg -i input.mp4 \
  -vf "scale=1920:1080:flags=lanczos,fps=30" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart \
  assets/hero-video.mp4
```

### §6.1 Mobile Delivery — Resolved

A ~40 MB non-lazy hero and a mobile Performance floor of 80 are in tension. This is resolved as follows, and the resolution is binding.

**LCP is measured on the poster, not the video.** For a `<video>` element with a `poster` attribute, the LCP candidate is the poster image. The video payload does not itself determine LCP — but an unthrottled 40 MB transfer competes for bandwidth and degrades TBT and overall Performance. The fix is delivery strategy, not asset destruction.

**Required implementation:**

1. **Poster is the LCP element.** Optimized WebP/AVIF, ≤ 150 KB, preloaded in the document head with `fetchpriority="high"`. It must paint before the video is ready.
2. **A supplementary mobile encode.** 1280×720, 30fps, CRF 23, faststart — target ≤ 15 MB. Served via `<source media="(max-width: 767px)">` ahead of the desktop source.
   ```bash
   ffmpeg -i assets/hero-video.mp4 \
     -vf "scale=1280:720:flags=lanczos" \
     -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
     -c:a aac -b:a 128k -movflags +faststart \
     assets/hero-video-mobile.mp4
   ```
3. **`preload="auto"` on desktop; `preload="metadata"` below 768px.** Faststart means playback begins on first buffered range regardless.
4. **Respect `Save-Data`.** Where the header is present or `navigator.connection.saveData` is true, hold at the poster and surface a play affordance rather than autoplaying.

**This does not violate §52.2.** That constraint protects the primary desktop encode from quality regression. Adding a smaller *supplementary* source for narrow viewports is delivery optimization, not regression. The desktop asset is untouched.

**VERIFY §6** — Assert: primary ≤ 50 MB · `ffprobe` reports ≤ 1080p, ≤ 30fps · `moov` within first 100 KB · deployed `content-length` matches local file size (mismatch indicates an LFS pointer is being served) · mobile encode ≤ 15 MB and serves at 390px · poster ≤ 150 KB and is preloaded with `fetchpriority="high"` · at 390px under Fast 3G, poster paints and LCP ≤ 2.5s.

---

# PART II — ARCHITECTURE

## §7 Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js, App Router** | Vercel-native; zero additional hosting configuration |
| Database | **Supabase Postgres** | Editorial and commerce data |
| Auth | **Supabase Auth** | Multi-contributor, role-gated |
| Storage | **Supabase Storage** | Editor uploads, covers, product media, digital goods |
| Payments | **Stripe Checkout** | Hosted, redirect-based. No PCI scope. |

**Tokenization mandate.** Every value in §4, §12, §13, §14 becomes a design token — Tailwind config or CSS custom properties. One system, applied universally. Magic numbers in components are a defect.

**Performance posture.** Server Components by default. Hydrate only genuinely interactive components. One autoplaying video on the page (the hero); no others.

**VERIFY §7** — Phase 1 gate: ported site renders pixel-identical to production, deploys `Ready`, Lighthouse Performance ≥ 90 desktop. Any regression blocks the phase.

## §8 URL Architecture

Every entity receives a permanent, human-readable, indexable URL. This decision is cheap now and expensive later — it governs the data model.

```
/                             Homepage
/story/[slug]                 Article, spotlight, review, news — all post types
/issues                       Magazine archive
/issues/[number]              Individual issue
/authors/[slug]               Contributor profile
/category/[category]          Category index
/opportunities                Opportunities index
/festivals                    Festival index
/shop                         Store index
/shop/[slug]                  Product detail
/about · /submit · /contact   Static
```

Slugs are generated from titles, editable in the CMS, and immutable once published. Changing a published slug issues a 301 from the old path.

**Phased-delivery carve-out.** Navigation and homepage sections ship in earlier phases than some of the routes they link to (Shop links land Phase 4; `/shop` builds Phase 12). During the build, the zero-404 requirement applies **only to routes whose phase has shipped**. Links to not-yet-built routes must point at a **designed interim page** — branded, on-system, stating the section is coming — never a raw 404 and never `href="#"`. Every interim page is removed by Phase 13.

**VERIFY §8** — Assert every published entity resolves at its canonical URL. Assert slug edits on published content create a 301, not a broken link. Assert every internal link resolves to either a built route or a designed interim page. Assert zero raw 404s and zero `href="#"` at every phase boundary.

## §9 Content Readiness Gates

**This is the mechanism that prevents an empty-looking publication.**

Each homepage section declares a minimum content threshold. Below threshold, the section does not render — the homepage composes from available sections without gaps or placeholders. Above threshold, it renders fully.

All thresholds count **published** rows matching the stated `placement` (§44).

| Section | Minimum to render |
|---|---|
| §22 Today on Set Life | 3 · `placement = today` |
| §23 Current Magazine Issue | 1 issue with `is_current = true` |
| §24 Indie Spotlight | 1 · `placement = spotlight_feature` |
| §25 The Call Sheet | 5 · `placement = call_sheet`, newest within 14 days |
| §26 Below the Line | 3 · `placement = below_the_line` |
| §27 Fresh Faces | 4 · `placement = fresh_face` |
| §28 Now in Production | 3 · `placement = production` |
| §29 The Cut | 1 · `placement = cut` |
| §30 The Screening Room | 1 · `placement = screening_room` |
| §31 Behind the Lens | 1 · `placement = behind_the_lens` |
| §32 Opportunities | 3 · `placement = opportunity`, deadline not expired |
| §33 Festival Circuit | 2 · `placement = festival`, date in future |
| §34 Set Life 100 | Published `honorees` for current `list_year` **and** admin enable |
| §35 Shop | 1 published product |
| §36 Instagram | API reachable, else CMS fallback grid |

**Staleness rule.** The Call Sheet renders only if its most recent item is within 14 days. A "today" module showing three-week-old news damages credibility more than its absence.

**Admin visibility.** The dashboard displays each section's gate status — met or unmet, with the shortfall. Contributors can see exactly what the homepage needs.

**VERIFY §9** — Seed the database below every threshold. Assert the homepage renders cleanly with only Hero, Newsletter, and Footer — no gaps, no empty containers, no console errors. Raise one section above threshold; assert it appears in correct sequence position.

---

# PART III — DESIGN SYSTEM

## §10 Viewport & Grid

**Primary design target: 1440 × 900.**

Verification widths: 1920 · 1728 · 1512 · 1440 · 1366 · 1024 · 834 · 768 · 430 · 414 · 393 · 390 · 375 · 360.

| Context | Grid | Outer margin |
|---|---|---|
| Desktop @1440 | 12 column · 1296px · ~24px gutters | 72px |
| Tablet @1024 | 8 column | 48px |
| Tablet @834 | 8 column | 32px |
| Tablet @768 | 8 column | 28px |
| Mobile @390 | Single column | 20px (16px below 375px) |

Max editorial width 1600px; most content 1280–1360px. Full-bleed sections ignore the container and span `100vw`. Selected elements — oversized numerals, covers, portraits — deliberately break the grid where specified.

## §11 Breakpoints

`1440+` full editorial desktop · `1200–1439` compressed desktop · `1024–1199` hybrid · `768–1023` tablet · `480–767` large mobile · `0–479` mobile.

Do not introduce breakpoints beyond this set.

## §12 Type Scale

| Role | Desktop | Mobile |
|---|---|---|
| Hero display | 88–124px | 48–64px |
| Editorial H1 | 72–96px | 48–58px |
| Section H2 | 56–76px | 38–48px |
| Feature headline | 42–56px | 30–38px |
| Card headline | 24–34px | 22–28px |
| Deck | 18–22px | 16–18px |
| Body | 17–19px | 16–18px |
| Metadata | 12–14px | 12–13px |
| Utility | 11–13px | — |

Uppercase is reserved for navigation, eyebrows, metadata, and category labels. Never uppercase body copy. Left alignment dominates.

## §13 Spacing

Scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96 · 120 · 160`

**Use the upper bound of every range in this document.** Default major desktop section padding to **140px** vertical, mobile to **88px**, unless a section states otherwise. Do not compress to shorten the page.

## §14 Motion

| Class | Duration |
|---|---|
| Microinteraction | 140–220ms |
| UI transition | 220–350ms |
| Section reveal | 500–900ms |
| Hero sequence | 1200–1800ms total |

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`. No elastic, bounce, or overshoot.

**Animate only:** `opacity`, `transform`, `clip-path`, `scale`. Never animate layout-triggering properties in a loop.

**Text animation is required.** Headlines rise line-by-line from clipped masks with stagger. Section headers mask-reveal on entry. Names and numerals fade and translate into position. Motion is **directional and deliberate** — a consistent vector per element group. Scattered or randomized entry is prohibited.

**`prefers-reduced-motion`:** substitute opacity-only transitions or instant placement. Fully functional with all motion disabled.

**VERIFY §14** — Enable `prefers-reduced-motion` at OS level. Assert every section renders complete and readable, no content trapped pre-animation, all interactive elements reachable.

---

# PART IV — HOMEPAGE

## §15 Section Order — Fixed

1. Hero (full viewport, video)
2. Today on Set Life
3. Current Magazine Issue
4. Indie Spotlight
5. The Call Sheet
6. Fresh Faces
7. Below the Line
8. Now in Production
9. The Cut — Reviews
10. The Screening Room
11. Behind the Lens
12. Opportunities
13. Festival Circuit
14. Set Life 100
15. **The Set Life Shop**
16. From @setlifeentertainment
17. The Call Sheet Newsletter
18. Editorial Footer

Sections render subject to §9 gates. Order never changes; absent sections close up.

**Editorial rhythm.** The sequence is an argument, each section a claim:

Hero — *Set Life matters.* · Today — *Set Life knows what's happening.* · Magazine — *Set Life is a real publication.* · Spotlight — *Set Life discovers people.* · Call Sheet — *Set Life tracks the industry.* · Fresh Faces — *Set Life finds who's next.* · **Below the Line — *Set Life understands how films are actually made.*** · In Production — *Set Life knows what's being built.* · The Cut — *Set Life has a critical voice.* · Screening Room — *Set Life produces media.* · Behind the Lens — *Set Life respects craft.* · Opportunities — *Set Life can advance my career.* · Festivals — *Set Life connects the ecosystem.* · Set Life 100 — *Set Life confers recognition.* · Shop — *Set Life is something I want to own.* · Instagram — *Set Life is culturally present.* · Newsletter — *I need to stay connected.*

Commerce is placed after recognition and before the social close. It arrives once authority is established — never as an interruption.

## §16 Global Navigation

Positioned **inside** the hero, layered over the video. No separate bar above the video. The first painted frame shows video behind the navigation.

**Desktop**

- Height 92px · horizontal padding 64–72px @1440
- Left: logo (155–190px) · Center: primary navigation · Right: Search, Submit, Shop
- Taxonomy: Magazine · Film & TV · Spotlights · Reviews · Watch · Industry · Opportunities · Festivals · **Shop**
- **Hero state:** transparent ground, `--off-white` type, no blur, no shadow
- **Scroll transition:** begins 70–100px; complete by 160–200px. Ground → `--black` at 94–98%. Height 92 → 72px. Logo scales proportionally. 300–450ms.
- **Hover:** label translates up 1–2px; `--gold` underline draws left→right (extend `.top-nav a::after`). 180–250ms.
- **Active:** `--red` type and underline.
- **Click:** retain `.nav-pulse`.
- **Mega menu:** 100vw ground, 1280–1360px content column, `--black`, height 340–460px. Category list, latest story, featured thumbnail, popular destinations. `opacity` + `translateY(8–12px)`, 220–300ms.

**Mobile**

- Height 72px · padding 20px · logo left · search + menu icons right
- Full-screen menu: `100vw × 100dvh`, `--black`, 30–38px editorial links, generous rhythm, utility links below

**VERIFY §16** — At 1440 and 390: screenshot at scroll 0 — transparent nav over video, no opaque bar. At scroll 200px — opaque nav, reduced height. Tab all links — visible gold focus ring on each. Open mega menu by keyboard — opens, traps focus, closes on `Escape`.

## §17 Hero — Full Viewport

**The highest-priority surface in this specification.**

```css
width: 100vw;
height: 100svh;          /* 100dvh fallback */
min-height: 720px;       /* desktop floor */
```

The video touches all four viewport edges. No margin, border, radius, container, or split. **No pixel of §22 is visible before first scroll.**

**Composition — absolute constraints**

- The hero is the existing autoplay video (§6). Not a photograph. Not a slideshow. Not a carousel.
- **No magazine-cover object in the hero.** Featured-issue treatment belongs in §23.
- **Nothing animates on top of the video.** Permitted overlays are exactly three: navigation, the three video control buttons, the existing bottom gradient. No particles, graphic flourishes, or decorative motion over the footage.
- Gradient, unchanged: `linear-gradient(180deg, transparent 0%, transparent 62%, rgba(10,10,10,0.5) 100%)`. Bottom only.
- Controls (`#heroRestartBtn`, `#heroPauseBtn`, `#heroMuteToggle`) remain **bottom-right at every breakpoint** — positioned to clear both navigation and on-screen faces.

**Copy — safe zone within the gradient**

@1440 × 900: `left: 72px`, `bottom: 72–96px`, max width 760–850px.

| Element | Specification |
|---|---|
| Eyebrow | Bebas Neue, `--gold`, caps, 12–14px, tracking 0.12–0.18em |
| Headline | Anton, `--off-white`, `clamp(72px, 7vw, 118px)`, line-height 0.88–0.96, letter-spacing −0.025em to −0.045em, max 4 lines |
| Deck | Archivo, 18–22px, line-height 1.4–1.55, width 480–620px |
| CTA row | 28–36px below deck. Primary `.btn-primary`, secondary `.btn-gold`. Height 46–50px. Radius 0–4px. |

**Entrance choreography** — video visible at 0ms; never a blank frame

| Time | Event |
|---|---|
| 100–250ms | Navigation fades + translates in, 6–10px |
| 250ms | Eyebrow mask-reveals |
| 350–900ms | **Headline lines rise independently from clipped containers. Travel 80–110% of line-height. Stagger 70–110ms per line.** `cubic-bezier(0.16, 1, 0.3, 1)` |
| 700–1050ms | Deck fades up ~16px |
| 850–1200ms | CTA row fades up |

No rotation, bounce, or 3D transform.

**Scroll behavior.** Across the first 250–500px: video may scale 1.00 → 1.025 or translate marginally. Headline may translate at a differential rate for depth. Subtle only.

**Scroll indicator.** Retain "SCROLL" label + vertical rule, bottom-center, animating slowly downward. No mouse iconography.

**Exit.** Hard cut into §22 at `--off-white`. Optional 1px `--line` divider. No curved transition shape.

**VERIFY §17 — CRITICAL GATE**

1. Screenshot at 1440×900 immediately post-load. Present: full-bleed video, transparent nav, logo, eyebrow, headline, deck, CTA. Absent: any part of §22, any light strip below the video, any margin around the video, any rounded container.
2. Repeat at 390×844.
3. Assert video height equals `window.innerHeight` at both.
4. Click each control. Restart → `currentTime` 0 and playing. Pause → `paused === true`. Mute → toggles `muted`, updates `aria-pressed`. **Confirm no element intercepts these clicks** — a prior production defect was caused by a full-width transparent nav overlay swallowing pointer events.
5. Throttle to Fast 3G. Assert playback begins without full download.
6. Lighthouse: LCP ≤ 2.5s, CLS ≤ 0.1.

## §18–§21 — reserved

## §22 Today on Set Life

Ground `--off-white` · 140px vertical · content 1296px · **Gate: 3 posts**

**Header row:** "TODAY ON SET LIFE" (Anton, 48–60px) · date (Bebas, 12–14px caps) · "View All Stories" — space-between.

**Grid:** Primary columns 1–7 — image ~760×500 (3:2), headline 38–52px Anton, byline linking to `/authors/[slug]`. Secondary columns 8–12 — 2–3 modules ~500×180–220px, category label `--gold`, headline, timestamp, reading time.

**Motion:** header mask-reveals · primary image clip-path reveals from bottom or left · headline +100–160ms · secondary stagger 60–90ms.

**Mobile:** single column · primary first, image full-width 4:3 or 3:2, headline 32–38px · secondary below, separated by `--line` rules.

**VERIFY §22** — Assert section top edge is the first pixel below viewport height at 1440×900 and 390×844. Assert reveals fire once, not on scroll oscillation. Assert content renders from CMS records. Assert bylines link to live author pages.

## §23 Current Magazine Issue

Ground `--black` · 850–1050px · full-width · internal grid 1296px · **Gate: 1 current issue**

**Left:** cover rendered 440–500px wide.
**Right:** "CURRENT ISSUE" eyebrow · issue number and season · cover subject (Anton, large) · editorial copy · CTA row — `.btn-primary` "Explore Issue", `.btn-gold` "Read Cover Story" / "View Archive".

**Background typography:** issue numeral or "SET LIFE" at 300–500px, opacity 3–7%. Architectural.

**Motion:** cover reveals via vertical mask + subtle scale · numeral parallaxes at 60–70% scroll rate · right column reveals sequentially.

**Mobile:** cover centered 72–80vw · details below · numeral cropped dramatically.

**VERIFY §23** — Renders from `magazine_issues` where `is_current = true`. Numeral opacity ≤ 7% and does not reduce text contrast below WCAG AA. Parallax disabled under reduced motion.

## §24 Indie Spotlight

Ground `--off-white` · 850–1000px · **Gate: 1 spotlight**

Asymmetric: portrait 54–60vw (may break grid) · copy 34–40vw.

Eyebrow "INDIE SPOTLIGHT" (gold) · name (Anton, 64–90px) · profession 18–22px · credits 14–16px · pull quote 28–38px.

Oversized "INDIE" / "SPOTLIGHT" behind subject at low opacity, masked behind the portrait where it reads cleanly.

**CTA:** Read Profile · Watch Interview

**Mobile:** image full-width · name 44–56px, may overlap lower image edge if contrast holds · content below.

**VERIFY §24** — At 390px measure contrast at the name/image overlap. ≥ 4.5:1 or remove the overlap on mobile.

## §25 The Call Sheet

Ground `--black` · 110px vertical · **Gate: 5 news posts, newest within 14 days**

**Header:** "THE CALL SHEET" · "WHAT'S MOVING IN INDEPENDENT FILM TODAY" · live timestamp.

**Desktop:** vertical list, not cards. Rows 86–110px: category label (`--gold` / `--red` by category) · headline · timestamp · arrow · `--line` divider.

Categories: Casting · Development · In Production · Acquisition · Distribution · Awards · Streaming · Business.

**Hover:** headline translates right 8–12px. Optional floating preview that does not obstruct the list.

**Mobile:** list retained · metadata reduced · headline 22–28px · no floating preview.

**VERIFY §25** — Rows are semantic list elements, keyboard-focusable, activate on `Enter`. Hover preview suppressed on touch. **Assert the staleness gate: seed newest item at 15 days old and confirm the section does not render.**

## §26 Below the Line — *Signature Section*

Ground `--black-2` / `--black-3` · **Gate: 3 crew posts**

**This section carries the editorial thesis (§1). It receives the most design attention of any section below the hero.**

**Header:** "BELOW THE LINE" · "THE PEOPLE WHO MAKE THE MOVIE POSSIBLE" (64–82px)

Subjects: DPs · editors · gaffers · grips · sound mixers · production designers · costume designers · ADs · makeup artists · location managers · camera teams · composers.

**Layout:** editorial mosaic — one large profile, two medium, several compact. **Not a uniform grid.** This is the most demanding responsive composition in the build; budget accordingly.

**Hover:** department label appears over image · minimal scale · name and title reveal.

**Mobile:** vertical sequence — lead profile first, then two-column compact portraits where space permits.

**VERIFY §26** — Assert no two mosaic tiles share identical dimensions. Assert department labels are present in the DOM for screen readers, not injected on hover only. Assert the mosaic holds composition at 1024 and 768 without collapsing to a uniform grid.

## §27 Fresh Faces

Ground `--off-white` · 120px vertical · **Gate: 4 spotlights**

**Header:** "FRESH FACES" · "THE NEXT NAMES YOU'LL KNOW" (Anton, 60–76px)

**Desktop rail:** 4 portraits visible · 290–310px wide · 420–470px tall · 4:5 · no radius · name and credits below. Hover: scale 1.00 → 1.025, name gains underline or arrow. Controlled drag/scroll. No autoplay.

**Mobile:** 1.15–1.35 cards visible · card width ~78vw · momentum scrolling.

**VERIFY §27** — Rail scrolls by keyboard arrows without trapping page scroll. At 390px a partial card is visible at the right edge.

## §28 Now in Production

Ground `--off-white` · 130px vertical · **Gate: 3 entries**

Header + filter row using `.pill` / `.pill-row`: Development · Pre-Production · Shooting · Post · Festival · Distribution.

**Desktop:** 3-column cards ~400px — poster/still · title · director · production company · location · status · genre · logline.

Status labels: In Production · Post-Production · Seeking Distribution.

**Mobile:** horizontal filter row · single column · status always visible.

**VERIFY §28** — Filters update the result set without full reload; active pill reflects state. Filtering to empty renders a designed empty state, not a blank region.

## §29 The Cut — Reviews

Ground `--off-white` · **Gate: 1 review**

**Branding:** "THE CUT" · "SET LIFE REVIEWS"

**Lead:** 16:9 still ~800×450 · score 80–110px in `--red` or `--gold` · verdict · reviewer byline · CTA.
**Secondary:** 3–4 cards.

Proprietary numeric score only. No tomato iconography. No stars unless a proprietary mark is designed and approved.

**Motion:** score resolves into position once on entry. Never loops.

**Mobile:** lead image · score and headline below · secondary single-column or rail.

**VERIFY §29** — Score animation fires exactly once per load. Score present as DOM text, not graphics only.

## §30 The Screening Room

Ground `--black` · min 900px · **Gate: 1 video entry**

**Header:** "THE SCREENING ROOM" · "WATCH SET LIFE"

**Player:** 16:9, max width 1180–1240px, centered, premium chrome. **Click-to-play — never autoplay.**

**Below:** title 44–58px · description · runtime · series/category · related clips.

Optional ambient blurred luminance from the active thumbnail. Restrained. No glow.

**Mobile:** player full container width · title 30–36px · swipeable related videos.

**VERIFY §30** — Assert no video element other than the hero has `autoplay`. Player supports a captions track and keyboard control (space, arrows).

**Implementation note.** Custom player chrome is deceptively expensive. A well-styled third-party player meeting the visual standard is acceptable and preferred if it saves meaningful time.

## §31 Behind the Lens

Ground `--off-white` · **Gate: 1 qualifying post**

Desktop split: film still ~58% · portrait and article text ~42%.
**Title:** "BEHIND THE LENS" · "DIRECTORS, CINEMATOGRAPHERS & THE LANGUAGE OF FILM"

Optional restrained technical detail treatment (frame number, camera, fps). Sparingly.

**Mobile:** still → title → portrait → text.

**VERIFY §31** — DOM reading order matches visual order at both breakpoints.

## §32 Opportunities

Ground `--black-2` / `--black-3` · **Gate: 3 live listings**

**Header:** "OPPORTUNITIES" · "YOUR NEXT PROJECT MAY START HERE"
**Tabs** (`.pill-row`): Casting · Crew · Jobs · Grants · Labs · Fellowships · Festivals

**Rows:** type · title · organization · location · paid status · **deadline (emphasized, `--gold`)** · arrow.

A "Set Life Verified" indicator applies **only** to entries verified through a documented process. Do not display verification affordances without that process defined and operating.

**Mobile:** tabs scroll horizontally · rows stack metadata vertically · deadline visible without expanding.

**VERIFY §32** — Expired deadlines are excluded or visually distinguished. Deadline announced by screen readers with full date context, not bare "Aug 28". Assert expiry logic runs server-side, not client-only.

## §33 Festival Circuit

Ground `--off-white` · **Gate: 2 upcoming festivals**

**Header:** "FESTIVAL CIRCUIT" · "WHERE INDEPENDENT FILM MEETS THE WORLD"

**Featured:** large photographic block — name · city · dates · submission deadline · coverage link.
**Upcoming:** vertical date-driven timeline, 5–8 entries. Not cards.

**Mobile:** feature first, timeline below.

**VERIFY §33** — Entries sort chronologically; past festivals excluded or explicitly marked.

## §34 Set Life 100

Ground `--black` · min 850–950px · **Gate: explicit admin enable**

Numeral "100" at 350–500px, low opacity, `--gold` or `--off-white`. Architectural.
Foreground: honoree portraits at varied vertical offsets.
**Title:** "THE SET LIFE 100" · "PEOPLE SHAPING THE FUTURE OF INDEPENDENT CINEMA"

**Motion:** numeral mask-reveals · portraits enter at staggered offsets · names fade and translate.

**Mobile:** numeral enormous, intentionally cropped · portraits stack.

**VERIFY §34** — Numeral does not reduce overlapping text contrast below WCAG AA. Portrait stagger is directionally consistent. **Assert the section is hidden by default and requires explicit admin activation.**

## §35 The Set Life Shop

Ground `--black` · 140px vertical · **Gate: 1 published product**

**Header:** "THE SET LIFE SHOP" · supporting line (e.g. "WEAR IT. PLAY IT. BE THERE.")

**Desktop:** 3–4 product cards — image (square or 4:5) · name · price · Buy. Cards carry the same editorial restraint as everything else: no radius beyond 0–4px, no glow, no badge clutter. Conditional metadata only — event date and location if ticketed; "Digital Download" label if digital.

**CTA:** "Visit the Shop" → `/shop`

**Mobile:** 2-column grid or horizontal rail. Large thumb targets. No hover-dependent affordances.

**VERIFY §35** — Assert cards render correctly for all three product shapes (physical, digital, ticketed) from the same component with no branching layout. Assert Buy action reaches Stripe Checkout. Assert tap targets ≥ 44×44px at 390px.

## §36 From @setlifeentertainment

Ground `--off-white` · **Gate: API reachable or CMS fallback populated**

**Header:** "FROM @SETLIFEENTERTAINMENT" · "Follow on Instagram"

Prefer live Instagram Graph API. Confirm access during this phase; fall back to a CMS-curated grid if unavailable.

**Desktop:** ~5 across, or art-directed masonry. Hover reveals caption excerpt, content type, Instagram mark.
**Mobile:** 2-column. Not 3.

**VERIFY §36** — Assert graceful degradation: on API failure or rate-limit, the fallback grid renders. Never an empty region or error state.

## §37 The Call Sheet — Newsletter

Full-width. Reuse `.cta-band`: `linear-gradient(120deg, var(--red-dark), var(--red))`. Height 520–650px.

**Headline:** Anton, 72–96px, `--white` — "KNOW WHAT'S HAPPENING BEFORE THE SET GOES LIVE" or approved copy.
**Form:** email + submit, width 600–760px.
**Post-signup preferences:** Daily Headlines · Weekly Edition · Casting & Crew · Festival Deadlines · Reviews · Magazine.

**Mobile:** headline 42–52px · form stacks vertically.

**VERIFY §37** — Submit valid and invalid addresses. Inline validation, accessible error messaging via `aria-describedby`, visible success state, no duplicate submission on double-click.

## §38 Editorial Footer

Extend `footer.site-footer` · ground `--black-2`

**Top:** large logo + brand statement.

**Columns:**
- **Explore** — Magazine · Film & TV · Spotlights · Reviews · Watch
- **Industry** — Industry News · Opportunities · Festivals · Production
- **Set Life** — About · Contact · Shop · Submit · Press
- **Legal** — Privacy · Terms · Editorial Policy · Review Policy · Accessibility

**Bottom:** copyright · social icons. **Only active channels.** Instagram is live; do not render placeholder icons linking nowhere.

Retain "Powered by Hughes Technologies" in `--gold`.

**VERIFY §38** — Every footer link resolves to a built route or a designed interim page (§8 carve-out). Zero raw 404s. Zero `href="#"` placeholders at any phase. At Phase 13, zero interim pages remain.

---

# PART V — QUALITY STANDARDS

## §39 Prohibited

Generic framework-default layouts · arbitrary gradients · 24–32px rounded SaaS cards as a default pattern · oversized glowing buttons · film grain overlays · lens flares · exaggerated parallax · **chaotic text animation entering from random, inconsistent directions** (text animation itself is *required* — §14, §17; it must be directional) · additional infinite marquees (the existing top strip is the sole exception) · scroll hijacking · horizontal page scroll · stock photography where genuine Set Life imagery exists · artificial skin smoothing · poorly cropped covers · extracting a subject already on a magazine cover as a separate asset · unreadable type · unpurposed empty space · one card design repeated across every section · slideshow or magazine-object treatment in the hero · any animated overlay on the hero video.

## §40 Accessibility — Non-Negotiable

Keyboard navigation throughout · visible focus states (gold rings, established — never revert to browser default) · semantic heading hierarchy · ARIA labeling on menus and controls · video captions · alt text on all imagery · WCAG AA contrast minimum · full `prefers-reduced-motion` support.

Art-directed typography must never corrupt screen-reader reading order.

**VERIFY §40** — Run axe-core or Lighthouse Accessibility on every route. **Score ≥ 95. Zero critical violations.** Complete one full keyboard-only traversal of the homepage.

## §41 Performance — Non-Negotiable

Hero video per §6.1. All below-fold imagery lazy-loads. No full-page spinner; content-aware skeletons only for genuine async loading.

**Image delivery — required, not optional.** This build is image-dense across seventeen sections with a ≥90/≥80 Lighthouse floor. Editorial imagery uploaded to Supabase Storage must not be served at original resolution.

- All editorial imagery renders through `next/image` with explicit `width`/`height` or `fill` plus `sizes`. No raw `<img>` for CMS content.
- Serve AVIF with WebP fallback. Configure Supabase Storage as a remote pattern in `next.config`.
- Generate `srcset` breakpoints matching §11. A 4:5 portrait in the §27 rail must not ship a 4000px master to a 390px viewport.
- Every image carries a blur placeholder or a solid `--black-2` fill to hold layout and protect CLS.
- The admin editor (§45) enforces alt text before an image can be inserted.

**VERIFY §41** — Lighthouse on production build, desktop and mobile:
- Performance ≥ 90 desktop, ≥ 80 mobile
- LCP ≤ 2.5s · CLS ≤ 0.1 · TBT ≤ 200ms
- Accessibility ≥ 95 · Best Practices ≥ 95 · SEO ≥ 95

Any metric below threshold is a blocker.

## §42 Mobile — Equal Priority

Mobile is not a reduction of desktop. Every section is recomposed per its own specification.

- **Hero:** full-bleed `100svh`/`100dvh` video, edge to edge, nav overlaid. Never shortened to reveal §22. Evaluate framing in 9:16 — if subject composition degrades in portrait, art-direct `object-position` for mobile rather than inheriting desktop centering.
- **Navigation:** logo + search + menu → full-screen dark overlay menu.
- **Editorial body copy:** 16–18px minimum. Image blocks full-width.
- **Commerce:** verify large thumb targets. No hover-dependent affordances.
- **Admin:** must remain functional on tablet — contributors will file from the field.

**Escalate, do not decide unilaterally:** whether the ~40 MB hero video is acceptable over cellular, or whether a lighter mobile encode via `<source media="...">` is warranted.

**VERIFY §42** — Run the full section verification suite at 430, 414, 393, 390, 375, 360px. Assert zero horizontal overflow at every width: `document.documentElement.scrollWidth === window.innerWidth`.

## §43 First-Screen Acceptance Test — Master Gate

At **1440 × 900** and **390 × 844**, screenshot immediately after load.

**Must contain:** full-bleed hero video · transparent navigation over it · logo · eyebrow · headline · deck · CTA row.

**Must not contain:** any portion of §22 · any light strip beneath the video · browser-style margins around the video · a floating or rounded hero container · a cookie banner obscuring composition.

**Composition test — OWNER JUDGMENT, not an automated assertion.** With all text hidden, the page should still read as an art-directed film publication. With all imagery hidden, the typography and grid should still read as a world-class editorial system.

This is a design review, deliberately subjective, and it is classified separately from the mechanical assertions above. Produce both screenshots and present them for sign-off. **It does not block a phase on its own** — disagreement here is resolved by the owner specifying a change, not by the assertion failing indefinitely. Every other item in every VERIFY block in this document is mechanically testable and does block.

---

# PART VI — PLATFORM

## §44 Data Model

Most editorial surfaces are one content type with a category discriminator. A single article editor drives all of them.

**`posts`**
`id` · `slug` (unique, immutable once published) · `title` · `dek` · `category` (enum below) · `placement` (enum below) · `body` (rich block content) · `hero_image_url` · `author_id` (FK → `authors`) · `status` (`draft` | `in_review` | `scheduled` | `published`) · `published_at` · `scheduled_for` · `featured` · `related_issue_id` (FK, nullable) · `seo_title` · `seo_description` · `og_image_url` · `reading_time` (derived on save) · `meta` (JSON — review score, opportunity deadline and compensation, festival dates, production status)

**`posts.category`** — what the piece *is*:
`article` · `news` · `spotlight` · `review` · `opportunity` · `festival` · `below_the_line` · `production` · `video` · `behind_the_lens`

**`posts.placement`** — which homepage section it feeds. Nullable; a post with no placement appears only in category indexes and search.
`today` · `spotlight_feature` · `fresh_face` · `call_sheet` · `below_the_line` · `production` · `cut` · `screening_room` · `behind_the_lens` · `opportunity` · `festival`

**Why placement exists — resolves four ambiguities the category enum alone cannot:**

| Ambiguity | Resolution |
|---|---|
| §24 Indie Spotlight vs §27 Fresh Faces — both `category = spotlight` | §24 draws `placement = spotlight_feature` (the single deep profile). §27 draws `placement = fresh_face` (the rail). One category, two placements. |
| §31 Behind the Lens had no category | Added to the enum, with matching placement. |
| §32 Opportunities "Festivals" tab vs §33 Festival Circuit | A **call for entries with a submission deadline** is `category = opportunity`, `placement = opportunity`. A **festival as an event with dates and coverage** is `category = festival`, `placement = festival`. Deadline present and actionable → Opportunities. Event coverage → Festival Circuit. A single festival may legitimately have one of each; they are separate posts. |
| §22 Today on Set Life vs everything else | `placement = today` is explicit, editor-assigned. Today is a curated slot, not a recency query. |

Placement is set by an editor in the CMS, defaulting from category. **§9 content gates count posts by `placement`, not `category`.**

**`honorees`** — backs §34 Set Life 100. Absent from the prior revision; a CMS-managed homepage section requires a table.
`id` · `list_year` · `rank` (nullable — the list may be unranked) · `name` · `title` · `discipline` · `portrait_url` · `citation` (short editorial text) · `related_post_id` (FK → `posts`, nullable) · `published`

§34 renders when `honorees` contains published rows for the current `list_year` **and** an admin has enabled the section.

**`authors`**
`id` · `slug` · `name` · `role` · `bio` · `avatar_url` · `location` · `social_links` (JSON) · `user_id` (FK → Supabase Auth)

**`post_revisions`**
`id` · `post_id` · `body` · `title` · `edited_by` · `created_at` — retained for recovery and attribution across a distributed team.

**`magazine_issues`**
`id` · `issue_number` · `title` · `cover_image_url` · `release_date` · `summary` · `is_current`

**`products`** — one flexible type. Sells merch, music, tickets, and anything added later without a developer introducing categories.
`id` · `slug` · `name` · `description` · `price` · `image_url` · `stripe_price_id` · `inventory` (nullable — blank = unlimited) · `digital_file_url` (nullable — set for downloadable goods) · `event_date` / `event_location` (nullable — set for ticketed events) · `published`

A product's nature is determined entirely by which optional fields are populated. **No `type` enum. No separate code path per category.**

**`orders`**
`id` · `stripe_session_id` · `product_id` · `customer_email` · `amount` · `status` · `download_token` (nullable) · `ticket_code` (nullable) · `created_at`

**`media`** — shared library for a multi-contributor team.
`id` · `url` · `filename` · `alt_text` · `uploaded_by` · `created_at`

**Roles:** `admin` · `editor` · `contributor` — on the Supabase Auth user record.

**VERIFY §44** — Row Level Security enabled on every table. Anonymous clients read published content only. No write path without an authenticated session of sufficient role. Attempt an unauthenticated write and a contributor-role publish; confirm both rejected. Assert every §9 gate query filters on `placement`. Assert a post with `category = spotlight` and no `placement` appears in neither §24 nor §27.

## §45 Admin Back Office

Sized for 5–9 distributed contributors.

| Route | Function |
|---|---|
| `/admin/login` | Supabase Auth, email/password |
| `/admin` | Dashboard — recent posts by status, **§9 gate status per homepage section**, quick-edit |
| `/admin/posts` | List, filter by status/author/category |
| `/admin/posts/[id]` | Article editor |
| `/admin/issues` | Magazine issue CRUD |
| `/admin/products` | Store product CRUD |
| `/admin/media` | Shared media library |
| `/admin/authors` | Contributor profiles |
| `/admin/submissions` | Inbound submission queue |

**Roles**

| Role | Capability |
|---|---|
| **Admin** | Everything. Settings, store, users, publishing. |
| **Editor** | Publish/unpublish any post, edit others' work, manage homepage featuring, review submissions. |
| **Contributor** | Create and edit own drafts, submit for review, upload media. **Cannot publish.** |

**Workflow:** `Draft → In Review → Scheduled → Published`. Contributors submit; editors approve. Revision history is retained on every save.

**Article editor** — the core requirement. Block-based rich editor (Tiptap or equivalent) supporting:
- Large section headers in the editorial type system
- Body copy
- **Inline image upload via drag-and-drop, direct to Supabase Storage**, with required alt text
- Pull quotes, inline galleries, video embeds
- Output rendering on the public site in magazine article format — oversized headers opening sections, full-width image blocks, editorial rhythm

A plain textarea does not satisfy this requirement.

**VERIFY §45** — End-to-end as each role. Contributor: create post with two section headers and one uploaded image → submit for review → **assert publish is unavailable**. Editor: review → publish → confirm live on homepage and at `/story/[slug]` → edit → confirm propagation → unpublish → confirm removal. Assert `/admin` while logged out redirects to login with no content leakage. Assert revision history captures each save with correct attribution.

## §46 Article Reading Experience

Long-form must be exceptional. This is where the magazine-format requirement is realized.

- Large hero image · animated headline reveal (§14) · author byline linking to `/authors/[slug]` · date · reading time
- Comfortable measure — 680–760px at desktop
- Oversized section headers opening each section, in Anton
- Full-width and inset image blocks with captions
- Pull quotes at 28–38px
- Sticky reading-progress indicator
- Share actions
- **Related content** — related stories (same `category`, then same `author_id`, then most recent), and a next-article recommendation at the foot. **Not "related people"** — subjects are not modeled as entities in this build; only authors are. Subject profiles are Growth Roadmap 2.1 and are deliberately out of scope. Do not build a people entity to satisfy this line.
- Inline video and gallery support

**Mobile:** body 16–18px minimum · image blocks full-width · progress indicator retained · share accessible without hover.

**VERIFY §46** — Publish a 2,000-word article with three section headers, two images, one pull quote, one embed. Assert: correct rendering at 1440 and 390 · reading time accurate within 20% · progress indicator tracks scroll accurately · related content populates or hides cleanly when empty · headings form a valid `h1 → h2 → h3` hierarchy.

## §47 SEO & Structured Data

A publication compounds value through discoverability. This is not optional polish.

**Structured data (JSON-LD) by page type**

| Page | Schema |
|---|---|
| Article / review / spotlight | `Article` (+ `Review` where applicable, with proprietary score in `reviewRating`) |
| Author profile | `Person` |
| Magazine issue | `CreativeWork` |
| Festival entry | `Event` |
| Video entry | `VideoObject` |
| Product | `Product` + `Offer` |
| All pages | `BreadcrumbList` · `Organization` (site-wide) |

**Per-page metadata:** canonical URL · OpenGraph (title, description, image, type) · Twitter/X card · meta description. Editable per post in the CMS via `seo_title`, `seo_description`, `og_image_url`, falling back to the post's own title, dek, and hero image.

**Site-wide:** XML sitemap, auto-generated and updated on publish · `robots.txt` · clean taxonomy at `/category/[category]` · author archive pages.

**VERIFY §47** — Validate every page type against Google's Rich Results Test. Zero errors. Assert sitemap includes all published entities and excludes drafts. Assert OG image renders correctly in a link-preview validator. Lighthouse SEO ≥ 95 on all routes.

## §48 Commerce

The simplest phase in the build. Do not overengineer.

- **Storefront** (`/shop`): all published products. Card = image, name, price, Buy. Conditional metadata: event date/location if ticketed; "Digital Download" if digital. Display logic only — no branching purchase flow.
- **Product detail** (`/shop/[slug]`): larger imagery, full description, Buy.
- **Checkout:** Stripe Checkout, redirect-based. One-click Buy per product. **No cart UI** unless explicitly requested later.
- **Webhook** (`/api/webhooks/stripe`): marks the order paid. If `digital_file_url` present, issues a signed, expiring download link. If `event_date` present, generates a unique `ticket_code`. No QR or scanning infrastructure.
- **Admin product form:** name, price, description, image upload, then three optional fields — inventory, digital file upload, event date/location.
- **Email:** confirm the team's existing transactional provider before wiring one.

**Transactional email is a hard dependency, not an escalation.** Download links and ticket codes are worthless if they never reach the buyer. Confirm the team's provider before Phase 12 begins; if none exists, Resend or Postmark are appropriate defaults. A purchase that produces a database row and no email is a failed purchase.

**VERIFY §48** — In Stripe test mode, complete a purchase for each shape. Assert: `orders` row created with correct amount · webhook signature verified · **confirmation email actually delivered to a real inbox for all three shapes** · download link in the email functional, access-controlled, and expiring · ticket code generated, unique, and present in the email · **webhook idempotency** — replay the same event and assert no duplicate order and no duplicate email.

## §48.1 Public Write Paths — Hardening

Two endpoints accept unauthenticated writes: newsletter signup (§37) and the submission form (§13 Delivery, Phase 13). RLS governs table access; it does not govern request volume. Both are spam targets.

Required on each:
- Rate limiting by IP — 5 requests per minute, 20 per hour. Vercel middleware or Upstash Redis.
- A honeypot field, plus a minimum time-to-submit threshold to defeat naive bots.
- Server-side validation and sanitization of every field. Never trust client validation.
- Email format verification on newsletter signup; consider double opt-in.
- Submissions land in the §45 admin queue as unpublished, never auto-published.

**VERIFY §48.1** — Script 25 rapid submissions to each endpoint. Assert rate limiting engages and returns 429. Assert honeypot submissions are silently rejected. Assert no submitted content reaches a public route without editor action.

---

# PART VII — DELIVERY

## §49 Phase Sequence

One branch, one pull request, one verification gate, one owner confirmation per phase. **No phase begins before the prior is confirmed.**

| # | Branch | Scope | Gate |
|---|---|---|---|
| 0 | `chore/ci-harness` | Playwright, Lighthouse CI, axe-core wired to PR checks. §49.1. **Before feature work.** | §49.1 |
| 1 | `feat/nextjs-migration` | Scaffold Next.js. Port existing pages 1:1. Zero visual change. Mobile video encode + poster optimization (§6.1). | §7 · §5 · §6 |
| 2 | `feat/supabase-foundation` | Provision Supabase. Schema §44. RLS. Env vars. URL architecture §8. | §44 · §8 |
| 3 | `feat/design-system` | Tokenize §4, §12, §13, §14. Component primitives. | §4 |
| 4 | `feat/homepage-hero` | §16 navigation, §17 hero. **Highest risk. Do not compress.** | §16 · §17 · §43 |
| 5 | `feat/content-gates` | §9 readiness gates + admin gate status display. | §9 |
| 6 | `feat/homepage-editorial` | §22 · §23 · §24 · §25 · §26 · §27 | Each VERIFY |
| 7 | `feat/homepage-industry` | §28 · §29 · §30 · §31 · §32 · §33 · §34 | Each VERIFY |
| 8 | `feat/homepage-closing` | §35 · §36 · §37 · §38 | Each VERIFY |
| 9 | `feat/admin-cms` | §45 roles, workflow, editor, media library, author profiles. | §45 |
| 10 | `feat/article-experience` | §46 reading experience, `/story/[slug]`, `/authors/[slug]`. | §46 |
| 11 | `feat/seo` | §47 structured data, metadata, sitemap. | §47 |
| 12 | `feat/store` | §48 storefront, checkout, webhook, product admin. | §48 |
| 13 | `feat/interior-pages` | About, Submit (with admin queue), Contact, Issues archive, category indexes, Opportunities and Festival listing pages. | §40 · §41 |

Phase 4 carries the highest risk and visibility. Phase 9 unblocks the editorial team — consider prioritizing it earlier if contributors are waiting to produce content.

## §49.1 Verification Enforcement — Continuous Integration

**"Regression is failure" requires a mechanism. Manual re-checking does not scale across thirteen phases.**

Every mechanically testable VERIFY assertion becomes an automated test at the phase that introduces it, and runs on **every subsequent pull request**. Phase 9's CMS work must not silently break Phase 4's hero.

**Established in Phase 1, before feature work:**

| Layer | Tool | Runs |
|---|---|---|
| Visual regression | Playwright screenshots at 1440×900 and 390×844 | Every PR |
| E2E behavior | Playwright — hero controls, nav states, gates, auth roles, checkout | Every PR |
| Performance | Lighthouse CI, thresholds per §41 | Every PR |
| Accessibility | axe-core on every route, §40 thresholds | Every PR |
| Structured data | Schema validation, §47 | Every PR after Phase 11 |
| Overflow | `scrollWidth === innerWidth` at all six mobile widths | Every PR |

**The §17 hero suite is the highest-value regression target in the build.** The pointer-events defect that disabled the video controls in production reached users precisely because nothing automatically re-tested it. Encode it as a test in Phase 4 and never remove it.

**Gate:** a PR with a failing CI check is not reviewable. The §43 composition test is excluded — it is owner judgment and cannot be scripted.

**VERIFY §49.1** — After Phase 4, deliberately reintroduce the pointer-events defect on a scratch branch. Assert CI catches it and blocks the PR. Revert. This proves the harness works before it is relied upon.

## §50 Pull Request Standard

Every PR includes:
1. Section references implemented
2. Verification results — every assertion, explicitly pass or fail
3. Screenshots at 1440×900 and 390×844
4. Lighthouse scores (performance, accessibility, SEO)
5. **New automated tests added for this phase's assertions** (§49.1)
6. Any specification ambiguity encountered and its resolution

A PR with a failing CI check or an unaddressed failing assertion is not ready for review.

## §51 Asset Manifest — Owner Deliverables

**Held:** logo (3 variants), 21 magazine covers, hero video.

| Section | Required |
|---|---|
| §22 Today · §25 Call Sheet | Editorial photography per story, 3:2 primary |
| §24 Spotlight · §27 Fresh Faces | Portraits, 4:5 |
| **§26 Below the Line** | **Authentic production and crew photography — not stock. Highest-priority asset need; this section carries the thesis.** |
| §28 Now in Production | Still or poster per project |
| §29 The Cut | 16:9 still per review |
| §30 Screening Room | Video files + thumbnail per entry |
| §31 Behind the Lens | Large still + subject portrait |
| §33 Festival Circuit | Festival photography |
| §34 Set Life 100 | Portrait per honoree |
| §35 Shop | Product photography, multiple angles · poster art per title/premiere |
| §45 Authors | Headshot per contributor (5–9) |

**Technical:** favicon set (16×16, 32×32, 180×180 apple-touch-icon) · default Open Graph image 1200×630.

§36 may draw live from the Instagram API — confirm during that phase.

---

# §52 Absolute Constraints

1. **Zero pixels of §22 visible before first scroll.** §17, §43.
2. **The primary hero encode's bitrate and resolution never regress.** §6. A supplementary smaller mobile source (§6.1) is delivery optimization and is explicitly permitted.
3. **No magazine object, no slideshow, no animated overlay on the hero video.** §17.
4. **Only the colors and typefaces in §4.** No exceptions.
5. **Text animation is required** — directional and deliberate, never scattered. §14, §17.
6. **Upper bound of every spacing range.** §13.
7. **One generic product type.** No per-category commerce systems. §44, §48.
8. **Sections render only above their content threshold.** Empty structure is worse than absent structure. §9.
9. **Contributors cannot publish.** Editorial workflow is enforced server-side, not in the UI. §45.
10. **No verification indicator without a real verification process.** §32.
11. **Every mechanically testable VERIFY assertion becomes a CI test and stays green.** §49.1. The §43 composition test is owner judgment and is exempt.
12. **Every VERIFY block passes before its phase closes.**

**Escalate rather than assume:** Vercel Pro upgrade for team collaboration · ticketing beyond a simple order code · which transactional email provider (required before Phase 12, not optional) · multi-item cart necessity · Instagram API access.

**Resolved — do not re-raise:** mobile video delivery (§6.1) · zero-404 during phased delivery (§8) · spotlight/fresh-face disambiguation and all other placement questions (§44) · Set Life 100 data model (§44 `honorees`) · team size and CMS role count (§2, §45).

**Out of scope — governed by the Growth Roadmap, do not implement:** user accounts · community and networking · industry directory · festival microsites · people/subject database · digital magazine reader · audience scoring · advertising inventory · roles beyond the three in §45.

---

*End of specification.*
