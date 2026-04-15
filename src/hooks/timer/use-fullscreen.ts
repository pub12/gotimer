"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useFullscreen() {
  const [is_fullscreen, set_is_fullscreen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      ref.current
        ?.requestFullscreen()
        .catch(() => set_is_fullscreen(true));
    } else {
      document.exitFullscreen().catch(() => set_is_fullscreen(false));
    }
  }, []);

  useEffect(() => {
    function on_change() {
      set_is_fullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", on_change);
    return () => document.removeEventListener("fullscreenchange", on_change);
  }, []);

  // Escape key fallback for browsers where fullscreenElement is null
  // but we're in our manual fullscreen mode
  useEffect(() => {
    if (!is_fullscreen || document.fullscreenElement) return;
    function on_keydown(e: KeyboardEvent) {
      if (e.key === "Escape") set_is_fullscreen(false);
    }
    document.addEventListener("keydown", on_keydown);
    return () => document.removeEventListener("keydown", on_keydown);
  }, [is_fullscreen]);

  return { is_fullscreen, toggle, ref };
}
