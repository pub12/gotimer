"use client";

import React, { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Pause, Play } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TimerShell from "@/components/shared/timer-shell";

// SVG ring constants
const RING_SIZE = 280;
const STROKE_WIDTH = 12;
const RADIUS = 134;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const dash_offset = CIRCUMFERENCE * (1 - progress);
  return (
    <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="w-full h-full -rotate-90">
      <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none"
        stroke="var(--surface-container-high)" strokeWidth={STROKE_WIDTH} />
      <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none"
        stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dash_offset}
        className="ring-progress-transition" />
    </svg>
  );
}

function TimeDisplay({ seconds, large }: { seconds: number; large?: boolean }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  const digit = large
    ? "text-7xl sm:text-8xl md:text-9xl font-headline font-black text-foreground"
    : "text-4xl sm:text-5xl md:text-7xl font-headline font-black text-foreground";
  const colon = large
    ? "text-7xl sm:text-8xl md:text-9xl font-headline font-black text-foreground mb-6 sm:mb-8"
    : "text-4xl sm:text-5xl md:text-7xl font-headline font-black text-foreground mb-4 sm:mb-5";
  const label = large
    ? "text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mt-2"
    : "text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1";

  return (
    <div className={`flex items-baseline ${large ? "gap-3 sm:gap-4" : "gap-1.5 sm:gap-2"}`}>
      <div className="flex flex-col items-center">
        <span className={digit}>{m}</span>
        <span className={label}>Minutes</span>
      </div>
      <span className={colon}>:</span>
      <div className="flex flex-col items-center">
        <span className={digit}>{s}</span>
        <span className={label}>Seconds</span>
      </div>
    </div>
  );
}

const RING_NORMAL = "relative w-56 h-56 sm:w-60 sm:h-60 md:w-80 md:h-80 flex items-center justify-center";
const RING_FULLSCREEN = "relative w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] md:w-[34rem] md:h-[34rem] flex items-center justify-center";

function CountdownPageContent() {
  const search_params = useSearchParams();
  const initial_time = Number(search_params.get("time")) || Number(search_params.get("duration")) || 60;

  const [user_duration, set_user_duration] = useState(initial_time);
  const [remaining, set_remaining] = useState(initial_time);
  const [running, set_running] = useState(false);
  const [audio_enabled, set_audio_enabled] = useState(false);
  const audio_context_ref = useRef<AudioContext | null>(null);
  const prev_remaining = useRef(remaining);

  // Reset when duration changes
  useEffect(() => {
    set_remaining(user_duration);
    set_running(false);
  }, [user_duration]);

  const toggle_audio = () => {
    if (!audio_enabled) {
      try {
        if (!audio_context_ref.current) {
          audio_context_ref.current = new (
            window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })?.webkitAudioContext
          )();
        }
        set_audio_enabled(true);
      } catch { /* Audio not supported */ }
    } else {
      set_audio_enabled(false);
    }
  };

  const play_beep = useCallback((duration = 0.15, frequency = 880) => {
    if (!audio_enabled || !audio_context_ref.current) return;
    try {
      const ctx = audio_context_ref.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = frequency; gain.gain.value = 0.2;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    } catch { /* Ignore */ }
  }, [audio_enabled]);

  // Countdown effect
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => set_remaining((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  // Audio alerts
  useEffect(() => {
    if (running && remaining > 0 && remaining <= 10 && prev_remaining.current !== remaining) play_beep();
    if (running && remaining === 0 && prev_remaining.current !== 0) play_beep(1.2, 1200);
    prev_remaining.current = remaining;
  }, [remaining, running, play_beep]);

  const progress = user_duration > 0 ? remaining / user_duration : 0;
  const status_text = remaining === 0 ? "Time's up!" : running ? "Counting down..." : "Ready";

  const btn_cls = (fs: boolean) =>
    `flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"} font-semibold transition-colors`;
  const reset_cls = (fs: boolean) =>
    `flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl ${fs ? "py-4 sm:py-5 px-6 text-lg" : "py-3 sm:py-4 px-5 text-base"} font-semibold transition-colors disabled:opacity-40`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Countdown Timer</h1>
        <div className="mt-4 mb-8">
          <TimerShell
            timer_label="Countdown Timer"
            status_text={status_text}
            audio_enabled={audio_enabled}
            on_toggle_audio={toggle_audio}
            duration={{ value: user_duration, onChange: set_user_duration }}
            defaults={{ duration: 60 }}
            remaining={remaining}
            running={running}
            controls={({ is_fullscreen: fs }) => (
              <div className={`flex gap-3 ${fs ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
                <button onClick={() => set_running(!running)} className={btn_cls(fs)}>
                  {running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> {remaining < user_duration ? "Resume" : "Start"}</>}
                </button>
                <button onClick={() => { set_remaining(user_duration); set_running(false); }} disabled={remaining === user_duration && !running} className={reset_cls(fs)}>
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
              </div>
            )}
          >
            {({ is_fullscreen: fs }) => (
              <div className={RING_NORMAL}>
                <ProgressRing progress={progress} color="var(--secondary)" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <TimeDisplay seconds={remaining} large={false} />
                </div>
              </div>
            )}
          </TimerShell>
        </div>

        <section className="w-full max-w-md mx-auto px-1 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Free online countdown timer with audio alerts. Great for board game turns, trivia rounds, and focus sessions.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function CountdownPageWrapper() {
  return (
    <Suspense>
      <CountdownPageContent />
    </Suspense>
  );
}
