# Niche Implementation — Master Index & SEO Strategy

**Date:** 2026-05-17
**Purpose:** Single entry point to all 9 niche implementation plans. Establishes the SEO-first principles common across all plans and recommends a build order.

---

## 1. The 9 niche plans

Each plan is a standalone implementation spec with SEO baked in. They can be built in any order; companion docs note any cross-dependencies.

| # | Plan | File | Effort (days) | Indexable URLs | Primary distribution channel |
|---|---|---|---|---|---|
| 1 | Sauna / Cold-Plunge | `2026-05-17-niche-sauna-cold-plunge.md` | 5 | 6 | r/Sauna + creator outreach |
| 2 | Debate / Toastmasters | `2026-05-17-niche-debate-toastmasters.md` | 8.5 | 11 | Coach cold email |
| 3 | Classroom Toolkit | `2026-05-17-niche-classroom-toolkit.md` | 10 | 9 | EdTech listicle inclusion |
| 4 | Streamer BRB Overlay | `2026-05-17-niche-streamer-brb-overlay.md` | 3.5 | 6 | OBS Project Resources |
| 5 | BGG Multi-Player Turn Timer | `2026-05-17-niche-bgg-multiplayer-turn-timer.md` | 4.5 | 10 | BoardGameGeek geeklist |
| 6 | Coffee (Pour-Over + Espresso) | `2026-05-17-niche-coffee-pour-over-espresso.md` | 6 | 13 | Lance Hedrick / FLTR feature |
| 7 | Tea (Per-Type + Gongfu) | `2026-05-17-niche-tea-multi-cup.md` | 5 | 10 | MeiLeaf / TeaDB feature |
| 8 | 20-20-20 Eye Strain | `2026-05-17-niche-20-20-20-eye-strain.md` | 2.5 | 3 | SEO + productivity blogs |
| 9 | Embed Widget Infrastructure | `2026-05-17-niche-embed-widget.md` | 5 | 7 (+ N invisible) | Backlink compounding |
| | **Total** | | **~50 days (~10 weeks)** | **75 new pages** | |

## 2. SEO principles common to every plan

These show up in each plan but are repeated here as the standing rules for any future niche addition.

### 2.1 URL structure rules

- Use **spelled-out slugs** for keyword match: `/lincoln-douglas` not `/ld`.
- Each preset/variant gets its **own indexable URL** — programmatic long-tail.
- Hub pages target head/mid-volume queries; preset pages target long-tail.
- One **canonical per URL** — presets are canonical to themselves (not to the hub).
- Top-level routes (`/classroom`, `/brb`) when they match search intent better than nested ones.

### 2.2 On-page SEO rules

For every new page:

- `<title>` ≤ 60 chars, keyword in first 30.
- `<meta description>` ≤ 160 chars, includes secondary keyword + value prop.
- Unique H1 matching primary query.
- 700-1500 words of body content (depth varies: tools 700, recipe pages 1000, health 1500).
- FAQ section (5-8 Q&A) — feeds FAQPage schema.
- Internal links: 3-5 inbound from related pages, 3-5 outbound to siblings.
- OG image (static for v1; dynamic later).
- `revalidate = 60` for ISR (existing pattern).

### 2.3 Schema markup baseline

Every page gets:

- **`WebApplication`** — existing pattern (see `tabata/layout.tsx`).
- **`BreadcrumbList`** — existing pattern.
- **`FAQPage`** — add to `TimerSeoContent` if not present.

Niche-specific schema where applicable:

- **`Recipe`** — pour-over recipes (highest rich-result value).
- **`HowTo`** — debate timing guides, OBS setup, embed integration.
- **`MedicalWebPage`** — 20-20-20 timer (health content E-E-A-T).
- **`ItemList`** — classroom hub.
- **`Game`** — board-game preset pages.

### 2.4 Internal linking rules

- Every new page is linked **FROM**:
  - Its category landing page.
  - 2-3 related pages within the category.
  - Sibling preset pages.
- Every new page links **TO**:
  - The category landing page.
  - 2-3 related niches in other categories where relevant.
  - The relevant hub (if it's a preset).
- **Anchor text variation** — never use the same anchor twice in one paragraph.

### 2.5 Backlink-first features

Every plan includes at least one feature designed to earn backlinks:

| Feature | Plans using it |
|---|---|
| **Shareable URL with config encoded** | All plans |
| **Print-friendly card** | Classroom, Debate, Sauna |
| **Embed iframe** | Eventually all plans (via plan #9) |
| **Permanent-listing channels** | BRB (OBS Resources), BGG (geeklist), Homebrew (HomeBrewTalk) |
| **Authoritative sources cited** | 20-20-20, Sauna, Coffee, Tea |
| **Rich-result schema** | Recipe (coffee), HowTo (debate, BRB) |

### 2.6 What NOT to do (SEO anti-patterns)

- **Do NOT target bare "X minute timer" queries.** Google's built-in widget kills the click. Generate these only as byproducts of niche pages (e.g., `/tea-timer/green` contains "3 minute tea timer" naturally).
- **Do NOT duplicate content across preset pages.** Each preset page needs unique body content for its specific use case.
- **Do NOT use generic OG images.** A page with no distinctive preview image gets fewer social shares.
- **Do NOT noindex any preset URL.** All preset URLs should be indexable (only `/e/*` embed pages are `noindex`).
- **Do NOT auto-prompt for browser permissions.** (Notifications, mic, location.) Tap-to-enable only.
- **Do NOT cross-link with the same anchor text repeatedly.** Vary anchor text per occurrence.

## 3. Recommended build order

Three valid sequences depending on your priorities:

### Sequence A — "Fastest learning"

Ship the smallest niches first to validate the SEO-first pattern, then scale up.

1. **Week 1**: 20-20-20 Eye Strain (2.5 days) + Streamer BRB (3.5 days) — 6 days, simplest niches
2. **Week 2-3**: Sauna/Cold-Plunge (5 days) + BGG Turn Timer (4.5 days) — 9.5 days
3. **Week 4-5**: Coffee (6 days) + Tea (5 days) — 11 days
4. **Week 6-7**: Debate (8.5 days) — heaviest single niche
5. **Week 8-9**: Classroom Toolkit (10 days) — largest scope
6. **Week 10**: Embed Widget (5 days) — backlink moat as the capstone

### Sequence B — "Maximum traffic in 3 months"

Front-load the highest-traffic potential plans.

1. **Weeks 1-2**: Sauna + Debate (start) — biggest single wins
2. **Weeks 3-5**: Debate (finish) + Classroom Toolkit — heaviest builds
3. **Weeks 6-7**: Coffee + Tea — moderate complexity, recipe-rich
4. **Weeks 8-9**: BGG + 20-20-20 + BRB
5. **Week 10**: Embed Widget

### Sequence C — "Backlink moat first"

If you believe the compounding backlink play is the highest-leverage move long-term.

1. **Weeks 1-2**: Embed Widget Infrastructure (5 days)
2. **Weeks 3-4**: 3-4 smallest niches (BRB, 20-20-20, Sauna)
3. **Weeks 5-8**: Coffee + Tea + BGG
4. **Weeks 9-12**: Classroom + Debate

**My recommendation: Sequence A.** It de-risks the SEO-first pattern (each plan applies many of the same SEO principles, so polishing them on the smallest niche first reduces rework on the biggest).

## 4. Cross-cutting work (do once, benefits all niches)

These are one-time investments that pay off across every plan. Do them in week 1 before niche-specific work begins.

### 4.1 Schema component enhancements (~0.5 day)

Audit `src/components/timer/timer-seo-content.tsx`:
- [ ] Add `FAQPage` JSON-LD emission if not present.
- [ ] Add prop support for additional schema types (`HowTo`, `Recipe`, `MedicalWebPage`, `ItemList`, `Game`).

### 4.2 OG image pipeline (~0.5 day)

For v1, static OG images per page. For v2, a dynamic generator:
- Static for now: design a template in Figma, export ~75 PNGs (one per page).
- Note in each plan that v2 should swap to dynamic via `@vercel/og` or similar.

### 4.3 Sitemap automation (~0.25 day)

Check `src/app/sitemap.ts`:
- If manually maintained, plan how to add 75 new URLs efficiently (probably batch by category).
- If filesystem-scanned, ensure new routes are auto-discovered.

### 4.4 iOS Safari audio + wake-lock audit (~0.5 day)

Verify in `timer-provider.tsx` / `timer-shell-v2.tsx`:
- [ ] iOS audio unlock pattern is shared and reused.
- [ ] Wake-lock is requested for any timer > 60s.
- Document the shared utilities so niche plans don't reinvent.

### 4.5 Cross-link audit (~0.25 day)

Establish a canonical "related timers" registry so cross-links are consistent:
- File: `src/lib/related-timers.ts`
- Each timer slug → array of related slugs.
- Used by every page's "Related" section.

**Total cross-cutting work: ~2 days.**

## 5. Per-niche traffic estimate (12-month order of magnitude)

Rough estimates assuming each niche gets baseline outreach (1-2 channels per the outreach plan) and decent SEO ranking on long-tail.

| Niche | 12mo monthly traffic | Confidence |
|---|---|---|
| Sauna / Cold-Plunge | 2-5k/mo | Medium-High |
| Debate / Toastmasters | 1-3k/mo | Medium |
| Classroom Toolkit | 3-8k/mo (if listicle inclusion works) | Medium |
| Streamer BRB | 1-3k/mo | Medium |
| BGG Turn Timer | 0.5-2k/mo | Medium |
| Coffee | 2-4k/mo | Medium |
| Tea | 1-3k/mo | Medium-Low |
| 20-20-20 | 1-3k/mo | Medium |
| Embed Widget | indirect (backlink lift across site) | High value, hard to measure directly |
| **Total** | **~11-31k/mo new traffic** | Order-of-magnitude only |

These are highly speculative — actual results depend heavily on outreach execution (see growth-outreach plan).

## 6. Implementation tracking

Per-plan status file: `docs/outreach/niche-status.csv`:

| Field | Values |
|---|---|
| Niche | (plan name) |
| Status | `planned` / `in-progress` / `shipped` / `validated` |
| Shipped date | YYYY-MM-DD |
| Pages indexed (Search Console) | (number) |
| First impressions (Search Console) | YYYY-MM-DD |
| First clicks | YYYY-MM-DD |
| Monthly traffic (most recent) | (number) |
| Outreach channels activated | (list) |
| Next action | (TBD) |

Review monthly.

## 7. SEO measurement plan

**Week 1 (after each niche launches):**
- Submit URLs to Google Search Console (Indexing → URL Inspection).
- Verify sitemap update is processed.

**Weeks 2-4:**
- Monitor Search Console impressions per page.
- For pages with > 100 impressions and < 2% CTR, rewrite meta description.
- For pages with 0 impressions after 4 weeks, check for indexing issues.

**Month 2-3:**
- Audit which long-tail queries are appearing in impressions.
- Add long-tail variants for the most promising queries (new preset pages).

**Month 3+:**
- Track domain authority changes (Ahrefs / SEMrush).
- Quarterly audit of internal linking — add new cross-links between high-performing pages.

## 8. Open questions for the implementer

Before starting any single niche:

1. **Do we have access to Google Search Console for gotimer.org?** Required for indexing requests and CTR data.
2. **What's the OG image template?** Need a design before generating ~75 images.
3. **Is there an existing related-timers registry?** Check before building one.
4. **Is the homepage nav extensible without redesign?** Several plans add to top-level nav.
5. **Do we have analytics that distinguishes channel sources** (organic Google vs. Reddit referral vs. OBS Resources)? Needed for measuring per-plan effectiveness.

## 9. Files index

All plans live in `docs/plans/`:

- `2026-05-17-growth-outreach-plan.md` — the outreach companion (handled separately per user instruction)
- `2026-05-17-three-niche-implementation.md` — original plan (now superseded by the per-niche files)
- `2026-05-17-alternative-niche-cut.md` — decision aid for picking a 3-niche cut (still useful for prioritizing build order)
- `2026-05-17-multi-step-verification.md` — strategy code verification (de-risks Sauna and Debate plans)
- `2026-05-17-outreach-email-templates.md` — ready-to-send templates (for the outreach side)
- `2026-05-17-niche-implementation-index.md` — this file
- `2026-05-17-niche-sauna-cold-plunge.md`
- `2026-05-17-niche-debate-toastmasters.md`
- `2026-05-17-niche-classroom-toolkit.md`
- `2026-05-17-niche-streamer-brb-overlay.md`
- `2026-05-17-niche-bgg-multiplayer-turn-timer.md`
- `2026-05-17-niche-coffee-pour-over-espresso.md`
- `2026-05-17-niche-tea-multi-cup.md`
- `2026-05-17-niche-20-20-20-eye-strain.md`
- `2026-05-17-niche-embed-widget.md`
