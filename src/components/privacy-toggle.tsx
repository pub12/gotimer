"use client";

import { useState, useEffect } from "react";

export function PrivacyToggle() {
  const [show_pic, set_show_pic] = useState(false);
  const [loading, set_loading] = useState(true);
  const [saving, set_saving] = useState(false);

  useEffect(() => {
    fetch("/api/user-preferences")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) set_show_pic(data.show_public_profile_pic);
      })
      .finally(() => set_loading(false));
  }, []);

  const toggle = async () => {
    const new_val = !show_pic;
    set_show_pic(new_val);
    set_saving(true);
    try {
      await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show_public_profile_pic: new_val }),
      });
    } catch {
      set_show_pic(!new_val);
    } finally {
      set_saving(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-8">
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Privacy</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium">
              Show my profile picture on public challenges
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={show_pic}
              onClick={toggle}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                show_pic ? "bg-primary" : "bg-muted"
              } ${saving ? "opacity-50" : ""}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                  show_pic ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>
        )}
      </div>
    </div>
  );
}
