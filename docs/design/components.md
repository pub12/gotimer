# Kinetic Clubhouse Component Library

Component reference for the GoTimer redesign. Each component lists its location, props, visual specs, and which pages use it.

---

## Layer 0: Design Tokens

**File:** `src/app/globals.css`

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#041534` (Navy) | Headlines, primary backgrounds, nav |
| `--secondary` | `#ab3514` (Burnt Orange) | CTAs, interactive accents |
| `--accent` | `#755b00` (Gold) | Tertiary accents, highlights, active chips |
| `--surface` | `#f8f9ff` | Page background |
| `--surface-container-low` | `#f1f3fb` | Card backgrounds |
| `--surface-container` | `#ebedf6` | Nested element backgrounds |
| `--surface-container-high` | `#e5e7f0` | Inactive chip backgrounds |
| `--surface-container-highest` | `#dfe1ea` | Deep nested / tooltip backgrounds |
| `--on-surface` | `#041534` | Primary text (never pure black) |
| `--on-surface-variant` | `#3a4158` | Secondary/muted text |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--status-active` | `#16a34a` | Active status badges |
| `--status-win` | `#755b00` (Gold) | Win indicators |
| `--status-loss` | `#ab3514` (Orange) | Loss indicators |
| `--status-reported` | `#6366f1` | Reported content badges |

### Fonts

| Token | Font | Weights | Usage |
|-------|------|---------|-------|
| `--font-headline` | Lexend | 900 (Black) | All headlines, display text |
| `--font-sans` | Inter | 400, 500, 600, 700 | Body text, UI labels |

### Spacing & Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.75rem` (12px) | Default border radius |
| `--radius-lg` | `1rem` (16px) | Cards, large elements |
| `--radius-xl` | `1.5rem` (24px) | Hero cards, feature sections |
| `border` | `transparent` | No visible borders — structure via bg shifts |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-soft` | `0 8px 32px rgba(4,21,52,0.06)` | Cards, buttons |
| `--shadow-soft-lg` | `0 16px 64px rgba(4,21,52,0.06)` | Hero sections, modals |

### Glassmorphism

| Token | Value | Usage |
|-------|-------|-------|
| `--glass-bg` | `rgba(248,249,255,0.72)` | Navbar, bottom nav |
| `--glass-blur` | `16px` | Backdrop blur amount |
| `--glass-border` | `rgba(255,255,255,0.2)` | Subtle glass edge |

### Interactive States

| State | Style |
|-------|-------|
| Hover | `scale-105` + `transition-all duration-200 ease-out` |
| Active | `scale-95` |
| Focus | `ring-2 ring-[var(--primary)]/50 ring-offset-2` |

---

## Layer 1: UI Primitives (`src/components/ui/`)

### Button (`button.tsx`) — RESTYLE

Existing shadcn/ui button with updated CVA variants.

**Props:** (unchanged from current)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "tertiary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` | Visual variant |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | Size variant |
| `asChild` | `boolean` | `false` | Render as child element via Slot |

**Visual changes:**
- Base: `rounded-[0.75rem]`, remove all `border` refs, add `hover:scale-105 transition-all duration-200 ease-out`
- `default`: `bg-primary text-white shadow-[var(--shadow-soft)]`
- `secondary`: `bg-secondary text-white shadow-[var(--shadow-soft)]` (Burnt Orange)
- `tertiary` (NEW): `bg-accent text-white shadow-[var(--shadow-soft)]` (Gold)
- `outline`: `bg-transparent text-primary` (no border, use shadow-soft for definition)
- `ghost`: `hover:bg-[var(--surface-container)]`

**Used by:** All 8 pages

---

### Card (`card.tsx`) — RESTYLE

Existing shadcn/ui card composition with updated styling.

**Props:** (unchanged from current)
| Component | Props | Description |
|-----------|-------|-------------|
| `Card` | `className` | Root container |
| `CardHeader` | `className` | Header section with grid layout |
| `CardTitle` | `className` | Title text |
| `CardDescription` | `className` | Subtitle text |
| `CardAction` | `className` | Top-right action slot |
| `CardContent` | `className` | Main content area |
| `CardFooter` | `className` | Footer with flex layout |

**Visual changes:**
- Card: Remove `border`, add `bg-[var(--surface-container-low)] shadow-[var(--shadow-soft)] rounded-[1rem]`
- CardTitle: Add `font-headline font-black` (Lexend 900)
- Remove all `[.border-b]` / `[.border-t]` references from sub-components

**Used by:** All 8 pages

---

### Badge (`badge.tsx`) — NEW

Status pills and category tags with CVA variants.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "active" \| "reported" \| "win" \| "loss"` | `"default"` | Color variant |
| `size` | `"sm" \| "md"` | `"md"` | Size variant |
| `children` | `ReactNode` | — | Badge content |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Base: `rounded-full font-medium inline-flex items-center`
- `sm`: `px-2 py-0.5 text-xs`
- `md`: `px-3 py-1 text-xs`
- `default`: `bg-[var(--surface-container-high)] text-[var(--on-surface)]`
- `active`: `bg-emerald-50 text-emerald-600`
- `reported`: `bg-indigo-50 text-indigo-600`
- `win`: `bg-amber-50 text-amber-700`
- `loss`: `bg-red-50 text-red-600`

**Used by:** Individual Challenge, Leaderboards, Admin Dashboard, Challenge pages

---

### Avatar (`avatar.tsx`) — NEW

Wraps `@radix-ui/react-avatar` with size variants and optional rank badge.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image URL |
| `fallback` | `string` | — | Initials or fallback text |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size variant |
| `rank` | `number` | — | Optional rank badge (shows at bottom-right) |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Sizes: `sm`=32px, `md`=40px, `lg`=56px, `xl`=80px
- Base: `rounded-full shadow-[var(--shadow-soft)] overflow-hidden`
- Fallback: `bg-[var(--surface-container)] text-[var(--on-surface-variant)] font-headline font-black`
- Rank badge: `absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center`

**Used by:** Navbar, Leaderboards, Individual Challenge, Game History, Admin

---

### SectionHeader (`section-header.tsx`) — NEW

Consistent section titling with oversized Lexend headline.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Headline text |
| `subtitle` | `string` | — | Optional subtitle |
| `align` | `"left" \| "center"` | `"left"` | Text alignment |
| `as` | `"h1" \| "h2" \| "h3"` | `"h2"` | HTML heading element |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Title: `font-headline font-black tracking-[-0.02em]`
- Responsive sizes: `text-2xl md:text-4xl` for h2, `text-3xl md:text-5xl` for h1
- Subtitle: `text-[var(--on-surface-variant)] text-base mt-2`

**Used by:** All 8 pages

---

### ProgressRing (`progress-ring.tsx`) — NEW (extracted)

SVG circular progress indicator. Currently inlined in `hero.tsx` and `timer-widget.tsx`.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | — | 0 to 1 progress value |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Ring size |
| `color` | `string` | `var(--secondary)` | Active stroke color |
| `trackColor` | `string` | `var(--surface-container-high)` | Track stroke color |
| `strokeWidth` | `number` | `12` | Stroke width |
| `children` | `ReactNode` | — | Center content (timer display, etc.) |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Sizes: `sm`=120px, `md`=200px, `lg`=320px
- SVG viewBox: proportional to size, centered circle
- Active stroke: `stroke-linecap="round"`, animated via `stroke-dashoffset` transition
- Track: `var(--surface-container-high)` (#e5e7f0)
- Animation class: `.ring-progress-transition` (1s linear)

**Used by:** Homepage (hero), Pomodoro Timer, Timer pages

---

### CategoryChip (`category-chip.tsx`) — NEW

Toggleable category/tag pill with active/inactive states.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Chip text |
| `active` | `boolean` | `false` | Active state |
| `onClick` | `() => void` | — | Click handler |
| `icon` | `LucideIcon` | — | Optional leading icon |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Base: `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105`
- Active: `bg-accent/15 text-accent font-semibold`
- Inactive: `bg-[var(--surface-container)] text-[var(--on-surface-variant)]`

**Used by:** Homepage (category grid), Blog Main (filter), Leaderboard

---

## Layer 2: Shared Composites (`src/components/shared/`)

### GlassmorphicNavbar (`glassmorphic-navbar.tsx`) — NEW

Replaces `navbar.tsx`. Desktop top navigation with glassmorphism. Preserves all existing auth logic (redirect handling, `use_auth_status`, `ProfilePicMenu`, feedback dialog).

**Props:** None (reads auth state internally)

**Visual spec:**
- Container: `fixed top-0 w-full z-50 backdrop-blur-[16px] bg-[var(--glass-bg)] shadow-[var(--shadow-soft)]`
- Logo: GoTimer logo + `font-headline font-black text-xl text-primary`
- Nav links: `font-headline font-black text-xs uppercase tracking-widest text-[var(--on-surface-variant)] hover:text-primary`
- Auth section: `Avatar` component for logged-in, `Button variant="secondary"` for login CTA
- Hidden on mobile below `md:` breakpoint (mobile uses bottom nav)

**Used by:** All non-admin pages (7 of 8)

---

### MobileBottomNav (`mobile-bottom-nav.tsx`) — NEW

Bottom tab bar for mobile with floating center CTA button.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `centerAction` | `{ icon: LucideIcon, label: string, href: string }` | — | Optional floating center button config |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Container: `fixed bottom-0 w-full z-50 md:hidden backdrop-blur-[var(--glass-blur)] bg-[var(--glass-bg)]`
- Tab items: 4-5 icon+label pairs, `text-[10px] text-[var(--on-surface-variant)]`
- Active tab: `text-primary`
- Center CTA: `bg-secondary text-white rounded-full w-14 h-14 -translate-y-4 shadow-[var(--shadow-soft-lg)]`
- Safe area padding: `pb-[env(safe-area-inset-bottom)]`

**Used by:** All non-admin pages

---

### StatCard (`stat-card.tsx`) — NEW

KPI metric display with value, label, and optional trend indicator.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | — | Metric value |
| `label` | `string` | — | Metric label |
| `trend` | `{ direction: "up" \| "down" \| "flat", value: string }` | — | Optional trend |
| `icon` | `LucideIcon` | — | Optional icon |
| `accentColor` | `string` | — | Optional bottom border/accent color |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Container: `bg-[var(--surface-container-low)] rounded-[1rem] p-6 shadow-[var(--shadow-soft)]`
- Value: `font-headline font-black text-3xl text-primary`
- Label: `text-sm text-[var(--on-surface-variant)] mt-1`
- Trend up: `text-emerald-600` with arrow-up icon
- Trend down: `text-secondary` with arrow-down icon
- Optional `accentColor` as `border-b-4` underline

**Used by:** Homepage, Admin Dashboard, Leaderboard (Graph)

---

### ChallengeCardV2 (`challenge-card-v2.tsx`) — NEW (unifies two existing)

Unified challenge card replacing both `challenges/challenge-card.tsx` and `leaderboard/challenge-card.tsx`.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string \| number` | — | Challenge ID |
| `name` | `string` | — | Challenge name |
| `scores` | `{ player1: PlayerScore, player2: PlayerScore }` | — | Player scores with names, avatars |
| `status` | `"active" \| "completed" \| "paused"` | — | Challenge status |
| `gameName` | `string` | — | Optional game type |
| `totalGames` | `number` | — | Total games played |
| `lastActivity` | `string` | — | Last activity timestamp |
| `variant` | `"compact" \| "full"` | `"compact"` | Layout variant |
| `href` | `string` | — | Link destination |
| `className` | `string` | — | Additional classes |

**PlayerScore type:**
```typescript
type PlayerScore = {
  name: string;
  avatar?: string;
  score: number;
}
```

**Visual spec:**
- `compact`: Single row — avatars, names, score, status badge. For lists.
- `full`: Stacked card — large avatars, prominent score display, game name. For features.
- Base: `bg-[var(--surface-container-low)] rounded-[1.5rem] shadow-[var(--shadow-soft)] hover:scale-[1.02] transition-all duration-200`
- Score: `font-headline font-black text-2xl` (compact) / `text-5xl` (full)
- Uses `Avatar`, `Badge` components internally

**Used by:** Homepage (teaser), Individual Challenge, Leaderboards, My Challenges, Public Challenges

---

### GameHistoryItem (`game-history-item.tsx`) — REFACTOR

Atomic game result row extracted from `challenges/game-history.tsx`.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `game` | `Game` | — | Game data object |
| `winnerName` | `string` | — | Winner display name |
| `isMyWin` | `boolean` | — | Whether current user won |
| `userPicture` | `string` | — | Winner avatar URL |
| `onEdit` | `() => void` | — | Optional edit handler |
| `onDelete` | `() => void` | — | Optional delete handler |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Container: `bg-[var(--surface-container-low)] p-6 rounded-[1.5rem] flex gap-6 hover:scale-[1.01] transition-all duration-200`
- Date badge: `w-20 font-headline font-black text-[var(--on-surface-variant)] text-center`
- Winner highlight: `bg-accent/8` subtle background
- Point delta: `font-headline font-black` with `+` green / `-` orange
- GIF display: `rounded-[0.75rem] overflow-hidden aspect-video`

**Used by:** Individual Challenge, Leaderboard (Graph)

---

### FaqAccordion (`faq-accordion.tsx`) — MOVE + RESTYLE

Moved from `timer-page/faq-accordion.tsx` to shared. Updated visuals.

**Props:** (unchanged)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `FaqItem[]` | — | Array of {question, answer} |

**FaqItem type:**
```typescript
type FaqItem = {
  question: string;
  answer: string;
}
```

**Visual changes:**
- Remove all border styling
- Items: `bg-[var(--surface-container-low)] rounded-[0.75rem]` with `gap-3` between
- Icon: Lucide `ChevronDown` with `transition-transform duration-200 group-open:rotate-180`
- Question text: `font-headline font-semibold`
- JSON-LD generation preserved (SEO-critical)

**Used by:** Timer pages, Blog Article, Homepage

---

### NewsletterSignup (`newsletter-signup.tsx`) — NEW

Email capture card with navy background.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Stay in the Loop"` | Headline |
| `subtitle` | `string` | — | Optional subtitle |
| `onSubmit` | `(email: string) => void` | — | Submit handler |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Container: `bg-primary text-white rounded-[1.5rem] p-8`
- Title: `font-headline font-black text-2xl`
- Input: `bg-white/10 text-white placeholder:text-white/50 rounded-[0.75rem] border-none`
- CTA: `Button variant="secondary"` (Burnt Orange)

**Used by:** Homepage, Blog Main, Blog Article

---

### BarChartWrapper (`bar-chart-wrapper.tsx`) — NEW

Pre-themed Recharts BarChart using the existing `ChartContainer` wrapper.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Chart data array |
| `config` | `ChartConfig` | — | Chart configuration (from chart.tsx) |
| `xKey` | `string` | — | X-axis data key |
| `bars` | `{ key: string, color?: string, stackId?: string }[]` | — | Bar definitions |
| `height` | `number` | `200` | Chart height |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Wraps `ChartContainer` + Recharts `BarChart` + `ChartTooltip`
- Bar radius: `[4, 4, 0, 0]` (rounded top corners)
- Tooltip: `bg-[var(--surface-container-highest)] shadow-[var(--shadow-soft)] rounded-[0.75rem]`
- Default colors from `--chart-1` through `--chart-5`

**Used by:** Leaderboard (Graph), Admin Dashboard

---

### MascotPlaceholder (`mascot-placeholder.tsx`) — NEW

Placeholder for future mascot character illustrations.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mood` | `"happy" \| "thinking" \| "celebrating"` | `"happy"` | Placeholder variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `alt` | `string` | — | Accessibility text |
| `className` | `string` | — | Additional classes |

**Visual spec:**
- Sizes: `sm`=64px, `md`=120px, `lg`=200px
- Renders: `next/image` if asset exists, otherwise a styled SVG placeholder
- Placeholder: Rounded rectangle with `bg-accent/10` and a Lucide icon (Smile, Lightbulb, PartyPopper)

**Used by:** Homepage, Timer pages, Empty states

---

## Layer 3: Page-Specific Components (RESTYLE)

These stay in their current directories. Only visual updates using the new design tokens and shared components.

### Homepage (`src/components/homepage/`)
- `hero.tsx` — Navy gradient bg, extract ProgressRing, Lexend headlines, Orange CTAs
- `category-grid.tsx` — Surface-tier cards, CategoryChip usage, hover:scale-105
- `leaderboard-teaser.tsx` — Use ChallengeCardV2 variant="full"
- `social-proof.tsx` — Use StatCard grid

### Timer Page (`src/components/timer-page/`)
- `timer-widget.tsx` — Use extracted ProgressRing, new color tokens
- `timer-page-template.tsx` — Surface tier layout, SectionHeader usage
- `competition-cta.tsx` — Button variant="secondary", card styling
- `related-timers.tsx` — Card restyle
- `session-tracker.tsx` — StatCard usage for stats display

### Challenges (`src/components/challenges/`)
- `challenge-card.tsx` — DEPRECATED (replaced by shared/ChallengeCardV2)
- `challenge-histogram.tsx` — Update to use --chart-N CSS variables
- `overall-histogram.tsx` — Update chart colors
- `group-leaderboard.tsx` — Avatar component, alternating bg rows instead of borders
- `score-display.tsx` — Avatar component, Lexend for scores
- `game-history.tsx` — Refactor to use shared/GameHistoryItem
- `gif-picker.tsx` — Restyle dialog with new tokens
- `trash-talk-banner.tsx` — Status colors, no borders

### Blog (`src/components/blog/`)
- `post-card.tsx` — Surface-tier bg, Badge for categories, hover:scale-105

### Admin (`src/components/admin/`)
- `sidebar.tsx` — Navy bg, Orange active state, Avatar component

### Leaderboard (`src/components/leaderboard/`)
- `challenge-card.tsx` — DEPRECATED (replaced by shared/ChallengeCardV2)

### MDX (`src/components/mdx/`)
- `callout.tsx` — Surface-tier backgrounds, no borders, new radius
- `blog-image.tsx` — Rounded corners update

### Global
- `footer.tsx` — Navy bg, new typography
- `navbar.tsx` — DEPRECATED (replaced by shared/GlassmorphicNavbar)
- `breadcrumb.tsx` — New typography tokens
