# Niche Implementation Plan — Tea Timer (Per-Type Presets + Multi-Cup Gongfu)

**Date:** 2026-05-17
**Niche priority:** Tier 1-2
**Build effort:** 3.5-4 days

---

## 1. Snapshot

A tea steeping timer with per-tea-type presets (green, oolong, white, black, pu-erh, herbal) plus a multi-cup concurrent-brew mode for gongfu sessions. Differentiator vs. existing tea timers: concurrent brews + gongfu progression (5-15-30-60-90s) on a single page. r/tea, Steepster, and r/puer threads show years of unmet demand for "more than 2 cups at once" tea timers.

## 2. SEO strategy

### 2.1 Target keywords

| Query | Est. monthly volume | Competition | Notes |
|---|---|---|---|
| `tea timer` | 1-3k | Medium | Generic; ad-supported sites rank |
| `green tea timer` | 500-1k | Low-Medium | Per-type long-tail |
| `oolong tea timer` | 200-500 | Low | Per-type long-tail |
| `pu erh tea timer` / `gongfu timer` | 100-300 | Very low | Niche enthusiast queries |
| `tea steeping time chart` | 1-3k | Medium | Informational + tool intent |
| `multi cup tea timer` | 100-300 | Very low | Pure long-tail win |
| `gongfu cha timer` | 100-300 | Very low | Underserved |

### 2.2 Why we can rank

- **Per-tea-type pages** target shallow competition pools.
- **Steeping-time chart** content earns informational query traffic AND links back to the tool.
- **Multi-cup / gongfu** = explicitly underserved (no good tool exists).
- **Per-tea SEO long-tail** mirrors what coffee timers do, just less developed.

### 2.3 Realistic competitive read

This niche has moderate competition but no dominant winner. Tea Drunk, MeiLeaf, Steepster, and steep.it all exist; none own the SEO. Per-type pages are the clear path.

## 3. URL structure

| URL | Keyword target | Type |
|---|---|---|
| `/kitchen/tea-timer` | tea timer / tea steeping time chart | Hub + chart |
| `/kitchen/tea-timer/green` | green tea timer | Per-type |
| `/kitchen/tea-timer/oolong` | oolong tea timer | Per-type |
| `/kitchen/tea-timer/white` | white tea timer | Per-type |
| `/kitchen/tea-timer/black` | black tea timer | Per-type |
| `/kitchen/tea-timer/pu-erh` | pu erh tea timer | Per-type |
| `/kitchen/tea-timer/herbal` | herbal tea timer | Per-type |
| `/kitchen/tea-timer/matcha` | matcha timer | Per-type |
| `/kitchen/tea-timer/gongfu` | gongfu tea timer | Method |
| `/kitchen/tea-timer/multi-cup` | multi cup tea timer | Mode |

10 URLs.

## 4. On-page SEO

**`/kitchen/tea-timer`** (hub):

```yaml
title: "Free Tea Timer — Steeping Times for Every Tea + Multi-Cup Mode"
meta_description: "Free tea timer with per-type presets (green, oolong, white, pu-erh, herbal) and multi-cup gongfu mode. Steeping chart included. No signup."
h1: "Tea Timer with Per-Type Steeping Presets"
```

**`/kitchen/tea-timer/gongfu`**:

```yaml
title: "Gongfu Cha Timer — Multi-Infusion Tea Timer (5-15-30-60s Auto)"
meta_description: "Free gongfu cha timer with auto-progressing infusion times (5s, 15s, 30s, 60s, 90s). Concurrent multi-cup brews. For oolong, pu-erh, and white tea sessions."
h1: "Gongfu Cha Multi-Infusion Tea Timer"
```

## 5. Content outline (per page, ~800-1000 words)

**Per-tea-type page:**

1. **Hero** — H1 + recommended steeping time/temp + the timer.
2. **Steeping times for [tea type]** — table by sub-variety (e.g., for green: Sencha 1min, Dragon Well 2min, Gyokuro 1.5min).
3. **How to brew [tea type]** — 150 words. Water temp, leaf ratio.
4. **Common mistakes** — 100 words. Over-steeping, water too hot, etc.
5. **For multi-infusion (gongfu) brewing** — 150 words. Cross-link to gongfu page.
6. **FAQ** — 5-6 Q&A (250 words).
7. **Related** — link other tea types + gongfu + multi-cup.

**Hub page** — different structure: configurator above fold, comprehensive steeping-time chart below (this is the page's main informational asset).

## 6. Schema markup

`WebApplication`, `BreadcrumbList`, `FAQPage`, plus `HowTo` for brewing methods.

The hub's steeping-time chart should be marked up as a structured `Table` for accessibility, though Google does not currently surface it as a rich result.

## 7. Internal linking plan

**Inbound:**
- `/kitchen` category landing — feature tea timer.
- `/kitchen/cooking`, `/kitchen/eggs` — sidebar link.
- `/kitchen/pour-over-timer` (coffee) — "Tea drinker? See our [tea timer]" cross-link.
- `/wellness/meditation` — "Pair meditation with a tea ritual" cross-link.

**Outbound:**
- Each per-type page → hub + 2-3 other types + gongfu (if applicable).
- Hub → all sub-pages.

## 8. Backlink hooks

| Hook | Who links |
|---|---|
| **Steeping-time chart** | Tea blogs and tea-shop pages cite the chart as a reference |
| **Per-type pages with specific brew temps and times** | Tea retailers occasionally link as a customer resource |
| **Gongfu multi-infusion auto-progress** | r/puer, r/gongfu users share the URL in discussions |
| **MeiLeaf / TeaDB feature** | Tier-2 creator outreach (see plan) |
| **No signup, no ads** | Differentiator vs. tea-tracking apps |

## 9. Implementation

### 9.1 Strategy

- Single-cup mode: `countdown.ts` with a per-tea preset.
- Multi-cup mode: new strategy `multi-cup.ts` OR clever use of multiple `countdown` instances in the same page state.
- Gongfu mode: `multi-step.ts` with auto-progressing durations (5, 15, 30, 60, 90s steps).

Multi-cup is the trickiest because each cup has its own countdown running in parallel. Recommend: pure React state for multi-cup (skip the strategy abstraction since each cup is just a simple countdown).

### 9.2 UI requirements

**Per-type single timer:**
- Standard countdown UI with tea-type-themed color (green tea = green, oolong = amber, etc.).
- Water temp recommendation visible.
- Audio chime on completion.

**Multi-cup:**
- Grid layout of cups (1-6 cups, configurable).
- Each cup: label, countdown, start/stop, individual chime.
- "Add cup" button.
- Save the cup set to localStorage and URL.

**Gongfu:**
- Single primary countdown with infusion-number indicator ("Infusion 3 of 8: 30s").
- "Next infusion" button auto-advances and resets duration to the next preset.
- Configurable progression curve (5-15-30-60-90 default; custom override).
- Re-steep tracking ("This is your 4th infusion — most pu-erhs go 8-12 infusions").

### 9.3 Files to create

- `src/lib/tea-presets.ts` (per-type recommendations + gongfu progression curves)
- `src/components/tea/tea-grid.tsx` (multi-cup grid)
- `src/components/tea/gongfu-progression.tsx`
- `src/components/tea/steeping-chart.tsx` (the hub's chart)
- `src/app/kitchen/tea-timer/page.tsx` + `layout.tsx`
- 9 × sub-page + layouts
- `public/og/tea-{type}.png` (one per major type)

### 9.4 Files to edit

- `src/app/sitemap.ts` — add 10 URLs
- `src/app/kitchen/page.tsx` — feature tea timer
- `src/app/kitchen/pour-over-timer/page.tsx` — cross-link

## 10. Effort estimate

| Task | Days |
|---|---|
| Tea presets + progression definitions | 0.5 |
| Single-cup UI per type | 0.5 |
| Multi-cup grid + state management | 1.0 |
| Gongfu progression UI | 0.5 |
| Steeping chart component (hub) | 0.5 |
| 10 routes + layouts | 0.25 |
| SEO content (10 pages × ~800-1000 words) | 1.5 |
| OG images | 0.25 |
| Sitemap + QA | 0.25 |
| **Total** | **5 days** |

## 11. Acceptance criteria

- [ ] All 10 routes load correctly.
- [ ] Per-type presets match common reference times (verified against MeiLeaf / Adagio).
- [ ] Multi-cup supports 1-6 concurrent timers without UI lag.
- [ ] Gongfu auto-advances to next preset duration when "Next infusion" pressed.
- [ ] Steeping chart on hub is comprehensive and accessible (semantic table markup).
- [ ] Each page has unique title, meta description, H1.
- [ ] FAQ + HowTo schema validates.
- [ ] Sitemap updated.
- [ ] Cross-links from kitchen + coffee + wellness pages.

## 12. SEO follow-up

- Monitor Search Console for `[type] tea timer` and `tea steeping time chart` queries.
- After 30 days, audit which sub-types underperform and add per-sub-variety long-tail pages (e.g., `/tea-timer/green/dragon-well`).
- Outreach: MeiLeaf, TeaDB (separate plan).

## 13. Risks

| Risk | Mitigation |
|---|---|
| Steeping-time recommendations vary by source | Cite 2-3 authoritative sources in FAQ; allow user override. |
| Multi-cup UI complex on mobile | Limit to 4 cups on mobile; show 6 on desktop. |
| Gongfu progression curve disputes | Allow custom progression; default to standard curve. |
