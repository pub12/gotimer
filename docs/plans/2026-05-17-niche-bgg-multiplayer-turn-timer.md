# Niche Implementation Plan — Multi-Player Board Game Turn Timer

**Date:** 2026-05-17
**Niche priority:** Tier 1
**Build effort:** 3.5-4 days

---

## 1. Snapshot

A web turn timer for 3-8 named players. Distinct from a chess clock (which is 2-player and per-player time bank); this one supports per-turn reset, per-player time bank, or hybrid. Shareable URL preset with player names baked in. Primary distribution = a BoardGameGeek geeklist tagged to heavy-clock games (Twilight Imperium, Gloomhaven, Brass) — geeklists are permanent and rank well in BGG search.

## 2. SEO strategy

### 2.1 Target keywords

| Query | Est. monthly volume | Competition | Notes |
|---|---|---|---|
| `board game turn timer` | 500-1k | Low-Medium | Underserved |
| `multiplayer chess clock` | 500-1k | Low | BGG threads show recurring demand |
| `turn timer for board games` | 200-500 | Low | Niche |
| `turn timer multiplayer` | 200-500 | Low | Niche |
| `twilight imperium turn timer` | 100-300 | Very low | Per-game long-tail |
| `gloomhaven turn timer` | 100-200 | Very low | Per-game long-tail |
| `brass birmingham turn timer` | 100-200 | Very low | Per-game long-tail |
| `analysis paralysis timer` | 200-500 | Low | Funny long-tail; high engagement |

### 2.2 Why we can rank

- **No dominant web competitor** — existing tools (multiplayerchessclock.com, Turns Timer) are Android-only or visually dated.
- **BoardGameGeek backlinks** — a popular geeklist ranks in BGG's internal search AND earns external Google backlinks because BGG's domain authority is high.
- **Per-game long-tail** — `[game] turn timer` queries are pure long-tail with near-zero competition.

### 2.3 The distribution wedge

Primary channel = **BGG geeklist** (see outreach plan). SEO is the long tail. Per-game preset pages target specific heavy-clock games and get linked from BGG game pages organically.

## 3. URL structure

| URL | Keyword target | Type |
|---|---|---|
| `/board-games/multi-player-turn-timer` | board game turn timer | Hub |
| `/board-games/multi-player-turn-timer/twilight-imperium` | twilight imperium turn timer | Preset |
| `/board-games/multi-player-turn-timer/gloomhaven` | gloomhaven turn timer | Preset |
| `/board-games/multi-player-turn-timer/brass-birmingham` | brass birmingham turn timer | Preset |
| `/board-games/multi-player-turn-timer/spirit-island` | spirit island turn timer | Preset |
| `/board-games/multi-player-turn-timer/terra-mystica` | terra mystica turn timer | Preset |
| `/board-games/multi-player-turn-timer/food-chain-magnate` | food chain magnate timer | Preset |
| `/board-games/multi-player-turn-timer/through-the-ages` | through the ages timer | Preset |
| `/board-games/multi-player-turn-timer/mage-knight` | mage knight turn timer | Preset |
| `/board-games/analysis-paralysis-timer` | analysis paralysis timer | Alias |

Existing `/board-games/turn-timer` (if it's the 2-player chess-clock-style) is preserved; new hub is `/multi-player-turn-timer` to distinguish.

## 4. Modes supported

The hub configurator exposes three modes (URL `?mode=`):

| Mode | Behavior |
|---|---|
| `per-turn` | Each player gets the same time limit per turn (e.g., 90s). Resets when next player starts. |
| `time-bank` | Each player has a total time budget for the game (e.g., 20 min each). Multiplayer chess clock. |
| `hybrid` | Per-turn cap + time bank. Turn timer counts down; if turn exceeds cap, banked time drains. |

## 5. URL parameter spec

```
/board-games/multi-player-turn-timer?players=Trent,Anna,Ravi,Kim&mode=per-turn&per_turn=300&bank=1200
```

| Param | Type | Example | Default |
|---|---|---|---|
| `players` | comma-list | `Trent,Anna,Ravi,Kim` | `Player 1,Player 2,Player 3,Player 4` |
| `mode` | enum | `per-turn` / `time-bank` / `hybrid` | `per-turn` |
| `per_turn` | seconds | `300` | 60 |
| `bank` | seconds | `1200` | 600 (only used in time-bank/hybrid) |
| `warning_at` | seconds | `10` | 10 (audio warning before turn ends) |
| `sound` | enum | `bell` / `chime` / `off` | `bell` |

URL must support 8 players × ~12 chars per name + parameters ≈ ~150-200 chars. Well within URL limits.

## 6. On-page SEO

**`/board-games/multi-player-turn-timer`** (hub):

```yaml
title: "Multi-Player Board Game Turn Timer — Free, No Signup, Up to 8 Players"
meta_description: "Free turn timer for 3-8 players. Per-turn or time-bank mode. Shareable URL with player names. No signup, no install. Cures analysis paralysis."
h1: "Multi-Player Board Game Turn Timer"
canonical: "/board-games/multi-player-turn-timer"
```

**`/board-games/multi-player-turn-timer/twilight-imperium`**:

```yaml
title: "Twilight Imperium 4 Turn Timer — Free, Up to 8 Players"
meta_description: "Free Twilight Imperium turn timer. 5-minute strategy phase cap pre-configured. Shareable URL with player names. Keep the 10-hour game on track."
h1: "Twilight Imperium Turn Timer"
```

## 7. Content outline (per preset page, ~700-900 words)

1. **Hero** — H1 + 1-sentence value prop + the configured timer.
2. **Why this game needs a turn timer** — 150 words. Game-specific (TI4's strategy phase, Gloomhaven's monster turns, Brass's auction).
3. **Recommended time settings** — 150 words. Per-game recommendations from BGG community wisdom.
4. **How to use this timer** — 150 words. Player setup, mode selection, sharing.
5. **Modes explained** — 100 words. Per-turn vs. time-bank.
6. **FAQ** — 4-6 Q&A (200 words).
7. **Related** — link to other game presets + chess clock + general turn timer.

The "Why this game needs a turn timer" + "Recommended time settings" sections are the page's real value — they answer the informational query a BGG user would search for.

Hub page (`/multi-player-turn-timer`) — different structure: configurator above fold, 600-800 words below covering general usage + game preset directory.

## 8. Schema markup

`WebApplication`, `BreadcrumbList`, `FAQPage`. Per-game pages also include `Game` schema for entity linking:

```json
{
  "@context": "https://schema.org",
  "@type": "Game",
  "name": "Twilight Imperium: Fourth Edition",
  "numberOfPlayers": "3-6",
  "url": "https://boardgamegeek.com/boardgame/233078/twilight-imperium-fourth-edition"
}
```

## 9. Internal linking plan

**Inbound:**
- `/board-games` category landing — feature multi-player turn timer prominently.
- `/board-games/chess-clock` — "For 3+ players, use our [multi-player turn timer]" CTA.
- `/board-games/turn-timer` (2-player) — same cross-link.
- Homepage if it has a "popular tools" section.

**Outbound:**
- Each preset → hub + 2-3 related game presets.
- Hub → all 8 game presets + chess clock + 2-player turn timer.

## 10. Backlink hooks

| Hook | Who links |
|---|---|
| **BGG geeklist** | Permanent BGG listing; appears in BGG search and is indexed by Google |
| **Per-game preset URLs** | BGG forum users paste presets when discussing the game ("share this URL with your group") |
| **Shareable player-name URL** | Game groups paste URL in Discord; counts as referral traffic |
| **Embed iframe (post-launch)** | Game-specific blogs / strategy sites can embed |
| **r/boardgames "What Did You Play" thread links** | Less common but happens |

## 11. Implementation

### 11.1 Strategy

Check `src/lib/timer-strategies/turn-timer.ts` first — it likely handles single-turn-timer. We need a new `multi-player-turn-timer.ts` strategy OR an extension to the existing one.

Sketch:

```ts
// src/lib/timer-strategies/multi-player-turn-timer.ts
export type Mode = "per-turn" | "time-bank" | "hybrid";

export interface MPState {
  players: { name: string; bank_remaining: number; }[];
  current_player_index: number;
  turn_remaining: number;          // ticks down current turn
  turn_cap: number;
  mode: Mode;
  warning_at: number;
  paused: boolean;
}

// actions: "next_player", "previous_player", "pause", "resume", "reset"
```

Most logic is similar to `turn-timer.ts` (single-player); the addition is the array of players + index-based player switching + per-player bank in time-bank/hybrid modes.

### 11.2 UI requirements

- **Large player display** — current player name visible from across the table.
- **Player roster sidebar** — shows all players with bank remaining (time-bank/hybrid) or last turn time (per-turn).
- **Big "Next Player" button** — single biggest UI element after the timer itself.
- **Previous player button** for misclicks.
- **Per-player visual differentiation** — color-coded chips/avatars.
- **Sound on player switch** + warning sound at `warning_at` seconds remaining.
- **Pause button** for bathroom breaks.
- **Configuration drawer** — players, mode, times. Saves to URL on change.
- **Full-screen mode** for projection or for placing a tablet in the middle of the table.

### 11.3 Files to create

- `src/lib/timer-strategies/multi-player-turn-timer.ts` (+ test)
- `src/lib/board-game-presets.ts` (per-game timing recommendations)
- `src/app/board-games/multi-player-turn-timer/page.tsx` + `layout.tsx`
- 8 × per-game preset pages + layouts
- `src/app/board-games/analysis-paralysis-timer/page.tsx` + `layout.tsx` (alias)
- `src/components/board-games/player-roster.tsx`
- `src/components/board-games/player-configurator.tsx`
- `public/og/multi-player-turn-timer.png` (+ per-game variants for top 3 games)

### 11.4 Files to edit

- `src/lib/timer-strategies/index.ts` — export new strategy
- `src/app/sitemap.ts` — add 10 URLs
- `src/app/board-games/page.tsx` — feature new timer
- `src/app/board-games/chess-clock/page.tsx` — cross-link
- `src/app/board-games/turn-timer/page.tsx` — cross-link

## 12. Effort estimate

| Task | Days |
|---|---|
| Strategy + tests | 1.0 |
| UI (configurator + roster + main display) | 1.0 |
| Hub page + 8 preset pages + alias | 0.5 |
| SEO content (10 pages × ~700-900 words) | 1.5 |
| OG images (4 — hub + top 3 games) | 0.25 |
| Sitemap + QA | 0.25 |
| **Total** | **4.5 days** |

## 13. Acceptance criteria

- [ ] All 10 routes load correctly.
- [ ] All three modes (per-turn, time-bank, hybrid) behave correctly.
- [ ] Player switch happens within 100ms of button press (responsive at the table).
- [ ] Shareable URL with 8 players + custom times round-trips correctly.
- [ ] Warning sound fires at configured threshold.
- [ ] Pause works mid-turn without losing turn state.
- [ ] Each page has unique title, meta description, H1.
- [ ] Per-game pages have game-specific timing recommendations.
- [ ] FAQPage + Game schema validates.
- [ ] Sitemap updated; 10 URLs submitted to Search Console.
- [ ] Cross-links from chess clock + 2-player turn timer.

## 14. SEO follow-up (post-launch)

- Submit sitemap.
- Post BGG geeklist (see outreach plan).
- Monitor Search Console for `[game] turn timer` queries — should appear within 2-3 weeks.
- After 30 days, identify games with traction; add 3-5 more preset pages for similar-genre games.

## 15. Risks

| Risk | Mitigation |
|---|---|
| Existing `/board-games/turn-timer` overlaps with new hub | Keep 2-player turn-timer as-is; cross-link to new multi-player version. No URL changes to existing page. |
| Player names with commas / special chars break URL | URL-encode names; document the limitation in FAQ. |
| 8-player game session lasts 3-5 hours → battery drain on tablets | Add wake-lock + low-CPU mode (CSS only, no Canvas) for long sessions. |
| BGG geeklist gets rejected by moderation | Read geeklist rules; ensure post is community-value-first (game recommendations) not promo-first. |
