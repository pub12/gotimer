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
