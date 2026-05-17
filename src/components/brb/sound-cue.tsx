"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { format_mmss, parse_params } from "./overlay";

/**
 * Companion audio tab for the BRB overlay. OBS Browser Source mutes
 * audio by default, so streamers open this tab in a second browser
 * window and add it as an Audio Output Capture source. Same URL
 * parameters as the overlay — pass them through and the chime fires
 * at the same moment.
 *
 * Audio requires a user gesture to unlock (browser policy). The page
 * shows a single big "Enable audio" button until clicked.
 */
function SoundCueInner() {
  const params = useSearchParams();
  const cfg = parse_params(params, undefined);

  const [audio_unlocked, set_audio_unlocked] = useState(false);
  const [seconds, set_seconds] = useState(cfg.duration);
  const [running, set_running] = useState(false);
  const ctx_ref = useRef<AudioContext | null>(null);

  const total = cfg.duration;

  const ensure_ctx = (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctx_ref.current) {
      try {
        const AudioCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtor) return null;
        ctx_ref.current = new AudioCtor();
      } catch {
        return null;
      }
    }
    return ctx_ref.current;
  };

  const play_chime = (variant: "tick" | "done") => {
    const ctx = ctx_ref.current;
    if (!ctx) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(variant === "done" ? 880 : 1320, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (variant === "done" ? 1.0 : 0.2));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (variant === "done" ? 1.0 : 0.25));
    } catch {
      /* ignore audio errors */
    }
  };

  const unlock_audio = () => {
    const ctx = ensure_ctx();
    if (!ctx) return;
    // Play a near-silent tick to register the gesture-driven unlock.
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      /* ignore */
    }
    set_audio_unlocked(true);
    if (cfg.autostart) set_running(true);
  };

  // Countdown tick — when running, decrement once per second and fire
  // chimes on the relevant transitions.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      set_seconds((prev) => {
        if (prev <= 0) {
          set_running(false);
          return 0;
        }
        const next = prev - 1;
        if (next === 0) {
          play_chime("done");
        } else if (cfg.pulse && next <= 10 && next > 0) {
          play_chime("tick");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, cfg.pulse]);

  const restart = () => {
    set_seconds(total);
    set_running(true);
  };

  const toggle = () => {
    if (seconds <= 0) {
      restart();
      return;
    }
    set_running((r) => !r);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <noscript>
        <div style={{ padding: 24, background: "#dc2626", color: "white" }}>
          JavaScript is required for the audio cue to fire. Enable JS in your browser.
        </div>
      </noscript>

      {!audio_unlocked ? (
        <>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 700, textAlign: "center", padding: "0 24px" }}>
            BRB Overlay — Audio Companion
          </h1>
          <p style={{ fontSize: 16, maxWidth: 520, textAlign: "center", padding: "0 24px", color: "#cbd5e1" }}>
            Browsers require a user gesture before any page can play sound. Click below to
            unlock, then keep this tab open and add it to OBS as an{" "}
            <em>Audio Output Capture</em> source.
          </p>
          <button
            type="button"
            onClick={unlock_audio}
            style={{
              padding: "16px 32px",
              fontSize: 18,
              fontWeight: 700,
              background: "#0ea5e9",
              color: "white",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Volume2 size={20} /> Enable audio
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: "clamp(72px, 14vw, 220px)", fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", lineHeight: 1 }}>
            {format_mmss(seconds)}
          </div>
          <div style={{ fontSize: 18, opacity: 0.85, textAlign: "center", padding: "0 24px" }}>
            {cfg.label}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={toggle}
              style={{
                padding: "10px 22px",
                fontSize: 15,
                fontWeight: 600,
                background: running ? "#475569" : "#0ea5e9",
                color: "white",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              {seconds <= 0 ? "Restart" : running ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={restart}
              style={{
                padding: "10px 22px",
                fontSize: 15,
                fontWeight: 600,
                background: "transparent",
                color: "white",
                border: "1px solid #475569",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => set_audio_unlocked(false)}
              style={{
                padding: "10px 22px",
                fontSize: 15,
                fontWeight: 600,
                background: "transparent",
                color: "#94a3b8",
                border: "1px solid #475569",
                borderRadius: 10,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <VolumeX size={16} /> Mute &amp; reset
            </button>
          </div>
          <p style={{ fontSize: 12, opacity: 0.6, maxWidth: 520, textAlign: "center", padding: "0 24px" }}>
            Chimes fire on the final 10 seconds and at zero. Add this tab to OBS as an
            Audio Output Capture source — viewers won&apos;t hear the page itself.
          </p>
        </>
      )}
    </div>
  );
}

export function SoundCue() {
  return (
    <Suspense fallback={null}>
      <SoundCueInner />
    </Suspense>
  );
}
