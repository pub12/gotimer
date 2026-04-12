# GoTimer Redesign: The Kinetic Clubhouse

## Context

GoTimer's current UI uses a generic shadcn/ui look — Geist fonts, yellow-ish OKLch primary, standard borders and shadows. The Stitch-generated designs in `docs/design/newui/` define a bold new identity called "The Kinetic Clubhouse" — a competitive-yet-approachable aesthetic with Navy + Burnt Orange + Gold palette, Lexend headlines, glassmorphism, and scale-on-hover interactions. This redesign replaces the entire design system across all 8 core pages while extracting reusable components to reduce duplication and improve maintainability.

## Decisions Made

- **Full replacement** of design system (fonts, colors, icons approach, shadows, borders)
- **Keep Lucide React** icons (not switching to Material Symbols)
- **Both navigations**: glassmorphic top nav on desktop + bottom nav with floating CTA on mobile
- **Mascot placeholders** for now (swap real assets later)
- **Full parallel** implementation: build design system foundation, then all 8 pages simultaneously
- **Restyle-first approach**: keep shadcn/ui architecture (CVA, Radix, data-slot), restyle with new tokens, add new shared components

## Scope

### Pages Being Redesigned (8)
1. Homepage
2. Pomodoro Timer
3. Admin Dashboard
4. Blog Main (listing)
5. Blog Article (detail)
6. Individual Challenge
7. Leaderboard — Meme-First variant
8. Leaderboard — Graph/Performance variant

### Out of Scope
- Auth pages (hazo_auth — styled via CSS variable mapping, not component changes)
- API routes
- Timer setup pages (countdown-setup, chess-clock-setup, round-timer-setup)
- Public challenge browse/detail pages (will inherit new tokens automatically)
- Partners, privacy policy, terms pages

## Architecture

### Phase 1: Foundation

**1a. Design Tokens (`src/app/globals.css`)**

Replace all CSS variables in `:root` and `.dark` with the Kinetic Clubhouse palette:

- **Primary:** `#041534` (Navy) — was `oklch(0.82 0.17 85)` (yellow). Foreground: `#ffffff`
- **Secondary:** `#ab3514` (Burnt Orange) — was `oklch(0.96 0.01 85)` (light gray). Foreground: `#ffffff`
- **Accent:** `#755b00` (Gold) — was `oklch(0.93 0.04 85)` (warm gray). Foreground: `#ffffff`
- **Surfaces:** 5-tier system from `#f8f9ff` to `#dfe1ea`
- **Border:** `transparent` — no visible borders, structure via background shifts
- **Shadows:** "Long-Soft" — `0 8px 32px rgba(4,21,52,0.06)`
- **Glassmorphism tokens:** `--glass-bg`, `--glass-blur`, `--glass-border`

Add new Tailwind theme mappings for `--color-surface-*` tiers and `--shadow-soft*`.

Update hazo_auth CSS variable mappings (`--hazo-*`) to match new palette.

Update `.dark` variant with navy-based backgrounds stepping from `#041534` to `#0d2654`.

**1b. Font Swap (`src/app/layout.tsx`)**

Replace:
```typescript
import { Geist, Geist_Mono } from "next/font/google";
```
With:
```typescript
import { Lexend, Inter } from "next/font/google";
```

- Lexend: weight 900, variable `--font-lexend`
- Inter: weights 400/500/600/700, variable `--font-inter`

Update `@theme inline` in globals.css:
- `--font-sans: var(--font-inter)`
- `--font-headline: var(--font-lexend)` (new custom font token)

**1c. Base layer update**

Change `@layer base` from `@apply border-border` to `@apply border-transparent` to enforce the no-border principle globally.

### Phase 2: Restyle Existing Primitives

**`src/components/ui/button.tsx`**
- Update `buttonVariants` CVA config with new colors, `rounded-[0.75rem]`, `hover:scale-105`, remove border refs
- Add `tertiary` variant (Gold)
- Add `shadow-[var(--shadow-soft)]` to default/secondary/tertiary

**`src/components/ui/card.tsx`**
- Remove `border` from Card base class
- Replace `shadow-sm` with `shadow-[var(--shadow-soft)]`
- Change `rounded-xl` to `rounded-[1rem]`
- Remove border refs from CardFooter/CardHeader
- Add `font-headline font-black` to CardTitle

**`src/components/ui/chart.tsx`**
- Update tooltip styling: remove border, use `--surface-container-highest` bg, `--shadow-soft`, new radius
- Chart colors automatically pick up new `--chart-N` variables

### Phase 3: New Shared Components

Create `src/components/shared/` directory. Build 5 new UI primitives + 9 new shared composites (see `docs/design/components.md` for full prop specs):

| # | Component | File | Purpose |
|---|-----------|------|---------|
| 1 | Badge | `ui/badge.tsx` | Status pills with CVA variants |
| 2 | Avatar | `ui/avatar.tsx` | Circular avatar with size/rank variants |
| 3 | SectionHeader | `ui/section-header.tsx` | Lexend headline + subtitle |
| 4 | ProgressRing | `ui/progress-ring.tsx` | SVG circle progress (extracted) |
| 5 | CategoryChip | `ui/category-chip.tsx` | Active/inactive toggle pill |
| 6 | GlassmorphicNavbar | `shared/glassmorphic-navbar.tsx` | Desktop top nav (replaces navbar.tsx) |
| 7 | MobileBottomNav | `shared/mobile-bottom-nav.tsx` | Bottom tab bar with floating CTA |
| 8 | StatCard | `shared/stat-card.tsx` | KPI metric display |
| 9 | ChallengeCardV2 | `shared/challenge-card-v2.tsx` | Unified challenge card |
| 10 | GameHistoryItem | `shared/game-history-item.tsx` | Atomic game result row |
| 11 | FaqAccordion | `shared/faq-accordion.tsx` | Moved from timer-page/ |
| 12 | NewsletterSignup | `shared/newsletter-signup.tsx` | Email capture card |
| 13 | BarChartWrapper | `shared/bar-chart-wrapper.tsx` | Pre-themed Recharts bar chart |
| 14 | MascotPlaceholder | `shared/mascot-placeholder.tsx` | Placeholder for future mascots |

### Phase 4: Page Redesigns (all parallel)

Each page: restyle existing page-specific components with new tokens + integrate shared components.

**Homepage** (`src/app/page.tsx` + `src/components/homepage/*`)
- Hero: Navy gradient, ProgressRing, Lexend headlines, Orange CTAs, mascot placeholder
- CategoryGrid: Surface-tier cards, CategoryChip, hover:scale-105
- LeaderboardTeaser: ChallengeCardV2 variant="full"
- SocialProof: StatCard grid
- HowItWorks: SectionHeader + numbered step cards
- FAQ: FaqAccordion (shared)

**Pomodoro Timer** (`src/app/countdown-setup/page.tsx` area + `src/components/timer-page/*`)
- Central ProgressRing (lg) with Lexend time display
- Preset duration chips via CategoryChip
- Sidebar: StatCard for PB Streak / Total Focus
- Challenge CTA card
- MascotPlaceholder for tip card
- Mobile: sticky bottom CTA

**Admin Dashboard** (`src/app/admin/*` + `src/components/admin/*`)
- Sidebar: Navy bg, Orange active state, Avatar
- KPI grid: 4x StatCard with colored underlines
- Moderation table: alternating surface-tier rows (no borders)
- BarChartWrapper for mascot usage chart
- System health indicators with Badge

**Blog Main** (`src/app/blog/page.tsx` + `src/components/blog/*`)
- Featured post: large image card with gradient overlay
- Article grid: post-card.tsx restyled with Badge categories, hover:scale-105
- NewsletterSignup card
- Sidebar: popular posts, CategoryChip filter

**Blog Article** (`src/app/blog/[slug]/page.tsx` + MDX components)
- Centered 720px content column
- SectionHeader for title
- Callout: surface-tier bg, left border in secondary color
- Step cards with numbered circles
- Pull quote with large quotation watermark
- CTA timer card
- FaqAccordion
- NewsletterSignup

**Individual Challenge** (`src/app/challenges/[id]/page.tsx` + challenge components)
- Hero gradient with background image
- Large Avatar pair (xl size) with rank badges
- Score display: `font-headline font-black text-7xl`
- Featured GIF display
- StatCard for win rate / streak
- Line chart for score progression (chart.tsx)
- GameHistoryItem feed

**Leaderboard — Meme-First** (`src/app/leaderboard/page.tsx`)
- Champion podium: top 3 with large Avatar (xl), rank badges
- Leaderboard table: Avatar, username, timer type, best time, reaction GIF
- "Vibe Check" sidebar widget
- "Live Arena" active matches section
- MobileBottomNav with floating Rank CTA

**Leaderboard — Graph** (tab or view toggle within `/leaderboard` page, not a separate route)
- ChallengeCardV2 for active challenges
- BarChartWrapper for win/loss performance chart
- GameHistoryItem feed
- StatCard grid

### Deprecation Plan

After all pages are migrated:
1. Delete `src/components/navbar.tsx` (replaced by `shared/glassmorphic-navbar.tsx`)
2. Delete `src/components/challenges/challenge-card.tsx` (replaced by `shared/challenge-card-v2.tsx`)
3. Delete `src/components/leaderboard/challenge-card.tsx` (replaced by `shared/challenge-card-v2.tsx`)
4. Move any remaining callers of `timer-page/faq-accordion.tsx` to `shared/faq-accordion.tsx`

## Key Technical Considerations

### hazo_auth Styling
The hazo_auth package uses `--hazo-*` CSS variables mapped in globals.css. These must be updated to match the new palette. The `ProfilePicMenu` component renders Radix Dialog/DropdownMenu — the existing global overrides for `[data-radix-popper-content-wrapper]` and `[role="dialog"]` must be updated with new radius/shadow/background values.

### Glassmorphism Fallback
`backdrop-filter: blur()` can cause perf issues on older mobile. Add:
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-nav { background: var(--surface); }
}
```

### Recharts Color Migration
`challenge-histogram.tsx` uses hardcoded oklch stroke colors on `<Line>` elements. These must be migrated to use `--chart-N` CSS variables or the `ChartConfig` color system from chart.tsx.

### No-Border Principle
Changing `--border` to `transparent` will cascade to all shadcn components. Some Radix primitives from hazo_auth may need additional overrides. Test all dialogs, dropdowns, and tooltips after the token swap.

## Component Reference

Full component props, visual specs, and page usage documented in `docs/design/components.md`.

## Verification Plan

After implementation:

1. **Visual regression**: Compare each page screenshot to the corresponding `docs/design/newui/*_screen.png`
2. **Font check**: Verify Lexend loads for headlines, Inter for body via browser DevTools
3. **Color check**: Verify no remnants of old yellow primary or Geist fonts
4. **Border check**: Search codebase for hardcoded `border-` classes that should be removed
5. **Responsive test**: Verify glassmorphic top nav on desktop, bottom nav on mobile
6. **Dark mode**: Toggle dark mode, verify surface tiers invert correctly
7. **Auth flow**: Test login/register/ProfilePicMenu with new token mapping
8. **Accessibility**: Verify focus rings visible, color contrast meets WCAG AA
9. **Performance**: Check `backdrop-filter` doesn't cause jank on mobile Safari
10. **Build**: `npm run build` passes with no errors
