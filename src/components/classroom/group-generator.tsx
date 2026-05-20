"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NameListInput } from "./name-list-input";
import { ExclusionBuilder } from "./exclusion-builder";
import {
  GroupMode,
  ShuffleResult,
  collect_pairs,
  shuffle_into_groups,
} from "./group-shuffler";
import {
  SavedGroupSetsMenu,
  type SavedGroupSetView,
} from "./saved-group-sets-menu";

/**
 * Group generator UI — name list input + mode selector + seed + result cards.
 * Persists previous shuffle pairings in localStorage so the next shuffle can
 * bias against repeating them.
 */

const HISTORY_KEY_PREFIX = "classroom:group-history:";

const EXCLUSIONS_KEY_PREFIX = "classroom:exclusions:";

function load_exclusions(slug: string): string[][] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(`${EXCLUSIONS_KEY_PREFIX}${slug}`);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
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
  // Setup panel collapses after the first shuffle so results take centre stage.
  const [show_setup, set_show_setup] = useState(true);

  const [exclusions, set_exclusions] = useState<string[][]>([]);

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

  const history = useMemo(() => load_history(slug), [slug]);

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
      set_show_setup(true);
    }
  }, [names, mode, target, seed, avoid_prev, history, slug, exclusions]);

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
    <div className="w-full max-w-3xl mx-auto space-y-4">

      {/* ── Groups display (hero when results exist) ── */}
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
        <div>
          {result.repeat_count > 0 && (
            <p className="text-xs text-muted-foreground mb-3 text-center">
              Couldn&apos;t avoid every prior pair — {result.repeat_count} repeats.
              Try more students per group, or clear the history.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {result.groups.map((g, i) => (
              <div
                key={`group-${i}`}
                className="bg-surface-container-low rounded-2xl p-5 shadow-[var(--shadow-soft)]"
              >
                <p className="font-headline font-black uppercase tracking-widest text-xs text-secondary mb-2">
                  Group {i + 1}
                </p>
                <ul className="space-y-1.5">
                  {g.map((name) => (
                    <li key={name} className="text-foreground text-base font-semibold">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Action bar when results are shown */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handle_shuffle}
              disabled={names.length === 0}
              className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-headline font-black uppercase tracking-widest text-sm shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer border-none"
            >
              Shuffle again
            </button>
            <button
              type="button"
              onClick={handle_copy}
              className="px-5 py-3 rounded-full bg-surface-container-low text-muted-foreground hover:text-foreground font-headline font-bold uppercase tracking-widest text-xs border border-surface-container-high transition-all duration-200 cursor-pointer"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => set_show_setup((v) => !v)}
              className="px-5 py-3 rounded-full bg-surface-container-low text-muted-foreground hover:text-foreground font-headline font-bold uppercase tracking-widest text-xs border border-surface-container-high transition-all duration-200 cursor-pointer"
            >
              {show_setup ? "Hide setup" : `Edit (${names.length} names)`}
            </button>
            <SavedGroupSetsMenu
              slug={slug}
              current_groups={result.groups}
              current_setup={current_setup}
              on_open={handle_open_saved}
            />
          </div>
        </div>
      )}

      {/* ── Setup panel (collapsible after first shuffle) ── */}
      {show_setup && (
        <div className="space-y-5 rounded-2xl bg-surface-container-low p-5 shadow-[var(--shadow-soft)]">
          <NameListInput
            slug={slug}
            on_change={(n) => set_names(n)}
            placeholder="Paste your class list — one name per line"
            label="Names"
            rows={5}
          />

          <ExclusionBuilder
            names={names}
            exclusions={exclusions}
            on_change={update_exclusions}
          />

          {!lock_target && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-headline font-semibold text-xs text-muted-foreground uppercase tracking-wide block mb-2">
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
                          : "bg-surface text-muted-foreground border-surface-container-high hover:text-foreground"
                      }`}
                    >
                      {m === "by_size" ? "Groups of K" : "N groups"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-headline font-semibold text-xs text-muted-foreground uppercase tracking-wide block mb-2">
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
                  className="w-full px-3 py-2 rounded-xl bg-surface text-foreground text-sm border border-surface-container-high focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all duration-200"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={avoid_prev}
                onChange={(e) => set_avoid_prev(e.target.checked)}
                className="cursor-pointer"
              />
              Avoid repeating last week&apos;s pairs
            </label>
            <button
              type="button"
              onClick={handle_shuffle}
              disabled={names.length === 0}
              className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-headline font-black uppercase tracking-widest text-sm shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer border-none"
            >
              {result ? "Shuffle again" : "Make groups"}
            </button>
          </div>
        </div>
      )}

      {/* First-run CTA when no results yet and setup is shown elsewhere */}
      {!result && !show_setup && (
        <div className="text-center py-8">
          <button
            type="button"
            onClick={() => set_show_setup(true)}
            className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-headline font-black uppercase tracking-widest text-sm shadow-[var(--shadow-soft)] hover:shadow-md cursor-pointer border-none"
          >
            Set up groups
          </button>
        </div>
      )}
    </div>
  );
}
