# Niche Implementation Plan — Classroom Toolkit

**Date:** 2026-05-17
**Niche priority:** Tier 1
**Build effort:** 9-10 days
**Tools shipped:** Name picker (wheel), Group generator, Noise meter, Tally counter, Hub page

---

## 1. Snapshot

Four classroom utilities (not timers) bundled into a `/classroom` hub. Each tool ranks individually for high-volume teacher queries; the hub URL is what gets pitched to EdTech listicle owners (warmest outreach channel we have). Existing `/productivity/classroom` timer page is preserved and cross-linked, not replaced.

## 2. SEO strategy

### 2.1 Target keywords

| Query | Est. monthly volume | Competition | Notes |
|---|---|---|---|
| `classroom name picker` | 2-5k | High | online-stopwatch, wheelofnames dominate |
| `random name picker` | 30-60k | High | wheelofnames.com owns this |
| `name picker wheel` | 5-10k | High | wheelofnames |
| `group generator for teachers` | 500-1k | Medium | Underserved |
| `random group generator` | 2-5k | Medium | Some competition |
| `classroom noise meter` | 1-3k | Medium | bouncyballs.org, toonoisy.com |
| `online noise meter` | 1-3k | Medium | Same |
| `tally counter online` | 2-5k | Medium-High | Several free tools |
| `online classroom tools` | 1-3k | Medium | Listicle territory — hub URL targets |

### 2.2 Honest competitive read

Head terms (`name picker wheel`, `random name picker`) are dominated by wheelofnames.com, which has a 15-year backlink moat. **We are not winning these head-on.**

What we CAN win:
- **Long-tail variants**: `classroom name picker no signup`, `name picker for small class`, `name picker that removes after pick`, `student name picker save list`.
- **Listicle inclusion**: EdTech listicles like "40 Online Timers for Teachers" and "Best Classroom Noise Meters" rank for the head terms. Getting added is the path to those head-term clicks via referral, not direct ranking.
- **Bundle pages**: `/classroom` ranks for `online classroom tools` and `free classroom tools` as a hub query, complementing the individual tool pages.

### 2.3 Search intent

Mixed: teachers searching mid-lesson need the tool *now* (transactional); teachers researching at home want comparisons (informational). Pages must serve both — tool above fold, comparison/feature content below.

## 3. URL structure

| URL | Keyword target | Type |
|---|---|---|
| `/classroom` | online classroom tools / free classroom tools | Hub |
| `/classroom/name-picker` | classroom name picker | Tool page |
| `/classroom/name-picker/wheel` | name picker wheel | Visual variant |
| `/classroom/name-picker/no-signup` | name picker no signup | Long-tail |
| `/classroom/group-generator` | random group generator / group generator for teachers | Tool page |
| `/classroom/group-generator/teams-of-3` | groups of 3 generator | Long-tail preset |
| `/classroom/group-generator/teams-of-4` | groups of 4 generator | Long-tail preset |
| `/classroom/noise-meter` | classroom noise meter / online noise meter | Tool page |
| `/classroom/tally-counter` | tally counter online | Tool page |

**Rationale for top-level `/classroom`**: matches search intent. Teachers search "classroom X", not "productivity classroom X". The top-level path also signals topical authority for a category we want to own.

Existing `/productivity/classroom` (timer) — keep as-is but add a "See also: our full classroom toolkit at /classroom" link.

## 4. On-page SEO per route

**`/classroom/name-picker`**

```yaml
title: "Classroom Name Picker — Free, No Signup, Save Your Class List"
meta_description: "Free random student name picker for teachers. Save your class list, remove names after picking, spinning wheel. No signup, no ads. Works on Smartboards."
h1: "Random Name Picker for Classrooms"
canonical: "/classroom/name-picker"
og_image: "/og/classroom-name-picker.png"
```

**`/classroom/noise-meter`**

```yaml
title: "Classroom Noise Meter — Free Mic-Based Sound Level Visual"
meta_description: "Free classroom noise meter using your microphone. Bouncy balls visual reacts to volume. No audio recorded or sent anywhere. No signup."
h1: "Classroom Noise Meter"
```

**`/classroom`**

```yaml
title: "Free Classroom Tools — Name Picker, Group Generator, Timer"
meta_description: "Free online tools for teachers: random name picker, group generator, noise meter, tally counter, classroom timer. No signup, no ads, works on Smartboards."
h1: "Free Classroom Tools for Teachers"
```

## 5. Schema markup

Per page: `WebApplication`, `BreadcrumbList`, `FAQPage`. Hub also uses `ItemList` schema to enumerate the tools:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Name Picker",
     "url": "https://gotimer.org/classroom/name-picker"},
    {"@type": "ListItem", "position": 2, "name": "Group Generator", "url": "..."},
    ...
  ]
}
```

`ItemList` can earn carousel rich results.

## 6. Content outline (per tool page, ~700-1000 words)

1. **Hero** — H1 + 1-sentence value prop + the tool itself.
2. **How to use** — 150 words.
3. **Why this tool over alternatives** — 150 words. Honest comparison (no bashing competitors by name).
4. **For teachers: practical use cases** — 200 words. Class transitions, group projects, behavior management.
5. **Features list** — bulleted, with the privacy point ("no audio recorded" for noise meter) prominent.
6. **FAQ** — 6-8 Q&A (300 words).
7. **Related tools** — link to other classroom tools and the classroom timer.

Hub page (`/classroom`) — different structure: 600-800 words, ItemList-style overview of each tool with screenshot + description + link.

## 7. Internal linking plan

**Inbound:**
- Homepage `/` — add "Classroom Tools" to the main nav if not present.
- `/productivity/classroom` (existing timer) — "See our full [classroom toolkit]" CTA.
- All productivity timers (pomodoro, study, presentation) — sidebar link to classroom hub.
- Blog posts (if any) about teaching — link relevant tool.

**Outbound:**
- Each tool page → hub.
- Hub → all 4 tools + the existing classroom timer.
- Each tool cross-links to 1-2 sibling tools ("After picking names, [generate groups]").

## 8. Backlink hooks

| Hook | Who links |
|---|---|
| **Save class list to URL** | Teachers share the URL with their preset class with colleagues / on Twitter |
| **No signup, no ads, no audio recording** | Privacy-conscious schools cite this; teacher-Twitter shares for the privacy angle |
| **Listicle inclusion** | Larry Ferlazzo, Educators Technology, WeAreTeachers, TCEA all maintain lists |
| **Smartboard-friendly** | Specific differentiator; teachers searching for Smartboard-compatible tools |
| **Printable group cards** | School blogs sometimes link the tool when posting about group activities |
| **Open-source mention** (if applicable, post-launch) | r/Teachers occasionally posts about open-source tools |

## 9. Implementation

### 9.1 Architecture

Each tool is a standalone React component — NOT using the `TimerPage` shell. They share design tokens (colors, typography, button styles) from the existing Tailwind/shadcn system.

### 9.2 Tool-specific implementation

**Name picker:**
- Input: textarea of names (one per line) OR paste CSV.
- State: stored in `localStorage` under a key tied to a class slug (auto-generated or user-set).
- URL: `?names=Alice,Bob,Charlie&class=period-3` (or encoded for long lists).
- UI: spinning wheel (SVG with CSS rotation, calculated final angle) OR simple flashing-name selector.
- Settings: "remove after pick" toggle, "spin duration" slider, "celebration confetti" toggle.

**Group generator:**
- Input: textarea of names + (N groups OR group size).
- Seed: optional seed for reproducibility.
- Avoid-previous-pairs: stores the last result in localStorage; toggle to bias against repeating pairs.
- Output: rendered group cards (CSS grid).
- Copy to clipboard + print stylesheet.

**Noise meter:**
- Permission: explicit "Tap to enable microphone" button — no auto-prompt.
- Disclosure: "No audio is recorded or sent anywhere" prominent above the meter.
- Visual: Canvas with bouncing balls (gravity + amplitude-driven impulse) OR animated bars.
- Threshold: configurable "too loud" line; visual change above threshold.
- Variants: bouncy balls, bars, color-only (accessibility option).

**Tally counter:**
- Single counter mode: +/- buttons, large readout, reset.
- Multi-counter mode: paste labels (one per line) → renders N counters in a grid.
- LocalStorage persistence per label set.

### 9.3 Files to create

- `src/app/classroom/page.tsx` + `layout.tsx`
- `src/app/classroom/name-picker/page.tsx` + `layout.tsx`
- `src/app/classroom/name-picker/wheel/page.tsx` + `layout.tsx`
- `src/app/classroom/name-picker/no-signup/page.tsx` + `layout.tsx`
- `src/app/classroom/group-generator/page.tsx` + `layout.tsx`
- `src/app/classroom/group-generator/teams-of-3/page.tsx` + `layout.tsx`
- `src/app/classroom/group-generator/teams-of-4/page.tsx` + `layout.tsx`
- `src/app/classroom/noise-meter/page.tsx` + `layout.tsx`
- `src/app/classroom/tally-counter/page.tsx` + `layout.tsx`
- `src/components/classroom/name-wheel.tsx` (SVG wheel)
- `src/components/classroom/name-list-input.tsx` (shared name list parser)
- `src/components/classroom/group-cards.tsx`
- `src/components/classroom/group-shuffler.ts` (logic + seed)
- `src/components/classroom/noise-meter.tsx` (Canvas + getUserMedia)
- `src/components/classroom/tally-counter.tsx`
- `public/og/classroom-{tool}.png` (one per tool + hub)

### 9.4 Files to edit

- `src/app/sitemap.ts` — add 9 URLs
- `src/app/page.tsx` — add classroom toolkit to home nav/landing
- `src/app/productivity/classroom/page.tsx` — cross-link to new toolkit
- `src/app/productivity/pomodoro/page.tsx`, `study/page.tsx`, `presentation/page.tsx` — sidebar link to classroom hub
- `src/components/timer/timer-seo-content.tsx` — ensure FAQPage + ItemList schema support

### 9.5 Things to verify before starting

1. Confirm top-level `/classroom` is fine (vs. nested) — discussed in companion docs; default is yes.
2. Check existing nav component for how to add a top-level category.
3. Verify the design tokens (colors, button styles) used by timer pages are exportable for non-timer pages.
4. Decide on noise-meter spectrum vs. amplitude — amplitude-only is sufficient for v1.

## 10. Effort estimate

| Task | Days |
|---|---|
| Name picker (wheel + list input + persistence) | 2.0 |
| Group generator (logic + seed + UI + print CSS) | 1.5 |
| Noise meter (getUserMedia + Canvas) | 2.0 |
| Tally counter (single + multi mode) | 0.5 |
| Hub page (`/classroom`) | 0.5 |
| 9 routes (page + layout) | 0.5 |
| Long-tail preset pages (teams-of-3, teams-of-4, no-signup) | 0.5 |
| SEO content (9 pages × ~700-1000 words) | 2.0 |
| Cross-linking + nav update | 0.25 |
| OG images (9 static) | 0.5 |
| Sitemap + QA | 0.25 |
| **Total** | **10 days** |

## 11. Acceptance criteria

- [ ] All 9 routes load and render correctly mobile + desktop + projector.
- [ ] Name picker wheel runs at 60fps on mid-range mobile.
- [ ] Group generator handles 1-200 names without UI degradation.
- [ ] Noise meter handles `getUserMedia` denial gracefully with clear fallback.
- [ ] Tally counter persists state across reloads.
- [ ] All tools work in full-screen mode.
- [ ] Group generator prints cleanly on letter paper.
- [ ] All pages have unique title, meta description, H1.
- [ ] FAQPage + ItemList schema validates in Google Rich Results Test.
- [ ] Sitemap updated; all 9 URLs submitted to Search Console.
- [ ] Cross-links from existing classroom timer and productivity pages.
- [ ] Noise meter has explicit "no audio recorded" disclosure visible above the tool.
- [ ] OG images render correctly on Twitter/Reddit.

## 12. SEO follow-up (post-launch)

- Submit sitemap update.
- Monitor Search Console for impressions on long-tail variants (`classroom name picker no signup`, `groups of 3 generator`).
- Manually request indexing for hub + 4 main tool URLs.
- After 2 weeks, identify any tool page with impressions > 100 but CTR < 2% → rewrite meta description.
- Get listed in 3+ EdTech listicles (separate outreach plan).
- Track inbound referrals from listicle sites in Search Console; promote the highest-converting ones into prominent cross-links.

## 13. Risks

| Risk | Mitigation |
|---|---|
| Noise meter mic permission UX confuses teachers mid-lesson | Pre-flight permission with clear "Tap to enable mic" button; show fallback visual if denied. |
| Name picker wheel performance on old Chromebooks | Use CSS transform for rotation, not Canvas. Test on a Chromebook with Intel Celeron N4020. |
| `/classroom` as top-level path conflicts with anything | Verify before building. Check existing routes. |
| Group generator URL length explosion (50 students × 8 chars + separators) | Use `?names=base64(json)` or compress with LZ-string if URL exceeds 1500 chars. |
| wheelofnames.com level competition crushes us on head terms | Accepted — we target long-tail and listicle inclusion, not head-on SEO. |
