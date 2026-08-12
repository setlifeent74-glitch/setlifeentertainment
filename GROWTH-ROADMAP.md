# SET LIFE ENTERTAINMENT
## Growth Roadmap — Deferred Capability Register

**Purpose:** Preserve every strategic concept not entering the current build, with the conditions that should trigger reconsideration.
**Status:** Reference document. Nothing here is authorized for build.
**Companion to:** Platform Build Specification v4.1

Nothing in this register is rejected. Each item is **sequenced** — held until the condition that makes it succeed is met. Building any of these before its trigger condition produces a feature that advertises its own emptiness, which damages the brand more than absence would.

---

## TIER 1 — Near-term expansion
*Likely viable within 6–12 months of launch, given current team trajectory.*

### 1.1 Festival Hubs (temporary microsites)

**Concept.** Dedicated editorial hubs for major festivals — `SET LIFE AT ABFF`, `SET LIFE AT BLACKSTAR`, `SET LIFE AT SUNDANCE`, `SET LIFE AT TRIBECA`. Each carries breaking news, reviews, interviews, schedules, galleries, winners, acquisition news, and daily recaps.

**Why deferred.** Requires physical presence and daily filing during a festival window. A hub that goes quiet mid-festival reads worse than no hub.

**Trigger condition.** Two team members credentialed and physically attending a festival, with a filing schedule agreed in advance.

**Build estimate.** Moderate. Reuses existing post infrastructure with a hub template and a festival tag. 1–2 weeks once the content model exists.

**Strategic note.** Your geographic spread is an advantage here — Atlanta, LA, Memphis, and Orlando teams can each own regional festivals without travel budget. Start with a regional festival rather than Sundance.

---

### 1.2 Set Life 100 (annual franchise)

**Concept.** Annual recognition of influential and emerging people reshaping independent cinema. Categories across actors, directors, producers, writers, executives, crew, innovators, distributors, festival leaders, educators.

**Why deferred from launch.** The section cannot render before the list exists. It is an editorial research project, not a feature.

**Trigger condition.** The list is compiled and editorially defensible. Requires roughly one quarter of lead time.

**Build estimate.** Low engineering, high editorial. The homepage module and a dedicated landing page are straightforward; the research is the work.

**Strategic note.** This has the highest long-term brand value of anything in the deferred register. It creates an annual news moment, generates inbound from every honoree, and establishes authority. Prioritize it as the first Tier 1 item.

---

### 1.3 Universal Search

**Concept.** Federated search across posts, people, magazine issues, reviews, opportunities, festivals, and video, with predictive suggestions and filters that update without page reload.

**Why deferred.** Search delivers little value below roughly 100 pieces of content and becomes essential above roughly 300.

**Trigger condition.** 100+ published items.

**Build estimate.** Moderate. Supabase full-text search covers this without additional infrastructure. 1–2 weeks.

---

### 1.4 Structured Opportunities Database

**Concept.** Upgrade Opportunities from a post category to a first-class structured entity — dedicated fields for compensation, department, experience level, union status, eligibility, application link, source, verification status, and automatic expiry flagging. Filterable by location, remote, paid/unpaid, department, experience, deadline, production type.

**Why deferred.** The post-category implementation in the current build handles low volume correctly. Structured data pays off at scale.

**Trigger condition.** 25+ concurrent live listings, or a dedicated person managing the vertical.

**Build estimate.** Moderate. Schema migration plus filter UI. 1–2 weeks.

**Strategic note.** This is the single most defensible utility feature in the entire concept. Filmmakers return weekly for opportunities in a way they do not return weekly for articles. It converts readership into habit.

---

## TIER 2 — Mid-term expansion
*Viable at meaningful scale. 12–24 months.*

### 2.1 People / Profile Database

**Concept.** Individual professional profile pages at `/people/[name]` — biography, headshot, gallery, credits, featured projects, awards, linked interviews and articles, video reel, external links, representation, skills, union affiliation, availability status. Editorially verified profiles receive a `SET LIFE VERIFIED` indicator.

**Why deferred.** Profiles are only valuable when densely interlinked with coverage. A profile page for someone with one article is a dead end.

**Trigger condition.** 50+ people covered across multiple pieces, so profiles aggregate rather than orphan.

**Build estimate.** Moderate-High. New entity, relationship modeling to posts, template work, and a verification workflow.

**Strategic note.** Partially seeded by the current build — author profile pages ship in v4.0 and establish the pattern. Subject profiles extend it.

**Verification caution.** Do not display a verification indicator without a documented process behind it. Define what verification means, who performs it, and what evidence is required, before the badge exists.

---

### 2.2 Digital Magazine Reader

**Concept.** A full in-browser reading experience for magazine issues — page navigation, table of contents, kinetic transitions between issues, print/purchase integration.

**Why deferred.** The current build renders issues as web-native article collections, which is better for SEO and mobile than a page-flip reader. A reader is an enhancement, not a requirement.

**Trigger condition.** Demonstrated reader demand for issue-as-object consumption, or a print product requiring a digital companion.

**Build estimate.** High if built properly. Consider third-party issue-reader services before custom work.

**Explicit caution.** The source brief warns against page-flip gimmickry. Any reader must be genuinely better than scrolling, not merely skeuomorphic.

---

### 2.3 Review Scoring System — Audience Layer

**Concept.** Dual scoring — `CRITIC SCORE` alongside `AUDIENCE SCORE`, the latter from verified registered users.

**Why deferred.** Audience scoring requires user accounts, which requires authentication, moderation, spam prevention, vote manipulation defense, and dispute handling. That is disproportionate infrastructure for a secondary metric.

**Trigger condition.** User accounts exist for another justified reason (see 3.1). Never build accounts solely to enable this.

**Build estimate.** Low on top of an existing account system. Prohibitive as a standalone justification.

**Note.** The critic score ships in the current build. It is sufficient and proprietary.

---

### 2.4 Advertising Infrastructure — MOVED TO ACTIVE BUILD

**No longer deferred.** Owner decision, overriding the original recommendation below: build now, at Phase 12, direct-sold only (two placements — homepage banner, in-article inline). See BUILD-SPEC.md §48.2. The reasoning that followed still governs the design even though the timing call changed.

**Original concept.** Deliberate, editorially-placed ad inventory that does not degrade the premium rhythm.

**Original deferral reasoning, for context.** Ad inventory requires audience scale to sell. Premature ad slots render empty or fill with low-quality network placements that materially damage a premium publication. The technical risk (empty inventory) is handled the same way §9's content gates handle everything else — an unsold placement doesn't render, it doesn't show a placeholder. That leaves only the *sales* risk (can it actually be sold before there's traffic), which is the owner's call to make, not a technical constraint.

**Strategic note — still governs the build.** Direct-sold sponsorship of a named franchise — "The Call Sheet, presented by —" — preserves editorial quality far better than programmatic network inventory. Pursue sponsorship, not ad networks. This held even after the timing decision changed.

---

### 2.5 Print Edition

**Concept.** A physical print run of magazine issues, alongside the online-only publication. Explicitly intended eventually, per the owner — not a hypothetical.

**Why deferred.** No print production, distribution, or fulfillment relationship exists yet. Print has real unit economics (print run size, per-unit cost, distribution/shipping) that don't apply to a digital publication — this isn't a copy change, it's a new production and fulfillment pipeline.

**Trigger condition.** A print production partner and distribution plan identified, and confidence the digital audience justifies a print run's fixed costs.

**Build estimate.** Low on the software side — `magazine_issues` (§44) was kept print-agnostic on purpose, so adding `print_run_count`, `isbn`, `distributor`, `ship_date` fields later doesn't require a schema rework. The real cost is entirely in the physical production and distribution relationship, which is outside this build's scope.

**Note on paid cover placements (§48.3).** These currently sell placement on the *digital* cover only. When print exists, decide explicitly whether a cover purchase includes the print edition or stays digital-only — don't let that ambiguity ship silently when Print Edition gets built.

---

## TIER 3 — Long-horizon / conditional
*Requires substantial scale or represents a distinct business line.*

### 3.1 Community — User Accounts & Networking

**Concept.** Registered user accounts with profiles, follows, bookmarked articles, saved opportunities and festivals, watchlists, film ratings, category subscriptions, personalized opportunity alerts, project pages, reel uploads, credits, résumés, and eventually private messaging.

**Why deferred — and the strongest recommendation in this register.** This is not a feature set. It is a second company. Professional networks are two-sided marketplaces with severe cold-start dynamics; they are worthless until both sides reach critical mass, and they require permanent investment in moderation, trust and safety, spam control, and dispute resolution. Stage 32 has pursued this for over a decade with dedicated resources.

A network that launches empty is reputationally worse than one that never launches. Publication credibility is spent, not built, by an abandoned social layer.

**Trigger condition.** The publication has an audience large enough that a network would populate itself in its first week without seeding. Realistically a multi-year question. Reassess only after sustained, substantial traffic.

**Build estimate.** Very High. Ongoing operational cost exceeds build cost.

**Intermediate alternative — recommended instead.** Newsletter segmentation delivers most of the personalization value at a fraction of the cost. Saved-opportunity alerts and category subscriptions can be served by email preferences without accounts, moderation, or a social graph. The current build's newsletter preference architecture is the correct first step.

---

### 3.2 Industry Directory

**Concept.** Searchable directories of talent, crew, production companies, post houses, casting companies, festivals, distributors, studios, film schools, rental houses, and location services, filtered by geography, profession, and specialty.

**Why deferred.** Pure cold-start failure. A directory with twelve entries is worse than no directory — it demonstrates thinness in the exact place the brand claims authority. Unlike Opportunities, which delivers value at low volume because a filmmaker needs one relevant listing, a directory only becomes useful at comprehensive scale.

**Trigger condition.** A viable seeding path — a data partnership, an acquired dataset, or a dedicated compilation effort — plus a maintenance owner. Do not launch incrementally.

**Build estimate.** Moderate engineering, very high data acquisition and maintenance cost.

---

### 3.3 The Greenlight — Project Promotion

**Concept.** Section highlighting upcoming independent projects seeking audience awareness, festival attention, distribution, crew, casting, or partnerships.

**Why deferred.** Overlaps substantially with Now in Production and Opportunities, both shipping in the current build. Adding a third adjacent section fragments content across modules that each look sparse.

**Trigger condition.** Now in Production reaches volume where a promotional tier becomes a meaningful distinction.

**Critical legal constraint — carried forward from the source brief.** Under no circumstances facilitate financial investment solicitation without securities-law compliance architecture and counsel. Connecting filmmakers to investors is regulated activity. This constraint is absolute and survives any change in scope.

---

### 3.4 Nine-Role Editorial Workflow

**Concept.** Administrator, Editor-in-Chief, Managing Editor, Section Editor, Writer, Reviewer, Video Editor, Contributor, Community Moderator.

**Why deferred.** The current build ships three roles — Administrator, Editor, Contributor — correctly sized for 5–9 distributed contributors. Additional roles add permission complexity without operational benefit until the newsroom has genuine functional separation.

**Trigger condition.** 15+ contributors with distinct standing responsibilities, or section editors with real editorial authority over defined verticals.

**Build estimate.** Low. The three-role system in v4.0 is designed to extend without migration.

---

### 3.5 Original Video Production at Scale

**Concept.** The Screening Room as a continuous original programming operation — director conversations, roundtables, set visits, red carpets, studio visits, behind-the-scenes documentaries, original series.

**Why gated rather than deferred.** The section ships in the current build but renders only when video content exists (see Content Readiness Gates in the build spec). This is a capacity question, not an engineering one.

**Trigger condition.** Sustained video production capability. Video is the most expensive content type per unit; confirm capacity before committing the section to the homepage permanently.

**Interim approach.** Embedded interviews and trailers satisfy the section at low cost. Original programming can follow.

---

## Sequencing Recommendation

Ordered by value-to-cost given current trajectory:

| Priority | Item | Rationale |
|---|---|---|
| — | **Advertising / Sponsorship** (2.4) | **No longer a roadmap item — moved to the active build, Phase 12.** Left here only so the original reasoning isn't lost. |
| 1 | **Set Life 100** (1.2) | Highest brand value. Creates an annual news moment. Low engineering cost. |
| 2 | **Structured Opportunities** (1.4) | Converts readership into weekly habit. Most defensible utility. |
| 3 | **Universal Search — full version** (1.3) | A minimal v1 (single query, no filters) already ships in the main build (BUILD-SPEC.md §16). This item is specifically the scaled-up successor — filtering, ranking, predictive suggestions — once the archive is large enough to need it. |
| 4 | **Festival Hubs** (1.1) | Geographic team spread makes this achievable earlier than typical. |
| 5 | **People Database** (2.1) | Compounds SEO and interlinking. Requires coverage density first. |
| 6 | **Print Edition** (2.5) | Owner has confirmed intent to eventually go to print. Gated on a production/distribution partner, not on engineering — schema is already print-agnostic. |
| — | Everything in Tier 3 | Reassess annually. Do not build on enthusiasm. |

---

## Governing Principle

Every item here fails the same way if built early: it renders empty, and empty structure signals abandonment more loudly than absent structure signals modesty.

The current build is designed so each of these can be added without architectural rework. The data model, URL structure, and component system in v4.0 anticipate all of it.

**Build the container when you can fill it. Not before.**
