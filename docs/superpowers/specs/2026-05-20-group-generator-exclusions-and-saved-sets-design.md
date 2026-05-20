# Group Generator — Exclusion Constraints + Studio-Backed Saved Sets

**Date:** 2026-05-20
**Status:** Approved
**Driver:** Feedback from Tony Vincent (Learning in Hand) on `gotimer.org/classroom/group-generator`. Two specific asks: (1) honour "these students cannot be paired" constraints; (2) save and name groups so they can be recalled later.

## Goals

1. Let a teacher mark **sets of students** (2 or more) that must not share a group, and have the shuffler honour those constraints as hard rules.
2. Let a logged-in teacher save a shuffle result under a name and recall it later across devices, with the underlying setup preserved so they can re-shuffle within it.

## Non-goals

- Sharing a saved set via URL with another teacher (future).
- Categories/folders for saved group sets (future; could reuse `studio_categories` if needed).
- Inline rename of an existing saved set without re-saving (PUT exists but no inline UI yet; small follow-on).
- Generalising Studio's data model to a polymorphic `saved_items` table. This spec adds a parallel `saved_group_sets` entity; unification is deferred until at least one more non-timer artifact is needed (e.g., name-picker rosters, noise-meter presets).
- Soft "prefer to keep apart" weighting. Exclusions are hard-only.

## Storage split (auth scope)

The classroom hub's positioning ("no signup, no ads") is preserved by drawing the auth line below day-to-day usage:

| State | Storage | Login required |
|-------|---------|----------------|
| Current class list | localStorage (existing pattern) | No |
| Current exclusion list | localStorage (new) | No |
| Avoid-prev-pairs history | localStorage (existing pattern) | No |
| Last-used mode / target | localStorage (existing pattern) | No |
| Named, persistent saved sets | Studio (server) | **Yes** |

Anonymous teachers retain every projection-day capability. Login is only the gate for cross-device, cross-session named recall.

## Data model

### localStorage (new key)

```
classroom:exclusions:${slug}  ->  string[][]
```

Each inner array is a set of names that cannot share a group. Two-name sets cover Tony's "John + Sam" case; three- or N-name sets cover his "Bill + David + Thomas" case.

### Server table (Studio)

New migration `v36` in `src/lib/db.ts`:

```sql
CREATE TABLE saved_group_sets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT 'default',
  name TEXT NOT NULL,
  groups_json TEXT NOT NULL,    -- string[][] — the saved result
  setup_json TEXT NOT NULL,     -- { names, mode, target, exclusions, seed? }
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_saved_group_sets_user ON saved_group_sets (user_id);
```

Mirrors the existing `saved_timers` pattern (user_id-scoped, JSON config blobs, timestamped). `slug` is metadata only — sets are shown globally per user, not filtered by slug, but the originating slug is retained so the UI can later surface "from teams-of-4" tags or filters.

## Shuffler algorithm (`group-shuffler.ts`)

### New option

```ts
interface ShuffleOptions {
  // ... existing fields ...
  exclusions?: string[][];  // each inner array = names that cannot share a group
}
```

### New return shape

```ts
interface ShuffleResult {
  groups: string[][];
  repeat_count: number;       // existing: prior-pair repeats (soft avoid)
  infeasible?: boolean;       // new: true when hard exclusions can't be honoured
  reason?: string;            // new: human-readable cause of infeasibility
}
```

### Algorithm

1. **Build forbidden-pair set.** For each exclusion group, add every `(a,b)` pair as `"min(a,b)||max(a,b)"` to `forbidden_pairs: Set<string>`.
2. **Greedy placement with retries.** For each retry attempt (default 25):
   a. Seed RNG from `base_seed + attempt`.
   b. Shuffle names.
   c. Walk names in shuffled order; for each name, place it in the first group that has room (per mode/target sizing) and contains no member that pairs forbiddenly with it.
   d. If a name can't be placed in any open group, this attempt fails; try next attempt.
3. **Result.** If any attempt succeeds, return the best result (lowest soft-avoid `repeat_count`). If every attempt fails, return `{ groups: [], repeat_count: 0, infeasible: true, reason: "..." }`.

The infeasibility `reason` is one of:
- `"Group size too small to honour every exclusion. Increase students per group, or remove an exclusion."`
- `"Number of groups too high to honour every exclusion. Reduce group count, or remove an exclusion."`
- `"Couldn't satisfy all exclusions after N attempts."` (catch-all)

### Tests

New `src/components/classroom/group-shuffler.test.ts` (or extend existing tests) covering:
- Pair exclusion respected (`["A","B"]` never share a group across many shuffles).
- N-way exclusion respected (`["A","B","C"]` — no two of them share a group).
- Infeasible case returns `infeasible: true` with a non-empty `reason`.
- Exclusions + avoid-prev-pairs together: hard exclusions always win; soft pairs minimised within feasible solutions.
- Determinism with `seed` set.

## UI

### Exclusion builder (in setup panel)

A new section labelled **"Keep these students apart"** lives inside the setup panel, between the class-list textarea and the mode/target controls.

Layout:
- A row of existing exclusion chips, each rendered as `John × Sam ×` (`×` between names is a visual separator; final `×` is the delete button).
- An **+ Add exclusion** button beneath the chip row.

Click-to-build flow:
1. Teacher clicks **+ Add exclusion** → component enters "build mode."
2. In build mode, names from the current class list are rendered as a wrapped grid of clickable name-tags. Clicking a tag toggles it into the building set (visual highlight).
3. A small toolbar shows the current building set: `Building: John, Sam` with **Done** and **Cancel** buttons.
4. **Done** with 2+ names selected → commit a new exclusion chip, clear build mode.
5. **Cancel** or Done with <2 names selected → discard, clear build mode.

The component is extracted to `src/components/classroom/exclusion-builder.tsx` so the main `group-generator.tsx` stays focused.

### Infeasibility surface

When the shuffler returns `infeasible: true`, the results area shows an inline alert (above where group cards would have rendered):

> ⚠ Couldn't make groups with these constraints. *reason*.

No partial result is displayed. The setup panel auto-expands so the teacher can adjust.

### Save / load saved sets

**Save button** (action bar, beside Shuffle/Copy/Edit):
- Anonymous user: clicking **Save** opens a small popover: *"Sign in to save groups across devices →"* with a link to `/hazo_auth/login?return_to=<current-path>`. No modal, no save attempted.
- Logged-in user: clicking **Save** opens a modal:
  - Heading: "Name this set"
  - Text input pre-filled with a suggestion: `"<weekday> <date> groups"` (e.g., `"Wed 20 May groups"`).
  - **Save** (POST) / **Cancel**.
  - On success: modal closes, toast: "Saved. Open from the Saved sets menu.", and the set appears immediately in the Saved-sets dropdown without a refetch.

**Saved sets dropdown** (action bar, only shown when logged-in and N ≥ 1):
- Button labelled **Saved sets (N)** ▾.
- Opens a popover list. Each row: name, group count, created-date relative-format. Per-row actions: **Open** and **Delete**.
- **Open** restores the saved result into the display AND restores the setup (class list, mode, target, exclusions) into the setup panel's working state. No re-shuffle.
- **Delete** confirms inline (`Delete? • Yes • Cancel`) then DELETEs and removes the row.

**Re-shuffle-within-set action**:
- After Open, a new action appears in the bar: **Shuffle within this set**. Pressing it runs the shuffler with the saved setup's names + exclusions, replacing the displayed result. The saved entry is *not* modified. To persist the new shuffle, the teacher saves again (creating a new set or overwriting via a future "Save over" UX — out of scope here).

Component: `src/components/classroom/saved-group-sets-menu.tsx`.

### Studio surface

`/studio` gets a new sidebar entry **Group sets** below the existing **All Timers / Uncategorized / categories** nav. Selecting it switches the main grid from `TimerTile` to `GroupSetTile` rendering.

`GroupSetTile`:
- Name as headline
- Group count + name count: `"4 groups · 24 students"`
- Created-date relative
- Hover/menu actions: **Open in tool** (deep-links to `/classroom/group-generator?load=<id>`), **Delete**.

When the group generator page loads with `?load=<id>`, it fetches the set and behaves as if the teacher clicked Open from the dropdown.

Component: `src/components/studio/group-set-tile.tsx`. Sidebar/grid changes in `src/components/studio/studio-page.tsx`.

## API

All routes live under `/api/studio/group-sets`. Auth via `hazo_auth` matching the existing `/api/studio/timers` pattern; user-scope enforced on every read and write; non-authenticated requests return 401.

### `GET /api/studio/group-sets`
Returns `{ group_sets: SavedGroupSet[] }` for the current user, ordered by `created_at DESC`.

### `POST /api/studio/group-sets`
Body: `{ name: string, slug?: string, groups: string[][], setup: {...} }`.
Validates: `name` non-empty after trim, `groups` non-empty, `setup.names` non-empty. Returns the created row.

### `GET /api/studio/group-sets/[id]`
Returns the single row if owned by current user, else 404.

### `PUT /api/studio/group-sets/[id]`
Body: `{ name?: string, groups?: string[][], setup?: {...} }`. Updates the provided fields and touches `updated_at`. Returns the updated row.

### `DELETE /api/studio/group-sets/[id]`
Deletes the row if owned, returns 204.

Validation lives in a small shared helper (mirroring the patterns in the existing timers routes) so the route files stay thin.

## Migration & rollout

1. Ship the algorithm + exclusion UI first (one PR). Saving is disabled / not visible until step 2.
2. Ship the DB migration + API + saved-sets UI second (one PR). Migration v36 is additive and idempotent — no data backfill required.
3. Studio surface (sidebar + tile) third (one small PR). Could ship in PR 2 if tight on time.

No legacy localStorage data to migrate — exclusion-list and saved-sets keys are brand new.

## Files touched (summary)

- `src/lib/db.ts` — migration v36
- `src/components/classroom/group-shuffler.ts` — algorithm
- `src/components/classroom/group-shuffler.test.ts` — tests (new or extended)
- `src/components/classroom/group-generator.tsx` — wire-up
- `src/components/classroom/exclusion-builder.tsx` — **new**
- `src/components/classroom/saved-group-sets-menu.tsx` — **new**
- `src/app/api/studio/group-sets/route.ts` — **new**
- `src/app/api/studio/group-sets/[id]/route.ts` — **new**
- `src/components/studio/studio-page.tsx` — sidebar + grid switch
- `src/components/studio/group-set-tile.tsx` — **new**

## Open questions (to revisit)

- Should `/classroom/group-generator/teams-of-3` etc. share saved sets with `/classroom/group-generator`? **Decision in this spec:** yes — sets are user-global; `slug` is metadata only.
- Where does an anonymous teacher's exclusion list go when they later log in? **Decision in this spec:** stays in localStorage; we do not auto-promote it. Future "import local working state to Studio" is a separate small feature.
