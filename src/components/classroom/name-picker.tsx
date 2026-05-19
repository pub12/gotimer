"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NameListInput } from "./name-list-input";
import { NameWheel } from "./name-wheel";

/**
 * NamePicker — combines a NameListInput + NameWheel.
 *
 * The class list is collapsible so the wheel can take centre stage once names
 * are entered. The list starts expanded (no names) and collapses automatically
 * the first time the user adds names.
 */

interface NamePickerProps {
  slug?: string;
  initial_names?: string;
  remove_after_pick_default?: boolean;
}

export function NamePicker({
  slug = "default",
  initial_names = "",
  remove_after_pick_default = true,
}: NamePickerProps) {
  const [names, set_names] = useState<string[]>([]);
  const [remove_after_pick, set_remove_after_pick] = useState(
    remove_after_pick_default,
  );
  // List starts open; collapses automatically once names are populated.
  const [list_open, set_list_open] = useState(true);
  const [did_auto_collapse, set_did_auto_collapse] = useState(false);

  function handle_name_change(n: string[], _raw: string) {
    set_names(n);
    // Auto-collapse the first time names appear so the wheel gets focus.
    if (n.length > 0 && !did_auto_collapse) {
      set_list_open(false);
      set_did_auto_collapse(true);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* ── Class list accordion ── */}
      <div className="rounded-2xl bg-surface-container-low shadow-[var(--shadow-soft)] overflow-hidden">
        <button
          type="button"
          onClick={() => set_list_open((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-left cursor-pointer bg-transparent border-none"
          aria-expanded={list_open}
        >
          <span className="font-headline font-semibold text-sm text-foreground">
            Class list
            {names.length > 0 && (
              <span className="ml-2 text-muted-foreground font-normal">
                — {names.length} name{names.length !== 1 ? "s" : ""}
              </span>
            )}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              list_open ? "rotate-180" : ""
            }`}
          />
        </button>

        {list_open && (
          <div className="px-5 pb-5 space-y-3 border-t border-surface-container-high">
            <div className="pt-4">
              <NameListInput
                slug={slug}
                initial={initial_names}
                on_change={handle_name_change}
                rows={6}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={remove_after_pick}
                onChange={(e) => set_remove_after_pick(e.target.checked)}
                className="cursor-pointer"
              />
              Remove name after spin
            </label>
            <p className="text-xs text-muted-foreground">
              Useful for cold-calling — each student is picked at most once
              until you re-paste the list.
            </p>
          </div>
        )}
      </div>

      {/* ── Wheel — expands when list is collapsed ── */}
      <div
        className={`flex justify-center transition-all duration-300 ${
          list_open ? "" : "pt-2"
        }`}
      >
        <div className={list_open ? "w-full max-w-xs" : "w-full max-w-sm"}>
          <NameWheel names={names} remove_after_pick={remove_after_pick} />
        </div>
      </div>
    </div>
  );
}
