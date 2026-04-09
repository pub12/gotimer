"use client";

import React, { useState, useEffect } from "react";

type HistoryEvent = {
  id: string;
  page_slug: string;
  action: "publish" | "unpublish";
  timestamp: string;
  admin_user_id: string;
};

type Props = {
  page_slug: string;
  expanded?: boolean;
};

function format_date(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PublishHistoryTimeline({ page_slug, expanded = false }: Props) {
  const [open, set_open] = useState(expanded);
  const [events, set_events] = useState<HistoryEvent[]>([]);
  const [loading, set_loading] = useState(false);
  const [loaded, set_loaded] = useState(false);

  useEffect(() => {
    if (open && !loaded) {
      set_loading(true);
      fetch(`/api/admin/publish-history?slug=${encodeURIComponent(page_slug)}`)
        .then((r) => r.json())
        .then((data) => {
          set_events(Array.isArray(data) ? data : data.events ?? []);
          set_loaded(true);
        })
        .catch(() => {})
        .finally(() => set_loading(false));
    }
  }, [open, loaded, page_slug]);

  return (
    <div className="text-sm">
      <button
        onClick={() => set_open((v) => !v)}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium bg-transparent border-none cursor-pointer p-0"
      >
        <span>{open ? "▼" : "▶"}</span>
        <span>{open ? "Hide history" : "Show history"}</span>
      </button>

      {open && (
        <div className="mt-2 pl-3 border-l-2 border-gray-200 space-y-2">
          {loading && (
            <p className="text-xs text-gray-400">Loading...</p>
          )}
          {!loading && events.length === 0 && (
            <p className="text-xs text-gray-400">No history yet.</p>
          )}
          {!loading &&
            events.map((ev) => (
              <div key={ev.id} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 inline-block w-2 h-2 rounded-full shrink-0 ${
                    ev.action === "publish" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-xs text-gray-700">
                  <span className="font-medium capitalize">{ev.action}ed</span>{" "}
                  on {format_date(ev.timestamp)}{" "}
                  <span className="text-gray-400">by {ev.admin_user_id}</span>
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
