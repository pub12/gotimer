# GoTimer Customer Acquisition Roadmap

> **For agentic workers:** This is a roadmap across six tracks, not one implementation plan. Each track is its own plan. Pick a track, then request a full TDD plan for that track using `superpowers:writing-plans`. Steps in this doc are milestones; full plans expand them into bite-sized TDD tasks.

**Goal:** Ship the six acquisition tracks (watermarks, platform timers, high-intent SEO timers, seasonal timers, community, embed) in the order that maximises signups per engineering-week.

**Architecture:** Tracks are layered. Track 6 (embed + watermark infrastructure) and Track 1 (watermark policy) are foundational — they determine whether every later build acts as a distribution surface. Tracks 2, 3, 4 ride on top. Track 5 is distribution and runs in parallel from day one.

**Tech Stack (confirmed from repo):** Next.js 16 (Turbopack), Tailwind v4, Radix UI, TypeScript, better-sqlite3, MDX. Timer system uses a registry pattern (`src/lib/timer-registry.ts`) with Strategies (10 engines) + Presets (24+) + Categories (6). Embed route already exists at `src/app/embed/[type]/page.tsx`.

**Domain:** `gotimer.org` (NOT .io). All watermarks, schema, canonical URLs, social cards must use `.org`.

---

## Execution Order (by signups-per-engineering-week)

| Phase | Weeks | Track | Why first |
|---|---|---|---|
| 1 | 1–2 | **Embed + Watermark foundations** (Tracks 6 + 1) | Every later track inherits the watermark → multiplies all downstream acquisition |
| 2 | 3–4 | **Streamer widget suite + Classroom timer** (part of Track 3 + Track 2) | Highest broadcast-per-use; daily habitual use; near-term SEO |
| 3 | 5–6 | **Platform landing pages + widget builder** (Track 2) | Unlocks acquisition for every timer already shipped |
| 4 | 7–8 | **Seasonal category + programmatic events** (Track 4) | Seasonal compounding; each embed = backlink |
| 5 | 9+ | **Remaining high-intent SEO timers** (Track 3) | Fills out SEO long tail |
| ∞ | from week 1 | **Community distribution** (Track 5) | Runs in parallel — post each launch into the relevant community |

---

# Track 1 — Watermarks

**Goal:** Every embed renders a branded, clickable `gotimer.org` watermark by default. Hiding the watermark is gated behind a signed-in Pro tier (pricing TBD — free for now, but the infra to gate it should exist).

**Acquisition mechanic:** Every third-party site, stream, classroom projector, and Notion page that embeds a GoTimer widget broadcasts the URL. This is the single highest-velocity channel.

**Current state:** `src/components/timer/timer-embed.tsx:56-77` already renders a watermark in `full` and `minimal` modes. There is **no `"none"` mode**, so by default the watermark is always on — good. But the link text and placement are not optimised for in-stream / in-classroom viewing.

**Files to create / modify:**
- Modify: `src/components/timer/timer-embed.tsx` — reorganise the branding block; add a `"hidden"` variant that is only honoured when a valid Pro token is present in URL params
- Create: `src/lib/embed-watermark.ts` — single source of truth for watermark rendering (text, positioning, sizing per embed type)
- Modify: `src/app/embed/[type]/page.tsx:8-16` — add `"pro_token"` to `RESERVED_KEYS` and validate it server-side
- Create: `src/lib/pro-tokens.ts` — verify/issue Pro embed tokens (HMAC-signed, stateless)
- Modify: `src/components/timer/timer-shell-v2.tsx` — ensure main-site pages have a minimal footer mention (not a watermark — it's the host site)

**Milestone tasks:**
1. Audit every embed render path. Confirm watermark is always visible when `branding !== "hidden"` AND no valid `pro_token`.
2. Ship three watermark variants: `full` (banner line), `minimal` (corner logo + URL), `corner` (bottom-right chip, ideal for OBS/streaming).
3. Position watermark in the corner for themes marked as `transparent` / `streaming`. For classroom (projector) theme, put it in the top-right and keep it large enough to be legible at 20 ft.
4. Add `pro_token` URL param validation. HMAC-signed token keyed on user ID + expiry. Store signing secret in `HAZO_CONFIG` env.
5. Wire into sitemap + OG images: every timer page gets an OG image with the URL baked in (future backlink when people share).
6. Event-track watermark clicks (`ga-events.ts` exists) so you can measure acquisition from watermark impressions.

**Success metric:** Click-through rate from watermark ≥ 0.5% of embed impressions. Watermark-driven signups attributable via UTM.

**Dependency:** None. Ship first.

---

# Track 2 — Platform Timers (distribution-surface landing pages)

**Goal:** Rank for "timer for [platform]" search queries AND provide the canonical copy-paste embed path for each platform's users. This is how you unlock acquisition on every timer you already ship.

**Acquisition mechanic:** High-intent SEO (transactional queries like "countdown for notion", "timer for obs") + platform-native distribution (Notion template gallery, OBS resource hub, WordPress plugin directory, Shopify App Store).

**Files to create / modify:**
- Create: `src/app/timer-for-[platform]/page.tsx` — one route per platform, server-rendered MDX-style (follow the pattern in `src/components/timer/timer-page.tsx`)
- Create: `src/lib/platform-integrations.ts` — registry of platform targets (slug, display name, embed docs, iframe sizing, auth quirks)
- Create: `src/app/widget-builder/page.tsx` — interactive wizard: pick timer type → style → duration → copy iframe
- Create: `src/components/widget-builder/` — wizard step components (pattern: reuse `src/app/studio` conventions)
- Modify: `src/app/sitemap.ts` — add platform landing pages to sitemap with priority 0.9
- Modify: `src/lib/timer-registry.ts` — add `embedPlatforms: string[]` to STRATEGIES so each strategy declares which platforms it has a tested embed for

**Platforms to ship (ordered by expected acquisition velocity):**

| Platform | Route | Priority | Reason |
|---|---|---|---|
| OBS / Twitch / YouTube | `/timer-for-obs` | P0 | Watermark on-stream = highest broadcast |
| Notion | `/timer-for-notion` | P0 | Existing widget gallery culture; users actively seek |
| WordPress | `/timer-for-wordpress` | P0 | Biggest CMS; iframe embed + future plugin |
| Google Slides / PowerPoint / Keynote | `/timer-for-slides` | P1 | Presenter timer is its own keyword |
| Wix | `/timer-for-wix` | P1 | Small-business sites |
| Squarespace | `/timer-for-squarespace` | P1 | Same |
| Webflow | `/timer-for-webflow` | P2 | Designer tier |
| Framer | `/timer-for-framer` | P2 | Design community |
| Carrd | `/timer-for-carrd` | P2 | Indie launches |
| Shopify | `/timer-for-shopify` (+ Shopify App) | P1 | Review-gated app store. Higher effort, separate track. |

**Milestone tasks:**
1. Build the `platform-integrations.ts` registry with all ten platforms, their iframe sizing quirks, and whether they support `<iframe>` vs `<script>` embed.
2. Create a single reusable landing-page template that reads from the registry. One template → ten rankable pages.
3. Build the widget builder wizard: choose timer (pulled from registry) → pick theme → pick duration → see live preview → copy iframe code. One-screen app, no signup required.
4. For each platform, write 400–800 words of platform-specific setup copy (how to paste into a Notion embed block, how to add as OBS browser source, how to embed in a WordPress block).
5. Generate platform-specific OG images (same template, swap the platform logo) — cheap social media share assets.
6. Ship a `/timer-for-[platform]/[timer-type]` cross-cut: `/timer-for-notion/pomodoro`, `/timer-for-obs/countdown`, etc. Programmatic SEO — 10 platforms × 10+ strategies = 100+ rankable pages with near-zero incremental effort.

**Success metric:** 5+ platform landing pages ranking top 10 for `timer for [platform]` within 90 days. Widget builder → embed-generated click-throughs.

**Dependency:** Requires Track 1 watermark hardening and Track 6 embed enhancements. Ship after Phase 1.

---

# Track 3 — High-Intent SEO Timers

**Goal:** Ship the four timers with the strongest demand-to-competitor-quality ratio: **Classroom visual timer, Toastmasters/speech timer, Streamer BRB suite, Speedrun splits**.

**Acquisition mechanic:** Exact-match transactional search queries where current incumbents are weak (ads, clunky UX, account gates).

**Files to create / modify:**
- For each new timer, add to `src/lib/timer-registry.ts` as a new STRATEGY (if novel engine) or PRESET (if existing engine fits)
- Create: `src/lib/timer-strategies/[strategy-name].ts` for novel engines (e.g. `speech-lights.ts`, `stream-brb.ts`, `splits.ts`, `visual-disk.ts`)
- Create: `src/app/[route]/page.tsx` for each landing page
- Create: `src/app/embed/[type]/page.tsx` consumers just work because registry is the source of truth

**Timer 1 — Classroom Visual Timer**
- Strategy: `visual-disk` (new). Shrinking colored disk, configurable 1–60 min.
- Route: `/classroom-timer` + preset pages `/classroom-timer/5-minutes`, `/classroom-timer/10-minutes`, etc.
- Theme: `classroom` — large type, high contrast, minimal chrome, watermark in top-right.
- Variants: shrinking disk (default), shrinking bar, traffic-light.
- Audio: gentle chime (opt-in). Must work full-screen on a projector.

**Timer 2 — Toastmasters / Speech Timer**
- Strategy: `speech-lights` (new). Green → yellow → red phases with configurable thresholds.
- Route: `/speech-timer` + `/toastmasters-timer` (alias) + presets per Toastmasters speech type (Ice Breaker 4–6 min, Table Topics 1–2 min, Evaluator 2–3 min, …).
- Differentiator: full-screen **color-flood** mode (whole viewport turns red when over time — visible across a conference room or on Zoom).
- Config: `green_at`, `yellow_at`, `red_at` in seconds. Supports silent mode for meeting use.

**Timer 3 — Stream BRB / Starting Soon / Intermission suite**
- Strategy: `stream-countdown` (new). Countdown with customizable message, transparent background, URL-param styling.
- Routes: `/stream-timer`, `/stream-timer/brb`, `/stream-timer/starting-soon`, `/stream-timer/intermission`.
- Params: `bg=transparent`, `font=`, `size=`, `accent=`, `message=`, `expired_message=`.
- Ship with an OBS-ready copy-paste browser-source URL generator as part of the widget builder (Track 2).
- Watermark: corner chip mode (minimal on-screen footprint).

**Timer 4 — Speedrun Splits**
- Strategy: `splits` (new). Stopwatch with configurable split list, personal-best comparison.
- Route: `/speedrun-timer`.
- Storage: local-first (localStorage for splits + PB). Optional account sync (later).
- Keyboard-driven: spacebar = split, R = reset.

**Milestone tasks (per timer):**
1. Add strategy entry to `timer-registry.ts` and implement engine in `src/lib/timer-strategies/[name].ts` following the existing strategy interface in `types.ts`.
2. Write unit tests for the strategy engine (follow test patterns used by existing strategies — check `src/lib/timer-strategies/countdown.ts` for reference).
3. Wire into `src/lib/timer-strategies/index.ts` dispatcher.
4. Create landing page under `src/app/[route]/page.tsx` with SEO copy (1,200+ words, H2-structured, FAQ section, JSON-LD HowTo schema).
5. Add to `src/lib/site-categories.ts` in the right category (classroom → productivity; speech → productivity; stream → new `streaming` category; speedrun → new `streaming` or `gaming` category).
6. Generate OG image per timer.
7. Confirm `/embed/[type]` works for the new strategy without further code (registry-driven).
8. Ship preset sub-pages for programmatic SEO: `/classroom-timer/5-minutes`, `/speech-timer/5-7-min`, etc.

**Success metric:** Each timer ranks top 10 for its primary keyword within 60 days. Daily sessions > 500 within 90 days per timer.

**Dependency:** Track 1 watermark variants must include `corner` mode for streamer timer. Track 6 embed infra must support `bg=transparent` param.

---

# Track 4 — Seasonal Timers (new category)

**Goal:** Ship a `/countdown-to/[event]` programmatic category with 40+ seasonal and evergreen event countdowns. Each is an embeddable widget that earns a backlink every time someone pastes it into a wedding site, sports blog, mosque/synagogue site, or mommy blog.

**Acquisition mechanic:** Seasonal SEO (re-compounds every year) + embed-as-backlink (each embed = permanent backlink).

**Files to create / modify:**
- Create: `src/lib/timer-registry.ts` — new CATEGORY `countdown-to` (or `events`) with appropriate heading/CTA
- Create: `src/lib/events-registry.ts` — registry of events: `{ slug, name, date_rule, tags, seasonal_months, schema_event_type }`
- Create: `src/app/countdown-to/[event]/page.tsx` — programmatic page reading from events registry
- Create: `src/app/countdown-to/page.tsx` — category hub listing all events
- Create: `src/lib/timer-strategies/event-countdown.ts` — countdown engine that handles recurring events (next occurrence logic)
- Modify: `src/app/sitemap.ts` — include `/countdown-to/*` routes with seasonal `changeFrequency`

**Initial event list (ship in this order):**

| Group | Events | Notes |
|---|---|---|
| Major holidays | Christmas, New Year, Halloween, Thanksgiving, Easter, Valentine's, Mother's Day, Father's Day, Independence Day | Largest seasonal spikes |
| Religious / cultural | Eid al-Fitr, Eid al-Adha, Ramadan start, Hanukkah, Passover, Diwali, Holi, Lunar New Year, Rosh Hashanah | Deep community embed (mosque/temple sites) |
| Sports | Super Bowl, World Cup, F1 season opener, NFL kickoff, Olympics, March Madness, FIFA, Wimbledon | Each blog / fan site embeds |
| Pop-culture / recurring | Black Friday, BFCM, Prime Day, Tax Day, Daylight Savings, Summer Solstice, Back to School | Retail + productivity overlap |
| Personal / evergreen | Wedding, Birthday, Anniversary, Retirement, Graduation, Baby Due Date, Moving Day | User-configurable target date; huge total volume |

Target ~50 events launch-ready.

**Milestone tasks:**
1. Build `events-registry.ts` with 50 seeded events. Each event has a `next_date()` function — use established libraries or a date-rule spec (e.g. "third Thursday in November").
2. Implement `event-countdown` strategy that reads an event from registry and computes next occurrence.
3. Build the programmatic page template with 800–1500 words of event-specific copy (tradition, history, how many days until, FAQs).
4. Add `Event` JSON-LD schema per page.
5. Add category hub `/countdown-to` grouped by month.
6. Ship user-configurable custom event countdown: `/countdown-to/custom?date=2027-06-15&name=My+Wedding` — user creates → they embed on their wedding site → permanent backlink.
7. Integrate with widget builder (Track 2) so users can pick "event countdown" and get iframe code.
8. Seasonal OG images per event, swapping in-theme colors (red/green for Christmas, etc.).

**Success metric:** 30+ event pages in Google index within 60 days. At least 3 events hit top 10 SERP for their core query within 180 days. 100+ third-party embeds of `countdown-to/custom` within 180 days (measure via referrer logs).

**Dependency:** Track 6 embed enhancements (Event schema, per-visitor evergreen mode). Ship in Phase 4.

---

# Track 5 — Community Distribution (runs in parallel from Day 1)

**Goal:** For every launch in Tracks 1–4, have a pre-written community post ready to go out the same day.

**Acquisition mechanic:** Tight-knit communities where one share reaches everyone. Authenticity matters — this is not marketing blast, it's "legitimate free tool shared where asked."

**Files to create / modify:**
- Create: `docs/distribution/community-targets.md` — master list of subreddits, Discord servers, forums, Slack/Circle groups, mailing lists per niche
- Create: `docs/distribution/launch-playbook.md` — template for each launch: where to post, what to say, when to follow up
- Create: `docs/distribution/post-templates/[track-slug].md` — pre-written launch posts per track

**Community targets (per track):**

| Launch | Post to |
|---|---|
| Classroom timer | r/Teachers, r/TeachingResources, r/AutismParenting, r/ADHD, TeachersPayTeachers free listing, EduTok hashtag |
| Toastmasters timer | Toastmasters District FB groups, r/Toastmasters, LinkedIn Toastmasters groups, Pathways mentors mailing lists |
| Stream BRB widgets | r/Twitch, r/Streamers, r/OBS, OBS Forum resource submission, StreamElements Discord, Lurk Discord |
| Speedrun | r/speedrun, speedrun.com forum thread that already asks for alternatives, relevant game speedrun Discords |
| D&D turn timer (later) | r/DnD, r/DMAcademy, D&D Beyond forums, Dungeon Masters' Workshop Discord |
| Platform landing pages (Notion) | r/Notion, Notion Tips FB group, Notion templates Twitter community |
| Seasonal / wedding | r/Wedding, r/Weddingsunder10k, The Knot community, Reddit r/WeddingPlanning |
| Seasonal / religious | relevant subreddits (r/islam, r/Judaism, r/Christianity), mosque/synagogue webmaster Facebook groups |

**Milestone tasks:**
1. Compile `community-targets.md` with links, posting rules, moderator contact where relevant.
2. Write a post-template for each track (authentic voice, "I built this because…", links to the tool, invite feedback).
3. Set a cadence: new launch → post within 24 hours → monitor comments for 72 hours → iterate based on feedback → re-post with v2 once substantive improvement ships.
4. For OBS Forum, prepare a dedicated resource listing with screenshots, zip package if relevant, changelog. This is a long-form submission.
5. Track referrer UTM tags per channel to measure which communities convert.

**Success metric:** Every launch is posted to ≥3 communities within 48 hours. Referrer traffic from communities ≥ 20% of new signups for the first 30 days post-launch.

**Dependency:** None. Start now.

---

# Track 6 — Embed Infrastructure Enhancements

**Goal:** Evolve the existing `src/app/embed/[type]/page.tsx` into the strongest free-tier embed in the market: transparent backgrounds, URL-param styling, responsive iframe, evergreen per-visitor timers, recurring timers, custom expired messages.

**Acquisition mechanic:** Foundation for every other track. Better embed = more places it's useful = more impressions.

**Files to create / modify:**
- Modify: `src/app/embed/[type]/page.tsx:8-16` — expand `RESERVED_KEYS` to include `bg`, `font`, `size`, `accent`, `message`, `expired_message`, `on_expire`, `repeat`, `evergreen`, `pro_token`
- Modify: `src/components/timer/timer-embed.tsx` — honour style params, render `message` and `expired_message`, support `bg=transparent`
- Create: `src/lib/embed-theme.ts` — theme resolution: dark/light/auto/darkroom/classroom/streaming/transparent
- Create: `src/lib/embed-recurrence.ts` — compute next occurrence for recurring timers (daily, weekly, every N minutes)
- Create: `src/lib/embed-evergreen.ts` — per-visitor persistence via cookie/localStorage
- Create: `src/components/timer/embed-iframe-resizer.ts` — `postMessage`-based responsive iframe helper (host page adds one script)
- Create: `src/app/api/oembed/route.ts` — oEmbed endpoint so GoTimer URLs render inline in Notion, Ghost, WordPress Gutenberg, Discord, Slack
- Create: `src/app/api/og/[...slug]/route.ts` — dynamic OG image generator for every timer URL (Next.js OG image API)

**Params to support (full URL schema):**
```
/embed/[type]?
  label=Pomodoro
  theme=light|dark|classroom|streaming|darkroom|transparent
  bg=transparent|<hex>
  font=sans|serif|mono|<google-font-name>
  size=xs|sm|md|lg|xl|full
  accent=<hex>
  controls=full|minimal|none
  branding=full|minimal|corner|hidden (hidden requires pro_token)
  message=Back+in+5+minutes
  expired_message=Back+soon
  on_expire=redirect:<url>|repeat|stop
  repeat=daily|weekly|Nm (every N minutes)
  evergreen=1 (per-visitor persistence)
  started=2026-04-24T12:00:00Z (absolute start — already supported)
  autostart=1
  pro_token=<hmac-signed>
```

**Milestone tasks:**
1. Extend `RESERVED_KEYS` and param parsing. Backfill tests for each new param.
2. Implement `bg=transparent` — add body class; ensure no ambient background colors leak.
3. Implement font loading: detect Google Font name, inject `<link>` stylesheet.
4. Implement `message` and `expired_message` rendering with safe HTML escaping.
5. Implement recurring timers (`repeat=daily|weekly|Nm`) — strategy wrapper.
6. Implement evergreen timers (`evergreen=1`) — cookie/localStorage-backed per-visitor timer.
7. Implement `on_expire=redirect:URL` — for BRB → next scene.
8. Build oEmbed endpoint so embed URLs inline in Notion, Ghost, Gutenberg, Discord, Slack — massive distribution multiplier.
9. Build dynamic OG image generator — every timer URL gets a shareable preview card. Social share = free impressions.
10. Build the `postMessage` iframe resizer — one line of JS on the host page gives responsive height. Ship as `<script src="https://gotimer.org/embed.js">` distributed per platform landing page.

**Success metric:** Embed URL with all 15 params renders correctly across Notion / OBS / WordPress / Shopify / Google Slides. oEmbed works in Notion and Discord. OG images render on Twitter / Facebook / LinkedIn / Slack previews.

**Dependency:** None. Ship first alongside Track 1.

---

# Sequencing Summary

```
Phase 1 (Weeks 1–2) ─┬─ Track 6: Embed infra (params, transparent bg, oEmbed, OG images, iframe resizer)
                     └─ Track 1: Watermarks (three variants, Pro token gating, analytics)

Phase 2 (Weeks 3–4) ─┬─ Track 3 partial: Streamer BRB suite (watermark corner mode)
                     └─ Track 3 partial: Classroom visual timer (projector theme)

Phase 3 (Weeks 5–6) ─┬─ Track 2: Widget builder wizard
                     └─ Track 2: Platform landing pages (OBS, Notion, WordPress, Slides first)

Phase 4 (Weeks 7–8) ─── Track 4: Seasonal timers (/countdown-to/* with 50 events)

Phase 5 (Weeks 9+) ──── Track 3 remainder: Toastmasters, Speedrun, and long-tail timers

Runs in parallel      ─ Track 5: Community distribution (from week 1)
```

---

# Self-Review

**Spec coverage:** All six requested tracks (watermarks, platform timers, high-intent SEO timers, seasonal timers, community, embed) are represented with goals, files, tasks, success metrics, dependencies.

**Placeholders:** No TBDs except pricing-tier detail for Track 1 (explicitly deferred per user — "free for now"). All file paths are real.

**Type consistency:** Strategy/Preset/Category types referenced match actual `src/lib/timer-registry.ts` exports confirmed by reading the file.

**Domain:** Used `gotimer.org` throughout. Memory saved.

---

# Execution Handoff

This is a roadmap across six tracks, not a single TDD-level plan. Two next-step options:

**Option A — Drill into one track.** Pick the track you want to ship first. I'll write a full TDD plan for just that track (file-by-file, task-by-task, test-by-test, commit-by-commit) in a fresh plan doc.

**Option B — Ship the foundations first.** Start with Phase 1 (Tracks 6 + 1) as a combined plan since they're tightly coupled — the watermark logic lives inside the embed infra. I'll write that combined plan.

**Recommended:** Option B. The foundations unlock every downstream track and they're quick (2 weeks). After that, Phase 2 is where visible wins start landing.
