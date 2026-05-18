"use client";

import React, { useState } from "react";
import { NameListInput } from "./name-list-input";
import { NameWheel } from "./name-wheel";

/**
 * NamePicker — combines a NameListInput + NameWheel into one tool widget.
 * Used by the /classroom/name-picker* leaf routes.
 */

interface NamePickerProps {
  slug?: string;
  initial_names?: string;
  /** When true, removes the picked name from the wheel after each spin. */
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

  return (
    <div className="w-full max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div>
        <NameListInput
          slug={slug}
          initial={initial_names}
          on_change={(n) => set_names(n)}
          rows={10}
        />
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={remove_after_pick}
              onChange={(e) => set_remove_after_pick(e.target.checked)}
              className="cursor-pointer"
            />
            Remove name after spin
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            Useful for cold-calling — each student is picked at most once until
            you re-paste the list.
          </p>
        </div>
      </div>

      <div>
        <NameWheel names={names} remove_after_pick={remove_after_pick} />
      </div>
    </div>
  );
}
