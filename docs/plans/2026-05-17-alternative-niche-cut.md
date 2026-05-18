# Alternative 3-Niche Cut — Decision Aid

**Date:** 2026-05-17
**Purpose:** Compare the original cut (sauna + debate + classroom) against three alternative cuts, so the choice is explicit before any code is written.

---

## TL;DR — three cuts to choose from

| Cut | Niches | Total effort | Best for |
|---|---|---|---|
| **A (original)** | Sauna + Debate + Classroom | ~20 days | Maximum traffic across diverse niches, sticky coach-driven adoption |
| **B (lightest)** | Sauna + Streamer BRB + Classroom (name-picker only) | ~10 days | Shipping fast, learning what converts, then doubling down |
| **C (most viral)** | Sauna + Streamer BRB + BGG turn timer | ~12 days | Pure community-driven distribution (Reddit, BGG, OBS) — no coach/educator outreach |
| **D (most defensible long-term)** | Sauna + Classroom (full) + Embed widget | ~18 days | Building a long-term backlink moat via classroom listicles + embed-driven backlinks |

My recommendation order:
1. **A (original)** if you want the best blend of traffic types and have ~4-5 weeks.
2. **B (lightest)** if you want to ship and measure within ~2 weeks before committing further.
3. **D** if you're playing the 12-month SEO compounding game and willing to delay the heavier debate build.
4. **C** if you specifically want zero educator/coach outreach and prefer to live in Reddit/Discord communities.

---

## Cut B — "Ship fast and measure" (Sauna + Streamer BRB + Name-picker only)

### What it is

- **Sauna / cold-plunge timer** — same as original (4-5 days).
- **Streamer BRB / OBS browser-source overlay** — transparent countdown URL configurable by query string (2-3 days; trivial codebase impact, mostly a styled countdown page).
- **Classroom name-picker only** (skip group generator, noise meter, tally for now) — 2 days.

**Total: ~9-10 days.**

### Why this could be the right call

- Each piece ships in under a week, so you get real traffic data faster.
- Each targets a *different* distribution channel (subreddit, OBS forum, EdTech newsletter) — natural A/B test on what converts.
- Lowest-effort niches in each category. If one channel under-performs, you've only spent 2-3 days, not 10.
- Leaves debate + full classroom for round 2, informed by what worked.

### Why it might not be

- Skipping debate forgoes the coach-driven sticky adoption, which is the highest-LTV play on the original list.
- Name-picker alone doesn't bundle as a "classroom toolkit" — weaker listicle pitch ("we have one tool" vs. "we have four").
- Streamer BRB has higher competition than the analysis initially showed once you account for free tools embedded in StreamElements/own3d.

### What success looks like at end of week 2

- 3 niches live.
- 1 OBS Resources listing submitted.
- 1 r/Sauna post landed.
- 1 EdTech newsletter pitch sent.
- ~200-500 inbound visits across the three new pages (rough order-of-magnitude).

---

## Cut C — "Pure community distribution" (Sauna + Streamer BRB + BGG turn timer)

### What it is

- **Sauna / cold-plunge timer** (4-5 days).
- **Streamer BRB overlay** (2-3 days).
- **Multi-player board-game turn timer** (3-8 named players, share URL) — 3-4 days.

**Total: ~10-12 days.**

### Why this could be the right call

- All three target communities where the founder/developer can lurk and engage authentically (Reddit, BGG, Discord). No cold emailing teachers.
- Lowest outreach overhead — distribution is "post in the right place" rather than "build a mailing list."
- Each has a permanent-listing channel (r/Sauna pinned posts, OBS Resources, BGG geeklists).

### Why it might not be

- Misses the EdTech ecosystem entirely. Educators are gotimer's largest existing user segment (classroom timer page already exists) — abandoning that growth vector is a strategic cost.
- Three subreddit posts is a small surface area. If one flops, you've lost 33% of your distribution.
- BGG turn timer demand is real but smaller than classroom demand by an order of magnitude.

### What success looks like at end of week 3

- 3 niches live.
- OBS Resources listing approved.
- BGG geeklist with 20-50 thumbs.
- r/Sauna post with 100+ upvotes.
- ~500-1500 inbound visits.

---

## Cut D — "12-month moat" (Sauna + Full classroom + Embed widget)

### What it is

- **Sauna / cold-plunge timer** (4-5 days).
- **Classroom toolkit — full**: name picker, group generator, noise meter, tally (9-10 days).
- **Embed widget infrastructure** — `<iframe>` wrapper for *every existing timer* with optional "Powered by gotimer" attribution (3-4 days).

**Total: ~17-19 days.**

### Why this could be the right call

- Embed widgets create permanent backlinks from *every site that embeds them* — this is the longest-compounding asset on the table. TickCounter built a business on this (1.9M+ sites).
- Full classroom toolkit maximizes the listicle inclusion play (4 tools = 4 separately-rankable pages = more listicle slots).
- No coach cold-emailing required.

### Why it might not be

- Embed widget infrastructure is a separate project that affects every existing page — high blast radius. Better as a focused 1-week project after the niches stabilize.
- Skipping debate forgoes a niche with weak incumbents.
- Embed adoption is slow and silent — you may not see traffic lift for 3-6 months.

### What success looks like at end of month 3

- Classroom toolkit listed in 3+ EdTech listicles.
- ~20-50 sites embedding gotimer widgets (most small blogs).
- ~30 new referring domains in Search Console.

---

## Comparison matrix

| Dimension | A (original) | B (lightest) | C (community) | D (moat) |
|---|---|---|---|---|
| Build effort | 20 days | 10 days | 12 days | 18 days |
| Calendar weeks | 4-5 | 2 | 2-3 | 3-4 |
| Coach/educator outreach required | Yes | Light | No | Light |
| Subreddit/forum posts required | 3-4 | 3 | 3-5 | 1-2 |
| Permanent-listing channels | OBS, BGG (partial) | OBS only | OBS + BGG | None direct |
| Listicle inclusion play | Strong | Weak | None | Strongest |
| 3-month traffic estimate | ~3-5k visits | ~1-2k visits | ~2-4k visits | ~2-3k visits |
| 12-month traffic estimate | ~20-40k visits | ~8-15k visits | ~10-20k visits | ~30-60k visits |
| Risk of zero traction | Low (3 channels) | Low (3 channels) | Medium (Reddit-dependent) | Medium (embed adoption is slow) |
| Builds toward long-term moat | Medium | Low | Low | High |

(All traffic estimates are order-of-magnitude guesses based on competitor SEO data, not validated forecasts.)

---

## Decision questions to resolve before committing

1. **How time-constrained are we?** If "must ship something in 2 weeks," pick B. If "4-6 weeks is fine," A or D.
2. **Are we willing to cold-email teachers/coaches?** If no, skip A → choose C or D.
3. **Do we want to learn before committing more?** If yes, B is the explicit learning play.
4. **Do we believe in the embed-widget moat?** If yes, D. If "interesting but unproven," defer to round 2 and pick A.
5. **Is debate timer a personal interest (do we have a connection to the debate world)?** If yes, A is much higher confidence because we have authentic outreach. If no, D or B may be better.

## My take if pushed for a recommendation

If I were running this and had no specific knowledge of your time budget or appetite for outreach: **Cut B for round 1 (ship and learn in 2 weeks), then decide round 2 based on which of the three channels converted best.** This minimizes regret and maximizes information.

If you already know you want to commit ~5 weeks to this: **stick with the original Cut A.** It has the best blend and the debate timer's sticky coach adoption is the single highest-LTV piece on any of the four cuts.

Either way: **add the embed widget (Cut D's piece) as a Q3 project regardless** — it compounds, and shipping it later is fine.
