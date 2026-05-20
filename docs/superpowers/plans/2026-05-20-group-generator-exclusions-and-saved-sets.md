# Group Generator — Exclusions + Saved Sets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hard N-way exclusion constraints to the classroom group generator, plus the ability for logged-in teachers to save and recall named group sets backed by a new Studio table.

**Architecture:** Three phases stacked top-to-bottom. (A) Pure-logic shuffler additions with TDD. (B) New exclusion-builder UI component wired into the existing group-generator with localStorage persistence. (C) New `saved_group_sets` DB table + REST API + save/load UI in the group generator + Studio sidebar surface. Working state stays in localStorage (no signup needed); only named persistent saves require login.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind, better-sqlite3, vitest, hazo_auth (existing auth helper).

**Spec:** `docs/superpowers/specs/2026-05-20-group-generator-exclusions-and-saved-sets-design.md`

---

## File Map

**Modified:**
- `src/components/classroom/group-shuffler.ts` — add `exclusions` option, infeasibility return, exclusion-aware placement
- `src/components/classroom/group-generator.tsx` — wire new components in, persist exclusions, save/load flow, `?load=<id>` query handling
- `src/components/studio/studio-page.tsx` — add **Group sets** sidebar entry + grid switch
- `src/lib/db.ts` — migration v36

**Created:**
- `src/components/classroom/group-shuffler.test.ts` — TDD tests for exclusion-aware shuffler
- `src/components/classroom/exclusion-builder.tsx` — click-to-build N-way exclusion chip UI
- `src/components/classroom/saved-group-sets-menu.tsx` — save modal + saved-sets dropdown
- `src/app/api/studio/group-sets/route.ts` — list + create
- `src/app/api/studio/group-sets/[id]/route.ts` — fetch + update + delete
- `src/components/studio/group-set-tile.tsx` — Studio grid tile

**Test command:** `npx vitest run src/components/classroom/group-shuffler.test.ts`
**Typecheck:** `npx tsc --noEmit`

---

## Phase A — Shuffler algorithm (TDD)

### Task 1: Write failing tests for exclusion-aware shuffler

**Files:**
- Create: `src/components/classroom/group-shuffler.test.ts`

- [ ] **Step 1: Write the test file**

```ts
import { describe, it, expect } from "vitest";
import { shuffle_into_groups } from "./group-shuffler";

describe("shuffle_into_groups: exclusions", () => {
  it("never places a 2-name exclusion together (by_size)", () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (let seed = 0; seed < 50; seed++) {
      const res = shuffle_into_groups({
        names,
        mode: "by_size",
        target: 4,
        seed,
        exclusions: [["A", "B"]],
      });
      expect(res.infeasible).toBeFalsy();
      const a_group = res.groups.find((g) => g.includes("A"));
      const b_group = res.groups.find((g) => g.includes("B"));
      expect(a_group).toBeDefined();
      expect(a_group).not.toBe(b_group);
    }
  });

  it("never places an N-way exclusion together", () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    for (let seed = 0; seed < 50; seed++) {
      const res = shuffle_into_groups({
        names,
        mode: "by_size",
        target: 3,
        seed,
        exclusions: [["A", "B", "C"]],
      });
      expect(res.infeasible).toBeFalsy();
      const groups = res.groups;
      // No group contains two or more of A/B/C
      for (const g of groups) {
        const intersection = g.filter((n) => ["A", "B", "C"].includes(n));
        expect(intersection.length).toBeLessThanOrEqual(1);
      }
    }
  });

  it("honours multiple exclusion entries simultaneously", () => {
    const names = ["A", "B", "C", "D", "E", "F"];
    const res = shuffle_into_groups({
      names,
      mode: "by_size",
      target: 3,
      seed: 7,
      exclusions: [["A", "B"], ["C", "D"]],
    });
    expect(res.infeasible).toBeFalsy();
    const find = (n: string) => res.groups.findIndex((g) => g.includes(n));
    expect(find("A")).not.toBe(find("B"));
    expect(find("C")).not.toBe(find("D"));
  });

  it("respects exclusions in by_count mode", () => {
    const names = ["A", "B", "C", "D", "E", "F"];
    const res = shuffle_into_groups({
      names,
      mode: "by_count",
      target: 2,
      seed: 3,
      exclusions: [["A", "B"]],
    });
    expect(res.infeasible).toBeFalsy();
    expect(res.groups).toHaveLength(2);
    const a_group = res.groups.find((g) => g.includes("A"));
    expect(a_group?.includes("B")).toBe(false);
  });

  it("returns infeasible when constraint can't be satisfied", () => {
    // 4 students, groups of 2, ALL pairs forbidden -> impossible
    const res = shuffle_into_groups({
      names: ["A", "B", "C", "D"],
      mode: "by_size",
      target: 2,
      exclusions: [
        ["A", "B"],
        ["A", "C"],
        ["A", "D"],
        ["B", "C"],
        ["B", "D"],
        ["C", "D"],
      ],
    });
    expect(res.infeasible).toBe(true);
    expect(res.reason).toBeTruthy();
    expect(res.groups).toEqual([]);
  });

  it("ignores empty exclusions array (same as no exclusions)", () => {
    const res = shuffle_into_groups({
      names: ["A", "B", "C", "D"],
      mode: "by_size",
      target: 2,
      seed: 1,
      exclusions: [],
    });
    expect(res.infeasible).toBeFalsy();
    expect(res.groups.flat().sort()).toEqual(["A", "B", "C", "D"]);
  });

  it("ignores single-name exclusion entries", () => {
    // ["A"] alone is meaningless — should not constrain anything
    const res = shuffle_into_groups({
      names: ["A", "B", "C", "D"],
      mode: "by_size",
      target: 2,
      seed: 1,
      exclusions: [["A"]],
    });
    expect(res.infeasible).toBeFalsy();
    expect(res.groups.flat().sort()).toEqual(["A", "B", "C", "D"]);
  });

  it("is deterministic with the same seed and exclusions", () => {
    const opts = {
      names: ["A", "B", "C", "D", "E", "F"],
      mode: "by_size" as const,
      target: 3,
      seed: 42,
      exclusions: [["A", "B"]],
    };
    const r1 = shuffle_into_groups(opts);
    const r2 = shuffle_into_groups(opts);
    expect(r2.groups).toEqual(r1.groups);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/classroom/group-shuffler.test.ts`
Expected: FAIL — `exclusions` is not in the type / the option is silently ignored, so tests like "never places A and B together" will fail intermittently and "returns infeasible" will fail.

### Task 2: Implement exclusions in the shuffler

**Files:**
- Modify: `src/components/classroom/group-shuffler.ts`

- [ ] **Step 1: Add `exclusions` to options + `infeasible/reason` to result**

Replace the `ShuffleOptions` and `ShuffleResult` interfaces at the top of `group-shuffler.ts` with:

```ts
export interface ShuffleOptions {
  names: string[];
  mode: GroupMode;
  /** When mode=by_count, target N groups. When mode=by_size, target K per group. */
  target: number;
  seed?: number | string;
  /** Previous pairings to avoid repeating (set of "a||b" sorted strings). */
  avoid_pairs?: Set<string>;
  /** Hard exclusion groups — each inner array is a set of names that cannot share a group. */
  exclusions?: string[][];
  /** Number of retries to minimize repeat pairs / satisfy exclusions. Default 25. */
  retries?: number;
}

export interface ShuffleResult {
  groups: string[][];
  /** Pairs that repeat from previous shuffle (count). */
  repeat_count: number;
  /** True when hard exclusions could not be honoured. */
  infeasible?: boolean;
  /** Human-readable cause when infeasible. */
  reason?: string;
}
```

- [ ] **Step 2: Replace `shuffle_into_groups` with the exclusion-aware version**

Find the existing `shuffle_into_groups` function (currently ~lines 121-152) and replace it with:

```ts
function pair_key(a: string, b: string): string {
  return a < b ? `${a}||${b}` : `${b}||${a}`;
}

function build_forbidden(exclusions: string[][] | undefined): Set<string> {
  const out = new Set<string>();
  if (!exclusions) return out;
  for (const group of exclusions) {
    if (group.length < 2) continue; // single-name entries are no-ops
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        out.add(pair_key(group[i], group[j]));
      }
    }
  }
  return out;
}

function try_place_with_exclusions(
  shuffled: string[],
  mode: GroupMode,
  target: number,
  forbidden: Set<string>,
): string[][] | null {
  const n = shuffled.length;
  if (n === 0 || target <= 0) return [];
  let group_count: number;
  let cap: number;
  if (mode === "by_count") {
    group_count = Math.min(target, n);
    cap = Math.ceil(n / group_count);
  } else {
    group_count = Math.max(1, Math.ceil(n / target));
    cap = target;
  }
  const groups: string[][] = Array.from({ length: group_count }, () => []);
  for (const name of shuffled) {
    let placed = false;
    for (let gi = 0; gi < group_count; gi++) {
      const g = groups[gi];
      if (g.length >= cap) continue;
      let conflicts = false;
      for (const existing of g) {
        if (forbidden.has(pair_key(name, existing))) {
          conflicts = true;
          break;
        }
      }
      if (!conflicts) {
        g.push(name);
        placed = true;
        break;
      }
    }
    if (!placed) return null;
  }
  return groups;
}

export function shuffle_into_groups(opts: ShuffleOptions): ShuffleResult {
  const { names, mode, target, avoid_pairs, retries = 25 } = opts;
  if (names.length === 0) {
    return { groups: [], repeat_count: 0 };
  }

  const forbidden = build_forbidden(opts.exclusions);
  const has_exclusions = forbidden.size > 0;

  const base_seed =
    typeof opts.seed === "string"
      ? string_seed(opts.seed)
      : typeof opts.seed === "number"
        ? opts.seed
        : (Math.random() * 2 ** 31) | 0;

  let best: string[][] = [];
  let best_repeat = Infinity;
  let feasible_found = !has_exclusions; // if no exclusions, every attempt is feasible by definition

  for (let attempt = 0; attempt < retries; attempt++) {
    const rng = mulberry32(base_seed + attempt);
    const shuffled = shuffle_in_place([...names], rng);

    let groups: string[][] | null;
    if (has_exclusions) {
      groups = try_place_with_exclusions(shuffled, mode, target, forbidden);
      if (groups === null) continue; // this seed didn't satisfy exclusions; retry
      feasible_found = true;
    } else {
      groups = distribute(shuffled, mode, target);
    }

    const repeats = avoid_pairs ? count_repeats(groups, avoid_pairs) : 0;
    if (repeats < best_repeat) {
      best = groups;
      best_repeat = repeats;
      if (repeats === 0 && (!has_exclusions || feasible_found)) {
        // Can't beat zero; we have a feasible, zero-repeat answer.
        if (!avoid_pairs || avoid_pairs.size === 0 || repeats === 0) break;
      }
    }
  }

  if (has_exclusions && !feasible_found) {
    return {
      groups: [],
      repeat_count: 0,
      infeasible: true,
      reason:
        "Couldn't honour all exclusions with these group sizes. Try larger groups, fewer groups, or remove an exclusion.",
    };
  }

  return {
    groups: best,
    repeat_count: best_repeat === Infinity ? 0 : best_repeat,
  };
}
```

- [ ] **Step 3: Run tests, all should pass**

Run: `npx vitest run src/components/classroom/group-shuffler.test.ts`
Expected: PASS — all 8 tests green.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/classroom/group-shuffler.ts src/components/classroom/group-shuffler.test.ts
git commit -m "feat(group-shuffler): hard N-way exclusions + infeasibility detection

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Phase B — Exclusion-builder UI

### Task 3: Create the exclusion-builder component

**Files:**
- Create: `src/components/classroom/exclusion-builder.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import React, { useState } from "react";
import { Plus, Check, X } from "lucide-react";

interface ExclusionBuilderProps {
  /** All names available to pick from (the class list). */
  names: string[];
  /** Current exclusion list — each inner array is a set that can't share a group. */
  exclusions: string[][];
  /** Called when exclusions change. */
  on_change: (next: string[][]) => void;
}

/**
 * Click-to-build exclusion editor. Teacher clicks "Add exclusion", picks 2+
 * names from the class list, then clicks Done. The committed exclusion shows
 * as a chip ("John × Sam ×") with a delete button.
 *
 * Single-name selections are discarded when Done is pressed — an exclusion
 * needs at least two members.
 */
export function ExclusionBuilder({ names, exclusions, on_change }: ExclusionBuilderProps) {
  const [building, set_building] = useState(false);
  const [draft, set_draft] = useState<string[]>([]);

  const toggle_in_draft = (name: string) => {
    set_draft((d) => (d.includes(name) ? d.filter((n) => n !== name) : [...d, name]));
  };

  const commit = () => {
    if (draft.length >= 2) {
      on_change([...exclusions, [...draft]]);
    }
    set_draft([]);
    set_building(false);
  };

  const cancel = () => {
    set_draft([]);
    set_building(false);
  };

  const remove_chip = (idx: number) => {
    on_change(exclusions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <label className="font-headline font-semibold text-xs text-muted-foreground uppercase tracking-wide block">
        Keep these students apart
      </label>

      {/* Existing chips */}
      {exclusions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {exclusions.map((group, idx) => (
            <span
              key={`exc-${idx}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-900 border border-rose-200 px-3 py-1 text-sm"
            >
              <span>{group.join(" × ")}</span>
              <button
                type="button"
                onClick={() => remove_chip(idx)}
                aria-label={`Remove exclusion: ${group.join(", ")}`}
                className="text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add flow */}
      {!building && (
        <button
          type="button"
          onClick={() => set_building(true)}
          disabled={names.length < 2}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-headline font-bold uppercase tracking-widest bg-surface text-muted-foreground hover:text-foreground border border-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add exclusion
        </button>
      )}

      {building && (
        <div className="space-y-3 rounded-xl bg-surface p-3 border border-surface-container-high">
          <p className="text-xs text-muted-foreground">
            Tap two or more names that should never share a group, then tap{" "}
            <strong>Done</strong>.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {names.map((name) => {
              const selected = draft.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggle_in_draft(name)}
                  className={`px-2.5 py-1 rounded-full text-sm border transition-colors cursor-pointer ${
                    selected
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-surface-container-low text-foreground border-surface-container-high hover:border-secondary/50"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">
              {draft.length === 0
                ? "No names selected yet"
                : draft.length === 1
                  ? "Select at least one more"
                  : `Building: ${draft.join(", ")}`}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancel}
                className="px-3 py-1.5 rounded-full text-xs font-headline font-bold uppercase tracking-widest bg-surface-container-low text-muted-foreground hover:text-foreground border border-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={commit}
                disabled={draft.length < 2}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-headline font-bold uppercase tracking-widest bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-none"
              >
                <Check className="w-3.5 h-3.5" />
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/classroom/exclusion-builder.tsx
git commit -m "feat(classroom): exclusion-builder component — click-to-build N-way chips

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 4: Wire exclusion-builder into group-generator with localStorage persistence

**Files:**
- Modify: `src/components/classroom/group-generator.tsx`

- [ ] **Step 1: Add localStorage helpers + state**

Open `src/components/classroom/group-generator.tsx`. Just below the existing `HISTORY_KEY_PREFIX` constant (around line 18), add:

```ts
const EXCLUSIONS_KEY_PREFIX = "classroom:exclusions:";

function load_exclusions(slug: string): string[][] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(`${EXCLUSIONS_KEY_PREFIX}${slug}`);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    // Sanity filter: drop entries that aren't arrays of strings or are <2 long
    return arr.filter(
      (e: unknown): e is string[] =>
        Array.isArray(e) && e.length >= 2 && e.every((n) => typeof n === "string"),
    );
  } catch {
    return [];
  }
}

function save_exclusions(slug: string, exclusions: string[][]) {
  try {
    window.localStorage.setItem(
      `${EXCLUSIONS_KEY_PREFIX}${slug}`,
      JSON.stringify(exclusions),
    );
  } catch {
    /* ignore */
  }
}
```

- [ ] **Step 2: Import the new component**

Add at the top with the other imports:

```ts
import { ExclusionBuilder } from "./exclusion-builder";
```

- [ ] **Step 3: Add exclusion state and persistence inside the component**

Inside the `GroupGenerator` function, after the existing `const [show_setup, set_show_setup] = useState(true);` line, add:

```ts
const [exclusions, set_exclusions] = useState<string[][]>([]);

// Load exclusions from localStorage when slug becomes available client-side.
useEffect(() => {
  set_exclusions(load_exclusions(slug));
}, [slug]);

const update_exclusions = useCallback(
  (next: string[][]) => {
    set_exclusions(next);
    save_exclusions(slug, next);
  },
  [slug],
);
```

- [ ] **Step 4: Pass exclusions to the shuffler**

Find the `handle_shuffle` callback (around line 71). Update its `shuffle_into_groups` call to include `exclusions`:

```ts
const handle_shuffle = useCallback(() => {
  if (names.length === 0) return;
  const res = shuffle_into_groups({
    names,
    mode,
    target,
    seed: seed.length > 0 ? seed : undefined,
    avoid_pairs: avoid_prev ? history : undefined,
    exclusions: exclusions.length > 0 ? exclusions : undefined,
  });
  set_result(res);
  set_copied(false);
  if (!res.infeasible) {
    set_show_setup(false);
    if (avoid_prev) {
      save_history(slug, collect_pairs(res.groups));
    }
  } else {
    // Keep the setup open so the teacher can adjust.
    set_show_setup(true);
  }
}, [names, mode, target, seed, avoid_prev, history, slug, exclusions]);
```

- [ ] **Step 5: Render the exclusion-builder inside the setup panel**

In the `{show_setup && (...)}` block, find the `<NameListInput ... />` element. Right after it (still inside the `<div className="space-y-5 rounded-2xl bg-surface-container-low p-5 shadow-[var(--shadow-soft)]">`), add:

```tsx
<ExclusionBuilder
  names={names}
  exclusions={exclusions}
  on_change={update_exclusions}
/>
```

- [ ] **Step 6: Render the infeasibility alert in the results area**

Inside the `{result && result.groups.length > 0 && (...)}` block — change the condition to also handle infeasibility. Replace that whole block's opening with:

```tsx
{result && result.infeasible && (
  <div
    role="alert"
    className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-900 px-4 py-3 mb-4 text-sm"
  >
    <strong>Couldn&apos;t make groups with these constraints.</strong>{" "}
    {result.reason}
  </div>
)}

{result && !result.infeasible && result.groups.length > 0 && (
```

(Make sure the closing `)}` of the original block still matches — only the opening condition changes.)

- [ ] **Step 7: Manual smoke-test**

Start the dev server: `npm run dev`

Then in a browser, visit `http://localhost:3000/classroom/group-generator`:
- Paste a class list of ~8 names.
- Click **Add exclusion** → click two names → **Done**. A chip should appear.
- Click **Make groups** → confirm the two excluded students aren't in the same group across several shuffles.
- Add 5 more exclusions covering everyone → **Shuffle again** → confirm the infeasibility alert appears.
- Reload the page → confirm exclusion chips persist (localStorage).

- [ ] **Step 8: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/classroom/group-generator.tsx
git commit -m "feat(group-generator): wire exclusion-builder + persist to localStorage

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Phase C — DB + API

### Task 5: Add DB migration v36 for saved_group_sets

**Files:**
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Add migration v36 to the `migrations` array**

Open `src/lib/db.ts`. Find the `migrations` array (starts around line 99). The current last entry is `{ version: 35, sql: ... }`. After that entry (before the closing `];` of the array), add:

```ts
  { version: 36, sql: `
    CREATE TABLE IF NOT EXISTS saved_group_sets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      slug TEXT NOT NULL DEFAULT 'default',
      name TEXT NOT NULL,
      groups_json TEXT NOT NULL,
      setup_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_saved_group_sets_user ON saved_group_sets (user_id);
  ` },
```

- [ ] **Step 2: Trigger migration by importing the module once**

Run a quick script to force migration application:

```bash
node -e "require('./src/lib/db.ts')" 2>&1 || true
```

(Expected: this may error because of TS — but the dev server boot will apply migrations. Skip if it errors; the next step covers it.)

Alternatively, start the dev server briefly:

```bash
timeout 8 npm run dev || true
```

Then verify the migration ran by inspecting the sqlite file:

```bash
sqlite3 data/gotimer.sqlite ".schema saved_group_sets"
```

Expected output: the `CREATE TABLE saved_group_sets ...` definition.

- [ ] **Step 3: Verify version row was inserted**

```bash
sqlite3 data/gotimer.sqlite "SELECT version FROM schema_migrations WHERE version=36;"
```

Expected: `36`

- [ ] **Step 4: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat(db): migration v36 — saved_group_sets table for Studio

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 6: Create list + create API route

**Files:**
- Create: `src/app/api/studio/group-sets/route.ts`

- [ ] **Step 1: Write the route handlers**

```ts
import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

interface SavedGroupSetSetup {
  names: string[];
  mode: string;
  target: number;
  exclusions: string[][];
  seed?: string;
}

function is_valid_setup(value: unknown): value is SavedGroupSetSetup {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  if (!Array.isArray(s.names) || s.names.length === 0) return false;
  if (typeof s.mode !== "string") return false;
  if (typeof s.target !== "number") return false;
  if (!Array.isArray(s.exclusions)) return false;
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = get_db();
    const rows = db
      .prepare(
        `SELECT * FROM saved_group_sets WHERE user_id = ? ORDER BY created_at DESC`,
      )
      .all(auth.user.id);

    return NextResponse.json({ group_sets: rows });
  } catch (error) {
    console.error("Error fetching group sets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name_raw = typeof body?.name === "string" ? body.name.trim() : "";
    const slug = typeof body?.slug === "string" && body.slug.length > 0 ? body.slug : "default";
    const groups = body?.groups;
    const setup = body?.setup;

    if (name_raw.length === 0) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({ error: "groups must be a non-empty array" }, { status: 400 });
    }
    if (!is_valid_setup(setup)) {
      return NextResponse.json({ error: "setup is invalid" }, { status: 400 });
    }

    const db = get_db();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO saved_group_sets (id, user_id, slug, name, groups_json, setup_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      auth.user.id,
      slug,
      name_raw,
      JSON.stringify(groups),
      JSON.stringify(setup),
      now,
      now,
    );

    const row = db.prepare(`SELECT * FROM saved_group_sets WHERE id = ?`).get(id);
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("Error creating group set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Smoke-test with curl (server running)**

Start dev server in another terminal: `npm run dev`

Unauthenticated GET should 401:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/studio/group-sets
```
Expected: `401`

- [ ] **Step 4: Commit**

```bash
git add src/app/api/studio/group-sets/route.ts
git commit -m "feat(api): GET/POST /api/studio/group-sets for Studio-backed saves

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 7: Create fetch + update + delete API route for a single saved set

**Files:**
- Create: `src/app/api/studio/group-sets/[id]/route.ts`

- [ ] **Step 1: Write the route handlers**

```ts
import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const db = get_db();
    const row = db
      .prepare(`SELECT * FROM saved_group_sets WHERE id = ? AND user_id = ?`)
      .get(id, auth.user.id);
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(row);
  } catch (error) {
    console.error("Error fetching group set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const db = get_db();
    const existing = db
      .prepare(`SELECT * FROM saved_group_sets WHERE id = ? AND user_id = ?`)
      .get(id, auth.user.id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const updates: string[] = [];
    const values: unknown[] = [];
    if (typeof body?.name === "string" && body.name.trim().length > 0) {
      updates.push("name = ?");
      values.push(body.name.trim());
    }
    if (Array.isArray(body?.groups)) {
      updates.push("groups_json = ?");
      values.push(JSON.stringify(body.groups));
    }
    if (body?.setup && typeof body.setup === "object") {
      updates.push("setup_json = ?");
      values.push(JSON.stringify(body.setup));
    }
    if (updates.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }
    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);
    values.push(auth.user.id);

    db.prepare(
      `UPDATE saved_group_sets SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    ).run(...(values as never[]));

    const row = db.prepare(`SELECT * FROM saved_group_sets WHERE id = ?`).get(id);
    return NextResponse.json(row);
  } catch (error) {
    console.error("Error updating group set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const db = get_db();
    const result = db
      .prepare(`DELETE FROM saved_group_sets WHERE id = ? AND user_id = ?`)
      .run(id, auth.user.id);
    if (result.changes === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting group set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/studio/group-sets/\[id\]/route.ts
git commit -m "feat(api): GET/PUT/DELETE /api/studio/group-sets/[id]

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Phase D — Save / Load UI in group generator

### Task 8: Create the saved-group-sets-menu component

**Files:**
- Create: `src/components/classroom/saved-group-sets-menu.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, ChevronDown, Trash2 } from "lucide-react";
import { use_hazo_auth } from "hazo_auth/client";
import type { GroupMode } from "./group-shuffler";

export interface SavedGroupSetSetup {
  names: string[];
  mode: GroupMode;
  target: number;
  exclusions: string[][];
  seed?: string;
}

export interface SavedGroupSet {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  groups_json: string;
  setup_json: string;
  created_at: string;
  updated_at: string;
}

export interface SavedGroupSetView {
  id: string;
  name: string;
  groups: string[][];
  setup: SavedGroupSetSetup;
  created_at: string;
}

function parse_row(row: SavedGroupSet): SavedGroupSetView {
  let groups: string[][] = [];
  let setup: SavedGroupSetSetup = {
    names: [],
    mode: "by_size",
    target: 4,
    exclusions: [],
  };
  try {
    groups = JSON.parse(row.groups_json);
  } catch {
    /* leave empty */
  }
  try {
    setup = JSON.parse(row.setup_json);
  } catch {
    /* leave default */
  }
  return { id: row.id, name: row.name, groups, setup, created_at: row.created_at };
}

interface SavedGroupSetsMenuProps {
  slug: string;
  /** Current shuffle result + setup that "Save" should persist. */
  current_groups: string[][] | null;
  current_setup: SavedGroupSetSetup;
  /** Called when the user opens a saved set. */
  on_open: (view: SavedGroupSetView) => void;
}

export function SavedGroupSetsMenu({
  slug,
  current_groups,
  current_setup,
  on_open,
}: SavedGroupSetsMenuProps) {
  const { authenticated } = use_hazo_auth({});
  const [sets, set_sets] = useState<SavedGroupSetView[]>([]);
  const [show_save_prompt, set_show_save_prompt] = useState(false);
  const [save_modal_open, set_save_modal_open] = useState(false);
  const [save_name, set_save_name] = useState("");
  const [saving, set_saving] = useState(false);
  const [dropdown_open, set_dropdown_open] = useState(false);
  const [confirm_delete_id, set_confirm_delete_id] = useState<string | null>(null);

  const fetch_sets = useCallback(async () => {
    if (!authenticated) {
      set_sets([]);
      return;
    }
    try {
      const res = await fetch("/api/studio/group-sets");
      if (!res.ok) return;
      const data = (await res.json()) as { group_sets: SavedGroupSet[] };
      set_sets((data.group_sets || []).map(parse_row));
    } catch {
      /* network/parse error — leave list unchanged */
    }
  }, [authenticated]);

  useEffect(() => {
    fetch_sets();
  }, [fetch_sets]);

  const default_name = useCallback(() => {
    const d = new Date();
    return `${d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} groups`;
  }, []);

  const open_save = () => {
    if (!authenticated) {
      set_show_save_prompt(true);
      window.setTimeout(() => set_show_save_prompt(false), 8000);
      return;
    }
    if (!current_groups || current_groups.length === 0) return;
    set_save_name(default_name());
    set_save_modal_open(true);
  };

  const submit_save = async () => {
    if (!current_groups || !save_name.trim()) return;
    set_saving(true);
    try {
      const res = await fetch("/api/studio/group-sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: save_name.trim(),
          slug,
          groups: current_groups,
          setup: current_setup,
        }),
      });
      if (res.ok) {
        set_save_modal_open(false);
        set_save_name("");
        fetch_sets();
      }
    } finally {
      set_saving(false);
    }
  };

  const delete_set = async (id: string) => {
    try {
      const res = await fetch(`/api/studio/group-sets/${id}`, { method: "DELETE" });
      if (res.ok) {
        set_sets((prev) => prev.filter((s) => s.id !== id));
        set_confirm_delete_id(null);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* Save button */}
      <div className="relative">
        <button
          type="button"
          onClick={open_save}
          disabled={!current_groups || current_groups.length === 0}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-surface-container-low text-muted-foreground hover:text-foreground font-headline font-bold uppercase tracking-widest text-xs border border-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5" />
          Save
        </button>
        {show_save_prompt && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 z-30 bg-card rounded-xl shadow-lg border border-surface-container-high p-3 text-xs text-foreground">
            <Link href="/hazo_auth/login" className="text-secondary underline underline-offset-2">
              Sign in
            </Link>{" "}
            to save groups across devices.
          </div>
        )}
      </div>

      {/* Saved sets dropdown */}
      {authenticated && sets.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => set_dropdown_open((v) => !v)}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-surface-container-low text-muted-foreground hover:text-foreground font-headline font-bold uppercase tracking-widest text-xs border border-surface-container-high transition-all duration-200 cursor-pointer"
          >
            Saved sets ({sets.length})
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {dropdown_open && (
            <div className="absolute top-full mt-2 right-0 z-30 w-80 bg-card rounded-xl shadow-lg border border-surface-container-high overflow-hidden">
              <ul className="max-h-80 overflow-y-auto divide-y divide-surface-container-high">
                {sets.map((s) => (
                  <li key={s.id} className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.groups.length} groups · {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          on_open(s);
                          set_dropdown_open(false);
                        }}
                        className="px-3 py-1 rounded-full text-xs font-headline font-bold uppercase tracking-widest bg-secondary text-secondary-foreground cursor-pointer border-none"
                      >
                        Open
                      </button>
                      {confirm_delete_id === s.id ? (
                        <button
                          type="button"
                          onClick={() => delete_set(s.id)}
                          className="px-2 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 hover:bg-rose-200 cursor-pointer"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => set_confirm_delete_id(s.id)}
                          aria-label={`Delete ${s.name}`}
                          className="p-1.5 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Save modal */}
      {save_modal_open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => set_save_modal_open(false)}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl border w-[min(90vw,420px)] p-5">
            <h3 className="text-sm font-semibold mb-3">Name this set</h3>
            <input
              type="text"
              value={save_name}
              onChange={(e) => set_save_name(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit_save();
              }}
              autoFocus
              placeholder="e.g. Tuesday science partners"
              className="w-full px-3 py-2 rounded-xl bg-surface text-foreground text-sm border border-surface-container-high focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => set_save_modal_open(false)}
                className="px-4 py-2 rounded-full text-xs font-headline font-bold uppercase tracking-widest bg-surface-container-low text-muted-foreground hover:text-foreground border border-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit_save}
                disabled={!save_name.trim() || saving}
                className="px-4 py-2 rounded-full text-xs font-headline font-bold uppercase tracking-widest bg-secondary text-secondary-foreground disabled:opacity-50 cursor-pointer border-none"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/classroom/saved-group-sets-menu.tsx
git commit -m "feat(classroom): saved-group-sets-menu — save modal + dropdown + delete

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 9: Wire save/load menu into group-generator + handle ?load=<id>

**Files:**
- Modify: `src/components/classroom/group-generator.tsx`

- [ ] **Step 1: Import the menu + types**

Add to imports near the top:

```ts
import { useSearchParams } from "next/navigation";
import {
  SavedGroupSetsMenu,
  type SavedGroupSetView,
} from "./saved-group-sets-menu";
```

- [ ] **Step 2: Build a current_setup memo for the menu**

Inside the `GroupGenerator` function, after the `update_exclusions` callback, add:

```ts
const current_setup = useMemo(
  () => ({
    names,
    mode,
    target,
    exclusions,
    seed: seed.length > 0 ? seed : undefined,
  }),
  [names, mode, target, exclusions, seed],
);

const handle_open_saved = useCallback(
  (view: SavedGroupSetView) => {
    set_names(view.setup.names);
    set_mode(view.setup.mode);
    set_target(view.setup.target);
    set_exclusions(view.setup.exclusions);
    save_exclusions(slug, view.setup.exclusions);
    set_seed(view.setup.seed ?? "");
    set_result({ groups: view.groups, repeat_count: 0 });
    set_show_setup(false);
  },
  [slug],
);
```

- [ ] **Step 3: Handle `?load=<id>` query param**

Add this effect just below the existing exclusion-loading useEffect:

```ts
const search_params = useSearchParams();
useEffect(() => {
  const load_id = search_params?.get("load");
  if (!load_id) return;
  let cancelled = false;
  (async () => {
    try {
      const res = await fetch(`/api/studio/group-sets/${load_id}`);
      if (!res.ok) return;
      const row = await res.json();
      if (cancelled) return;
      let groups: string[][] = [];
      let setup;
      try { groups = JSON.parse(row.groups_json); } catch {}
      try { setup = JSON.parse(row.setup_json); } catch {}
      if (!setup) return;
      handle_open_saved({ id: row.id, name: row.name, groups, setup, created_at: row.created_at });
    } catch { /* ignore */ }
  })();
  return () => { cancelled = true; };
}, [search_params, handle_open_saved]);
```

- [ ] **Step 4: Add the menu into the results action bar**

Find the existing action-bar `<div className="flex items-center justify-center gap-3 flex-wrap">` (inside the `{result && !result.infeasible && result.groups.length > 0 && ...}` block). Inside that flex container, after the existing **Copy** and **Edit/Hide setup** buttons, add:

```tsx
<SavedGroupSetsMenu
  slug={slug}
  current_groups={result.groups}
  current_setup={current_setup}
  on_open={handle_open_saved}
/>
```

- [ ] **Step 5: Manual smoke-test**

Start dev server: `npm run dev`. In a browser:
- **Logged out:** visit `/classroom/group-generator`, paste names, shuffle, click **Save**. Confirm the "Sign in to save" popover appears, no save happens.
- **Logged in** (via `/hazo_auth/login`): same flow → modal appears → enter a name → save. Confirm the **Saved sets (1)** dropdown appears immediately with the entry.
- Click **Open** on the saved entry from a fresh tab → confirm the result + setup restore.
- Visit `/classroom/group-generator?load=<id>` (using a real ID from the database) → confirm the same restore happens via deep link.
- **Delete** flow: click trash → click Confirm → row disappears.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/classroom/group-generator.tsx
git commit -m "feat(group-generator): wire Studio save/load + ?load=<id> deep link

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Phase E — Studio surface

### Task 10: Create group-set-tile and surface in Studio

**Files:**
- Create: `src/components/studio/group-set-tile.tsx`
- Modify: `src/components/studio/studio-page.tsx`

- [ ] **Step 1: Write the tile component**

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, MoreVertical, Trash2, ExternalLink } from "lucide-react";

interface GroupSetTileProps {
  id: string;
  name: string;
  groups: string[][];
  student_count: number;
  created_at: string;
  on_deleted: () => void;
}

export function GroupSetTile({
  id,
  name,
  groups,
  student_count,
  created_at,
  on_deleted,
}: GroupSetTileProps) {
  const [menu_open, set_menu_open] = useState(false);
  const [confirming, set_confirming] = useState(false);

  const delete_set = async () => {
    const res = await fetch(`/api/studio/group-sets/${id}`, { method: "DELETE" });
    if (res.ok) on_deleted();
  };

  return (
    <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Users className="w-5 h-5 text-secondary shrink-0" />
          <h3 className="font-headline font-bold text-base text-foreground truncate">{name}</h3>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => set_menu_open((v) => !v)}
            aria-label="Tile menu"
            className="p-1.5 rounded-full text-muted-foreground hover:bg-surface-container-high cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menu_open && (
            <div className="absolute right-0 top-8 z-20 w-44 bg-card rounded-lg shadow-lg border py-1">
              <Link
                href={`/classroom/group-generator?load=${id}`}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-surface-container-low"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in tool
              </Link>
              <button
                type="button"
                onClick={() => {
                  set_menu_open(false);
                  set_confirming(true);
                }}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-surface-container-low text-destructive cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {groups.length} groups · {student_count} students ·{" "}
        {new Date(created_at).toLocaleDateString()}
      </p>
      {confirming && (
        <div className="flex items-center justify-between gap-2 mt-1 p-2 rounded-lg bg-rose-50 border border-rose-200">
          <span className="text-xs text-rose-900">Delete this set?</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => set_confirming(false)}
              className="px-2 py-1 text-xs rounded-full bg-white text-foreground border border-rose-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={delete_set}
              className="px-2 py-1 text-xs rounded-full bg-rose-600 text-white cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add Studio sidebar entry + grid switch**

Open `src/components/studio/studio-page.tsx`.

Add to imports near the top:

```ts
import { Users } from "lucide-react";
import { GroupSetTile } from "./group-set-tile";
```

Add a `SavedGroupSet` type near the top of the file (next to `SavedTimer`):

```ts
type SavedGroupSetRow = {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  groups_json: string;
  setup_json: string;
  created_at: string;
  updated_at: string;
};

type ParsedGroupSet = {
  id: string;
  name: string;
  groups: string[][];
  student_count: number;
  created_at: string;
};

function parse_group_set(row: SavedGroupSetRow): ParsedGroupSet {
  let groups: string[][] = [];
  let student_count = 0;
  try {
    groups = JSON.parse(row.groups_json);
    student_count = groups.flat().length;
  } catch {
    /* default 0 */
  }
  return { id: row.id, name: row.name, groups, student_count, created_at: row.created_at };
}
```

Inside the `StudioPage` component, alongside the existing `timers` / `categories` state, add:

```ts
const [group_sets, set_group_sets] = useState<ParsedGroupSet[]>([]);
const [view, set_view] = useState<"timers" | "group_sets">("timers");
```

Update the `fetch_data` callback to also fetch group sets:

```ts
const fetch_data = useCallback(async () => {
  set_loading(true);
  try {
    const [timers_res, cats_res, sets_res] = await Promise.all([
      fetch("/api/studio/timers"),
      fetch("/api/studio/categories"),
      fetch("/api/studio/group-sets"),
    ]);
    const timers_data = await timers_res.json();
    const cats_data = await cats_res.json();
    const sets_data = await sets_res.json();

    set_timers(Array.isArray(timers_data) ? timers_data : timers_data.timers || []);
    set_categories(Array.isArray(cats_data) ? cats_data : cats_data.categories || []);
    set_group_sets(
      Array.isArray(sets_data?.group_sets)
        ? (sets_data.group_sets as SavedGroupSetRow[]).map(parse_group_set)
        : [],
    );
  } catch {
    set_timers([]);
    set_categories([]);
    set_group_sets([]);
  } finally {
    set_loading(false);
  }
}, []);
```

In the desktop sidebar `<nav>` block, after the existing "New Category" button, add a divider + Group sets button:

```tsx
<div className="my-2 border-t border-surface-container-high" />
<button
  className={`flex items-center justify-between px-3 py-2.5 rounded-[0.75rem] text-sm font-medium transition-all duration-150 cursor-pointer ${
    view === "group_sets"
      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
      : "text-foreground hover:bg-surface-container-high"
  }`}
  onClick={() => set_view("group_sets")}
>
  <span className="flex items-center gap-2">
    <Users className="w-4 h-4" />
    Group sets
  </span>
  <span className="text-xs opacity-70">{group_sets.length}</span>
</button>
```

Also wrap the existing `All Timers` button's `onClick` to set `view` back to `"timers"` — change its `onClick={() => set_selected_category(null)}` to:

```tsx
onClick={() => { set_view("timers"); set_selected_category(null); }}
```

Apply the same `set_view("timers")` to the other timer-side buttons (Uncategorized + each category) so switching back works.

Replace the timer grid block (the `<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">` that maps over `filtered_timers`) with a conditional rendering:

```tsx
{view === "group_sets" ? (
  group_sets.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Users className="w-10 h-10 text-muted-foreground mb-3" />
      <p className="text-muted-foreground text-sm">
        No saved group sets yet. Make groups in the{" "}
        <Link href="/classroom/group-generator" className="text-secondary underline">
          group generator
        </Link>{" "}
        and tap Save.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {group_sets.map((s) => (
        <GroupSetTile
          key={s.id}
          id={s.id}
          name={s.name}
          groups={s.groups}
          student_count={s.student_count}
          created_at={s.created_at}
          on_deleted={fetch_data}
        />
      ))}
    </div>
  )
) : (
  // (the original timer grid block — keep as-is, just nested here)
  loading ? (
    /* ...existing skeleton... */
  ) : filtered_timers.length === 0 ? (
    /* ...existing empty state... */
  ) : (
    /* ...existing timer grid... */
  )
)}
```

(Practical note: keep the existing timer grid intact, just move it inside the `else` branch. Don't duplicate the timer code.)

- [ ] **Step 3: Manual smoke-test**

Start dev server: `npm run dev`. Logged in, visit `/studio`:
- Confirm sidebar now has **Group sets** entry below the categories.
- Click it → if no sets yet, empty state appears with link.
- Save a set from the group generator → return to Studio → confirm the new tile appears.
- Click **Open in tool** on a tile → confirm it deep-links to `/classroom/group-generator?load=<id>` and restores.
- **Delete** flow on a tile → confirm row disappears.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/studio/group-set-tile.tsx src/components/studio/studio-page.tsx
git commit -m "feat(studio): surface saved group sets in sidebar + grid

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-review (done by author)

- **Spec coverage:** Algorithm (Tasks 1–2), exclusion UI (Tasks 3–4 + persistence), DB migration (Task 5), API (Tasks 6–7), save/load UI (Tasks 8–9), Studio surface (Task 10). All spec sections mapped.
- **Placeholder scan:** No TBD/TODO/"add validation" placeholders. Every step contains the actual code or command.
- **Type consistency:** `ShuffleOptions.exclusions` / `ShuffleResult.infeasible` defined in Task 2, consumed in Tasks 4, 8, 9. `SavedGroupSet` / `SavedGroupSetView` defined in Task 8, consumed in Task 9. `ParsedGroupSet` defined in Task 10, consumed only within `studio-page.tsx`. Names match across tasks.
- **Test coverage:** Pure shuffler logic has 8 tests covering pair, N-way, multi-entry, by_count, infeasibility, empty/single-name no-op, determinism. UI and API exercised via manual smoke-tests (matching this codebase's convention — no existing API or component-level tests).
