"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Classroom noise meter using getUserMedia + AnalyserNode.
 *
 * Privacy: nothing is recorded or sent. The audio stream stays inside the
 * AudioContext on the user's device. We pull only the time-domain amplitude
 * out of AnalyserNode each animation frame.
 *
 * Three modes: bouncy balls (Canvas), animated bars (Canvas), color-only
 * (no animation — large coloured panel switches between calm/loud).
 *
 * Permission UX: explicit "Tap to enable microphone" button. No auto-prompt.
 * If denied, fall back to "color-only" mode with a placeholder + retry CTA.
 */

type Mode = "balls" | "bars" | "color";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

const BALL_COLORS = [
  "#7c3aed",
  "#22c55e",
  "#f97316",
  "#06b6d4",
  "#ec4899",
  "#eab308",
];

function make_balls(count: number, w: number, h: number): Ball[] {
  return Array.from({ length: count }, (_, i) => ({
    x: w / 2 + (Math.random() - 0.5) * w * 0.4,
    y: h * 0.7 + Math.random() * 30,
    vx: (Math.random() - 0.5) * 2,
    vy: 0,
    r: 18 + Math.random() * 14,
    color: BALL_COLORS[i % BALL_COLORS.length],
  }));
}

function rms_from_buffer(buffer: Uint8Array<ArrayBuffer>): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    const v = (buffer[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / buffer.length);
}

export function NoiseMeter() {
  const [state, set_state] = useState<"idle" | "starting" | "running" | "denied" | "error">(
    "idle",
  );
  const [mode, set_mode] = useState<Mode>("balls");
  const [threshold, set_threshold] = useState(0.18); // RMS 0..1
  const [level, set_level] = useState(0);
  const [error_msg, set_error_msg] = useState<string>("");

  const audio_ctx_ref = useRef<AudioContext | null>(null);
  const analyser_ref = useRef<AnalyserNode | null>(null);
  const buffer_ref = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const stream_ref = useRef<MediaStream | null>(null);
  const raf_ref = useRef<number | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const balls_ref = useRef<Ball[]>([]);

  const stop_everything = useCallback(() => {
    if (raf_ref.current !== null) {
      cancelAnimationFrame(raf_ref.current);
      raf_ref.current = null;
    }
    if (stream_ref.current) {
      stream_ref.current.getTracks().forEach((t) => t.stop());
      stream_ref.current = null;
    }
    if (audio_ctx_ref.current) {
      audio_ctx_ref.current.close().catch(() => {});
      audio_ctx_ref.current = null;
    }
    analyser_ref.current = null;
    buffer_ref.current = null;
  }, []);

  useEffect(() => stop_everything, [stop_everything]);

  const start = useCallback(async () => {
    set_error_msg("");
    set_state("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      stream_ref.current = stream;
      const Ctx = window.AudioContext;
      if (!Ctx) {
        set_state("error");
        set_error_msg("This browser doesn't support the Web Audio API.");
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      const ctx = new Ctx();
      audio_ctx_ref.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyser_ref.current = analyser;
      buffer_ref.current = new Uint8Array(new ArrayBuffer(analyser.fftSize));
      set_state("running");
    } catch (err) {
      const e = err as DOMException;
      if (e.name === "NotAllowedError" || e.name === "SecurityError") {
        set_state("denied");
        set_error_msg(
          "Microphone access denied. Click the lock icon in your address bar to re-enable, then tap Try Again.",
        );
      } else {
        set_state("error");
        set_error_msg(`Couldn't access the microphone: ${e.message || e.name}`);
      }
    }
  }, []);

  const stop = useCallback(() => {
    stop_everything();
    set_state("idle");
    set_level(0);
  }, [stop_everything]);

  // Animation loop.
  useEffect(() => {
    if (state !== "running") return;
    const canvas = canvas_ref.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    // Resize canvas to its CSS size with devicePixelRatio.
    function resize() {
      if (!canvas || !ctx2d) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      balls_ref.current = make_balls(8, rect.width, rect.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let last_t = performance.now();
    function tick(t: number) {
      raf_ref.current = requestAnimationFrame(tick);
      if (!analyser_ref.current || !buffer_ref.current) return;
      analyser_ref.current.getByteTimeDomainData(buffer_ref.current);
      const rms = rms_from_buffer(buffer_ref.current);
      set_level(rms);

      const dt = Math.min(0.05, (t - last_t) / 1000);
      last_t = t;

      if (!canvas || !ctx2d) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx2d.clearRect(0, 0, w, h);

      if (mode === "balls") {
        const balls = balls_ref.current;
        const impulse = Math.min(1, rms * 5);
        // Threshold-tinted background.
        ctx2d.fillStyle = rms > threshold ? "rgba(244,63,94,0.06)" : "rgba(34,197,94,0.05)";
        ctx2d.fillRect(0, 0, w, h);
        // Threshold line.
        const ty = h - h * threshold * 4 - 30;
        if (ty > 0 && ty < h) {
          ctx2d.strokeStyle = "rgba(244,63,94,0.5)";
          ctx2d.setLineDash([6, 6]);
          ctx2d.beginPath();
          ctx2d.moveTo(0, ty);
          ctx2d.lineTo(w, ty);
          ctx2d.stroke();
          ctx2d.setLineDash([]);
        }
        for (const b of balls) {
          // Gravity + amplitude impulse.
          b.vy += 800 * dt;
          if (impulse > 0.05 && b.y > h - 40) {
            b.vy -= impulse * 600;
            b.vx += (Math.random() - 0.5) * impulse * 200;
          }
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          // Walls.
          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx *= -0.7;
          } else if (b.x + b.r > w) {
            b.x = w - b.r;
            b.vx *= -0.7;
          }
          // Floor.
          if (b.y + b.r > h) {
            b.y = h - b.r;
            b.vy *= -0.6;
            b.vx *= 0.95;
          }
          // Damping.
          b.vx *= 0.995;
          ctx2d.beginPath();
          ctx2d.fillStyle = b.color;
          ctx2d.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx2d.fill();
        }
      } else if (mode === "bars") {
        const bars = 24;
        const bw = w / bars - 4;
        for (let i = 0; i < bars; i++) {
          // Use the impulse + a per-bar offset for visual interest.
          const offset = Math.sin(t / 200 + i) * 0.25 + 0.75;
          const bh = Math.max(4, rms * h * 4 * offset);
          const color = rms > threshold ? "#f43f5e" : "#22c55e";
          ctx2d.fillStyle = color;
          ctx2d.fillRect(i * (bw + 4) + 2, h - bh, bw, bh);
        }
        // Threshold line at threshold*4*h
        const ty = h - threshold * h * 4;
        if (ty > 0 && ty < h) {
          ctx2d.strokeStyle = "rgba(244,63,94,0.6)";
          ctx2d.setLineDash([6, 6]);
          ctx2d.beginPath();
          ctx2d.moveTo(0, ty);
          ctx2d.lineTo(w, ty);
          ctx2d.stroke();
          ctx2d.setLineDash([]);
        }
      }
      // color mode draws nothing on canvas; the panel below is the indicator
    }
    raf_ref.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      if (raf_ref.current !== null) cancelAnimationFrame(raf_ref.current);
      raf_ref.current = null;
    };
  }, [state, mode, threshold]);

  const is_loud = level > threshold;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Privacy disclosure — required above the tool. */}
      <div
        role="note"
        className="rounded-2xl bg-secondary/5 border border-secondary/30 px-4 py-3 mb-4 text-center"
      >
        <p className="text-xs md:text-sm text-foreground font-medium">
          <strong>Privacy:</strong> No audio is recorded or sent anywhere. The
          microphone signal stays on this device and is discarded continuously.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden bg-surface-container-low shadow-[var(--shadow-soft)] aspect-[16/9] relative">
        {(state === "idle" || state === "denied" || state === "error") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="font-headline font-bold text-lg text-foreground mb-2">
              {state === "denied"
                ? "Microphone access blocked"
                : state === "error"
                  ? "Couldn't start"
                  : "Tap to enable microphone"}
            </p>
            {error_msg && (
              <p className="text-sm text-muted-foreground mb-3 max-w-md">{error_msg}</p>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-headline font-black uppercase tracking-widest text-sm shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px transition-all duration-200 cursor-pointer border-none"
            >
              {state === "denied" || state === "error" ? "Try again" : "Enable microphone"}
            </button>
          </div>
        )}
        {state === "starting" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Starting microphone…</p>
          </div>
        )}
        {state === "running" && (
          <>
            <canvas ref={canvas_ref} className="w-full h-full block" />
            {mode === "color" && (
              <div
                className="absolute inset-0 flex items-center justify-center text-center"
                style={{ backgroundColor: is_loud ? "#fee2e2" : "#dcfce7" }}
              >
                <div>
                  <p
                    className="font-headline font-black uppercase tracking-widest text-3xl md:text-5xl"
                    style={{ color: is_loud ? "#b91c1c" : "#15803d" }}
                  >
                    {is_loud ? "Too loud" : "Quiet"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Adjust threshold to suit your classroom.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {state === "running" && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(["balls", "bars", "color"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => set_mode(m)}
                className={`px-4 py-2 rounded-full font-headline font-bold uppercase tracking-widest text-xs transition-all duration-200 cursor-pointer border ${
                  mode === m
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-surface-container-low text-muted-foreground border-surface-container-high hover:text-foreground"
                }`}
              >
                {m === "balls" ? "Bouncy balls" : m === "bars" ? "Bars" : "Color only"}
              </button>
            ))}
          </div>
          <div className="px-2">
            <label className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-1.5">
              <span>Too-loud threshold</span>
              <span>{Math.round(threshold * 100)}%</span>
            </label>
            <input
              type="range"
              min={0.05}
              max={0.5}
              step={0.01}
              value={threshold}
              onChange={(e) => set_threshold(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Too-loud threshold"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={stop}
              className="px-5 py-2 rounded-full bg-surface-container-low text-muted-foreground hover:text-foreground font-headline font-bold uppercase tracking-widest text-xs border border-surface-container-high transition-all duration-200 cursor-pointer"
            >
              Turn off microphone
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
