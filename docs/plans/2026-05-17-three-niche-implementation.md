# Implementation Plan — Three Niche Timers

**Author:** implementation scoping for sauna/cold-plunge, debate/Toastmasters, and classroom toolkit
**Date:** 2026-05-17
**Status:** Draft for review
**Companion doc:** `2026-05-17-growth-outreach-plan.md`

---

## 1. Niche selection and rationale

| # | Niche | Why this one (vs. the alternatives) |
|---|---|---|
| 1 | **Sauna / cold-plunge contrast therapy timer** | Weakest digital incumbents on the entire shortlist — existing tools are physical sand timers or app-only. Søberg/Huberman trend keeps demand hot. Single Reddit post in r/Sauna can land 1000+ visits if framed correctly. |
| 2 | **Debate / Toastmasters timer (multi-format presets)** | Coach-driven adoption is sticky — once a coach uses it for one tournament, students keep using it. Format fragmentation (PF, LD, Policy, WSDC, Toastmasters 5-7) creates a programmatic long-tail SEO win. No dominant free web competitor; Debatekeeper is Android-only. |
| 3 | **Classroom toolkit** (name picker, group generator, noise meter, tally counter) | Unlocks the warmest outreach channel we have (EdTech newsletters and 8+ listicle owners). Bundles well with the existing `/productivity/classroom` timer page. Each sub-tool ranks individually + cross-links into the toolkit hub. |

Niches deferred to round 2 (so we ship round 1 well, not all at once):
- Multi-player BGG turn timer
- Streamer BRB / OBS overlay
- Pour-over coffee multi-stage timer

---

## 2. Codebase patterns we are reusing

These are the existing conventions discovered in `/src` and the goal is to follow them strictly — no new patterns invented unless required.

| Concern | Existing pattern |
|---|---|
| Route structure | `/src/app/<category>/<timer-slug>/page.tsx` + co-located `layout.tsx` |
| Timer shell | `<TimerPage strategy={...} config={...} label="..." below={...} seo_content={...} />` |
| Strategies | `/src/lib/timer-strategies/` — pick from `interval`, `multi-step`, `countdown`, `turn-timer`, etc. New strategy file only if no existing one fits. |
| SEO content | `<TimerSeoContent timer_name=... category_name=... faq=... related_timers=...>{MDX-style children}</TimerSeoContent>` |
| Per-page metadata | `layout.tsx` exports `metadata: Metadata` + emits JSON-LD `WebApplication` + `BreadcrumbList` script tags |
| URL-driven config | Read from `useSearchParams()`, mirror to URL via `window.history.replaceState` |
| ISR | `export const revalidate = 60` at the page level where SEO content can change |
| Sitemap | `/src/app/sitemap.ts` — add new routes here |
| Category landing | `/src/app/<category>/page.tsx` — link to each timer in the category |

---

## 3. Niche 1 — Sauna / Cold-Plunge Contrast Therapy Timer

### 3.1 Route plan

| Route | Purpose |
|---|---|
| `/wellness/sauna` | Sauna-only timer (e.g., 15-min single session) — captures `sauna timer` search |
| `/wellness/cold-plunge` | Cold-plunge-only timer (e.g., 2-3 min) — captures `cold plunge timer` |
| `/wellness/contrast-therapy` | **The flagship**: multi-round protocol with configurable hot/cold/rest phases. Default = Søberg protocol (3 rounds, end-on-cold) |
| `/wellness/soberg-protocol` | Alias of contrast-therapy with Søberg preset pre-selected. Separate URL to rank for "Søberg protocol timer". |

Add all four to `/src/app/wellness/page.tsx` (category landing) alongside breathing, fasting, meditation, sleep.

### 3.2 Strategy

**Verified 2026-05-17 (see `2026-05-17-multi-step-verification.md`):** reuse `multi-step.ts` as-is. Cycles are pre-expanded into a flat `StepDefinition[]` at config time via a small `expand_contrast()` shim in `src/lib/contrast-therapy.ts`. No strategy changes needed.

Phase model:
```ts
type Phase = {
  label: string;        // "Sauna", "Plunge", "Rest"
  duration_seconds: number;
  color?: string;       // tint the display
  sound?: string;       // chime variant
};
```

Søberg protocol preset:
```
[
  { label: "Sauna", duration_seconds: 15 * 60 },
  { label: "Plunge", duration_seconds: 120 },
  { label: "Rest", duration_seconds: 60 },
] x 3 cycles, ending on Plunge
```

### 3.3 UI requirements specific to this niche

- **Large, glanceable readout** — users will see it from across a sauna room or while wet.
- **Audio cues** — must be loud and distinctive (bell or gong, not a soft beep). Different sound per phase transition.
- **Wake lock** — request `navigator.wakeLock` so screen does not sleep during a 15-min sauna phase. (Check whether existing timers already do this; if so, reuse.)
- **Mute toggle** — some saunas are shared / quiet.
- **Round indicator** — "Round 2 of 3" must be visible at all times.
- **Plunge-last warning** — Søberg's key insight is end-on-cold; UI should reinforce this with a "Final cold" badge on the last phase.

### 3.4 SEO content (FAQ + body)

FAQ topics (8 entries):
1. What is contrast therapy?
2. What is the Søberg protocol?
3. How long should I stay in the sauna?
4. How long should the cold plunge be?
5. Should I end on hot or cold? (Søberg: cold; cite Søberg Principle research)
6. How often should I do contrast therapy?
7. Is contrast therapy safe for everyone? (cardiovascular caveats)
8. Can I use this timer with my home sauna or cold plunge?

Body sections:
- "What is contrast therapy and why the Søberg protocol"
- "How to use this timer" (preset selection → configure → start)
- "Sauna and cold-plunge timing recommendations"
- "Safety considerations"

Related timers: breathing, meditation, HIIT (recovery context), sleep timer.

### 3.5 Outreach hooks built into the feature

- **Shareable URL with config encoded**: a coach/practitioner can send `gotimer.org/wellness/contrast-therapy?phases=...&cycles=3` and the recipient gets the exact protocol.
- **"Powered by Søberg Institute" attribution** if they agree to a partnership (ask via outreach email before adding).
- **OG image** for sharing — auto-generated showing "Søberg Protocol — 3 rounds" so Twitter/Reddit shares render well.

### 3.6 Effort estimate

- Strategy: 0.5 day (if `multi-step` extends cleanly) — 1.5 days (if new strategy file)
- UI (4 routes + shared component): 1.5 days
- SEO content: 1 day
- Sitemap + category landing updates: 0.5 day
- OG image generation: 0.5 day
- **Total: 4-5 days**

### 3.7 Acceptance checklist

- [ ] All four routes load and render correctly on mobile + desktop.
- [ ] Søberg preset matches the published Søberg protocol (3 rounds, end on cold).
- [ ] Audio cues fire on phase transitions and are loud enough at arm's length.
- [ ] Wake lock keeps screen on for 15+ minutes without backgrounding.
- [ ] Shareable URL with custom phases round-trips correctly.
- [ ] JSON-LD WebApplication + BreadcrumbList present in `<head>`.
- [ ] Added to `/wellness` category page and to `sitemap.ts`.
- [ ] OG image renders correctly on Twitter and Reddit preview.

---

## 4. Niche 2 — Debate / Toastmasters Timer

### 4.1 Route plan

| Route | Purpose |
|---|---|
| `/productivity/debate-timer` | **Flagship hub** — format selector + active timer |
| `/productivity/debate-timer/pf` | Public Forum preset (4-3-4-3-...) |
| `/productivity/debate-timer/ld` | Lincoln-Douglas preset (6-3-7-3-...) |
| `/productivity/debate-timer/policy` | Policy debate preset (8-minute constructive, etc.) |
| `/productivity/debate-timer/wsdc` | World Schools Debate Championship preset |
| `/productivity/debate-timer/parli` | British Parliamentary preset |
| `/productivity/toastmasters-timer` | Toastmasters-specific entry point |
| `/productivity/toastmasters-timer/ice-breaker` | 4-6 minute Ice Breaker |
| `/productivity/toastmasters-timer/prepared-speech` | 5-7 minute prepared speech |
| `/productivity/toastmasters-timer/table-topics` | 1-2 minute table topics |

Each preset URL is its own page for SEO. Underlying component is shared.

### 4.2 Strategy

**Verified 2026-05-17:** use existing `multi-step.ts` plus a 5-line `previous_step` action addition (+0.5 day) so judges can rewind a phase. See verification doc. Each format is a sequence:

```ts
// Public Forum example
[
  { label: "1st Constructive (Pro)", duration_seconds: 240 },
  { label: "1st Constructive (Con)", duration_seconds: 240 },
  { label: "Crossfire", duration_seconds: 180 },
  // ...
]
```

### 4.3 UI requirements specific to this niche

- **Stoplight mode** (green / yellow / red light bars) — standard in debate; required for projection. Configurable warning thresholds (e.g., yellow at 1:00 remaining, red at 0:30, flashing at time-up).
- **POI bells** (Points of Information) for parliamentary formats — bell at 1:00 and at 6:00 (or as configured).
- **Full-screen / projection mode** — large digits, high contrast, single key (`F` or `Esc`) toggle. Coach will project this on a classroom screen.
- **Mute / vibrate toggle** — for round-of-32 tournaments where multiple rooms run simultaneously.
- **"Continue to next speech" button** — between phases, the judge or moderator presses to advance (vs. auto-advance with a 5-second hand-off).
- **Custom preset builder** — let coaches build their own format (some leagues have non-standard rules). Saves to URL.

### 4.4 SEO content (FAQ + body)

FAQ topics (per format page) — keep each FAQ specific to that format:
- Public Forum format page FAQ: "What is Public Forum debate?", "How long is a PF round?", "What are the speaking times in PF?"
- Lincoln-Douglas format page FAQ: similar but LD-specific.
- Toastmasters page FAQ: "What are the standard Toastmasters speech lengths?", "How does the green/yellow/red signaling work?"

Hub page (`/productivity/debate-timer`) FAQ:
- "What is the difference between PF, LD, and Policy debate?"
- "Can I use this for in-person tournaments?"
- "Does it work on a projector?"
- "Can I save custom formats?"

Related timers: pomodoro, presentation, classroom, study.

### 4.5 Outreach hooks built into the feature

- **Custom-preset shareable URL** — a coach can send `gotimer.org/productivity/debate-timer?format=custom&phases=...` to their team. This is the key outreach hook for the "email 10 coaches" play.
- **Print-friendly format card** — generate a one-page PDF of the format and timing for coaches to print and distribute. Drives backlinks from school debate pages.
- **Embed code** — `<iframe>` for school debate club websites and coach blogs.

### 4.6 Effort estimate

- Strategy: 0 days (reuse `multi-step`)
- Hub page + format selector UI: 1 day
- Stoplight + projection mode component: 1 day
- 10 format preset pages (mostly content, shared component): 1.5 days
- Custom preset builder + URL serialization: 1 day
- SEO content (10 pages): 2 days
- Print-friendly PDF + embed: 1 day
- Sitemap + category landing updates: 0.5 day
- **Total: 7-8 days**

### 4.7 Acceptance checklist

- [ ] All 10 routes load with correct preset times.
- [ ] Stoplight mode renders correctly at projection sizes (test at 1920x1080 full-screen).
- [ ] POI bells fire at configurable times for parliamentary formats.
- [ ] Custom preset builder serializes to URL and round-trips.
- [ ] Embed iframe works at multiple aspect ratios.
- [ ] Each format page has unique title, meta description, JSON-LD, and FAQ.
- [ ] Added to `/productivity` category page and to `sitemap.ts`.
- [ ] Print PDF generates correctly and is readable.

---

## 5. Niche 3 — Classroom Toolkit (Name Picker + Group Generator + Noise Meter + Tally)

### 5.1 Route plan

| Route | Purpose |
|---|---|
| `/classroom` | **Toolkit hub** — links to all four sub-tools + existing `/productivity/classroom` timer |
| `/classroom/name-picker` | Random name picker (wheel + simple list) |
| `/classroom/group-generator` | Paste list → split into N groups or groups of N |
| `/classroom/noise-meter` | Mic-driven sound-level visual (bouncy balls or similar) |
| `/classroom/tally-counter` | Click counter with optional multiple counters |

Rationale for top-level `/classroom` instead of `/productivity/classroom/*`: these are not timers, they are classroom utilities. Top-level hub matches how teachers search ("classroom name picker", not "productivity classroom name picker").

### 5.2 Strategies / data flow

These are NOT countdown timers, so they bypass the `TimerPage` shell. Each is its own React component.

| Tool | Core implementation |
|---|---|
| Name picker | Single React component. Input: textarea list of names. Output: spinning wheel animation (SVG/Canvas) or simple-list highlight cycle. URL-encode the name list so a teacher can bookmark a class. |
| Group generator | Single React component. Inputs: name list + (N groups OR group size) + shuffle seed. Output: rendered group cards. Copy-to-clipboard button. |
| Noise meter | Requires `getUserMedia` for microphone. Render bouncy balls (Canvas) or animated bars that respond to volume. Threshold line with "too loud" indicator. |
| Tally counter | Local-storage-backed counter with + / - / reset and a "multiple counters" mode (paste labels). |

### 5.3 UI requirements specific to this niche

Common to all four:
- **Full-screen mode** — teacher will project on a classroom screen.
- **Large, kid-friendly typography** — bigger than the timer pages.
- **Print-friendly** — group generator must print on standard letter paper.
- **No login, no signup, no ads** — the wedge against online-stopwatch which serves ads.

Name picker specifics:
- Wheel animation must be smooth at 60fps and have a clear "spinning" sound.
- "Remove after pick" toggle (so teachers can call on every student exactly once).
- Confetti / celebration on result.

Group generator specifics:
- Seed input so teachers can reproduce the same groups (e.g., "same as yesterday").
- Avoid pairs from previous run (toggle).

Noise meter specifics:
- Microphone permission request must be clearly explained (no audio is recorded or sent anywhere — pure visual).
- "Too loud" sound threshold is configurable.
- Visual variants (bouncy balls, bars, color-only) selectable.

### 5.4 SEO content (FAQ + body)

Per-tool FAQ (4-6 entries each). Examples:

Name picker FAQ:
- "How do I pick a random student?"
- "Can I save my class list?"
- "How does the wheel decide?" (it's just `Math.random()` — be honest)
- "Can I remove a student after they're picked?"

Group generator FAQ:
- "How do I split my class into groups of 3?"
- "Can I make sure the same students don't get paired together again?"
- "Can I print the group assignments?"

Noise meter FAQ:
- "Does this record my classroom?" (No — explicitly answer)
- "What if my microphone doesn't work?"
- "What sound level is too loud?"

Hub page (`/classroom`) FAQ:
- "What classroom tools does GoTimer offer?"
- "Are these tools free?"
- "Do I need to create an account?"
- "Can I use these on a Smartboard or projector?"

### 5.5 Outreach hooks built into the feature

- **`/classroom` hub** — a single URL to send to teachers; bundles all four tools. This is what we pitch to listicle owners.
- **Class list save** — store in `localStorage` (no signup). Teachers love bookmarking a working URL.
- **No mic permission asked on noise meter until "Start" is clicked** — important for trust.
- **Backlinks from group generator** — each generated group set can have a permalink for sharing.

### 5.6 Effort estimate

- Name picker (wheel animation + list): 2 days
- Group generator: 1.5 days
- Noise meter (microphone, Canvas viz): 2 days
- Tally counter: 0.5 day
- Hub page + cross-linking + category integration: 1 day
- SEO content (5 pages): 2 days
- Sitemap + nav updates: 0.5 day
- **Total: 9-10 days**

### 5.7 Acceptance checklist

- [ ] All 5 routes load correctly.
- [ ] Name picker wheel runs at 60fps on mid-range mobile.
- [ ] Group generator handles 1-200 names without UI degradation.
- [ ] Noise meter handles `getUserMedia` permission denial gracefully with clear fallback message.
- [ ] Tally counter persists state across page reloads.
- [ ] All tools work in full-screen mode.
- [ ] Group generator prints cleanly on letter paper (margin check).
- [ ] JSON-LD WebApplication + BreadcrumbList on every page.
- [ ] Added to top-level nav and to `sitemap.ts`.
- [ ] Noise meter has explicit "no audio is recorded" disclosure visible.

---

## 6. Shared scope across all three niches

### 6.1 Shared shipping checklist

For every new route:
- [ ] `page.tsx` + `layout.tsx` co-located
- [ ] `layout.tsx` exports `metadata`, emits JSON-LD `WebApplication` + `BreadcrumbList`
- [ ] Page added to `sitemap.ts`
- [ ] Page linked from relevant category landing
- [ ] Wake lock requested if timer > 60s
- [ ] Audio cues work on iOS Safari (test specifically — Safari blocks autoplay)
- [ ] OG image renders correctly when shared on Twitter/Reddit/Slack
- [ ] Lighthouse score >= 95 for Performance, Accessibility, SEO
- [ ] Tested at 360px, 768px, 1280px, 1920px viewports

### 6.2 Things to verify before starting

Before writing any code:
1. ~~Read `src/lib/timer-strategies/multi-step.ts` to confirm it handles repeating cycles~~ **DONE 2026-05-17 — pre-expand cycles, no strategy changes. See verification doc.**
2. Read `src/components/timer/timer-page.tsx` and `timer-shell-v2.tsx` to confirm the `below` slot + `seo_content` slot are flexible enough for the debate stoplight UI.
3. Read `src/app/sitemap.ts` to confirm the pattern for adding new routes (manual list vs. filesystem scan).
4. Read `timer-provider.tsx` / `timer-shell-v2.tsx` to confirm the iOS audio-unlock pattern and wake-lock are reused, not reimplemented.
5. Check the existing `/productivity/classroom` page — decide whether to move it to `/classroom/timer` or keep both.

### 6.3 Ordering across niches

Recommended sequencing — start with the smallest niche to lock the pattern, then scale up:

1. **Week 1**: Sauna/cold-plunge (4-5 days). Smallest scope, weakest competition. Validates the multi-step + presets + wake-lock pattern.
2. **Week 2**: Debate/Toastmasters (7-8 days). Reuses the same multi-step pattern with more presets. Validates the stoplight + projection UI.
3. **Weeks 3-4**: Classroom toolkit (9-10 days). Largest scope and most different (not a timer shell). Done last because it does not block the others.

If we hit a slip, drop noise meter (the trickiest piece) and ship name picker + group generator + tally as v1 of the classroom toolkit.

### 6.4 Out of scope for this implementation

- Embed widget infrastructure (separate project — see `/components/timer/timer-embed.tsx` for the existing pattern; not extending it here).
- Custom OG image generator (use static images per page for v1).
- Saving custom presets to a database (URL serialization only).
- User accounts for any classroom tool (intentional — login kills our wedge).
- Localization beyond English (defer).

## 7. Risks and how we mitigate

| Risk | Mitigation |
|---|---|
| `multi-step` strategy does not support repeating cycles → need new strategy | Verify in week 0 before starting. If true, scope a small `cycle.ts` strategy. |
| iOS Safari audio cues require user interaction to unlock | Existing timers must handle this — check the implementation in `tabata/page.tsx` and reuse. |
| Microphone permission denied → noise meter unusable | Show fallback message + still render visual mock with a fake input. Most teachers will allow once. |
| Stoplight projection mode performance on old classroom hardware | Use CSS transitions only, no Canvas. Test on a low-end Chromebook. |
| Søberg Institute does not respond to partnership email | Ship without attribution — Søberg protocol is a public protocol, not trademarked. |
| Coach outreach yields zero replies in week 4 | Pivot to one-shot subreddit posts and listicle inclusion. Coaches were a stretch target, not the foundation. |

## 8. Open questions for review

1. Confirm we want top-level `/classroom` (not nested under `/productivity`) — this matches search intent but adds a new top-level category to maintain.
2. Are we comfortable shipping noise meter v1 without spectrum analysis (just amplitude)? Spectrum adds 1-2 days and is probably overkill.
3. For the debate timer custom-preset URL — is there a length limit on `?phases=...` we should worry about (some browsers cap URL at ~2000 chars)?
4. Do we want analytics events on each preset selection so we know which formats coaches actually use? (Add to v1 or defer?)
5. Should the classroom hub be reachable from the existing `/productivity/classroom` timer page? (Probably yes — cross-link both ways.)

---

## Appendix A — Effort summary

| Niche | Estimated days | Outreach prerequisite | First creator pitch |
|---|---|---|---|
| Sauna/cold-plunge | 4-5 | r/Sauna mod modmail (week before launch) | Email Glenn Auerbach (SaunaTimes) week of launch |
| Debate/Toastmasters | 7-8 | Draft coach email template + scrape 15 coach addresses | Email batch of 10 coaches week after launch |
| Classroom toolkit | 9-10 | Draft listicle pitch template | Email Tony Vincent + Eric Curts + Educators Technology week of launch |
| **Total** | **~21 days (~4-5 weeks)** | | |

## Appendix B — File checklist (what gets created or edited)

**New files (sauna/cold-plunge):**
- `src/app/wellness/sauna/page.tsx` + `layout.tsx`
- `src/app/wellness/cold-plunge/page.tsx` + `layout.tsx`
- `src/app/wellness/contrast-therapy/page.tsx` + `layout.tsx`
- `src/app/wellness/soberg-protocol/page.tsx` + `layout.tsx`

**New files (debate):**
- `src/app/productivity/debate-timer/page.tsx` + `layout.tsx`
- `src/app/productivity/debate-timer/pf/page.tsx` + `layout.tsx`
- `src/app/productivity/debate-timer/ld/page.tsx` + `layout.tsx`
- `src/app/productivity/debate-timer/policy/page.tsx` + `layout.tsx`
- `src/app/productivity/debate-timer/wsdc/page.tsx` + `layout.tsx`
- `src/app/productivity/debate-timer/parli/page.tsx` + `layout.tsx`
- `src/app/productivity/toastmasters-timer/page.tsx` + `layout.tsx`
- (+3 toastmasters preset pages)
- `src/components/timer/plugins/stoplight.tsx` (new)
- `src/lib/debate-formats.ts` (preset definitions)

**New files (classroom toolkit):**
- `src/app/classroom/page.tsx` + `layout.tsx`
- `src/app/classroom/name-picker/page.tsx` + `layout.tsx`
- `src/app/classroom/group-generator/page.tsx` + `layout.tsx`
- `src/app/classroom/noise-meter/page.tsx` + `layout.tsx`
- `src/app/classroom/tally-counter/page.tsx` + `layout.tsx`
- `src/components/classroom/name-wheel.tsx` (new)
- `src/components/classroom/group-cards.tsx` (new)
- `src/components/classroom/noise-meter.tsx` (new)
- `src/components/classroom/tally-counter.tsx` (new)

**Edited files (common):**
- `src/app/sitemap.ts` — add new routes
- `src/app/wellness/page.tsx` — link new wellness timers
- `src/app/productivity/page.tsx` — link new debate / toastmasters timers
- `src/app/page.tsx` — add classroom toolkit to landing (if appropriate)
- `src/lib/timer-strategies/multi-step.ts` — possibly extend for repeating cycles
- `src/lib/timer-strategies/index.ts` — export any new strategies
