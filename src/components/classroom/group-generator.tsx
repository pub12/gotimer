"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NameListInput } from "./name-list-input";
import {
  GroupMode,
  ShuffleResult,
  collect_pairs,
  shuffle_into_groups,
} from "./group-shuffler";

/**
 * Group generator UI — name list input + mode selector + seed + result cards.
 * Persists previous shuffle pairings in localStorage so the next shuffle can
 * bias against repeating them.
 */

const HISTORY_KEY_PREFIX = "classroom:group-history:";

interface GroupGeneratorProps {
  slug?: string;
  /** Default mode at first render. */
  default_mode?: GroupMode;
  /** Default target value (group count or group size). */
  default_target?: number;
  /** Lock the target to default (used by /teams-of-3 and /teams-of-4 leaves). */
  lock_target?: boolean;
}

function load_history(slug: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(`${HISTORY_KEY_PREFIX}${slug}`);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function save_history(slug: string, pairs: string[]) {
  try {
    window.localStorage.setItem(
      `${HISTORY_KEY_PREFIX}${slug}`,
      JSON.stringify(pairs),
    );
  } catch {
    /* ignore */
  }
}

export function GroupGenerator({
  slug = "default",
  default_mode = "by_size",
  default_target = 4,
  lock_target = false,
}: GroupGeneratorProps) {
  const [names, set_names] = useState<string[]>([]);
  const [mode, set_mode] = useState<GroupMode>(default_mode);
  const [target, set_target] = useState<number>(default_target);
  const [seed, set_seed] = useState<string>("");
  const [avoid_prev, set_avoid_prev] = useState<boolean>(true);
  const [result, set_result] = useState<ShuffleResult | null>(null);
  const [copied, set_copied] = useState(false);

  const history = useMemo(() => load_history(slug), [slug]);

  const handle_shuffle = useCallback(() => {
    if (names.length === 0) return;
    const res = shuffle_into_groups({
      names,
      mode,
      target,
      seed: seed.length > 0 ? seed : undefined,
      avoid_pairs: avoid_prev ? history : undefined,
    });
    set_result(res);
    set_copied(false);
    if (avoid_prev) {
      save_history(slug, collect_pairs(res.groups));
    }
  }, [names, mode, target, seed, avoid_prev, history, slug]);

  const handle_copy = useCallback(async () => {
    if (!result) return;
    const text = result.groups
      .map((g, i) => `Group ${i + 1}: ${g.join(", ")}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      set_copied(true);
      window.setTimeout(() => set_copied(false), 1500);
    } catch {
      /* clipboard may be unavailable in some contexts */
    }
  }, [result]);

  useEffect(() => {
    if (lock_target) set_target(default_target);
  }, [lock_target, default_target]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <NameListInput
        slug={slug}
        on_change={(n) => set_names(n)}
        placeholder="Paste your class list — one name per line"
        label="Names"
        rows={6}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!lock_target && (
          <div>
            <label className="font-headline font-semibold text-sm text-foreground block mb-2">
              Mode
            </label>
            <div className="flex gap-1.5">
              {(["by_size", "by_count"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set_mode(m)}
                  className={`flex-1 px-3 py-2 rounded-xl font-headline font-bold uppercase tracking-widest text-[0.65rem] transition-all duration-200 cursor-pointer border ${
                    mode === m
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-surface-container-low text-muted-foreground border-surface-container-high hover:text-foreground"
                  }`}
                >
                  {m === "by_size" ? "Groups of K" : "N groups"}
                </button>
              ))}
            </div>
          </div>
        )}

        {!lock_target && (
          <div>
            <label className="font-headline font-semibold text-sm text-foreground block mb-2">
              {mode === "by_size" ? "Students per group" : "Number of groups"}
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={target}
              onChange={(e) =>
                set_target(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-foreground text-sm border border-surface-container-high focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all duration-200"
            />
          </div>
        )}

        <div className={lock_target ? "md:col-span-3" : ""}>
          <label className="font-headline font-semibold text-sm text-foreground block mb-2">
            Seed (optional)
          </label>
          <input
            type="text"
            value={seed}
            onChange={(e) => set_seed(e.target.value)}
            placeholder="e.g. period-3-fri"
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-foreground placeholder:text-muted-foreground text-sm border border-surface-container-high focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all duration-200"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Same seed + same names = same groups. Leave blank for random.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={avoid_prev}
            onChange={(e) => set_avoid_prev(e.target.checked)}
            className="cursor-pointer"
          />
          Avoid repeating last week&apos;s pairs
        </label>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={handle_shuffle}
          disabled={names.length === 0}
          className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-headline font-black uppercase tracking-widest text-sm shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer border-none"
        >
          {result ? "Shuffle again" : "Make groups"}
        </button>
        {result && (
          <button
            type="button"
            onClick={handle_copy}
            className="px-5 py-3 rounded-full bg-surface-container-low text-muted-foreground hover:text-foreground font-headline font-bold uppercase tracking-widest text-xs border border-surface-container-high transition-all duration-200 cursor-pointer"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {result && result.groups.length > 0 && (
        <div>
          {result.repeat_count > 0 && (
            <p className="text-xs text-muted-foreground mb-3 text-center">
              Couldn&apos;t avoid every prior pair — {result.repeat_count} repeats.
              Try more students per group, or clear the history.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.groups.map((g, i) => (
              <div
                key={`group-${i}`}
                className="bg-surface-container-low rounded-2xl p-4 shadow-[var(--shadow-soft)]"
              >
                <p className="font-headline font-black uppercase tracking-widest text-[0.7rem] text-secondary">
                  Group {i + 1}
                </p>
                <ul className="mt-2 space-y-1">
                  {g.map((name) => (
                    <li
                      key={name}
                      className="text-foreground text-sm font-medium"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
