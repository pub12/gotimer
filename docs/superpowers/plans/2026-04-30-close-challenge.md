# Close Challenge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Close challenge" action (with persistent Reopen) to the My Challenges list, compute and display the winner on closed cards, and reflect the closed state visually on both the private detail page and public challenge views.

**Architecture:** The existing `status` column (enum: `active | completed | archived`) is used — "close" maps to `completed`. A new `closed_at TEXT NULL` column is added via migration. The existing `PATCH /api/challenges/[id]` route is extended to set/clear `closed_at` as a side-effect of status transitions. The winner is computed live from scores using a new pure utility `compute_winner`. The Close/Reopen action lives in a per-card ellipsis menu (creator-only) on the My Challenges list.

**Tech Stack:** Next.js 15, React, TypeScript, better-sqlite3, shadcn/ui (Button, Card), Tailwind CSS v4, Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/db.ts` | Modify | Add migration v35 for `closed_at TEXT NULL` |
| `src/lib/challenge-winner.ts` | **Create** | Pure `compute_winner` utility used by all surfaces |
| `src/lib/challenge-winner.test.ts` | **Create** | Unit tests for winner computation |
| `src/app/api/challenges/[id]/route.ts` | Modify | Side-effect `closed_at` on status PATCH |
| `src/components/challenges/challenge-card.tsx` | Modify | Ellipsis menu (close/reopen), closed visual treatment |
| `src/app/challenges/page.tsx` | Modify | Fetch current_user_id, group active/closed, pass close handler |
| `src/app/challenges/[id]/page.tsx` | Modify | Freeze Add Game / Edit / Delete when closed |
| `src/app/challenges/[id]/edit/page.tsx` | Modify | Remove broken `paused` option from status dropdown |
| `src/app/public-challenges/page.tsx` | Modify | Add winner badge on completed public list cards |
| `src/app/public-challenges/[id]/public-challenge-detail-client.tsx` | Modify | Closed banner + hero finalization (FINAL stamp, winner highlight) |

---

## Task 1: DB Migration — add `closed_at` column

**Files:**
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Add migration v35**

Open `src/lib/db.ts`. Find the `migrations` array (last entry is version 34). Append:

```ts
{ version: 35, sql: `ALTER TABLE game_challenges ADD COLUMN closed_at TEXT` },
```

- [ ] **Step 2: Verify migration runs cleanly**

```bash
npm run dev
```

Navigate to `http://localhost:3000/challenges` while logged in. Server should start without errors. The column now exists. Stop the dev server (`Ctrl+C`).

- [ ] **Step 3: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add closed_at column to game_challenges (migration v35)"
```

---

## Task 2: API — set/clear `closed_at` on status transition

**Files:**
- Modify: `src/app/api/challenges/[id]/route.ts` (lines 141–146)

- [ ] **Step 1: Add closed_at side-effect in the PATCH handler**

Find this block in the PATCH handler:

```ts
  if (status !== undefined) {
    if (!["active", "completed", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.push("status = ?");
    values.push(status);
  }
```

Replace it with:

```ts
  if (status !== undefined) {
    if (!["active", "completed", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.push("status = ?");
    values.push(status);
    if (status === "completed") {
      updates.push("closed_at = datetime('now')");
    } else if (status === "active") {
      updates.push("closed_at = NULL");
    }
  }
```

- [ ] **Step 2: Verify manually**

Start `npm run dev`. Open a challenge edit page as creator, change status to Completed, save. In a DB browser or via the API:

```bash
curl -b "your-cookie" http://localhost:3000/api/challenges/YOUR_ID | jq '.closed_at'
```

Should return a non-null datetime string. Change back to Active and `closed_at` should be `null`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/challenges/[id]/route.ts
git commit -m "feat: set/clear closed_at on challenge status transition"
```

---

## Task 3: Winner utility + tests

**Files:**
- Create: `src/lib/challenge-winner.ts`
- Create: `src/lib/challenge-winner.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `src/lib/challenge-winner.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { compute_winner } from "./challenge-winner";

describe("compute_winner", () => {
  it("returns no_result when all scores are zero", () => {
    const result = compute_winner([
      { name: "Alex", score: 0 },
      { name: "Jordan", score: 0 },
    ]);
    expect(result).toEqual({ kind: "no_result" });
  });

  it("returns no_result for empty array", () => {
    expect(compute_winner([])).toEqual({ kind: "no_result" });
  });

  it("returns no_result for single participant", () => {
    expect(compute_winner([{ name: "Alex", score: 5 }])).toEqual({ kind: "no_result" });
  });

  it("returns win for clear winner", () => {
    const result = compute_winner([
      { name: "Alex", score: 7 },
      { name: "Jordan", score: 5 },
    ]);
    expect(result).toEqual({ kind: "win", winner_name: "Alex", winner_score: 7, loser_score: 5 });
  });

  it("picks winner regardless of input order", () => {
    const result = compute_winner([
      { name: "Jordan", score: 5 },
      { name: "Alex", score: 7 },
    ]);
    expect(result).toEqual({ kind: "win", winner_name: "Alex", winner_score: 7, loser_score: 5 });
  });

  it("returns tie when top two scores are equal", () => {
    const result = compute_winner([
      { name: "Alex", score: 4 },
      { name: "Jordan", score: 4 },
    ]);
    expect(result).toEqual({ kind: "tie", score: 4 });
  });

  it("group format — highest scorer wins", () => {
    const result = compute_winner([
      { name: "A", score: 3 },
      { name: "B", score: 7 },
      { name: "C", score: 5 },
    ]);
    expect(result).toEqual({ kind: "win", winner_name: "B", winner_score: 7, loser_score: 5 });
  });

  it("group format — tie when top two are equal", () => {
    const result = compute_winner([
      { name: "A", score: 5 },
      { name: "B", score: 5 },
      { name: "C", score: 3 },
    ]);
    expect(result).toEqual({ kind: "tie", score: 5 });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/challenge-winner.test.ts
```

Expected: FAIL with "Cannot find module './challenge-winner'"

- [ ] **Step 3: Implement the utility**

Create `src/lib/challenge-winner.ts`:

```ts
export type WinnerResult =
  | { kind: "win"; winner_name: string; winner_score: number; loser_score: number }
  | { kind: "tie"; score: number }
  | { kind: "no_result" };

export function compute_winner(
  players: { name: string; score: number }[]
): WinnerResult {
  if (players.length < 2) return { kind: "no_result" };

  const total = players.reduce((sum, p) => sum + p.score, 0);
  if (total === 0) return { kind: "no_result" };

  const sorted = [...players].sort((a, b) => b.score - a.score);

  if (sorted[0].score === sorted[1].score) {
    return { kind: "tie", score: sorted[0].score };
  }

  return {
    kind: "win",
    winner_name: sorted[0].name,
    winner_score: sorted[0].score,
    loser_score: sorted[1].score,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/lib/challenge-winner.test.ts
```

Expected: 8 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/challenge-winner.ts src/lib/challenge-winner.test.ts
git commit -m "feat: add compute_winner utility with tests"
```

---

## Task 4: ChallengeCard — ellipsis menu + closed visual

**Files:**
- Modify: `src/components/challenges/challenge-card.tsx`

- [ ] **Step 1: Update the component**

Replace the entire file with:

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Swords, MoreHorizontal, Scale } from "lucide-react";
import { compute_winner } from "@/lib/challenge-winner";

type ChallengeCardProps = {
  id: string;
  name: string;
  my_wins: number;
  opponent_wins: number;
  draws: number;
  total_games: number;
  status: string;
  game_name?: string | null;
  player_names?: string[];
  is_creator?: boolean;
  closed_at?: string | null;
  on_close_toggle?: () => void;
};

function format_closed_at(closed_at: string): string {
  const diff = Date.now() - new Date(closed_at).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Closed today";
  if (days === 1) return "Closed yesterday";
  return `Closed ${days} days ago`;
}

export function ChallengeCard({
  id,
  name,
  my_wins,
  opponent_wins,
  draws,
  total_games,
  status,
  game_name,
  player_names,
  is_creator,
  closed_at,
  on_close_toggle,
}: ChallengeCardProps) {
  const [menu_open, set_menu_open] = useState(false);

  const is_closed = status === "completed";
  const is_winning = my_wins > opponent_wins;
  const is_tied = my_wins === opponent_wins;

  const winner_result = compute_winner([
    { name: player_names?.[0] || "You", score: my_wins },
    { name: player_names?.[1] || "Opponent", score: opponent_wins },
  ]);

  return (
    <div className="relative">
      <Link href={`/challenges/${id}`} className="no-underline block">
        <Card
          className={`hover:shadow-lg transition-shadow cursor-pointer ${
            is_closed ? "border-l-4 border-l-accent" : ""
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-8">
                <CardTitle className="text-lg">{name}</CardTitle>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                  {game_name && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {game_name}
                    </span>
                  )}
                  {player_names && player_names.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {player_names.join(" vs ")}
                    </span>
                  )}
                </div>
              </div>
              {status !== "active" && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    is_closed
                      ? "bg-accent/10 text-accent font-medium"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {is_closed ? "Closed" : status}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {is_closed ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {winner_result.kind === "win" && (
                    <>
                      <Trophy className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-accent font-semibold text-sm">
                        {winner_result.winner_name} won{" "}
                        {winner_result.winner_score}–{winner_result.loser_score}
                      </span>
                    </>
                  )}
                  {winner_result.kind === "tie" && (
                    <>
                      <Scale className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-semibold text-sm">
                        Tied {winner_result.score}–{winner_result.score}
                      </span>
                    </>
                  )}
                  {winner_result.kind === "no_result" && (
                    <span className="text-muted-foreground text-sm">
                      Closed — no result
                    </span>
                  )}
                </div>
                {closed_at && (
                  <p className="text-xs text-muted-foreground">
                    {format_closed_at(closed_at)}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {is_winning ? (
                    <Trophy className="w-5 h-5 text-primary" />
                  ) : (
                    <Swords className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-2xl font-bold">
                    <span className={is_winning ? "text-primary" : ""}>
                      {my_wins}
                    </span>
                    <span className="text-muted-foreground mx-1">-</span>
                    <span className={!is_winning && !is_tied ? "text-primary" : ""}>
                      {opponent_wins}
                    </span>
                  </span>
                  {draws > 0 && (
                    <span className="text-sm text-muted-foreground">
                      ({draws} draw{draws !== 1 ? "s" : ""})
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {total_games} game{total_games !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>

      {is_creator && (
        <>
          {menu_open && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => set_menu_open(false)}
            />
          )}
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                set_menu_open(!menu_open);
              }}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors border-none bg-transparent cursor-pointer"
              aria-label="Challenge options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menu_open && (
              <div className="absolute right-0 top-8 bg-card border rounded-lg shadow-lg py-1 min-w-[168px]">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    set_menu_open(false);
                    on_close_toggle?.();
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors border-none bg-transparent cursor-pointer"
                >
                  {is_closed ? "Reopen challenge" : "Close challenge"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/challenges/challenge-card.tsx
git commit -m "feat: add ellipsis menu and closed visual to ChallengeCard"
```

---

## Task 5: Challenges list page — user ID, grouping, close handler

**Files:**
- Modify: `src/app/challenges/page.tsx`

- [ ] **Step 1: Update the Challenge type**

Find the `type Challenge = {` block (around line 15). Replace it with:

```ts
type Challenge = {
  id: string;
  name: string;
  description: string;
  status: string;
  created_by: string;
  closed_at: string | null;
  my_wins: number;
  opponent_wins: number;
  draws: number;
  total_games: number;
  created_at: string;
  game_name: string | null;
  participants: { user_id: string; role: string }[];
};
```

- [ ] **Step 2: Add current_user_id state and fetch**

After the existing state declarations (after `const [loading, set_loading] = useState(true);`), add:

```ts
const [current_user_id, set_current_user_id] = useState<string>("");
```

In the `useEffect` that fetches challenges, after `if (!authenticated) { ... }`, add a fetch for the current user. Replace the opening of the useEffect body with:

```ts
  useEffect(() => {
    if (auth_loading) return;
    if (!authenticated) {
      set_loading(false);
      return;
    }

    // Fetch current user ID for creator checks
    fetch("/api/hazo_auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.id) set_current_user_id(data.user.id);
      })
      .catch(() => {});

    // Link any pending invitations ...
```

- [ ] **Step 3: Add close toggle handler**

After the state declarations, add:

```ts
  const handle_close_toggle = async (challenge_id: string, current_status: string) => {
    const new_status = current_status === "completed" ? "active" : "completed";
    await fetch(`/api/challenges/${challenge_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: new_status }),
    });
    // Re-fetch challenges to get fresh closed_at and status
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) set_challenges(data);
      })
      .catch(() => {});
  };
```

- [ ] **Step 4: Split challenges into active and closed groups**

Find the `{/* Challenge cards */}` section inside the `authenticated &&` block. Replace:

```tsx
                {/* Challenge cards */}
                <div className="space-y-3 mb-8">
                  {challenges.map((c) => (
                    <ChallengeCard
                      key={c.id}
                      id={c.id}
                      name={c.name}
                      my_wins={c.my_wins}
                      opponent_wins={c.opponent_wins}
                      draws={c.draws}
                      total_games={c.total_games}
                      status={c.status}
                      game_name={c.game_name}
                      player_names={c.participants.map(
                        (p) => user_names[p.user_id] || "Player"
                      )}
                    />
                  ))}
                </div>
```

With:

```tsx
                {/* Challenge cards — active group */}
                {(() => {
                  const active = challenges.filter((c) => c.status !== "completed");
                  const closed = challenges.filter((c) => c.status === "completed");
                  return (
                    <>
                      <div className="space-y-3 mb-8">
                        {active.map((c) => (
                          <ChallengeCard
                            key={c.id}
                            id={c.id}
                            name={c.name}
                            my_wins={c.my_wins}
                            opponent_wins={c.opponent_wins}
                            draws={c.draws}
                            total_games={c.total_games}
                            status={c.status}
                            game_name={c.game_name}
                            player_names={c.participants.map(
                              (p) => user_names[p.user_id] || "Player"
                            )}
                            is_creator={c.created_by === current_user_id}
                            closed_at={c.closed_at}
                            on_close_toggle={() => handle_close_toggle(c.id, c.status)}
                          />
                        ))}
                        {active.length === 0 && challenges.length > 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            All challenges are closed.
                          </p>
                        )}
                      </div>

                      {closed.length > 0 && (
                        <>
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Closed
                          </h3>
                          <div className="space-y-3 mb-8">
                            {closed.map((c) => (
                              <ChallengeCard
                                key={c.id}
                                id={c.id}
                                name={c.name}
                                my_wins={c.my_wins}
                                opponent_wins={c.opponent_wins}
                                draws={c.draws}
                                total_games={c.total_games}
                                status={c.status}
                                game_name={c.game_name}
                                player_names={c.participants.map(
                                  (p) => user_names[p.user_id] || "Player"
                                )}
                                is_creator={c.created_by === current_user_id}
                                closed_at={c.closed_at}
                                on_close_toggle={() => handle_close_toggle(c.id, c.status)}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Go to `http://localhost:3000/challenges`. Close a challenge via the ⋯ menu. The card should move to the "Closed" section with accent border and trophy line. Reopen it — card moves back to active. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/app/challenges/page.tsx
git commit -m "feat: group active/closed challenges and wire close/reopen handler"
```

---

## Task 6: Challenge detail page — freeze gameplay when closed

**Files:**
- Modify: `src/app/challenges/[id]/page.tsx`

- [ ] **Step 1: Hide "Add Game Result" button when closed**

Find the `{/* Floating ADD GAME RESULT button */}` block (around line 366). It's currently:

```tsx
        {/* Floating ADD GAME RESULT button */}
        <div className="bg-primary/[0.03] py-4 -mx-4 md:-mx-6 px-4 md:px-6 rounded-[1rem] flex justify-center -mt-6 relative z-20 mb-6">
          <button
            onClick={() => set_show_add_game(true)}
            ...
          >
            <Plus className="w-5 h-5" />
            Add Game Result
          </button>
        </div>
```

Wrap the entire div in a condition:

```tsx
        {/* Floating ADD GAME RESULT button — hidden when closed */}
        {challenge.status !== "completed" && (
          <div className="bg-primary/[0.03] py-4 -mx-4 md:-mx-6 px-4 md:px-6 rounded-[1rem] flex justify-center -mt-6 relative z-20 mb-6">
            <button
              onClick={() => set_show_add_game(true)}
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-headline font-black text-base shadow-[var(--shadow-soft-lg)] hover:scale-105 transition-all duration-200 border-none cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Game Result
            </button>
          </div>
        )}
```

- [ ] **Step 2: Suppress on_edit and on_delete callbacks when closed**

Find where `<GameHistory>` is rendered (around line 480). It receives `on_delete` and `on_edit`. Replace those two props conditionally:

```tsx
              on_delete={challenge.status !== "completed" ? handle_delete_game : undefined}
              on_edit={challenge.status !== "completed" ? (game) => set_editing_game(game) : undefined}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Close a challenge via the list page, then open its detail. "Add Game Result" button should be gone. Game history entries should have no edit/delete actions. Stop server.

- [ ] **Step 4: Commit**

```bash
git add src/app/challenges/[id]/page.tsx
git commit -m "feat: freeze game mutations on closed challenge detail"
```

---

## Task 7: Edit page — remove broken `paused` status option

**Files:**
- Modify: `src/app/challenges/[id]/edit/page.tsx`

- [ ] **Step 1: Replace the status dropdown options**

Find the `<select>` for status (around line 214):

```tsx
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
```

Replace with:

```tsx
              <option value="active">Active</option>
              <option value="completed">Completed</option>
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/challenges/[id]/edit/page.tsx
git commit -m "fix: remove invalid 'paused' status option from edit page"
```

---

## Task 8: Public challenges list — winner badge

**Files:**
- Modify: `src/app/public-challenges/page.tsx`

- [ ] **Step 1: Import compute_winner**

Add to the imports at the top of the file:

```ts
import { compute_winner } from "@/lib/challenge-winner";
```

Also add `Trophy` and `Scale` to the lucide import:

```ts
import { Trophy, Users, Gamepad2, Scale } from "lucide-react";
```

- [ ] **Step 2: Add winner badge inside the card link**

Find the section where `score_display` is shown in the card (around line 169). After the existing score/game stats, add a winner badge when the challenge is completed. Replace the `<div className="flex flex-wrap items-center gap-x-4...">` section (score stats row) with:

```tsx
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{player_names.join(" vs ")}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Gamepad2 className="w-3.5 h-3.5" />
                          {c.total_games} game{c.total_games !== 1 ? "s" : ""}
                        </span>
                        {c.status === "completed" ? (() => {
                          const wr = compute_winner(
                            c.participants.map((p) => ({
                              name: user_names[p.user_id] || "Player",
                              score: c.scores[p.user_id] || 0,
                            }))
                          );
                          if (wr.kind === "win") return (
                            <span className="flex items-center gap-1 text-accent font-medium">
                              <Trophy className="w-3.5 h-3.5" />
                              {wr.winner_name} won {wr.winner_score}–{wr.loser_score}
                            </span>
                          );
                          if (wr.kind === "tie") return (
                            <span className="flex items-center gap-1">
                              <Scale className="w-3.5 h-3.5" />
                              Tied {wr.score}–{wr.score}
                            </span>
                          );
                          return <span>Closed — no result</span>;
                        })() : (
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            {score_display || "No games yet"}
                          </span>
                        )}
                      </div>
```

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Go to `http://localhost:3000/public-challenges`. Completed challenges should show a `🏆 Alex won 7-5` badge in the stats row. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/app/public-challenges/page.tsx
git commit -m "feat: show winner badge on completed public challenge cards"
```

---

## Task 9: Public challenge detail — closed banner + FINAL hero

**Files:**
- Modify: `src/app/public-challenges/[id]/public-challenge-detail-client.tsx`

- [ ] **Step 1: Add imports**

Add to the imports at the top:

```ts
import { compute_winner } from "@/lib/challenge-winner";
import { Trophy, Scale } from "lucide-react";
```

- [ ] **Step 2: Compute winner inside the component**

After the existing variable declarations (`const p1_winning = player1_score > player2_score;`), add:

```ts
  const is_closed = challenge.status === "completed";

  const winner_result = compute_winner([
    { name: p1_name, score: player1_score },
    { name: p2_name, score: player2_score },
  ]);
```

- [ ] **Step 3: Add closed banner above the hero**

Find the `{/* Dark Hero Section */}` block. Insert this banner immediately above it (after the top bar close tag):

```tsx
        {/* Closed banner */}
        {is_closed && (
          <div className="mx-4 md:mx-6 mb-4 rounded-[1rem] bg-accent/10 border border-accent/20 px-5 py-4">
            <div className="flex items-center gap-3">
              {winner_result.kind === "win" && (
                <>
                  <Trophy className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-accent font-semibold text-sm">
                      {winner_result.winner_name} won {winner_result.winner_score}–{winner_result.loser_score}
                    </p>
                    {challenge.closed_at && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This challenge was closed{" "}
                        {(() => {
                          const diff = Date.now() - new Date(challenge.closed_at!).getTime();
                          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                          if (days === 0) return "today";
                          if (days === 1) return "yesterday";
                          return `${days} days ago`;
                        })()}
                      </p>
                    )}
                  </div>
                </>
              )}
              {winner_result.kind === "tie" && (
                <>
                  <Scale className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground font-semibold text-sm">
                      Tied {winner_result.score}–{winner_result.score}
                    </p>
                    {challenge.closed_at && (
                      <p className="text-xs text-muted-foreground mt-0.5">This challenge is closed</p>
                    )}
                  </div>
                </>
              )}
              {winner_result.kind === "no_result" && (
                <p className="text-muted-foreground text-sm font-semibold">
                  This challenge is closed — no games were played
                </p>
              )}
            </div>
          </div>
        )}
```

- [ ] **Step 4: Add FINAL stamp and dim/highlight hero when closed**

Inside the Dark Hero Section, find the `<div className="relative z-10 px-6 md:px-12 py-10 md:py-14">` block. Add a FINAL stamp overlay at the top when closed, right after the opening div:

```tsx
            {/* FINAL stamp */}
            {is_closed && (
              <div className="flex justify-center mb-4">
                <span className="text-xs font-headline font-black uppercase tracking-[0.3em] text-primary-foreground/40 border border-primary-foreground/20 px-3 py-1 rounded-full">
                  Final
                </span>
              </div>
            )}
```

- [ ] **Step 5: Highlight winner / dim loser score in the hero**

In the hero, the score spans already use `p1_winning` to conditionally dim. Extend this to use `winner_result` when closed. Find the score spans:

```tsx
                <span className={`text-6xl md:text-8xl lg:text-9xl font-headline font-black ${p1_winning ? "text-primary-foreground" : "text-primary-foreground/50"}`}>
                  {player1_score}
                </span>
```

And:

```tsx
                <span className={`text-6xl md:text-8xl lg:text-9xl font-headline font-black ${!p1_winning && player2_score > player1_score ? "text-primary-foreground" : "text-primary-foreground/50"}`}>
                  {player2_score}
                </span>
```

Replace with:

```tsx
                <span className={`text-6xl md:text-8xl lg:text-9xl font-headline font-black ${
                  is_closed && winner_result.kind === "win"
                    ? winner_result.winner_name === p1_name
                      ? "text-primary-foreground"
                      : "text-primary-foreground/30"
                    : p1_winning
                    ? "text-primary-foreground"
                    : "text-primary-foreground/50"
                }`}>
                  {player1_score}
                </span>
```

```tsx
                <span className={`text-6xl md:text-8xl lg:text-9xl font-headline font-black ${
                  is_closed && winner_result.kind === "win"
                    ? winner_result.winner_name === p2_name
                      ? "text-primary-foreground"
                      : "text-primary-foreground/30"
                    : !p1_winning && player2_score > player1_score
                    ? "text-primary-foreground"
                    : "text-primary-foreground/50"
                }`}>
                  {player2_score}
                </span>
```

- [ ] **Step 6: Add `closed_at` to ChallengeData type**

The `ChallengeData` type in this file needs `closed_at`:

```ts
type ChallengeData = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  status: string;
  closed_at?: string | null;
  gif_url: string | null;
  participants: { user_id: string; role: string }[];
  games: { ... };
  scores: Record<string, number>;
  draws: number;
};
```

- [ ] **Step 7: Verify build**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 8: Verify in browser**

```bash
npm run dev
```

Go to a public challenge that is completed. Should see:
- Amber banner with trophy + winner name + "closed N days ago"
- "FINAL" pill in the hero
- Winner score bright, loser score heavily dimmed (`/30` opacity)

- [ ] **Step 9: Commit**

```bash
git add src/app/public-challenges/[id]/public-challenge-detail-client.tsx
git commit -m "feat: add closed banner and FINAL hero treatment to public challenge detail"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Close action in My Challenges view (Task 4 + 5)
- ✅ Reopen (undo close) — ellipsis menu "Reopen challenge" (Task 4)
- ✅ Creator-only menu (Task 4 — `is_creator` prop)
- ✅ Visual: accent border, trophy+winner+score line, Closed pill, "Closed N days ago" (Task 4)
- ✅ Active/closed grouping in list (Task 5)
- ✅ Freeze game adds/edits when closed (Task 6)
- ✅ Remove broken `paused` option (Task 7)
- ✅ Winner badge on public list (Task 8)
- ✅ Banner + FINAL stamp + dimming on public detail (Task 9)
- ✅ Tie case ("Tied N–N" + Scale icon) covered in Tasks 3/4/8/9
- ✅ No-games case ("Closed — no result") covered in Tasks 3/4/8/9
- ✅ `closed_at` column + timestamp side-effect (Tasks 1 + 2)
- ✅ "Closed N days ago" on card and banner (Tasks 4 + 9)

**Placeholder scan:** All code blocks are complete. No TBDs.

**Type consistency:** `WinnerResult` type defined in Task 3 used identically in Tasks 4, 8, 9. `closed_at` prop added to `ChallengeCard` in Task 4, passed from page in Task 5, added to `ChallengeData` in Task 9.
