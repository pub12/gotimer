# GoTimer.org — Site Iteration PRD

**Version:** 2.1 (Codebase-verified)
**Date:** May 1, 2026
**Source data:** Days 1–11 operational logs, GSC/GA4, logbook, and direct codebase audit of `/src`

---

## Audit Summary

Before listing open items, here's what the codebase audit confirmed as **already implemented** — removing these from the backlog.

### ✅ Already Done

| Item | Evidence |
|---|---|
| Duration timer content (5, 10, 15, 20, 25, 30, 45, 60 min) | All 8 pages fully covered in `quick-timer-content.ts` with 400–600 word intro, meta, and FAQs |
| GPTBot / ClaudeBot robots.txt | `robots.ts` has clean, consistent Allow rules for both — no conflict |
| Article JSON-LD (BlogPosting) | `blog/[slug]/page.tsx` injects full BlogPosting schema on every post |
| WebApplication schema | `layout.tsx` has global WebApplication + Organization + WebSite in `@graph` |
| WebApplication schema on sub-pages | Individual layouts (e.g. `wellness/sleep/layout.tsx`) have page-specific WebApplication schema |
| HowTo schema on setup pages | All three setup pages have HowTo + BreadcrumbList schema in their layouts |
| BreadcrumbList schema | Present on setup pages and sub-category timer pages |
| FAQPage schema | Intentionally removed — Google deprecated FAQ rich results Aug 2023; `faq-accordion.tsx` documents this decision. Do not re-add. |
| Sleep timer meta description | `/wellness/sleep/layout.tsx` has a solid, benefit-led meta. No change needed. |
| Social proof strip | `SocialProof` component live on homepage ("28+ Free Timers, 0 Sign-ups Required") |
| Photography timer category | 6 sub-pages live: film-development, long-exposure-calculator, enlarger-timer, stand-development, cyanotype, photo-walk |
| /board-games/turn-timer page | Full page with WebApplication schema, per-player countdown for 2–8 players |
| Setup pages (noindex question) | These pages have real HowTo schema + quality metadata. They should stay indexed. |

---

## Open Items

25 items from the original PRD reduced to **13 genuine gaps** after the codebase audit.

---

## Priority 1 — Robots.txt & Crawlability (Critical, Low Effort)

These unblock AI engine indexing. All are 1–5 line changes.

### P1.1 — Add Google-Extended Allow Rule

**Issue:** `robots.ts` has no Google-Extended entry at all. While the site isn't actively blocking it, an explicit `Allow: /` rule is best practice for Google AI Overviews (Gemini). More critically, the Cloudflare-managed WAF section may be overriding the generated `robots.txt` — this needs to be confirmed in the Cloudflare dashboard.

**Action:**
1. Check Cloudflare → Security → Bots → whether a managed rule is injecting a `Disallow: /` for Google-Extended.
2. Add to `robots.ts`:
```ts
{
  userAgent: "Google-Extended",
  allow: "/",
  disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
},
```

**Risk:** None. Only increases crawlability.

---

### P1.2 — Add Applebot-Extended Allow Rule

**Issue:** Apple Intelligence uses `Applebot-Extended` for AI citations. Not in `robots.ts` at all.

**Action:** Add to `robots.ts`:
```ts
{
  userAgent: "Applebot-Extended",
  allow: "/",
  disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
},
```

**Effort:** 5 minutes.

---

### P1.3 — Fix Canonical Tags on /board-games Sub-Pages

**Issue:** `/board-games/chess-clock/layout.tsx` sets `canonical: "/board-games/chess-clock"` — pointing to itself, not to the top-level `/chess-clock` page. Same pattern likely applies to `/board-games/countdown` and `/board-games/round-timer`. This means Google sees two separate pages with near-duplicate content, neither consolidating ranking signals.

**Decision required:** Should `/board-games/*` pages consolidate into the top-level equivalents, or are they intentionally separate with distinct content?

- If consolidating: change canonicals to point to top-level (`/chess-clock`, `/countdown`, `/round-timer`)
- If keeping separate: ensure the sub-pages have meaningfully different content and cross-link to each other

**Current state of `/board-games/chess-clock`:** Title is "Board Game Chess Clock | GoTimer" with a minimal layout — no unique content added vs the top-level `/chess-clock`. This should consolidate.

---

## Priority 2 — New Pages (High Value, Medium Effort)

### P2.1 — Add /game-timer Dedicated Landing Page

**Issue:** No `/game-timer` page exists. GSC shows the keyword cluster already generating impressions on unrelated pages:

| Query | Impressions | Position |
|---|---|---|
| game timer | 35 | ~28 |
| go game clock | 20 | ~31 |
| turn timer | 11 | ~35 |

`/board-games/turn-timer` covers the turn-timer use case but isn't targeting "game timer" as a primary keyword. A `/game-timer` page acts as the umbrella landing page linking out to the specific timer tools.

**Spec:**
- URL: `/game-timer`
- Title: `Free Online Game Timer — Board Games, Turn Timer & Chess Clock`
- Content: 500+ words covering board game timing generally, linking to `/board-games/turn-timer`, `/chess-clock-setup`, `/board-games/chess-clock`
- Include Go/byoyomi section (targets "go game clock" query)
- WebApplication schema + BreadcrumbList
- Add to sitemap and category navigation

---

### P2.2 — Add /interval-timer Dedicated Page

**Issue:** No `/interval-timer` page exists. Estimated 200K+ monthly searches. GoTimer has all the underlying timers (HIIT, Tabata, EMOM) but no umbrella page capturing the generic "interval timer" query.

**Spec:**
- URL: `/interval-timer`
- Title: `Free Interval Timer Online — HIIT, Tabata, EMOM & Custom`
- Content: What interval training is, difference between HIIT/Tabata/EMOM, how to use each, links to `/fitness/hiit`, `/fitness/tabata`, `/fitness/emom`
- This is the highest-volume missing page on the site

---

### P2.3 — Add Go Byoyomi Section to /chess-clock

**Issue:** "go game clock" generates 20 impressions but the chess-clock page only mentions Go in passing ("Works for chess, Scrabble, Go…") with no byoyomi-specific content.

**Action:** Add a dedicated section to `/chess-clock/page.tsx`:
- "Using GoTimer as a Go Clock (Byoyomi)" — ~200 words explaining byoyomi timing, how to approximate it with the chess clock, common byoyomi periods (30s, 60s)
- This directly serves the 20+ GSC impressions searching for "go game clock"

---

## Priority 3 — Homepage Optimisation

### P3.1 — Improve Homepage Title Keyword Order

**Issue:** Current title: `"GoTimer — Free Online Timers with Leaderboard & Competition"`

At position 18.1 with 521 impressions, the brand name leads — which means the primary keyword "free online timer" doesn't appear until after the dash. Users scanning SERPs see "GoTimer" first, which means nothing to them.

**Suggested title:** `"Free Online Timer — Countdown, HIIT, Chess Clock & More | GoTimer"`

This leads with the user's intent keyword, then lists the strongest timer types (reducing pogo-sticking), then brand for recognition.

**Also check:** The `description` in `layout.tsx` leads with "Free countdown timers, Pomodoro, HIIT…" which is actually good. Just the title ordering needs attention.

---

## Priority 4 — Timer Page Content Depth

### P4.1 — Add Content to Remaining DB Timer Pages

**Issue:** Seed script created 20 timer pages total including `pomodoro-timer`, `hiit-timer`, `meditation-timer`, `breathing-timer`, `cooking-timer`, `egg-timer`, `fasting-timer`, `study-timer`, `classroom-timer`, `presentation-timer`, `adhd-focus-timer`, `sleep-timer`. These pages exist as DB entries but may have thin `intro_html` depending on whether content was added post-seed.

**Action:** Audit each via the admin panel or DB query. Any page with `intro_html` under ~400 words should be expanded using the same pattern as `quick-timer-content.ts`.

---

## Priority 5 — E-E-A-T & Trust Signals

### P5.1 — Author Bio Component on Blog Posts

**Issue:** `blog/[slug]/page.tsx` has no author bio section. The BlogPosting JSON-LD sets `author` to `Organization: GoTimer` (not a person). Google's helpful content system rewards personal authorship signals, and AI engines prefer citing sources with identifiable authors.

**Spec:**
- New `AuthorBio` component rendered below the article body, above the FAQ section
- Fields: name, avatar (character mascot works), 1–2 sentence bio, optional social link
- Update BlogPosting JSON-LD `author` to `@type: Person` when a named author is set
- Even a single "GoTimer Editorial Team" author card would improve E-E-A-T score

---

### P5.2 — Strengthen Social Proof Stats

**Issue:** The existing `SocialProof` component shows "6 Timer Categories, 28+ Free Timers, 0 Sign-ups Required". These stats are accurate but don't convey scale or trust. "0 Sign-ups Required" is a feature, not a proof point.

**Suggested replacement stats:**
- "40+ Free Timers" (after upcoming additions)
- "Used in 50+ Countries" (verifiable via GA4 geo report)
- "0 Sign-ups Required" → "100% Free, Forever"

Or add a fourth stat: "Cited by ChatGPT" / "AI-recommended" if comfortable making that claim.

---

## Priority 6 — Content Strategy

### P6.1 — Blog Articles to Support Photography Timer Pages

**Issue:** The photography timer pages (6 sub-pages) exist as functional tools but have no blog content supporting them. The photography niche is a unique differentiator — no competitor covers darkroom/film timing. Blog articles drive the organic long-tail traffic that converts to timer page visits.

**Suggested articles (Drake character):**
1. "How to Use a Timer for Long Exposure Photography" — targets "long exposure timer", links to `/photography/long-exposure-calculator`
2. "Film Development at Home: Why Your Timer Is the Most Important Tool" — targets "film development timer", links to `/photography/film-development`
3. "Cyanotype Printing: Getting UV Exposure Times Right" — niche but zero competition, links to `/photography/cyanotype`

---

### P6.2 — Board Game Blog Articles to Support /board-games

**Issue:** `/board-games/` has 4 functional timer pages but no supporting blog content. Topics 35–38 from the content plan specifically target board game search queries that would feed these pages.

**Suggested articles (Drake character):**
1. "Best Timer Settings for Scrabble" — targets "scrabble timer rules"
2. "Do You Need a Timer for Catan?" — debate format, links to `/board-games/turn-timer`
3. "Turn Timer for Board Games" — supports the "turn timer" + "game timer" keyword cluster, links to `/game-timer` (new page P2.1)

---

### P6.3 — Comparison / VS Articles for GEO

**Issue:** AI engines frequently answer "X vs Y" queries by citing structured comparison sources. GoTimer already has standalone articles for Pomodoro and 52-17 — a direct comparison piece is the natural next step and will capture AI citations when users ask those methods to be compared.

**Suggested articles (Scout character):**
1. "Pomodoro vs 52-17: Which Study Timer Method Is Right for You?" — directly compares two articles already live on the blog
2. "HIIT vs Tabata: What's the Difference and Which Timer Do You Need?" (Drake) — high volume, supports `/fitness/hiit` and `/fitness/tabata`

---

## Not Recommended (Reversed from Original PRD)

| Item | Reason |
|---|---|
| Noindex setup pages | Setup pages have HowTo schema, BreadcrumbList, and quality metadata. They're good SEO pages. Noindexing would lose existing GSC impressions. |
| FAQPage JSON-LD | Google deprecated FAQ rich results for most sites in August 2023. Already correctly removed. Do not re-add. |
| WebApplication schema on timer pages | Already implemented globally in `layout.tsx` and per-page where needed. |
| Article JSON-LD on blog posts | Already implemented in `blog/[slug]/page.tsx`. |
| HowTo schema | Already on setup pages. |

---

## Sprint Sequence Recommendation

| Week | Items | Expected Outcome |
|---|---|---|
| 1 | P1.1 (Google-Extended) + P1.2 (Applebot) + P3.1 (homepage title) | Unblock AI crawlers, improve homepage CTR |
| 2 | P1.3 (board-games canonical decision) + P4.1 (DB timer page content audit) | Fix duplicate content signals, add content depth |
| 3 | P2.1 (/game-timer page) + P2.3 (Go byoyomi on /chess-clock) | Capture 66+ game-timer cluster impressions |
| 4 | P2.2 (/interval-timer page) | Target 200K/mo interval-timer keyword |
| 5 | P5.1 (author bio) + P6.3 (comparison articles) | E-E-A-T improvement + GEO citation targets |
| 6 | P6.1 + P6.2 (photography + board game blog articles) | Long-tail content supporting existing timer pages |

---

## Key Metrics to Track

| Metric | Current | 30-Day Target | Source |
|---|---|---|---|
| Homepage GSC position | 18.1 | < 12 | GSC Performance |
| Game-timer cluster position | ~30 (no dedicated page) | < 15 (/game-timer live) | GSC Queries |
| Interval-timer ranking | Not ranking | Position < 30 | GSC Queries |
| ChatGPT referral sessions | 25 / 11 days | > 100 / 30 days | GA4 |
| Google-Extended status | Unconfirmed | Confirmed Allowed | Cloudflare dashboard |
| Blog E-E-A-T score | 5/10 | > 7/10 | Manual audit |

---

*PRD generated from codebase audit of `/src` (May 1 2026) + 11 days of operational log data.*
