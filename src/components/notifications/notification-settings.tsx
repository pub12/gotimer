"use client";

import React, { useState, useEffect, useCallback } from "react";
import { use_hazo_auth } from "hazo_auth/client";

interface NotificationPreference {
  id: string;
  channel: string;
  notify_before_completion: number;
  notify_on_step_change: number;
  notify_on_agitation: number;
  notify_on_complete: number;
}

interface NotificationSettingsProps {
  timer_id?: string;
}

const BEFORE_OPTIONS = [
  { value: 60, label: "1 minute" },
  { value: 120, label: "2 minutes" },
  { value: 300, label: "5 minutes" },
  { value: 600, label: "10 minutes" },
];

const CHANNELS = [
  { value: "push", label: "Push" },
  { value: "telegram", label: "Telegram" },
  { value: "email", label: "Email" },
] as const;

export function NotificationSettings({ timer_id }: NotificationSettingsProps) {
  const { authenticated } = use_hazo_auth({});
  const [selected_channels, set_selected_channels] = useState<Set<string>>(new Set(["push"]));
  const [notify_before, set_notify_before] = useState(120);
  const [on_step_change, set_on_step_change] = useState(false);
  const [on_agitation, set_on_agitation] = useState(false);
  const [on_complete, set_on_complete] = useState(true);
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [loading, set_loading] = useState(true);

  const fetch_preferences = useCallback(async () => {
    try {
      const params = timer_id ? `?timer_id=${timer_id}` : "";
      const res = await fetch(`/api/notifications/preferences${params}`);
      if (!res.ok) return;
      const prefs: NotificationPreference[] = await res.json();

      if (prefs.length > 0) {
        const channels = new Set(prefs.map((p) => p.channel));
        set_selected_channels(channels);

        // Use the first preference for shared settings
        const first = prefs[0];
        set_notify_before(first.notify_before_completion);
        set_on_step_change(first.notify_on_step_change === 1);
        set_on_agitation(first.notify_on_agitation === 1);
        set_on_complete(first.notify_on_complete === 1);
      }
    } catch {
      // Ignore fetch errors
    } finally {
      set_loading(false);
    }
  }, [timer_id]);

  useEffect(() => {
    if (authenticated) {
      fetch_preferences();
    } else {
      set_loading(false);
    }
  }, [authenticated, fetch_preferences]);

  const toggle_channel = (channel: string) => {
    set_selected_channels((prev) => {
      const next = new Set(prev);
      if (next.has(channel)) {
        next.delete(channel);
      } else {
        next.add(channel);
      }
      return next;
    });
  };

  const save = async () => {
    set_saving(true);
    set_saved(false);

    try {
      const channels = Array.from(selected_channels);
      if (channels.length === 0) channels.push("push");

      await Promise.all(
        channels.map((channel) =>
          fetch("/api/notifications/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              timer_id: timer_id || null,
              channel,
              notify_before_completion: notify_before,
              notify_on_step_change: on_step_change,
              notify_on_agitation: on_agitation,
              notify_on_complete: on_complete,
            }),
          })
        )
      );

      set_saved(true);
      setTimeout(() => set_saved(false), 2000);
    } catch {
      // Ignore save errors
    } finally {
      set_saving(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="rounded-xl bg-surface-container p-4 text-center text-sm text-muted-foreground">
        Sign in to enable notifications
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-surface-container p-4 text-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface-container p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Notification Settings</h3>

      {/* Channel selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Channels</label>
        <div className="flex gap-2">
          {CHANNELS.map((ch) => (
            <button
              key={ch.value}
              onClick={() => toggle_channel(ch.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selected_channels.has(ch.value)
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-container-high text-muted-foreground hover:bg-surface-container-highest"
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notify before completion */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Notify before completion
        </label>
        <select
          value={notify_before}
          onChange={(e) => set_notify_before(Number(e.target.value))}
          className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        >
          {BEFORE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <ToggleRow
          label="Notify on step change"
          checked={on_step_change}
          on_change={set_on_step_change}
        />
        <ToggleRow
          label="Notify on agitation"
          checked={on_agitation}
          on_change={set_on_agitation}
        />
        <ToggleRow
          label="Notify on complete"
          checked={on_complete}
          on_change={set_on_complete}
        />
      </div>

      {/* Save button */}
      <button
        onClick={save}
        disabled={saving}
        className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
          saved
            ? "bg-emerald-500 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        } disabled:opacity-50`}
      >
        {saving ? "Saving..." : saved ? "Saved!" : "Save"}
      </button>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  on_change,
}: {
  label: string;
  checked: boolean;
  on_change: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-xs text-foreground">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => on_change(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-surface-container-highest"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
