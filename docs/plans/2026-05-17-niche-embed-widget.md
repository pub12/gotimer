# Niche Implementation Plan — Embed Widget Infrastructure

**Date:** 2026-05-17
**Niche priority:** Tier 1 (strategic — long-term moat)
**Build effort:** 4-5 days

---

## 1. Snapshot

`<iframe>` embed infrastructure that turns every existing gotimer page into an embeddable widget for third-party sites. Free embeds carry a small "Powered by gotimer" attribution; paid removal at a future point. Strategic value: **every embed = a permanent backlink to gotimer.org**. TickCounter built a business on this (1.9M+ embedded sites). This is the longest-compounding asset on the roadmap.

## 2. SEO strategy

This is fundamentally **backlink-acquisition infrastructure**, not a destination-traffic play. The SEO benefit is:

1. Every embed on a third-party page → a backlink to `gotimer.org/[timer]`.
2. Backlinks raise domain authority, improving rank for every page on the site.
3. The embed-builder page itself targets `embed countdown timer`, `iframe timer`, etc.

### 2.1 Target keywords for the embed-builder page

| Query | Est. monthly volume | Competition |
|---|---|---|
| `embed countdown timer` | 500-1k | Medium (TickCounter ranks) |
| `iframe timer` | 200-500 | Low |
| `countdown widget for website` | 1-3k | Medium |
| `wedding countdown widget` | 500-1k | Medium (TickCounter) |
| `event countdown embed` | 200-500 | Low |
| `embed timer wordpress` | 200-500 | Low |

### 2.2 Backlink yield assumption

Per TickCounter's history: ~5-10% of users who configure an embed actually deploy it. Of those, ~30% deploy on a domain Google indexes. Realistic targets:

| Time | Configured embeds | Live embeds | Indexed backlinks |
|---|---|---|---|
| 3 months | ~200 | ~50 | ~15 |
| 6 months | ~1k | ~200 | ~60 |
| 12 months | ~5k | ~1k | ~300 |

These compound. By month 18 the backlink profile materially shifts gotimer's domain authority, lifting every other page.

## 3. URL structure

| URL | Keyword target | Type |
|---|---|---|
| `/embed` | embed countdown timer / iframe timer | Builder hub |
| `/embed/countdown` | embed countdown timer | Builder per-timer |
| `/embed/wedding-countdown` | wedding countdown widget | Use-case landing |
| `/embed/event-countdown` | event countdown embed | Use-case landing |
| `/embed/wordpress` | embed timer wordpress | Platform-specific |
| `/embed/shopify` | shopify countdown timer | Platform-specific |
| `/embed/notion` | notion countdown timer | Platform-specific |
| `/e/{timer-slug}` | (the embed iframe target itself; not indexed) | Iframe URL |

The `/e/` short prefix is intentional — embed URLs should be short.

## 4. Embed URL spec

The actual iframe URL is `/e/[timer-slug]?[params]`. Examples:

```html
<iframe src="https://gotimer.org/e/countdown?mins=5&label=Lunch+break" width="300" height="100"></iframe>

<iframe src="https://gotimer.org/e/wedding?date=2027-06-15&label=Sarah+and+Alex" width="320" height="120"></iframe>
```

### Embed parameters (shared across all embeds)

| Param | Type | Notes |
|---|---|---|
| `theme` | enum | `light` / `dark` / `auto` |
| `accent` | hex | accent color |
| `font` | enum | `sans` / `serif` / `mono` |
| `attribution` | bool | `1` shows "Powered by gotimer" (default); `0` requires paid tier |
| Per-timer params (mins, date, etc.) | per-timer | matches the parent page's URL params |

## 5. On-page SEO

**`/embed`** (hub):

```yaml
title: "Embed a Free Countdown Timer on Your Website — No Signup"
meta_description: "Free embed-able countdown timer, event widget, and Pomodoro for any website. WordPress, Shopify, Notion, Webflow. Just paste an iframe. No signup."
h1: "Embed a Countdown Timer on Your Website"
```

**`/embed/wedding-countdown`**:

```yaml
title: "Free Wedding Countdown Widget for Your Website — Customizable"
meta_description: "Free embeddable wedding countdown timer with custom date, names, and theme. Paste the iframe into any site builder (Squarespace, Wix, WordPress, Notion)."
h1: "Wedding Countdown Widget"
```

## 6. Content outline

**Hub page (`/embed`, ~1000 words):**

1. **Hero** — H1 + 1-sentence value + a live embed-builder above the fold (configure → copy iframe).
2. **How embeds work** — 150 words.
3. **Examples by use case** — gallery of pre-configured embeds (wedding, product launch, sale countdown, Pomodoro, event).
4. **Platform guides** — short links to WordPress, Shopify, Notion, Webflow pages.
5. **Customization options** — themes, colors, sizes.
6. **Pricing** (when paid tier exists) — free with attribution, $X to remove.
7. **FAQ** — 5-6 Q&A.

**Platform-specific page (e.g., `/embed/wordpress`, ~700-900 words):**

1. **Hero** — H1 + the builder.
2. **Step-by-step: add to WordPress** — block editor + classic editor + Elementor + Gutenberg.
3. **Troubleshooting common WordPress embed issues**.
4. **Examples**.
5. **FAQ**.

## 7. Schema markup

`WebApplication`, `BreadcrumbList`, `FAQPage`, plus `HowTo` for the platform-specific pages.

## 8. Internal linking plan

**Inbound:**
- Every timer page gets an "Embed this timer on your website" link in the toolbar → routes to `/embed/[that-timer]?config=...`.
- Homepage gets an "Embed gotimer on your site" CTA.

**Outbound:**
- Each `/embed/[platform]` page links back to the relevant timer pages.

## 9. Backlink hooks (the whole point)

| Hook | Mechanism |
|---|---|
| **"Powered by gotimer" attribution on every free embed** | The attribution is a `<a href="https://gotimer.org/">` — every embed = a backlink |
| **Easy iframe copy → user pastes on their site** | Zero friction acquisition |
| **Platform-specific guides** | Earn `embed countdown wordpress` / `shopify` long-tail SEO |
| **Showcase of "sites using gotimer"** | Optional gallery of public embeds (with permission) — drives FOMO adoption |

## 10. Implementation

### 10.1 The embed page structure

`/e/[timer-slug]/page.tsx` renders a *stripped-chrome* version of the timer:

```tsx
export default function EmbedPage({ params, searchParams }) {
  return (
    <html>
      <head>
        <style>{embed_styles}</style>
      </head>
      <body className="embed-frame">
        <TimerComponent {...config} />
        {show_attribution && (
          <a href="https://gotimer.org" className="attribution" target="_blank" rel="noopener">
            Powered by gotimer
          </a>
        )}
      </body>
    </html>
  );
}
```

### 10.2 Embed builder UI

`/embed/page.tsx` is an interactive configurator:

1. Select timer type (countdown, pomodoro, wedding, etc.).
2. Configure parameters (date, label, theme).
3. Live preview iframe rendered in the page.
4. **Copy iframe** button — generates the exact `<iframe>` markup.
5. (Future) **Remove attribution** upsell.

### 10.3 Critical implementation details

- **Embed pages must NOT include site nav, footer, analytics tracking that depends on consent banners.** Embedded pages run in third-party contexts.
- **Robots:** the `/e/` paths should be `noindex` (we don't want gotimer's own embed iframes ranking against gotimer's main timer pages). Add `<meta name="robots" content="noindex">` to embed pages.
- **CSP headers:** allow embedding. Set `X-Frame-Options: ALLOWALL` (or remove the header) on `/e/*` routes only — never on the main site.
- **Performance:** embed pages must be lightweight (< 50KB JS) because they load on third-party pages.
- **Attribution link:** open in new tab (`target="_blank" rel="noopener"`); never modify the parent page.
- **Theme respect:** if parent passes `?theme=dark`, render in dark mode; if `auto`, use `prefers-color-scheme`.

### 10.4 Files to create

- `src/app/e/[slug]/page.tsx` (the embed iframe target)
- `src/app/e/layout.tsx` (minimal layout, no nav, no footer)
- `src/app/embed/page.tsx` + `layout.tsx`
- `src/app/embed/countdown/page.tsx` + `layout.tsx`
- `src/app/embed/wedding-countdown/page.tsx` + `layout.tsx`
- `src/app/embed/event-countdown/page.tsx` + `layout.tsx`
- `src/app/embed/wordpress/page.tsx` + `layout.tsx`
- `src/app/embed/shopify/page.tsx` + `layout.tsx`
- `src/app/embed/notion/page.tsx` + `layout.tsx`
- `src/components/embed/embed-builder.tsx`
- `src/components/embed/iframe-preview.tsx`
- `src/components/embed/attribution.tsx`
- `next.config.ts` patches for headers on `/e/*`

### 10.5 Files to edit

- `next.config.ts` — add header rules for `/e/*` (X-Frame-Options or CSP frame-ancestors)
- `src/app/sitemap.ts` — add `/embed/*` pages (NOT `/e/*`)
- Every timer page that should be embeddable — add "Embed this timer" link in toolbar/footer
- `src/components/timer/timer-toolbar.tsx` — add embed CTA
- `src/app/page.tsx` — add embed CTA in nav or footer

## 11. Effort estimate

| Task | Days |
|---|---|
| `/e/[slug]` embed page + header config | 1.0 |
| Embed builder UI + iframe generator | 1.5 |
| Attribution component + dark/light/auto theming | 0.5 |
| 7 builder/landing routes + layouts | 0.5 |
| SEO content (7 pages) | 1.5 |
| "Embed this timer" CTA on existing timer pages | 0.25 |
| OG images (for the landing pages, not embeds) | 0.25 |
| Sitemap + robots + QA | 0.25 |
| **Total** | **5 days** |

## 12. Acceptance criteria

- [ ] All 7 builder/landing routes load correctly.
- [ ] `/e/[slug]` renders a minimal embeddable version with attribution.
- [ ] Iframe can be embedded on a third-party page (test on a separate test site).
- [ ] X-Frame-Options / frame-ancestors permits embedding on any origin.
- [ ] Attribution link points to gotimer.org with `rel="noopener"`.
- [ ] Theme/accent/font URL params apply correctly.
- [ ] `/e/*` pages are `noindex`.
- [ ] Embed builder generates valid iframe markup.
- [ ] Live preview matches generated iframe.
- [ ] Each builder page has unique title, meta description, H1.
- [ ] FAQ + HowTo schema validates.
- [ ] Existing timer pages have "Embed this timer" CTA.
- [ ] Cross-links from homepage and main nav.
- [ ] Sitemap updated for `/embed/*` only.

## 13. SEO follow-up (post-launch)

- Submit `/embed/*` sitemap.
- Monitor Search Console for `embed countdown timer` and platform-specific queries.
- After 60 days, audit which embed configurations are most-used → promote into pre-built landing pages.
- Add more platform guides (Webflow, Squarespace, Ghost, Substack) based on demand.

## 14. Long-term roadmap (post v1)

- **Paid attribution removal** ($5-15/month) — viable once embed adoption reaches ~500 active embeds.
- **Embed gallery** (with permission, showcase sites using gotimer embeds).
- **Embed analytics** for paid users (view count per embed).
- **WebComponent variant** (`<gotimer-countdown>`) for advanced users who don't want iframes.
- **Self-hosted JS embed** (script tag) as an alternative to iframe.

## 15. Risks

| Risk | Mitigation |
|---|---|
| Embed iframes break with browser security updates (CSP changes) | Test quarterly. Provide both iframe and script-tag options. |
| Third-party sites strip the attribution link | Inevitable. Free tier still useful for the iframe URL appearing in HTML source = some SEO value even without rendered backlink. |
| Embed pages bloat the site's index | `/e/*` is `noindex` — won't appear in sitemap or rank against main pages. |
| Embed builder is harder to use than expected | Heavy usability testing on the builder before launch; copy-iframe should be one click. |
| Attribution dilutes branding | The whole point. Accept it. The backlink moat is worth more than the brand purity. |
