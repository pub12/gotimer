# Niche Implementation Plan — Sauna / Cold-Plunge Contrast Therapy Timer

**Date:** 2026-05-17
**Niche priority:** Tier 1 (highest)
**Build effort:** 4-5 days
**Companion docs:** `2026-05-17-three-niche-implementation.md` (superseded by this), `2026-05-17-multi-step-verification.md`

---

## 1. Snapshot

A multi-phase contrast-therapy timer (sauna → cold plunge → rest, repeated) with the Søberg protocol pre-configured. Targets the rapidly-growing biohacking / recovery audience where digital incumbents are weakest (most "timers" in this space are physical sand timers). One flagship URL plus three preset URLs plus two single-purpose timers = five SEO landing pages.

## 2. SEO strategy

### 2.1 Target keywords

| Query | Estimated monthly volume (US) | Competition | Notes |
|---|---|---|---|
| `sauna timer` | 1.5-3k | Medium | Mostly retailers; few good free tools |
| `cold plunge timer` | 500-1k | Low | Almost no dedicated tools; mostly blog content |
| `contrast therapy timer` | 200-500 | Low | Underserved query |
| `soberg protocol` / `søberg protocol` | 1-3k | Low-Medium | Trending; Huberman audience |
| `soberg protocol timer` | 50-200 | Very low | Almost no competition — pure winning opportunity |
| `15 minute sauna timer` | 100-300 | Low | Long-tail preset URL |
| `contrast bath timer` | 100-300 | Low | Adjacent (PT context) |
| `cold exposure timer` | 100-300 | Low | Adjacent (Wim Hof crossover) |

**Head term we target:** `cold plunge timer`. Lower volume than `sauna timer` but lower competition; faster ranking trajectory.

**Long-tail goldmine:** `soberg protocol timer`. Almost no competition, growing demand, Huberman/Søberg references in podcasts drive consistent search.

### 2.2 Search intent

Transactional / tool-use. Users want to *start a timer*, not read an article. Page must put the timer above the fold, content below.

### 2.3 Why we can rank

- **Digital incumbents are weak.** Existing tools are mobile-app-only (Plunge app, Othership) or physical sand timers. No dedicated free web tool.
- **Søberg protocol is a public, named protocol** — strong long-tail anchor with low competition.
- **Multiple landing pages** (one per timer variant + one per preset) capture different query types.
- **No Google-built-in widget** for "sauna timer" — unlike `5 minute timer` where Google answers in the SERP.

## 3. URL structure

| URL | Primary keyword target | Type |
|---|---|---|
| `/wellness/sauna-timer` | sauna timer | Single-phase timer |
| `/wellness/cold-plunge-timer` | cold plunge timer | Single-phase timer |
| `/wellness/contrast-therapy` | contrast therapy timer | Flagship multi-phase |
| `/wellness/contrast-therapy/soberg-protocol` | soberg protocol timer | Preset — highest-value long-tail |
| `/wellness/contrast-therapy/15-3-rest` | 15 minute sauna timer (via title) | Preset alias |
| `/wellness/contrast-therapy/wim-hof-style` | wim hof timer | Preset alias |

Each preset URL is its own indexable page. Underlying timer is the same React component with different default config.

**Canonical strategy:** Each preset is canonical to itself (not to `/contrast-therapy`). The preset URL is the answer to the long-tail query; we want it ranking, not the hub.

## 4. On-page SEO per route

### `/wellness/contrast-therapy/soberg-protocol`

```yaml
title: "Søberg Protocol Timer — Free Contrast Therapy Tool (Ends on Cold)"   # 59 chars
meta_description: "Free Søberg protocol timer for sauna and cold-plunge contrast therapy. 3 rounds, ends on cold per Dr. Susanna Søberg's research. No signup."  # 154 chars
h1: "Søberg Protocol Timer"
h2_sequence:
  - "What is the Søberg Protocol?"
  - "How to Use This Timer"
  - "Why End on Cold? The Søberg Principle"
  - "Sauna and Cold Plunge Safety"
  - "Customize Your Protocol"
  - "Related Recovery Timers"
canonical: "/wellness/contrast-therapy/soberg-protocol"
og_image: "/og/soberg-protocol-timer.png"  # static for v1
```

Body content target: 1000-1400 words (long enough to satisfy "thorough resource" signal, short enough to keep tool above fold).

Apply the same shape to each route, varying titles/H1s to match keyword.

## 5. Schema markup (JSON-LD)

Per page, emit three blocks:

1. **WebApplication** (already standard in this codebase, see `tabata/layout.tsx`).
2. **BreadcrumbList** (already standard).
3. **FAQPage** — new for this niche, gates rich-result eligibility on FAQ queries:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "What is the Søberg protocol?",
     "acceptedAnswer": {"@type": "Answer", "text": "..."}},
    ...
  ]
}
```

Add FAQ schema emission to `TimerSeoContent` if not already present. Check `src/components/timer/timer-seo-content.tsx` first.

## 6. Content outline (per preset page, ~1000-1400 words)

1. **Hero** — H1 + 1-sentence subtitle + the timer itself (above fold).
2. **What is [protocol name]?** — 150-200 words. Cite the source (Søberg 2021 paper on brown adipose tissue).
3. **How to use this timer** — 200-300 words. Step-by-step. Reference the protocol parameters.
4. **The science / "Why end on cold?"** — 200-300 words. Citations matter for E-E-A-T.
5. **Customize your protocol** — 100-150 words. Explain the URL parameters / config UI.
6. **Safety** — 150-200 words. Cardiovascular caveats, hydration, signs to stop.
7. **FAQ** — 6-8 Q&A blocks (300-400 words combined). Each Q is a long-tail query.
8. **Related timers** — link list (HIIT, breathing, meditation, sleep).

## 7. Internal linking plan

**Inbound (other pages → these new pages):**
- `/wellness` category landing — feature contrast-therapy in the top section.
- `/wellness/breathing` — add "After your breath work, try [contrast therapy]" CTA.
- `/wellness/meditation` — similar CTA.
- `/wellness/sleep` — "End your evening recovery routine with [cold plunge]" CTA.
- `/fitness/hiit` and `/fitness/tabata` — "Recover with contrast therapy" link in related timers.
- Homepage `/` — if there's a "popular" section, include cold plunge during launch period.

**Outbound (these pages → others):**
- Each preset cross-links to the others (`Søberg ↔ Wim Hof style ↔ 15-3-rest`).
- Hub `/contrast-therapy` cross-links to single-purpose `/sauna-timer` and `/cold-plunge-timer`.
- All link back up to `/wellness`.

**Anchor text variety** — never use the same anchor twice in the same paragraph; vary between brand ("Søberg protocol timer"), descriptive ("free contrast therapy tool"), and natural ("the timer below").

## 8. Backlink hooks

What makes someone link to this page from theirs:

| Hook | Who links |
|---|---|
| **Shareable URL with custom phases encoded** | Coaches/practitioners share via blog posts, Substacks |
| **Søberg protocol is a "the protocol for X" anchor** | Recovery blogs citing the protocol can link our tool as "see this free timer" |
| **Print-friendly protocol card** | Sauna/cold-plunge owners print and post in facility — drives word of mouth (not direct backlinks but offline traffic) |
| **Embed iframe** (post-launch, see embed-widget plan) | Cold-plunge equipment retailers / sauna sites can embed |
| **No ads, no signup** | Differentiator that creator-blogs cite when comparing tools |

## 9. Implementation

### 9.1 Strategy

**Decision (verified 2026-05-17):** Reuse `multi-step.ts` as-is. Pre-expand cycles into a flat `StepDefinition[]` via a shim.

New file: `src/lib/contrast-therapy.ts`:

```ts
import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

export type ContrastPhase = { name: string; duration: number };
export type ContrastConfig = {
  phases: ContrastPhase[];
  cycles: number;
  end_on?: string;
};

export function expand_contrast(config: ContrastConfig): StepDefinition[] {
  const steps: StepDefinition[] = [];
  for (let r = 1; r <= config.cycles; r++) {
    for (const phase of config.phases) {
      steps.push({
        name: `${phase.name} — Round ${r}/${config.cycles}`,
        duration: phase.duration,
      });
    }
  }
  if (config.end_on) {
    const last_keep = steps.map(s => s.name.startsWith(config.end_on!)).lastIndexOf(true);
    return steps.slice(0, last_keep + 1);
  }
  return steps;
}

export const SOBERG_PRESET: ContrastConfig = {
  phases: [
    { name: "Sauna", duration: 15 * 60 },
    { name: "Plunge", duration: 120 },
    { name: "Rest", duration: 60 },
  ],
  cycles: 3,
  end_on: "Plunge",
};

export const WIM_HOF_PRESET: ContrastConfig = { /* ... */ };
export const FIFTEEN_THREE_PRESET: ContrastConfig = { /* ... */ };
```

### 9.2 UI requirements

- **Large round/phase readout** — visible from across a sauna room.
- **Wake lock** — request `navigator.wakeLock` (verify shell already does this; reuse).
- **Loud audio cues** (bell / gong, not soft beep). Different sound per phase transition.
- **Mute toggle.**
- **Round indicator** ("Round 2 of 3") always visible.
- **Plunge-last badge** on the final phase.
- **URL-driven config** — full protocol encoded in query string for sharing.

### 9.3 Files to create

- `src/lib/contrast-therapy.ts` (preset expander)
- `src/app/wellness/sauna-timer/page.tsx` + `layout.tsx`
- `src/app/wellness/cold-plunge-timer/page.tsx` + `layout.tsx`
- `src/app/wellness/contrast-therapy/page.tsx` + `layout.tsx`
- `src/app/wellness/contrast-therapy/soberg-protocol/page.tsx` + `layout.tsx`
- `src/app/wellness/contrast-therapy/15-3-rest/page.tsx` + `layout.tsx`
- `src/app/wellness/contrast-therapy/wim-hof-style/page.tsx` + `layout.tsx`
- `public/og/soberg-protocol-timer.png` (and one per preset)

### 9.4 Files to edit

- `src/app/sitemap.ts` — add 6 new URLs
- `src/app/wellness/page.tsx` — feature contrast therapy in category landing
- `src/components/timer/timer-seo-content.tsx` — add FAQPage JSON-LD emission if not present
- `src/app/wellness/breathing/page.tsx`, `meditation/page.tsx`, `sleep/page.tsx` — add cross-link CTAs

## 10. Effort estimate

| Task | Days |
|---|---|
| Strategy shim (`expand_contrast`) | 0.5 |
| 6 routes (page + layout) | 1.5 |
| SEO content (6 pages × ~1000 words) | 1.5 |
| FAQPage schema in TimerSeoContent | 0.25 |
| Cross-linking + category landing | 0.25 |
| OG images (static, 6) | 0.5 |
| Sitemap + QA | 0.5 |
| **Total** | **5 days** |

## 11. Acceptance criteria

- [ ] All 6 routes return 200 and render correctly mobile + desktop.
- [ ] Søberg preset matches published protocol (3 rounds, end on cold).
- [ ] Audio cues fire on phase transitions, loud at arm's length.
- [ ] Wake lock keeps screen on for 15+ minutes.
- [ ] Each route has unique `<title>`, `<meta description>`, and H1.
- [ ] FAQ schema validates in Google Rich Results Test.
- [ ] Each page passes Lighthouse SEO ≥ 95, Performance ≥ 90.
- [ ] All 6 URLs in sitemap and submitted to Search Console.
- [ ] Cross-links added to breathing, meditation, sleep, HIIT, Tabata, wellness landing.
- [ ] OG image renders correctly on Twitter/Reddit preview.
- [ ] Shareable URL with custom phases round-trips correctly.

## 12. SEO follow-up (post-launch, weeks 1-4)

- Submit XML sitemap update to Google Search Console.
- Manually request indexing for the 6 new URLs.
- Monitor Search Console for impressions on `soberg protocol timer` — should appear within 2-3 weeks.
- Track click-through rate; if < 2%, rewrite meta description.
- Add internal links from any future wellness content.
