# Niche Implementation Plan — Debate / Toastmasters Timer

**Date:** 2026-05-17
**Niche priority:** Tier 1
**Build effort:** 7.5-8.5 days
**Companion docs:** `2026-05-17-multi-step-verification.md`

---

## 1. Snapshot

A full-featured debate timer with format presets (PF, LD, Policy, WSDC, Parli) plus Toastmasters speech presets. Stoplight projection mode for in-person tournaments. Each format gets its own SEO landing page → 11 indexable URLs. Coach-driven adoption is sticky: once a coach uses it at one tournament, students keep returning.

## 2. SEO strategy

### 2.1 Target keywords

| Query | Est. monthly volume | Competition | Notes |
|---|---|---|---|
| `debate timer` | 1-2k | Medium | Debatekeeper (Android-only) ranks; opportunity for web |
| `public forum debate timer` | 200-500 | Low | Debate-format-specific = low competition |
| `lincoln douglas timer` | 200-500 | Low | Same |
| `policy debate timer` | 200-500 | Low | Same |
| `wsdc timer` / `world schools debate timer` | 100-300 | Very low | Underserved |
| `parli timer` / `british parliamentary timer` | 100-300 | Very low | Underserved |
| `toastmasters timer` | 1-2k | Medium | tmtimer.calebgrove.com ranks; wp4toastmasters |
| `toastmasters ice breaker timer` | 100-300 | Low | Long-tail |
| `toastmasters table topics timer` | 100-300 | Low | Long-tail |
| `speech timer green yellow red` | 200-500 | Low | Stoplight feature query |
| `cross examination timer` | 100-300 | Low | Long-tail |

**Strategy:** Win the long-tail per format. Head term `debate timer` is a bonus, not the primary target — format-specific pages are the leverage.

### 2.2 Search intent

Mixed transactional ("I need a timer for my round in 10 minutes") and informational ("how long is each speech in LD"). Pages must answer the format question AND provide the tool.

### 2.3 Why we can rank

- **Format fragmentation** = no single page can dominate all formats. Per-format pages compete in shallow pools.
- **No Google built-in widget** for `debate timer`.
- **Debatekeeper is Android-only** → no dominant web competitor.
- **Coaches link to free tools from school debate pages** = backlink trickle from .edu and school domains.

## 3. URL structure

| URL | Keyword target | Type |
|---|---|---|
| `/productivity/debate-timer` | debate timer | Hub + format selector |
| `/productivity/debate-timer/public-forum` | public forum debate timer | Format preset |
| `/productivity/debate-timer/lincoln-douglas` | lincoln douglas timer | Format preset |
| `/productivity/debate-timer/policy` | policy debate timer | Format preset |
| `/productivity/debate-timer/wsdc` | world schools debate timer | Format preset |
| `/productivity/debate-timer/british-parliamentary` | british parliamentary timer | Format preset |
| `/productivity/toastmasters-timer` | toastmasters timer | Hub |
| `/productivity/toastmasters-timer/ice-breaker` | toastmasters ice breaker | Preset (4-6 min) |
| `/productivity/toastmasters-timer/prepared-speech` | toastmasters prepared speech timer | Preset (5-7 min) |
| `/productivity/toastmasters-timer/table-topics` | table topics timer | Preset (1-2 min) |
| `/productivity/toastmasters-timer/evaluation` | toastmasters evaluation timer | Preset (2-3 min) |

11 indexable URLs. Each is a thin shim over the shared component with a different preset and different SEO content.

**Naming convention:** spelled-out URL slugs (`lincoln-douglas` not `ld`) for keyword match. Abbreviations confuse Google.

## 4. On-page SEO per route

Same template as the sauna plan — `<title>` ≤ 60 chars, `<meta description>` ≤ 160 chars, unique H1.

Examples:

**`/productivity/debate-timer/lincoln-douglas`**

```yaml
title: "Lincoln-Douglas Debate Timer — Free, Projectable, Green/Yellow/Red"
meta_description: "Free Lincoln-Douglas debate timer with NSDA speech times pre-configured. Stoplight signal for projectors. No signup. Works on Smartboards and phones."
h1: "Lincoln-Douglas Debate Timer"
canonical: "/productivity/debate-timer/lincoln-douglas"
og_image: "/og/lincoln-douglas-debate-timer.png"
```

**`/productivity/toastmasters-timer/ice-breaker`**

```yaml
title: "Toastmasters Ice Breaker Timer — 4-6 Min Green/Yellow/Red"
meta_description: "Free Toastmasters Ice Breaker speech timer with the 4-5-6 minute signal lights pre-configured. Projectable. No signup, no download."
h1: "Toastmasters Ice Breaker Speech Timer"
```

## 5. Schema markup

Per page: `WebApplication`, `BreadcrumbList`, `FAQPage`. Format pages also include a `HowTo` block for "How to time a [format] debate round":

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Time a Public Forum Debate Round",
  "step": [
    {"@type": "HowToStep", "name": "Set the format", "text": "..."},
    {"@type": "HowToStep", "name": "Start with 1st Constructive (Pro)", "text": "..."},
    ...
  ]
}
```

HowTo schema can produce rich results in SERPs.

## 6. Content outline (per format page, ~900-1200 words)

1. **Hero** — H1 + format speech-times summary (e.g., "PF: 4-4-3-4-4-3-2-2-3 minutes") + the timer.
2. **What is [format] debate?** — 150-200 words.
3. **Standard [format] speech times** — table of times by speech (this *is* the page's main informational value).
4. **How to use this timer** — 200 words. Stoplight signaling, judge controls, etc.
5. **Tips for judges and coaches** — 150 words.
6. **Customize for your league** — 100 words. Some districts use non-standard times.
7. **FAQ** — 6 Q&A (300 words combined).
8. **Related timers** — toastmasters page, pomodoro for prep, presentation timer.

The speech-times table is critical — it's the informational answer to "what are the speech times in [format]". Pages without this table compete poorly.

## 7. Internal linking plan

**Inbound:**
- `/productivity` category landing — feature debate timer in top section.
- `/productivity/presentation` — "Use our debate timer for formal speeches" cross-link.
- `/productivity/classroom` — "For classroom debates, use our [debate timer]" link.
- Each format page links to the others ("PF ↔ LD ↔ Policy ↔ WSDC ↔ Parli").
- Toastmasters hub links to all 4 speech-type preset pages.
- Debate hub and Toastmasters hub cross-link as siblings.

**Outbound:**
- Each page links back to the relevant hub and category page.
- Links to non-debate timers (pomodoro, presentation) as related.

## 8. Backlink hooks

| Hook | Who links |
|---|---|
| **Custom-preset URL** (per-school speech times) | Coaches paste URL into school debate club page |
| **Print-friendly speech-times card** | School debate clubs print and distribute; sometimes posted on school .edu pages with a backlink |
| **Embed iframe for tournament organizers** | Post-launch, see embed-widget plan |
| **"Free + ad-free" differentiator** | Coaches comparing tools cite this; debate-coach Substacks |
| **Speech-times table** | Other debate sites cite our table as the authoritative summary; we earn `[format] speech times` long-tail traffic AND backlinks |

## 9. Implementation

### 9.1 Strategy

**Decision (verified 2026-05-17):** Use existing `multi-step.ts` plus a 5-line `previous_step` action addition (so judges can rewind a phase).

New file: `src/lib/debate-formats.ts`:

```ts
import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

export type DebateFormat = {
  slug: string;
  name: string;
  description: string;
  steps: StepDefinition[];
};

export const PUBLIC_FORUM: DebateFormat = {
  slug: "public-forum",
  name: "Public Forum",
  description: "NSDA Public Forum format",
  steps: [
    { name: "1st Constructive (Pro)", duration: 4 * 60 },
    { name: "1st Constructive (Con)", duration: 4 * 60 },
    { name: "Crossfire", duration: 3 * 60 },
    // ...
  ],
};

export const LINCOLN_DOUGLAS: DebateFormat = { /* ... */ };
// ... etc
```

### 9.2 UI requirements

- **Stoplight mode** (green / yellow / red bars). Configurable thresholds (yellow at 1:00 remaining, red at 0:30, flashing at time-up).
- **POI bells** for parliamentary formats (bell at 1:00 and at 6:00).
- **Full-screen / projection mode** (`F` key toggle). Tested at 1920x1080.
- **Mute / vibrate toggle.**
- **Manual "next" + "previous" buttons** for judge control.
- **Custom preset builder** — coaches define custom speech sequences, URL-encoded for sharing.

New component: `src/components/timer/plugins/stoplight.tsx` — color-bar UI keyed to remaining time.

### 9.3 Strategy patch

Add to `src/lib/timer-strategies/multi-step.ts` (5 lines + test):

```ts
case "previous_step": {
  const prev_idx = Math.max(0, state.current_step - 1);
  const prev_step = state.steps[prev_idx];
  return {
    ...state,
    prev_step: state.current_step,
    current_step: prev_idx,
    step_remaining: prev_step.duration,
    step_elapsed: 0,
    agitation_countdown: prev_step.agitation?.initial_seconds || 0,
    agitation_pending: false,
  };
}
```

Extend `multi-step.test.ts` (currently `stopwatch.test.ts` exists; add a multi-step test file or extend existing if present).

### 9.4 Files to create

- `src/lib/debate-formats.ts`
- `src/components/timer/plugins/stoplight.tsx`
- 11 × (`page.tsx` + `layout.tsx`) under `/productivity/debate-timer/*` and `/productivity/toastmasters-timer/*`
- `src/components/timer/plugins/print-format-card.tsx` (PDF or printable HTML page)
- `public/og/{format-slug}-debate-timer.png` (one per format)

### 9.5 Files to edit

- `src/lib/timer-strategies/multi-step.ts` — add `previous_step` action
- `src/lib/timer-strategies/multi-step.test.ts` (or co-located test) — add coverage
- `src/app/sitemap.ts` — add 11 URLs
- `src/app/productivity/page.tsx` — link debate + toastmasters timers
- `src/app/productivity/presentation/page.tsx` and `classroom/page.tsx` — cross-link CTAs
- `src/components/timer/timer-seo-content.tsx` — ensure FAQPage + HowTo schema support

## 10. Effort estimate

| Task | Days |
|---|---|
| Strategy `previous_step` patch + test | 0.5 |
| Stoplight component | 1.0 |
| Hub page + format selector UI | 1.0 |
| 11 format/preset pages (mostly content, shared component) | 1.5 |
| Custom preset builder + URL serialization | 1.0 |
| SEO content (11 pages, speech-times tables) | 2.0 |
| Print-friendly format card | 0.5 |
| OG images (11) | 0.5 |
| Sitemap + QA + projection test on real projector | 0.5 |
| **Total** | **8.5 days** |

## 11. Acceptance criteria

- [ ] All 11 routes load with correct preset times.
- [ ] Stoplight readable at projection sizes (test at 1920x1080 full-screen).
- [ ] POI bells fire at configured times for parliamentary formats.
- [ ] Judge can advance and rewind phases manually.
- [ ] Custom preset URL round-trips (write → reload → identical state).
- [ ] Each page has unique title, meta description, H1, FAQ, and speech-times table.
- [ ] HowTo + FAQPage schema validates in Google Rich Results Test.
- [ ] Lighthouse SEO ≥ 95 on all pages.
- [ ] Sitemap updated; all 11 URLs submitted to Search Console.
- [ ] Print PDF generates correctly on letter paper.
- [ ] Cross-links from `/productivity`, `/productivity/presentation`, `/productivity/classroom`.

## 12. SEO follow-up (post-launch)

- Submit sitemap update.
- For each format, monitor impressions on `[format] speech times` and `[format] timer` queries.
- If `[format] speech times` table earns impressions but low CTR, the page is being seen as a reference — add an explicit "use the timer below" CTA above the table.
- Reach out (separate plan) to debate coaches and offer custom-preset URLs as the outreach hook.
