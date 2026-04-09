"use client";

import React, { useState, useEffect, useCallback } from "react";
import { use_auth_status } from "hazo_auth/client";

type SessionTrackerProps = {
  timer_type: string;
  /** Pass a signal when a timer completes so the tracker can log the session */
  on_complete?: (duration: number) => void;
  /** Optionally render a custom trigger button or slot */
  children?: (props: { log_session: (duration: number) => void; session_count_today: number }) => React.ReactNode;
};

export function SessionTracker({ timer_type, children }: SessionTrackerProps) {
  const { authenticated } = use_auth_status();
  const [session_count_today, set_session_count_today] = useState(0);

  const load_today_count = useCallback(async () => {
    if (!authenticated) return;
    try {
      const res = await fetch(`/api/timer-sessions?timer_type=${encodeURIComponent(timer_type)}`);
      if (!res.ok) return;
      const sessions = await res.json() as { completed_at: string }[];
      const today = new Date().toISOString().slice(0, 10);
      const count = sessions.filter((s) => s.completed_at.slice(0, 10) === today).length;
      set_session_count_today(count);
    } catch {
      // ignore
    }
  }, [authenticated, timer_type]);

  useEffect(() => {
    load_today_count();
  }, [load_today_count]);

  const log_session = useCallback(async (duration: number) => {
    if (!authenticated) return;
    try {
      await fetch("/api/timer-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timer_type, duration }),
      });
      set_session_count_today((prev) => prev + 1);
    } catch {
      // ignore — don't break the timer experience
    }
  }, [authenticated, timer_type]);

  if (!authenticated) return null;

  if (children) {
    return <>{children({ log_session, session_count_today })}</>;
  }

  return (
    <div className="text-sm text-muted-foreground text-center">
      {session_count_today > 0
        ? `Session ${session_count_today} today`
        : "Start your first session today"}
    </div>
  );
}
