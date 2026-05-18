# Niche Implementation Plan — Streamer BRB / Starting-Soon Overlay (OBS Browser Source)

**Date:** 2026-05-17
**Niche priority:** Tier 1
**Build effort:** 3 days

---

## 1. Snapshot

A transparent-background countdown overlay configurable entirely via URL query string, designed to be dropped into OBS Studio as a Browser Source. No login, no account, no watermark. Three preset URLs cover the three most common use cases (starting soon, BRB, stream over). The killer distribution channel is the OBS Project Resources listing — a permanent, auto-trusted listing that delivers long-tail traffic for years.

## 2. SEO strategy

### 2.1 Target keywords

| Query | Est. monthly volume | Competition | Notes |
|---|---|---|---|
| `obs countdown timer` | 1-3k | Medium | Stagetimer, StreamElements rank; ours is free |
| `obs brb timer` | 200-500 | Low | Underserved |
| `obs starting soon countdown` | 500-1k | Low-Medium | Niche |
| `twitch brb timer` | 500-1k | Low | Niche |
| `streamelements countdown free` | 200-500 | Low | Comparison query |
| `transparent countdown overlay` | 200-500 | Low | Long-tail |
| `obs browser source timer` | 500-1k | Low | Implementation-specific query |

### 2.2 Why we can rank

- **OBS Project Resources listing** = auto-trusted backlink + first-party traffic. This single listing is worth more than the sum of all SEO work.
- **Free + no-signup** = direct differentiator vs. StreamElements/own3d (which require login).
- **Query-string config** = each preset URL is its own SEO page.

### 2.3 The distribution wedge

Unlike other niches, **the primary acquisition channel here is NOT Google search**. It is:
1. The OBS Project Resources listing (permanent, ~50-150 clicks/month after established).
2. r/Twitch self-promo threads (one-shot bursts).
3. Streamer-tools YouTube channels (EposVox, Gaming Careers).

SEO is a secondary channel. We still optimize, but we don't expect it to be the largest source of traffic for 6+ months.

## 3. URL structure

| URL | Keyword target | Type |
|---|---|---|
| `/brb` | obs brb timer / transparent countdown overlay | Hub + configurator |
| `/brb/starting-soon` | obs starting soon countdown | Preset |
| `/brb/be-right-back` | twitch brb timer | Preset |
| `/brb/stream-over` | stream ending screen | Preset |
| `/brb/raid-countdown` | twitch raid countdown timer | Preset |
| `/streamer-tools/obs-countdown` (alias) | obs countdown timer | Landing for SEO |

The `/brb` short URL is intentional — easier for streamers to remember and type into OBS.

## 4. URL parameter spec

All parameters are query-string driven so the overlay is configurable without UI:

```
/brb?mins=5&label=Back+soon&color=ffd700&font=mono&bg=transparent&sound=bell&autostart=1
```

| Param | Type | Example | Default |
|---|---|---|---|
| `mins` | int | `5` | 5 |
| `secs` | int | `30` | 0 |
| `label` | string | `Back+soon` | "Back soon" |
| `color` | hex | `ffd700` | white |
| `font` | enum | `mono` / `serif` / `sans` | sans |
| `bg` | enum | `transparent` / hex | transparent |
| `sound` | enum | `bell` / `chime` / `off` | off |
| `autostart` | bool | `1` | 0 |
| `size` | enum | `xl` / `lg` / `md` | xl |
| `align` | enum | `center` / `left` / `right` | center |
| `pulse` | bool | `1` | 0 (pulse on last 10s) |

## 5. On-page SEO

**`/brb`** (hub):

```yaml
title: "Free OBS Browser-Source Countdown Timer — No Signup"
meta_description: "Transparent BRB and starting-soon countdown for OBS Studio. URL-driven config, no watermark, no signup. Drop the URL into a Browser Source and stream."
h1: "OBS BRB / Starting-Soon Countdown Overlay"
canonical: "/brb"
```

**`/brb/starting-soon`**:

```yaml
title: "OBS Starting Soon Countdown — Transparent, Free, No Watermark"
meta_description: "Free 'Starting Soon' countdown overlay for OBS. 5-minute default, customizable via URL. Transparent background, no signup or watermark."
h1: "Stream Starting Soon Countdown"
```

## 6. Content outline (per page, ~700-900 words)

For the OBS-focused content, the page must include:

1. **Hero** — H1 + 1-line value prop + a live demo of the overlay rendering.
2. **Quick start: drop into OBS** — 5-step guide with screenshots.
3. **URL parameter reference** — table (mirrors the spec above).
4. **Preset URLs** — bulleted list of pre-built variants.
5. **Compatibility** — works with OBS Studio, Streamlabs Desktop, vMix, XSplit (test each).
6. **Privacy / what we collect** — explicit "no analytics on the overlay URL".
7. **FAQ** — 6 Q&A (e.g., "Why doesn't the background show as transparent?", "Why does the sound not play?").
8. **For developers** — encourage tinkering with the URL params, link to source if open.

The Quick Start guide is the page's primary user value — Google rewards comprehensive how-to content for queries like "obs browser source countdown."

## 7. Schema markup

`WebApplication` + `BreadcrumbList` + `HowTo` (for the OBS setup steps) + `FAQPage`.

## 8. Internal linking plan

**Inbound:**
- Homepage `/` — add a "For Streamers" link in the footer or a section.
- Top-level nav — add "Streamer Tools" if not present.
- `/embed` page (if it exists) — cross-link as a related embed scenario.

**Outbound:**
- Each preset → hub + sibling presets.
- Hub → external link to OBS Project Resources listing (signals we're listed there).

## 9. Backlink hooks

| Hook | Who links |
|---|---|
| **OBS Project Resources listing** | Permanent, auto-trusted. Other streamer-tool sites discover via that index. |
| **No watermark, no signup** | Streamer-tool comparison videos and reddit threads cite this |
| **Pre-built URLs for common scenarios** | Streamers paste URL into their Discord, school, or Twitch panel — those count as referral traffic |
| **GitHub readme / source (if open)** | If we open-source the overlay component, GitHub linkbacks |
| **YouTube tutorials by streamer-tool creators** | EposVox, Gaming Careers, Harris Heller could feature in setup guides |

## 10. Implementation

### 10.1 Strategy

Reuse `countdown.ts` strategy with custom display. No new strategy needed.

### 10.2 UI requirements

This is fundamentally different from other timer pages — there is NO toolbar, sidebar, or branding on the *overlay itself*. The page is essentially:

```tsx
<html>
  <body style={{ background: 'transparent' }}>
    <div className="overlay-readout">{formatted_time}</div>
    {/* no nav, no footer, no anything */}
  </body>
</html>
```

The SEO content lives on a *separate* version of the route — either via:
- **Option A:** `/brb` is the SEO landing (with nav, content, demo), `/brb/embed` is the bare overlay.
- **Option B (preferred):** `/brb` is both — when loaded with `?embed=1`, it strips chrome. OBS users use `/brb?embed=1&mins=5`.

Option B is cleaner: one URL to remember.

### 10.3 Critical implementation details

- **Transparent background** — OBS requires CSS `body { background: transparent }` to work with browser source's "Custom CSS" or built-in transparency.
- **No `width=device-width` viewport hack** that scales fonts on small windows — OBS sometimes renders at 1080p inside a smaller viewport.
- **Fonts must be self-hosted or system** — Google Fonts can fail to load over time and break OBS overlays.
- **Audio playback in OBS browser source is disabled by default** — document this clearly. Optionally provide a separate browser tab the streamer can mute/unmute.
- **No animations that pin to 60fps** — OBS users have varying GPU budgets. CSS transitions only, no Canvas.
- **Pulse / flash on last 10 seconds** — CSS `@keyframes` (low GPU cost).

### 10.4 Files to create

- `src/app/brb/page.tsx` + `layout.tsx`
- `src/app/brb/starting-soon/page.tsx` + `layout.tsx`
- `src/app/brb/be-right-back/page.tsx` + `layout.tsx`
- `src/app/brb/stream-over/page.tsx` + `layout.tsx`
- `src/app/brb/raid-countdown/page.tsx` + `layout.tsx`
- `src/app/streamer-tools/obs-countdown/page.tsx` + `layout.tsx` (SEO alias)
- `src/components/brb/overlay.tsx` (the bare overlay component)
- `src/components/brb/configurator.tsx` (the URL builder UI for the hub page)
- `public/og/obs-brb-overlay.png`
- `docs/obs-resources-submission.md` (the listing copy for OBS Project Resources, ready to submit)

### 10.5 Files to edit

- `src/app/sitemap.ts` — add 6 URLs
- `src/app/page.tsx` — add "For Streamers" footer link
- Top-level nav — add Streamer Tools

## 11. Effort estimate

| Task | Days |
|---|---|
| Bare overlay component | 0.5 |
| URL parameter parsing + validation | 0.5 |
| Configurator UI (hub page) | 0.5 |
| 6 routes (page + layout) | 0.5 |
| SEO content (6 pages × ~700 words) | 1.0 |
| OBS Resources submission copy + testing in OBS | 0.5 |
| OG image | 0.25 |
| Sitemap + QA | 0.25 |
| **Total** | **3.5 days** |

## 12. Acceptance criteria

- [ ] All 6 routes load correctly.
- [ ] `/brb?embed=1` renders with transparent background and no chrome.
- [ ] All URL parameters parse correctly and apply to the overlay.
- [ ] Tested in OBS Studio 30.x on macOS and Windows.
- [ ] Tested in Streamlabs Desktop.
- [ ] Pulse-on-last-10-seconds works smoothly at 1080p.
- [ ] Each non-embed page has unique title, meta description, H1.
- [ ] HowTo schema for the OBS setup guide validates.
- [ ] Sitemap updated; 6 URLs submitted to Search Console.
- [ ] OBS Resources submission copy ready in `docs/obs-resources-submission.md`.
- [ ] OG image renders correctly.

## 13. SEO follow-up (post-launch)

- Submit to OBS Project Resources (separate task — see outreach plan).
- Monitor referral traffic from obsproject.com — should appear within a week of listing approval.
- After 30 days, identify which preset URLs get the most direct traffic; promote them in the hub page.
- Reach out to EposVox / Gaming Careers (separate outreach plan).

## 14. Risks

| Risk | Mitigation |
|---|---|
| OBS Resources rejects the listing | Resubmit with stronger free/open positioning. Read existing approved listings for tone. |
| Streamers expect built-in browser-source audio that OBS blocks | Document the OBS audio limitation prominently. Offer a separate browser tab for the audio cue. |
| Self-hosted fonts increase page weight | Use system font stack for the overlay (Arial / -apple-system). Custom fonts only for SEO content pages. |
| Direct competitors (StreamElements) build a free tier | Our wedge is "no login at all" — keep zero-login as a hard rule. |
