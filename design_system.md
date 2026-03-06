# GoTimer Design System

Design tokens and component patterns for consistent styling across pages.

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `blue-600` / `#3B82F6` | Buttons, progress ring, active states |
| Primary hover | `blue-700` / `#2563EB` | Button hover states |
| Primary subtle | `blue-50` | Badge backgrounds, active toggle bg |
| Primary text | `blue-600` | Badge text, link text |
| Active player | `green-500` / `#22C55E` | Chess clock active ring, active card highlight |
| Active player subtle | `green-50/30` | Chess clock active card background |
| Active player text | `green-600` | Chess clock "Your Move" label |
| Inactive player ring | `gray-300` / `#D1D5DB` | Chess clock inactive progress ring |
| Background (mobile) | `gray-100` / `#F3F4F6` | Page background mobile |
| Background (desktop) | `gray-200` / `#E5E7EB` | Page background desktop (more contrast) |
| Card | `white` / `#FFFFFF` | Card surfaces |
| Text primary | `gray-800` / `#1F2937` | Timer digits, headings |
| Text secondary | `gray-700` / `#374151` | Button labels |
| Text muted | `gray-500` / `#6B7280` | Subtitles, descriptions |
| Text subtle | `gray-400` / `#9CA3AF` | Labels (MINUTES/SECONDS) |
| Border | `gray-200` / `#E5E7EB` | Secondary button borders, ring track |
| Dot active | `blue-500` | Status badge dot (countdown/round) |
| Dot active chess | `green-500` | Status badge dot (chess clock) |

## Typography

| Element | Classes |
|---------|---------|
| Timer digits | `text-5xl md:text-7xl font-bold font-mono text-gray-800` |
| Timer digits (chess ring) | `text-3xl md:text-4xl font-bold font-mono text-gray-800` |
| Timer labels | `text-xs uppercase tracking-wider text-gray-400` |
| Status badge | `text-sm font-semibold uppercase tracking-wide text-blue-600` |
| Subtitle | `text-sm text-gray-500` |
| Button text | `text-base md:text-lg font-semibold` |
| Footer text | `text-xs text-gray-500` |
| Footer links | `text-xs text-blue-600 hover:text-blue-800` |

## Spacing

| Element | Value |
|---------|-------|
| Page padding | `px-3 pb-4 md:px-4` |
| Card padding | `p-6 md:p-12` |
| Card inner gap | `gap-5 md:gap-6` |
| Button padding | `py-4 md:py-5` |
| Button row gap | `gap-3` |
| Footer margin-top | `mt-6` |

## Border Radius

| Element | Value |
|---------|-------|
| Cards | `rounded-2xl` |
| Buttons (primary/secondary) | `rounded-2xl` |
| Badges | `rounded-full` |
| Sound toggle | `rounded-full` |
| Progress bar | `rounded-full` |

## Shadows

| Element | Value |
|---------|-------|
| Card | `shadow-lg` |
| Primary button | `shadow-md` |
| Secondary button | `shadow-sm` |

## Components

### Status Badge
Pill-shaped indicator with colored dot.
```
bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide
Dot: w-2 h-2 rounded-full bg-blue-500
```
Chess variant uses `bg-green-50 text-green-600` with `bg-green-500` dot.

### Circular Progress Ring
SVG with gray track and colored progress arc.
- viewBox: `280x280`, stroke-width: `12`, radius: `134`
- Track: `stroke="#E5E7EB"`
- Progress (countdown): `stroke="#3B82F6"`, `strokeLinecap="round"`
- Progress (chess active): `stroke="#22C55E"` (green)
- Progress (chess inactive): `stroke="#D1D5DB"` (gray)
- Rotated `-90deg` so arc starts at 12 o'clock
- `stroke-dashoffset` animated with `transition: 1s linear`
- Responsive (countdown): `w-60 h-60 md:w-80 md:h-80`
- Responsive (chess): `w-40 h-40 md:w-52 md:h-52`

### Horizontal Progress Bar
Animated bar for round timer page.
- Container: `h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden w-full`
- Fill: `bg-blue-500 h-full rounded-full`
- Width animated with `transition: width 1s linear` (`.bar-progress-transition`)
- Fills over each minute cycle: `width = (round_time % 60) / 60 * 100%`

### Player Card (Chess)
Clickable sub-card for each chess clock player.
- Active: `ring-2 ring-green-400 bg-green-50/30`
- Inactive: `bg-gray-50`
- Transition: `transition-all duration-300`
- Contains: name input, progress ring, status label

### Primary Button
Full-width blue action button.
```
bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 md:py-5 w-full shadow-md text-base md:text-lg font-semibold
```

### Secondary Button
White bordered button for less prominent actions.
```
bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-4 md:py-5 shadow-sm text-base md:text-lg font-semibold
```

### Sound Toggle
Small circular icon button, positioned absolute top-right of card.
```
rounded-full p-2
Inactive: bg-gray-100 hover:bg-gray-200
Active: bg-blue-100
```

### Card Container
White card for primary content area.
- Single-card pages (countdown, round timer): `max-w-md md:max-w-lg`
- Multi-card pages (chess clock): `max-w-2xl md:max-w-3xl`
```
bg-white rounded-2xl shadow-lg p-6 md:p-12 w-full mx-auto
```
