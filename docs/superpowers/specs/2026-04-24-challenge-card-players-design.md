# Challenge Card: Show Opponent Name and Avatar

**Date:** 2026-04-24
**Scope:** `/challenges` list page — individual challenge cards.

## Problem

On `/challenges`, each card currently shows a combined score like `6 - 6` with no visual indication of which number belongs to which player. Player names appear only in a small subtitle (`"Pubs Abayasiri vs Tim"`), which is easy to miss and does not align each name with its score. There are no profile pictures.

## Goal

Make each card immediately answer: **who is winning and who is losing**, with the current user on the left and the opponent on the right, each annotated with their name and profile picture.

## Design

### Card layout

```
┌───────────────────────────────────────────────────────────────┐
│ April Antics                                         11 games │
│ [Rummikub]                                                    │
│                                                               │
│ [🖼]  Pubs Abayasiri   6   —   6   Tim   [🖼]                 │
│                       (bold)    (bold)                        │
└───────────────────────────────────────────────────────────────┘
```

Rules:
- **Current user** (the logged-in viewer) is always rendered on the **left**. The **opponent** is on the right.
- Winning side's **name and score** get `text-primary`. Losing side stays default foreground. Draws (equal scores) stay default on both sides.
- Avatars are 32px circles. If `profile_picture_url` is missing or errors out, fall back to an initial-in-circle (same `img + hidden sibling` pattern already used in `ScoreDisplay`).
- The previous subtitle line `"Pubs Abayasiri vs Tim"` is **removed** — names now appear inline with the score, making the subtitle redundant.
- The draws indicator (`(3 draws)`) stays as a small muted tag placed after the score.
- The top-right `{total_games} games` label is unchanged.

### Group challenges (3+ participants)

The server already aggregates: `opponent_wins` is the sum across all non-me participants. Keep that semantic. On the right side of the card, when `participants.length > 2`:

- Render a **stacked avatar group** of up to 3 opponent avatars (overlapping, negative margin).
- Replace the opponent name with a label like **"3 others"** (count of non-me participants).
- Score number semantics are unchanged (`my_wins — opponent_wins`).

For `participants.length === 2` the single-avatar + single-name layout above applies.

For `participants.length === 1` (solo / no opponent has joined yet) the right side shows a muted placeholder avatar + the label `"Opponent"`, matching the current behavior where placeholder "opponent" wins are counted.

### Data wiring

Changes in `src/app/challenges/page.tsx`:
- Destructure `user_id` from `use_auth_status()` (already exposed by `hazo_auth`'s `AuthStatusData`).
- Widen local profile state from `user_names: Record<string, string>` to `user_profiles: Record<string, { name: string; picture_url: string | null }>`, populated from the existing `/api/user-profiles` response (which already returns `profile_picture_url`).
- For each challenge, pass to `ChallengeCard`:
  - `current_user_id: string`
  - `participants: Array<{ user_id: string; name: string; picture_url: string | null }>`
- Remove the `player_names` prop wiring (no longer needed).

Changes in `src/components/challenges/challenge-card.tsx`:
- Replace `player_names: string[]` prop with `current_user_id: string` and `participants: Array<{ user_id: string; name: string; picture_url: string | null }>`.
- Split participants into `me` (matches `current_user_id`) and `others` (everyone else).
- Render the new score row per the rules above.
- Extract a private `PlayerAvatar` helper inside `challenge-card.tsx` to avoid duplicating the img-with-fallback pattern.

### Demo (unauthenticated preview)

`DemoCard` in `src/app/challenges/page.tsx` updates to the same visual layout, using hardcoded names (`"You"` / `"Opponent"`) and initial-fallback avatars (no pictures). This preserves the marketing preview shown to logged-out visitors.

## Out of scope

- No API changes. `/api/challenges` already returns `participants[]` with `user_id` and `role`, and `/api/user-profiles` already returns `profile_picture_url`.
- The detail page `/challenges/[id]` already uses `ScoreDisplay` with avatars — unchanged.
- `public-challenges` uses a different card (`/components/shared/challenge-card-v2.tsx`) — unchanged.
- `OverallHistogram` and `ChallengeHistogram` sections below the card list — unchanged.

## Success criteria

- On `/challenges`, each real challenge card shows the current user's avatar + name on the left with their score, and the opponent's avatar + name on the right with their score.
- When a name or picture is missing, the fallback initial renders in a circle without a broken-image icon.
- Winner's name and score appear in primary color; ties render both sides default.
- Group challenges (3+ participants) render a stacked avatar group + "N others" on the right.
- Solo / unjoined challenges render a muted placeholder avatar + "Opponent" label.
- No regressions in the logged-out demo preview or the `{total_games} games` label.
