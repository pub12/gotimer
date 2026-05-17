"use client";

import React, { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";

type Permission = "default" | "granted" | "denied" | "unsupported";

function read_permission(): Permission {
  if (typeof window === "undefined") return "default";
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission as Permission;
}

interface NotificationOptInProps {
  on_change?: (permission: Permission) => void;
}

export function NotificationOptIn({ on_change }: NotificationOptInProps) {
  const [permission, set_permission] = useState<Permission>("default");
  const [busy, set_busy] = useState(false);

  useEffect(() => {
    const initial = read_permission();
    set_permission(initial);
    on_change?.(initial);
  }, [on_change]);

  async function request() {
    if (permission !== "default") return;
    set_busy(true);
    try {
      const result = (await Notification.requestPermission()) as Permission;
      set_permission(result);
      on_change?.(result);
    } finally {
      set_busy(false);
    }
  }

  if (permission === "unsupported") {
    return (
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <BellOff className="size-3.5" />
        Your browser does not support notifications. The audio chime still works.
      </p>
    );
  }

  if (permission === "granted") {
    return (
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <BellRing className="size-3.5 text-secondary" />
        Notifications enabled — you will be reminded every cycle.
      </p>
    );
  }

  if (permission === "denied") {
    return (
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <BellOff className="size-3.5" />
        Notifications blocked. Re-enable them in your browser settings to get reminders even on other tabs.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={request}
      disabled={busy}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium shadow-[var(--shadow-soft)] hover:shadow-md transition-all disabled:opacity-60"
    >
      <Bell className="size-4" />
      {busy ? "Asking your browser…" : "Enable browser notifications"}
    </button>
  );
}

export type { Permission as NotificationPermissionState };
