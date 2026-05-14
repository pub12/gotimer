"use client";

import { useEffect, useRef } from "react";

/**
 * Drives re-renders at ~100ms intervals while the stopwatch is running,
 * using requestAnimationFrame throttled to avoid painting faster than needed.
 * Calls `on_tick` each time an interval fires. Strict cleanup on unmount.
 */
export function useStopwatchRenderDriver(running: boolean, on_tick: () => void) {
  const on_tick_ref = useRef(on_tick);
  on_tick_ref.current = on_tick;

  useEffect(() => {
    if (!running) return;

    let raf_id: number;
    let last_fire = 0;
    const INTERVAL_MS = 100;

    function loop(now: number) {
      if (now - last_fire >= INTERVAL_MS) {
        last_fire = now;
        on_tick_ref.current();
      }
      raf_id = requestAnimationFrame(loop);
    }

    raf_id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf_id);
  }, [running]);
}
