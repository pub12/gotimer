"use client";

import React, { useEffect, useState } from "react";

/**
 * Shared textarea / paste-CSV name list input with localStorage persistence.
 * Stores under "classroom:names:<slug>" so teachers can keep a class list
 * across sessions without an account. Returns the parsed string[] via
 * the on_change callback.
 */

const STORAGE_PREFIX = "classroom:names:";

export function parse_names(raw: string): string[] {
  // Accept newline OR comma separated; trim, dedupe, drop empties.
  const parts = raw
    .split(/[\n,]/)
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

interface NameListInputProps {
  slug?: string;
  initial?: string;
  on_change: (names: string[], raw: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
}

export function NameListInput({
  slug = "default",
  initial = "",
  on_change,
  placeholder = "Paste names — one per line or comma separated",
  label = "Class list",
  rows = 8,
}: NameListInputProps) {
  const storage_key = `${STORAGE_PREFIX}${slug}`;
  const [raw, set_raw] = useState<string>(initial);
  const [hydrated, set_hydrated] = useState(false);

  // Hydrate from localStorage on mount only.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(storage_key);
      if (saved !== null && saved.length > 0) {
        set_raw(saved);
        on_change(parse_names(saved), saved);
      } else if (initial.length > 0) {
        on_change(parse_names(initial), initial);
      }
    } catch {
      /* ignore quota / privacy mode */
    }
    set_hydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist + notify on change after hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storage_key, raw);
    } catch {
      /* ignore */
    }
    on_change(parse_names(raw), raw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw, hydrated]);

  function handle_clear() {
    set_raw("");
  }

  const count = parse_names(raw).length;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <label
          htmlFor={`name-list-${slug}`}
          className="font-headline font-semibold text-sm text-foreground"
        >
          {label}
        </label>
        <span className="text-xs text-muted-foreground">
          {count} {count === 1 ? "name" : "names"}
        </span>
      </div>
      <textarea
        id={`name-list-${slug}`}
        value={raw}
        onChange={(e) => set_raw(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-foreground placeholder:text-muted-foreground text-sm border border-surface-container-high focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all duration-200 resize-y"
      />
      <div className="flex justify-between mt-2">
        <p className="text-xs text-muted-foreground">
          Saved to this browser. No account, no upload, no signup.
        </p>
        {raw.length > 0 && (
          <button
            type="button"
            onClick={handle_clear}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer bg-transparent border-none p-0"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
