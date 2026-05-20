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
