# Niche Implementation Plan — Coffee Timers (Pour-Over + Espresso)

**Date:** 2026-05-17
**Niche priority:** Tier 1
**Build effort:** 5-6 days
**Note:** Two tools (pour-over multi-stage + espresso shot timer) bundled into one plan because they share infrastructure and audience.

---

## 1. Snapshot

Pour-over multi-stage timer with method-specific presets (V60, Chemex, AeroPress, Hoffmann 4:6, French press) + espresso shot timer with pre-infusion / first-drip split tracking. Shared audience (home baristas) but distinct queries and pages. Coffee timers earn moderate traffic but compete against well-funded mobile apps — we win by being the only zero-friction web tool with shareable preset URLs.

## 2. SEO strategy

### 2.1 Target keywords

**Pour-over:**

| Query | Est. monthly volume | Competition | Notes |
|---|---|---|---|
| `pour over timer` | 1-3k | Medium | pourovertimer.com ranks; thin competition |
| `v60 timer` | 500-1k | Low-Medium | Specific method = lower competition |
| `chemex timer` | 200-500 | Low | Underserved |
| `aeropress timer` | 500-1k | Medium | Several mobile apps rank |
| `hoffmann v60 timer` | 200-500 | Low | Named-recipe query |
| `4:6 method timer` / `tetsu kasuya timer` | 200-500 | Very low | Underserved |
| `french press timer` | 1-3k | Medium | Common, fragmented competition |

**Espresso:**

| Query | Est. monthly volume | Competition | Notes |
|---|---|---|---|
| `espresso timer` | 1-3k | Medium | Mostly mobile apps |
| `espresso shot timer` | 500-1k | Low-Medium | Underserved web |
| `espresso pre infusion timer` | 100-300 | Very low | Pure long-tail win |
| `25 second espresso timer` | 100-300 | Low | Recipe-driven query |

### 2.2 Why we can rank

- **Method-specific pages** create per-method shallow competition.
- **Named-recipe pages** (Hoffmann V60, Tetsu Kasuya 4:6) have almost no SEO competition and high intent.
- **Shareable preset URL** = differentiator vs. apps. Coffee creators (Lance Hedrick, James Hoffmann) link "use this URL" in video descriptions.
- **Pre-infusion split** for espresso = exact pain point cited in home-barista threads; an SEO page that *names* the pain wins the click.

### 2.3 Honest competitive read

Pour-over and espresso queries are not greenfield. We're competing against:
- App ecosystem (Timer.Coffee, FourSix, Brewfecto) — strong but app-only.
- Single-method web tools (pourovertimer.com) — basic.

Our winning conditions:
- Cover ALL major methods on ONE site.
- Per-named-recipe URLs that target long-tail.
- The Lance Hedrick / FLTR-magazine creator pitch (see outreach plan) — a single feature is worth more than 6 months of SEO.

## 3. URL structure

### Pour-over

| URL | Keyword target | Type |
|---|---|---|
| `/kitchen/pour-over-timer` | pour over timer | Hub + configurator |
| `/kitchen/pour-over-timer/v60` | v60 timer | Method preset |
| `/kitchen/pour-over-timer/chemex` | chemex timer | Method preset |
| `/kitchen/pour-over-timer/aeropress` | aeropress timer | Method preset |
| `/kitchen/pour-over-timer/aeropress-inverted` | inverted aeropress | Method preset |
| `/kitchen/pour-over-timer/french-press` | french press timer | Method preset |
| `/kitchen/pour-over-timer/hoffmann-v60` | hoffmann v60 timer | Named recipe |
| `/kitchen/pour-over-timer/hoffmann-french-press` | hoffmann french press | Named recipe |
| `/kitchen/pour-over-timer/tetsu-kasuya-4-6` | 4:6 method timer | Named recipe |
| `/kitchen/pour-over-timer/kalita-wave` | kalita wave timer | Method preset |

### Espresso

| URL | Keyword target | Type |
|---|---|---|
| `/kitchen/espresso-timer` | espresso timer | Hub |
| `/kitchen/espresso-timer/pre-infusion` | espresso pre-infusion timer | Mode preset |
| `/kitchen/espresso-timer/25-second-shot` | 25 second espresso timer | Recipe preset |

13 total URLs.

## 4. On-page SEO

**`/kitchen/pour-over-timer/hoffmann-v60`**:

```yaml
title: "Hoffmann V60 Timer — James Hoffmann's Ultimate V60 Recipe"
meta_description: "Free V60 pour-over timer with James Hoffmann's recipe pre-configured: 50g bloom, 60g pours, 2:00 finish at 200g. No signup, no app. Audio cues per pour."
h1: "Hoffmann V60 Timer"
```

**`/kitchen/espresso-timer/pre-infusion`**:

```yaml
title: "Espresso Pre-Infusion Timer — Tracks Bloom and First Drip"
meta_description: "Free espresso timer with pre-infusion phase + first-drip split. Tracks total extraction and post-first-drip time separately. No signup."
h1: "Espresso Pre-Infusion Timer"
```

## 5. Content outline (per recipe page, ~900-1200 words)

1. **Hero** — H1 + recipe summary (g coffee, g water, ratio, brew time) + the timer.
2. **The recipe** — 200-300 words. Faithful reproduction of the named recipe.
3. **How to use this timer** — 150 words.
4. **Why this recipe (and who created it)** — 150 words. Credit the source (Hoffmann, Kasuya, Rao, etc.).
5. **Equipment needed** — 100-150 words. Dripper, filter, grinder, scale, kettle.
6. **Pro tips for nailing this method** — 200 words.
7. **FAQ** — 5-6 Q&A (250 words).
8. **Related** — link other pour-over methods + espresso + tea timer.

The recipe summary above the fold answers the search intent directly; the body provides depth for E-E-A-T signals.

## 6. Schema markup

`WebApplication`, `BreadcrumbList`, `FAQPage`, plus `Recipe` schema on each recipe page:

```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Hoffmann V60",
  "recipeYield": "1 cup (200g)",
  "totalTime": "PT4M",
  "recipeIngredient": ["20g coffee, medium-fine", "300g water at 95°C"],
  "recipeInstructions": [
    {"@type": "HowToStep", "name": "Bloom", "text": "Add 50g water..."},
    ...
  ]
}
```

`Recipe` schema is extremely high-value SEO — it can produce rich cards with timing, ratings, and method, dramatically increasing CTR.

## 7. Internal linking plan

**Inbound:**
- `/kitchen` category landing — feature pour-over and espresso prominently.
- `/kitchen/cooking`, `/kitchen/eggs`, `/kitchen/bread-proofing` — sidebar links to coffee timers.
- `/kitchen/multi-timer` — "Brewing multiple coffees at once? Use multi-timer." CTA.
- Homepage if it features popular tools.

**Outbound:**
- Each recipe page → hub + 2-3 sibling recipes ("Other Hoffmann recipes: French Press, AeroPress").
- Pour-over hub ↔ espresso hub (cross-link as siblings).
- All link back to `/kitchen`.

## 8. Backlink hooks

| Hook | Who links |
|---|---|
| **Lance Hedrick / FLTR Magazine feature** | Coffee creators with massive backlink authority — single feature = lift across all coffee pages |
| **Shareable recipe URL** | r/coffee, r/espresso, home-barista users paste URLs in discussions |
| **Named-recipe pages** (Hoffmann, Kasuya) | Other coffee blogs cite the recipe and link our timer as "follow along" |
| **Pre-infusion split tracking** | home-barista forum threads about pre-infusion timing |
| **Recipe schema rich results** | Higher CTR drives more clicks → more shares → more backlinks |

## 9. Implementation

### 9.1 Strategy

Pour-over uses `multi-step.ts` (sequential pour stages). Espresso uses a custom `espresso-shot.ts` strategy because it has two parallel timestamps (pump-on time + first-drip-relative time) running simultaneously.

Espresso strategy sketch:

```ts
// src/lib/timer-strategies/espresso-shot.ts
export interface EspressoState {
  elapsed: number;            // since pump-on
  first_drip_at: number | null;  // ms when first drip pressed
  target_range: [number, number];  // e.g., [25, 30] for 25-30s
  phase: "pre-infusion" | "extracting" | "complete";
}
// action: "first_drip" — captures first_drip_at = elapsed
```

### 9.2 UI requirements

**Pour-over:**
- Large primary readout (current pour-phase remaining).
- Pour-step prompt ("Pour 60g now") above the readout.
- Cumulative water-weight progress bar (visual: 50/300g, 110/300g, etc.).
- Audio bell on each pour transition.
- Recipe summary card pinned to the side (ratio, total water).

**Espresso:**
- Single large readout for total elapsed (mm:ss).
- Secondary smaller readout for "since first drip" (only visible once first-drip is pressed).
- Big "First Drip" button — visible and one-tap.
- Target band visual: green between 25-30s, yellow before 25, red after 30.
- Shot history log (last 5 shots: total time, first-drip time, notes).

### 9.3 Files to create

- `src/lib/coffee-recipes.ts` (recipe definitions for the 7 named recipes)
- `src/lib/timer-strategies/espresso-shot.ts` (+ test)
- `src/app/kitchen/pour-over-timer/page.tsx` + `layout.tsx`
- 9 × per-recipe pour-over preset pages + layouts
- `src/app/kitchen/espresso-timer/page.tsx` + `layout.tsx`
- 2 × espresso preset pages + layouts
- `src/components/coffee/pour-step-display.tsx`
- `src/components/coffee/espresso-display.tsx`
- `src/components/coffee/shot-history.tsx`
- `public/og/{recipe}.png` (one per major recipe, ~8 images)

### 9.4 Files to edit

- `src/lib/timer-strategies/index.ts` — export espresso strategy
- `src/app/sitemap.ts` — add 13 URLs
- `src/app/kitchen/page.tsx` — feature coffee timers
- `src/app/kitchen/cooking/page.tsx`, `eggs/page.tsx`, `bread-proofing/page.tsx`, `multi-timer/page.tsx` — cross-links

## 10. Effort estimate

| Task | Days |
|---|---|
| Pour-over recipes definition (7 recipes) | 0.5 |
| Pour-over UI (step display, water-weight progress) | 1.0 |
| Espresso strategy + test | 0.5 |
| Espresso UI (first-drip button, target band, history) | 1.0 |
| 13 routes (page + layout) | 0.5 |
| SEO content (13 pages × ~900-1200 words; coffee content is research-heavy) | 2.0 |
| OG images (8) | 0.5 |
| Sitemap + QA | 0.25 |
| **Total** | **6 days** |

## 11. Acceptance criteria

- [ ] All 13 routes load correctly.
- [ ] Each named-recipe preset matches the published recipe (Hoffmann, Kasuya, Rao verified).
- [ ] Audio bell fires on each pour transition.
- [ ] Espresso first-drip button captures timestamp within 100ms.
- [ ] Target band changes color at correct seconds.
- [ ] Shot history persists across reloads.
- [ ] Each page has unique title, meta description, H1.
- [ ] Recipe schema validates in Google Rich Results Test.
- [ ] FAQ schema validates.
- [ ] Sitemap updated; 13 URLs submitted to Search Console.
- [ ] Cross-links from all kitchen timers.
- [ ] OG images render correctly.

## 12. SEO follow-up (post-launch)

- Submit sitemap.
- Monitor Recipe rich results in Search Console (they appear under "Search Appearance" → "Recipe").
- Track impressions on named-recipe queries (Hoffmann V60, Tetsu Kasuya 4:6) — these should appear within 2-3 weeks and have high CTR.
- Reach out to Lance Hedrick (separate outreach plan) — a single video mention is worth months of SEO.

## 13. Risks

| Risk | Mitigation |
|---|---|
| Recipe inaccuracy → coffee community calls it out | Cite source URL for each recipe; allow community-submitted corrections via a simple feedback form. |
| Hoffmann / Kasuya request takedown of named-recipe pages | Recipes are not copyrightable. Method names are fair use. Maintain credit prominently. |
| App ecosystem (Timer.Coffee) ships a web version | Our wedge is shareable URL + no install. Maintain that as the differentiator. |
| Espresso pre-infusion timing varies by machine | Document the variance in FAQ; let users configure pre-infusion duration via URL param. |
