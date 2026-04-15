"use client";

import { useEffect, useRef } from "react";

/**
 * A single setInterval-based tick engine with drift correction.
 * Calls `on_tick` every ~1000ms while `running` is true.
 */
export function useTickEngine(running: boolean, on_tick: () => void) {
  const on_tick_ref = useRef(on_tick);
  on_tick_ref.current = on_tick;

  useEffect(() => {
    if (!running) return;

    let expected = Date.now() + 1000;
    const timer = setInterval(() => {
      const drift = Date.now() - expected;
      on_tick_ref.current();
      expected += 1000;
      // If drift exceeds 1 second, reset to avoid rapid catch-up
      if (drift > 1000) {
        expected = Date.now() + 1000;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);
}
