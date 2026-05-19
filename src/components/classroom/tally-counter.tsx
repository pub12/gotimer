"use client";

import React, { useCallback, useEffect, useState } from "react";

/**
 * Single + multi-counter tally for classrooms.
 *
 * Single mode: one big counter with +/- and reset.
 * Multi mode:  paste labels (one per line) → render N counters in a grid.
 *
 * State persists in localStorage under "classroom:tally:<slug>". The label set
 * has its own key so changing the labels doesn't lose unrelated tally state.
 */

const STORAGE_PREFIX = "classroom:tally:";

type Mode = "single" | "multi";

interface PersistedState {
  mode: Mode;
  single: number;
  labels: string;
  values: Record<string, number>;
}

function load(slug: string): PersistedState {
  if (typeof window === "undefined")
    return { mode: "single", single: 0, labels: "Yes\nNo", values: {} };
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    /* ignore */
  }
  return { mode: "single", single: 0, labels: "Yes\nNo", values: {} };
}

function save(slug: string, state: PersistedState) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function parse_labels(raw: string): string[] {
  const parts = raw
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

interface TallyCounterProps {
  slug?: string;
}

export function TallyCounter({ slug = "default" }: TallyCounterProps) {
  const [hydrated, set_hydrated] = useState(false);
  const [mode, set_mode] = useState<Mode>("single");
  const [single, set_single] = useState(0);
  const [labels_raw, set_labels_raw] = useState("Yes\nNo");
  const [values, set_values] = useState<Record<string, number>>({});
  // Labels input is collapsed once the user has set labels and hit the counters.
  const [editing_labels, set_editing_labels] = useState(true);

  useEffect(() => {
    const s = load(slug);
    set_mode(s.mode);
    set_single(s.single);
    set_labels_raw(s.labels);
    set_values(s.values);
    set_hydrated(true);
    // If labels are already configured, start with the input collapsed.
    if (s.labels.trim() && s.labels !== "Yes\nNo") set_editing_labels(false);
    else if (parse_labels(s.labels).length > 0) set_editing_labels(false);
  }, [slug]);

  useEffect(() => {
    if (!hydrated) return;
    save(slug, { mode, single, labels: labels_raw, values });
  }, [hydrated, slug, mode, single, labels_raw, values]);

  const labels = parse_labels(labels_raw);

  const bump = useCallback((label: string, delta: number) => {
    set_values((prev) => ({
      ...prev,
      [label]: Math.max(0, (prev[label] ?? 0) + delta),
    }));
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-center gap-2 mb-6">
        {(["single", "multi"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => set_mode(m)}
            className={`px-5 py-2 rounded-full font-headline font-bold uppercase tracking-widest text-xs transition-all duration-200 cursor-pointer border ${
              mode === m
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "bg-surface-container-low text-muted-foreground border-surface-container-high hover:text-foreground"
            }`}
          >
            {m === "single" ? "Single counter" : "Multiple counters"}
          </button>
        ))}
      </div>

      {mode === "single" && (
        <div className="flex flex-col items-center bg-surface-container-low rounded-2xl p-8 shadow-[var(--shadow-soft)]">
          <p
            className="font-headline font-black tabular-nums text-foreground"
            style={{ fontSize: "clamp(4rem, 18vw, 10rem)", lineHeight: 1 }}
          >
            {single}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => set_single((v) => Math.max(0, v - 1))}
              className="w-16 h-16 rounded-full bg-surface text-foreground font-headline font-black text-3xl border border-surface-container-high shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px cursor-pointer"
              aria-label="Subtract one"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => set_single(0)}
              className="px-5 py-3 rounded-full bg-surface text-muted-foreground hover:text-foreground font-headline font-bold uppercase tracking-widest text-xs border border-surface-container-high cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => set_single((v) => v + 1)}
              className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground font-headline font-black text-3xl shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px cursor-pointer border-none"
              aria-label="Add one"
            >
              +
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-6 text-center max-w-md">
            Tap + and − to count. Press Reset to start over. Your count is saved
            in this browser even if you close the tab.
          </p>
        </div>
      )}

      {mode === "multi" && (
        <div className="space-y-4">
          {/* Counters are always the hero */}
          {labels.length === 0 ? (
            <div className="rounded-2xl bg-surface-container-low p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Add category labels below to start tallying.
              </p>
              <button
                type="button"
                onClick={() => set_editing_labels(true)}
                className="px-5 py-2 rounded-full bg-secondary text-secondary-foreground font-headline font-bold uppercase tracking-widest text-xs cursor-pointer border-none shadow-[var(--shadow-soft)]"
              >
                Add labels
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {labels.map((lbl) => {
                const v = values[lbl] ?? 0;
                return (
                  <div
                    key={lbl}
                    className="bg-surface-container-low rounded-2xl p-5 shadow-[var(--shadow-soft)] flex flex-col items-center"
                  >
                    <p className="text-sm font-headline font-semibold text-muted-foreground truncate w-full text-center mb-1">
                      {lbl}
                    </p>
                    <p
                      className="font-headline font-black tabular-nums text-foreground my-2"
                      style={{ fontSize: "clamp(3rem, 10vw, 5rem)", lineHeight: 1 }}
                    >
                      {v}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => bump(lbl, -1)}
                        className="w-12 h-12 rounded-full bg-surface text-foreground font-headline font-black text-2xl border border-surface-container-high cursor-pointer shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px transition-all duration-150"
                        aria-label={`Subtract one from ${lbl}`}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() => bump(lbl, 1)}
                        className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-headline font-black text-2xl cursor-pointer border-none shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px transition-all duration-150"
                        aria-label={`Add one to ${lbl}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Compact label management strip */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => set_editing_labels((v) => !v)}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer bg-transparent border-none p-0"
            >
              {editing_labels ? "Hide label editor" : `Edit labels (${labels.length})`}
            </button>
            {labels.length > 0 && (
              <button
                type="button"
                onClick={() => set_values({})}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer bg-transparent border-none p-0"
              >
                Reset all
              </button>
            )}
          </div>

          {/* Collapsible label editor */}
          {editing_labels && (
            <div>
              <label
                htmlFor="tally-labels"
                className="font-headline font-semibold text-xs text-muted-foreground uppercase tracking-wide block mb-2"
              >
                Labels — one per line
              </label>
              <textarea
                id="tally-labels"
                value={labels_raw}
                onChange={(e) => set_labels_raw(e.target.value)}
                rows={4}
                placeholder={"Yes\nNo\nMaybe"}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-foreground placeholder:text-muted-foreground text-sm border border-surface-container-high focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all duration-200 resize-y"
              />
              {labels.length > 0 && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => set_editing_labels(false)}
                    className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground font-headline font-bold uppercase tracking-widest text-xs cursor-pointer border-none"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
