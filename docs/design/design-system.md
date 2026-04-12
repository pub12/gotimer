# GoTimer Design System — "The Kinetic Clubhouse"

Reference for maintaining visual consistency across all pages and components.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#041534` (Navy) | Headlines, hero sections, primary backgrounds |
| `--primary-foreground` | `#ffffff` | Text on navy |
| `--secondary` | `#ab3514` (Burnt Orange) | CTAs, ring accents, interactive highlights |
| `--secondary-foreground` | `#ffffff` | Text on orange |
| `--accent` | `#755b00` (Gold) | Tertiary accents, win indicators |
| `--accent-foreground` | `#ffffff` | Text on gold |

### Surface Tiers (no visible borders — structure via color shifts)

| Token | Value | Usage |
|-------|-------|-------|
| `--surface` | `#f8f9ff` | Page background |
| `--surface-container-low` | `#f1f3fb` | Card backgrounds (`bg-card`) |
| `--surface-container` | `#ebedf6` | Nested elements |
| `--surface-container-high` | `#e5e7f0` | Input backgrounds, button hover |
| `--surface-container-highest` | `#dfe1ea` | Tooltips, deep nesting |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--status-active` | `#16a34a` | Active badges |
| `--status-win` | `#755b00` | Win indicators |
| `--status-loss` | `#ab3514` | Loss indicators |
| `--status-reported` | `#6366f1` | Reported content |

---

## Typography

| Token | Font | Weights | Usage |
|-------|------|---------|-------|
| `--font-headline` | Lexend | 900 (Black) | All headlines, display text, timer digits |
| `--font-sans` | Inter | 400-700 | Body text, UI labels, descriptions |

### Heading Scale

| Level | Class | Usage |
|-------|-------|-------|
| Page h1 | `text-3xl md:text-5xl font-headline font-black` | Main page titles |
| Section h2 | `text-2xl md:text-4xl font-headline font-black` | Section headings |
| Card h3 | `text-xl md:text-2xl font-headline font-black` | Card titles |
| Admin h1 | `text-2xl font-headline font-black text-foreground` | Admin pages (denser) |

---

## Border Radius

Only two values plus `rounded-full` for pills:

| Value | Class | Usage |
|-------|-------|-------|
| 12px | `rounded-[0.75rem]` | Small elements: buttons, inputs, badges, callouts |
| 16px | `rounded-[1rem]` | Cards, containers, hero sections, table rows |
| 50% | `rounded-full` | Pills, avatars, category chips |

**Never use**: `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-lg` on cards or containers.

---

## Shadows

Two shadow tokens. No custom shadows.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-soft` | `0 8px 32px rgba(4,21,52,0.06)` | Cards, buttons, default elevation |
| `--shadow-soft-lg` | `0 16px 64px rgba(4,21,52,0.06)` | Hero sections, modals, hover elevation |

### Usage Rules

- Cards at rest: `shadow-[var(--shadow-soft)]`
- Cards on hover: `hover:shadow-[var(--shadow-soft-lg)]`
- Hero/featured sections: `shadow-[var(--shadow-soft-lg)]`
- Small badges: `shadow-sm` (Tailwind default, acceptable)
- **Never use**: `shadow-xl`, `shadow-2xl`, or shadows with colored opacity (`shadow-secondary/30`)

---

## Borders

Global rule: **no visible borders**. Structure comes from surface-tier color shifts.

```css
* { @apply border-transparent; }
```

- Cards: No border, use `bg-card` + shadow
- Inputs: `border-transparent`, background color `bg-surface-container-high`
- Dividers (rare): `border-foreground/5` for very subtle separation

---

## Cards

Standard card pattern used everywhere:

```
bg-card rounded-[1rem] shadow-[var(--shadow-soft)]
```

With padding: `p-4 sm:p-6 md:p-8` (scale to content)

---

## Buttons

Defined in `src/components/ui/button.tsx`:

| Variant | Style |
|---------|-------|
| Default | `bg-primary text-primary-foreground` |
| Secondary | `bg-secondary text-white` (Burnt Orange CTAs) |
| Tertiary | `bg-accent text-accent-foreground` (Gold) |
| Outline | `bg-transparent text-primary` |
| Ghost | `hover:bg-surface-container` |
| Destructive | `bg-destructive text-white` |

All buttons: `rounded-[0.75rem] shadow-[var(--shadow-soft)] hover:scale-105 active:scale-95`

---

## Interactive States

| State | Effect |
|-------|--------|
| Hover | `hover:scale-105` + shadow elevation |
| Active/Press | `active:scale-95` |
| Disabled | `opacity-50 cursor-not-allowed` |
| Focus | `focus-visible:ring-ring/50 focus-visible:ring-[3px]` |
| Transition | `transition-all duration-200 ease-out` |

---

## Glassmorphic Navigation

Desktop navbar (fixed top):
```
backdrop-blur-[16px] bg-[rgba(248,249,255,0.72)]
shadow-[var(--shadow-soft)]
```

Mobile: bottom nav with same glassmorphism.

---

## Timer Shell (Fullscreen)

The `TimerShell` component provides a consistent fullscreen experience across all timers:

- **Background**: `bg-primary` (navy) with CSS variable overrides for white-on-dark contrast
- **Top bar**: GoTimer logo (left) + audio/exit buttons (right)
- **Center**: Scalable content (title + ring + controls) via CSS `transform: scale()`
- **Bottom bar**: Timer type pill (left) + flash config + theme picker + size slider + share (right)

### Fullscreen Features (persisted in URL, shareable)

| Feature | URL param | Default |
|---------|-----------|---------|
| Title | `?title=My Timer` | empty |
| Duration | `?duration=600` | page default |
| Size scale | `?size=135` | 100 |
| Theme | `?theme=ocean` | default |
| Flash alert | `?flash=10` | 5 |

### Theme Presets

| ID | Background | Ring/Accent |
|----|-----------|-------------|
| (default) | Navy `#041534` | Burnt Orange `#ab3514` |
| ocean | `#0c4a6e` | `#0ea5e9` |
| emerald | `#064e3b` | `#10b981` |
| violet | `#2e1065` | `#8b5cf6` |
| rose | `#4c0519` | `#f43f5e` |
| amber | `#451a03` | `#f59e0b` |
| slate | `#1e293b` | `#94a3b8` |
| lime | `#1a2e05` | `#84cc16` |

---

## Page Layout Patterns

### Public pages (with Navbar + Footer)
Homepage, countdown, chess-clock, round-timer, blog, leaderboard, challenges, public challenges.

Pattern: `<Navbar /> <main className="min-h-screen bg-surface pt-14 md:pt-20">...</main> <Footer />`

### Admin pages (with AdminSidebar)
All `/admin/*` routes. Sidebar provided by `admin/layout.tsx`.

Pattern: `<main className="p-8 max-w-5xl">...</main>`

### Challenge detail hero sections
Dark gradient hero is intentional for visual impact:
```
bg-gradient-to-br from-primary to-primary-container rounded-[1rem] shadow-[var(--shadow-soft-lg)]
```

---

## File Locations

| What | Where |
|------|-------|
| CSS variables & tokens | `src/app/globals.css` |
| Button component | `src/components/ui/button.tsx` |
| Card component | `src/components/ui/card.tsx` |
| Timer shell (fullscreen) | `src/components/shared/timer-shell.tsx` |
| Glassmorphic navbar | `src/components/shared/glassmorphic-navbar.tsx` |
| Admin sidebar | `src/components/admin/sidebar.tsx` |
