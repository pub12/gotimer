# GoTimer.org — Site Iteration PRD

**Version:** 3.0 (Post-Day-24 update)
**Date:** May 14, 2026
**Source data:** Days 1–24 operational logs, GSC/GA4, logbook learnings, and direct codebase audit of `/src`

---

## What Changed in This Version

v2.1 (May 1) had 13 open items. This version closes 8 of them, adds 4 new timer page opportunities identified via competitor and search gap analysis, and incorporates content strategy requirements derived from 24 days of operational learnings.

---

## ✅ Closed Since v2.1

| Item | Resolution | Date |
|---|---|---|
| P1.1 — Google-Extended robots.txt | Fixed: Cloudflare "Manage robots.txt → Instruct AI bot traffic" was injecting Disallow block overriding `robots.ts`. Changed to "Do not manage". robots.txt now shows explicit `Allow: /` for Google-Extended. | May 14 |
| P1.2 — Applebot-Extended robots.txt | Fixed in same Cloudflare change. `Allow: /` confirmed in live robots.txt. | May 14 |
| P1.3 — Board-games canonical tags | Fixed in codebase: `/board-games/chess-clock`, `/board-games/countdown`, `/board-games/round-timer` now all point canonical to top-level equivalents (`/chess-clock`, `/countdown`, `/round-timer`). `/board-games/turn-timer` left as self-referential — it has unique content, schema, and breadcrumbs. | May 14 |
| P2.1 — /game-timer page | Already existed (HTTP 200 confirmed). No action needed. | Confirmed May 14 |
| P2.2 — /interval-timer page | Already existed (HTTP 200 confirmed). No action needed. | Confirmed May 14 |
| P3.1 — Homepage title keyword order | Already updated prior to v2.1. Current: "Free Online Timer — Countdown, HIIT, Chess Clock & Leaderboards \| GoTimer". No change needed. | Pre-v2.1 |
| P5.1 — Author bio component | `src/components/blog/author-bio.tsx` existed but with generic copy. Improved: added `bg-surface-container-low` background, avatar ring, GoTimer link, and benefit-led bio copy. All 41 blog posts now show a properly styled author card. JSON-LD already set `@type: Person` with name "Pubs Abayasiri". | May 14 |
| Sitemap caching (missing 9 posts) | Added `export const dynamic = "force-dynamic"` to `sitemap.ts`. 9 posts (game-night-rivalry-tracker, chess-clock-non-chess-games, 7-board-games-that-need-a-timer, best-timer-settings-board-games, plank-timer-challenge, running-interval-timer-couch-to-5k, flashcard-timer-technique, how-to-time-multiple-dishes, pasta-timer-guide-al-dente-times) were missing due to Next.js static caching. Will appear after next deploy. Resubmit sitemap in GSC after deploy. | May 14 |

---

## Open Items

9 genuine gaps remain across four priorities.

---

## Priority 1 — New Timer Pages (High Value, Mixed Effort)

These are confirmed traffic gaps where GoTimer has no page at all. All four verified via live HTTP check on May 14.

---

### N1 — Add /stopwatch Page

**Gap:** `/stopwatch` returns 404. Monthly search volume: ~500K. This is the single largest missing timer type — a count-up stopwatch is the second most searched timer type after basic countdown.

**Effort:** Requires code. A stopwatch is count-up, not countdown — it needs a new strategy in `timer-registry.ts`. This is a Claude Code task, not an admin panel entry.

**Spec:**
- New strategy: `stopwatch` in `timer-registry.ts` — count-up from 0:00, lap recording
- New route: `/stopwatch`
- Title: `Free Online Stopwatch — Start, Stop & Lap Timer`
- WebApplication schema + BreadcrumbList
- DB timer page intro (500+ words): what a stopwatch is used for, stopwatch vs countdown, common use cases (running, cooking, sports, presentations)
- Add to sitemap and category navigation

**Blog support required (see N1-blog):** Timer pages without blog support stall at position 55–75 with impressions but zero clicks — confirmed pattern from `/10-minute-timer` and `/15-minute-timer`. Plan 2 blog articles within 2 weeks of the page going live.

---

### N2 — Add /workout-timer Page

**Gap:** `/workout-timer` returns 404. Monthly search volume: ~100K. All underlying fitness timers exist (HIIT, Tabata, EMOM, rest, stretching) but there is no umbrella page for the generic "workout timer" query.

**Effort:** Low — DB timer page via admin panel, no code required.

**Spec:**
- URL: `/workout-timer`
- Strategy: `interval`, default config: `{ work: 40, rest: 20, rounds: 8 }` (HIIT default)
- Title: `Free Workout Timer Online — HIIT, Tabata, EMOM & Rest`
- Intro (500+ words): overview of interval training, when to use HIIT vs Tabata vs EMOM, links to `/fitness/hiit`, `/fitness/tabata`, `/fitness/emom`, `/fitness/rest-timer`
- 5–7 FAQs: how long workouts should be, rest intervals, HIIT vs Tabata difference, timing for beginners
- `<TimerEmbed type="hiit" />` in intro body

---

### N3 — Add /boxing-timer Page

**Gap:** `/boxing-timer` returns 404. Monthly search volume: ~30K. `/round-timer` exists but has no boxing-specific content or keyword targeting. Boxing is a well-defined use case with distinct intent (3-minute rounds, 1-minute rest, 3–12 rounds).

**Effort:** Low — DB timer page via admin panel.

**Spec:**
- URL: `/boxing-timer`
- Strategy: `round-timer`, default config: `{ round_duration: 180, rest_duration: 60, rounds: 12 }`
- Title: `Free Boxing Timer Online — Round Timer with Bell`
- Intro (500+ words): boxing round structure, sparring vs bag work vs conditioning, presets for beginner/amateur/pro
- Include quick-reference table: round lengths by discipline (boxing, MMA, Muay Thai, kickboxing) — tables add high-value structured content that ranks well for featured snippets
- Cross-links to `/round-timer` and `/fitness/hiit`
- FAQs: How long is a boxing round? How many rounds in amateur boxing? Can I use this for MMA?

---

### N4 — Add /calisthenics-timer Page

**Gap:** `/calisthenics-timer` returns 404. Monthly search volume: ~20K, growing. No competitor has a dedicated calisthenics timer page with quality content.

**Effort:** Low — DB timer page via admin panel.

**Spec:**
- URL: `/calisthenics-timer`
- Strategy: `interval`, default config: `{ work: 45, rest: 15, rounds: 10 }`
- Title: `Free Calisthenics Timer — Bodyweight Workout Intervals`
- Intro (500+ words): what calisthenics timing is, why interval timing improves bodyweight workouts, work/rest ratios for beginner/intermediate/advanced, links to `/fitness/hiit` and `/fitness/tabata`
- Include a 4-week progression table — from learnings, these add ~430 words of structured content and rank well for "how to" intent
- Cross-link to `/workout-timer` once that page is live

---

## Priority 2 — Blog Support for New Timer Pages

**Critical learning from 24 days of operation:** Timer tool pages consistently stall at position 55–75 with 40–65 impressions and zero clicks without supporting blog articles. This is confirmed by `/10-minute-timer` (65 impressions, 0 clicks) and `/15-minute-timer` (53 impressions, 0 clicks). Blog articles are what push timer pages into the click zone by building topical authority and internal link equity.

**Rule:** Every new timer page must have at least one supporting blog article live within 2 weeks of the page publishing.

---

### N1-blog — Stopwatch Blog Support

Write after `/stopwatch` is live. Drake character. Two articles:

1. **"Stopwatch vs Countdown Timer: Which One Do You Actually Need?"**
   - Targets users comparing tools; links to `/stopwatch` and `/countdown`
   - Include a decision table: use case → stopwatch vs countdown
   - `<TimerEmbed type="countdown" />` and link to `/stopwatch`

2. **"How to Use a Stopwatch for Running (Without a Running App)"**
   - Targets "running stopwatch online", "lap timer running"
   - Links to `/stopwatch` and `/blog/running-interval-timer-couch-to-5k`
   - Include splits table for common distances (1km, 5km, pace targets)

---

### N2-blog — Workout Timer Blog Support

Write after `/workout-timer` is live. Drake character. Two articles:

1. **"How to Set Up a Workout Timer for Any Exercise Style"**
   - Targets "workout timer setup", "how to use interval timer"
   - Links to `/workout-timer`, `/fitness/hiit`, `/fitness/tabata`
   - Include a settings cheat sheet table by exercise style

2. **"HIIT vs Tabata vs EMOM: Which Interval Timer Format Is Right for You?"**
   - Comparison piece, high volume, excellent GEO citation target
   - Links to `/fitness/hiit`, `/fitness/tabata`, `/fitness/emom`, `/workout-timer`
   - Include a structured comparison table — AI engines cite these heavily

---

### N3-blog — Boxing Timer Blog Support

Write after `/boxing-timer` is live. Drake character. One article:

1. **"Boxing Round Timer: How to Structure Training Sessions Like a Pro"**
   - Targets "boxing round timer", "boxing training timer"
   - Links to `/boxing-timer` and `/round-timer`
   - Include a session structure table: warm-up, rounds, rest, cool-down

---

## Priority 3 — Remaining Content Items (Carried from v2.1)

### P2.3 — Add Go Byoyomi Section to /chess-clock

**Status:** Still pending.

**Action:** Add ~200-word section to `/chess-clock/page.tsx`: "Using GoTimer as a Go Clock (Byoyomi)" — explain byoyomi timing, how to approximate it with the chess clock, common periods (30s, 60s). Directly targets "go game clock" query (20+ impressions, no dedicated content).

---

### P4.1 — Content Audit of DB Timer Pages

**Status:** Still pending.

**Action:** Audit each DB timer page via admin panel. Any `intro_html` under ~400 words should be expanded. Priority targets (highest impression potential):
- `/pomodoro-timer`
- `/meditation-timer`
- `/breathing-timer`
- `/study-timer`
- `/classroom-timer`
- `/adhd-focus-timer`

**Expansion pattern that works (from learnings):** Add a 4-week progression table + common mistakes section. This adds ~430 words of structured, rankable content. Do not pad with filler prose — structured tables and named sections outperform generic paragraphs.

---

### P5.2 — Strengthen Social Proof Stats

**Status:** Still pending.

**Suggested update (after N1–N4 timer pages are live):**
- "40+ Free Timers" (accurate post N1–N4)
- "Used in 50+ Countries" (verifiable via GA4 geo report)
- "100% Free, Forever" (replaces "0 Sign-ups Required" — feature claim → promise)

---

### P6.1 — Photography Blog Articles

**Status:** Still pending. 6 photography timer pages exist, no supporting blog content. Photography is the site's most unique differentiator — no competitor covers darkroom/film timing.

**Articles (Drake character):**
1. "How to Use a Timer for Long Exposure Photography" — links to `/photography/long-exposure-calculator`
2. "Film Development at Home: Why Your Timer Is the Most Important Tool" — links to `/photography/film-development`
3. "Cyanotype Printing: Getting UV Exposure Times Right" — niche, zero competition, links to `/photography/cyanotype`

---

### P6.2 — Remaining Board Game Blog Articles

**Status:** Board Games cluster has 5 strong articles. Two remaining slots:

1. **"Turn Timer for Board Games"** — links to `/board-games/turn-timer` and `/game-timer`
2. **"Do You Need a Timer for Catan?"** — debate format, links to `/board-games/turn-timer`

---

### P6.3 — Comparison Articles for GEO

**Status:** Still pending. AI engines frequently answer "X vs Y" queries by citing structured comparison sources.

1. **"Pomodoro vs 52-17: Which Study Timer Method Is Right for You?"** — Scout character; directly compares two articles already live
2. **"HIIT vs Tabata vs EMOM"** — can be combined with N2-blog item 2 above for efficiency (write once, serves both purposes)

---

## Content Publishing Rules (Derived from 24 Days of Learnings)

Apply to every new timer page and blog article:

**1. TimerEmbed is mandatory.** Every blog article must embed the relevant timer page with `<TimerEmbed type="..." />`. Articles without a TimerEmbed are leaving timer page authority on the table.

**2. Cross-link at publish time.** Add back-links from 3+ existing related articles on the same day as publish. Batching retroactively costs a week of link equity.

**3. Every new timer page needs a blog article within 2 weeks.** Positions 55–75 with impressions and zero clicks is the confirmed failure mode. Blog articles provide the authority push.

**4. Progression tables beat prose for expansion.** A 4-week progression table + common mistakes section adds ~430 high-value structured words. Use for any timer page intro or thin article.

**5. Verify featured image field immediately after POST.** `character_id` does not auto-populate `featured_image`. Check immediately — the Step 1 QC has caught this repeatedly.

**6. Verify cross-links before patching.** Check existing article content before adding cross-links — previous sessions may have already added them.

**7. Seasonal content timing:** Study content in April–May | Fitness in January | Cooking in November–December.

---

## Not Recommended (Unchanged)

| Item | Reason |
|---|---|
| Noindex setup pages | Setup pages have HowTo schema, BreadcrumbList, quality metadata. Noindexing loses existing GSC impressions. |
| FAQPage JSON-LD | Google deprecated FAQ rich results Aug 2023. Correctly removed. Do not re-add. |
| WebApplication schema on timer pages | Already implemented globally in `layout.tsx` and per-page where needed. |

---

## Sprint Sequence

| Week | Items | Expected Outcome |
|---|---|---|
| Now | Deploy codebase changes (sitemap, canonicals, author bio) → resubmit sitemap in GSC | 9 missing posts indexed, canonical signals consolidated |
| 1 | N2 (/workout-timer) + N3 (/boxing-timer) + N4 (/calisthenics-timer) via admin panel | 3 new pages, ~150K monthly search volume covered |
| 2 | N2-blog (2 workout articles) + N3-blog (boxing article) | Blog support cluster for new fitness timer pages |
| 3 | N1 (/stopwatch — code + DB page) via Claude Code | Largest single traffic opportunity on the site |
| 4 | N1-blog (2 stopwatch articles) + P2.3 (Go byoyomi section) | Stopwatch cluster established, game-clock keyword covered |
| 5 | P4.1 (DB timer page content audit) + P5.2 (social proof stats) | Timer page depth improved, homepage trust signals updated |
| 6 | P6.1 (photography articles) + P6.2/P6.3 (comparison/board game articles) | Long-tail content, GEO citation targets |

---

## Key Metrics to Track

| Metric | Current (May 14) | 30-Day Target | Source |
|---|---|---|---|
| GSC Clicks (90d) | 54 | > 120 | GSC Performance |
| GSC Impressions (90d) | 853 | > 1,500 | GSC Performance |
| Indexed pages | 10 confirmed | > 30 | GSC Indexing |
| ChatGPT referral sessions (28d) | 13 | > 30 | GA4 Referrals |
| Stopwatch page (once live) | 404 | Position < 40 | GSC Queries |
| Workout-timer position | 404 | Position < 30 | GSC Queries |
| Game-timer cluster | pos ~28 | < 15 | GSC Queries |
| Boxing-timer (once live) | 404 | Position < 40 | GSC Queries |

---

## Appendix: robots.txt Status (Confirmed May 14)

All five major AI crawlers now have explicit `Allow: /` rules:

```
User-Agent: GPTBot           → Allow: /
User-Agent: ClaudeBot        → Allow: /
User-Agent: Google-Extended  → Allow: /
User-Agent: Applebot-Extended → Allow: /
User-Agent: PerplexityBot    → Allow: /
```

Cloudflare "Manage robots.txt" is set to "Do not manage". `robots.ts` in the codebase is now the sole source of truth. Cloudflare "AI Crawl Control" panel confirms Allow for all four major AI crawlers as belt-and-suspenders.

---

*PRD v3.0 — May 14, 2026 — updated from Days 1–24 operational data, codebase audit, keyword gap analysis, and 24-day learnings log.*
