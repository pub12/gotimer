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
