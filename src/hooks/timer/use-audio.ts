"use client";

import { useState, useRef, useCallback } from "react";

export type SoundPreset = "tick" | "warning" | "complete" | "phase_change";

const PRESET_CONFIG: Record<SoundPreset, { duration: number; frequency: number }> = {
  tick: { duration: 0.15, frequency: 880 },
  warning: { duration: 0.15, frequency: 1000 },
  complete: { duration: 1.2, frequency: 1200 },
  phase_change: { duration: 0.5, frequency: 660 },
};

export function useAudio() {
  const [enabled, set_enabled] = useState(false);
  const ctx_ref = useRef<AudioContext | null>(null);

  const toggle = useCallback(() => {
    if (!enabled) {
      try {
        if (!ctx_ref.current) {
          ctx_ref.current = new (
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
              ?.webkitAudioContext
          )();
        }
        set_enabled(true);
      } catch {
        /* Audio not supported */
      }
    } else {
      set_enabled(false);
    }
  }, [enabled]);

  const play_beep = useCallback(
    (duration = 0.15, frequency = 880) => {
      if (!enabled || !ctx_ref.current) return;
      try {
        const ctx = ctx_ref.current;
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.value = 0.2;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* Ignore */
      }
    },
    [enabled],
  );

  const play_preset = useCallback(
    (preset: SoundPreset) => {
      const config = PRESET_CONFIG[preset];
      play_beep(config.duration, config.frequency);
    },
    [play_beep],
  );

  return { enabled, toggle, play_beep, play_preset };
}
