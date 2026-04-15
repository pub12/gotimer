"use client";

import { useEffect, useRef } from "react";

/**
 * Acquires a Screen Wake Lock while `active` is true.
 * Automatically re-acquires when the tab becomes visible again.
 */
export function useWakeLock(active: boolean) {
  const lock_ref = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;

    let released = false;

    async function acquire() {
      try {
        lock_ref.current = await navigator.wakeLock.request("screen");
        lock_ref.current.addEventListener("release", () => {
          lock_ref.current = null;
        });
      } catch {
        /* Wake lock not available */
      }
    }

    function on_visibility_change() {
      if (!released && document.visibilityState === "visible" && !lock_ref.current) {
        acquire();
      }
    }

    acquire();
    document.addEventListener("visibilitychange", on_visibility_change);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", on_visibility_change);
      lock_ref.current?.release().catch(() => {});
      lock_ref.current = null;
    };
  }, [active]);
}
