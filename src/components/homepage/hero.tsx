"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Play, Pause, Minus, Plus, RotateCcw, Volume2, VolumeX, Maximize, Pencil } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import TimerShell from "@/components/shared/timer-shell";


const SUB_HEADLINES = [
  "25-minute Pomodoro? Done.",
  "Board game showdown? Set.",
  "HIIT workout? Go.",
  "Study session? Start.",
];

const QUICK_PICKS = [
  { label: "25 min Pomodoro", seconds: 1500, href: "/pomodoro-timer" },
  { label: "20 min HIIT", seconds: 1200, href: "/hiit-timer" },
  { label: "Board Games", seconds: null, href: "/board-games" },
  { label: "Custom", seconds: null, href: "/countdown-setup" },
];

function format_time(total_seconds: number): string {
  const m = Math.floor(total_seconds / 60);
  const s = total_seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Hero() {
  const router = useRouter();
  const [duration, set_duration] = useState(300); // 5 minutes default
  const [remaining, set_remaining] = useState(300);
  const [running, set_running] = useState(false);
  const [sub_index, set_sub_index] = useState(0);
  const [audio_enabled, set_audio_enabled] = useState(false);
  const audio_ctx_ref = useRef<AudioContext | null>(null);
  const prev_remaining = useRef(remaining);

  // Reset when duration changes
  useEffect(() => {
    set_remaining(duration);
    set_running(false);
  }, [duration]);

  // Rotate sub-headlines
  useEffect(() => {
    const interval = setInterval(() => {
      set_sub_index((i) => (i + 1) % SUB_HEADLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => {
      set_remaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  // Audio beeps in last 10 seconds
  const play_beep = useCallback(
    (dur = 0.15, frequency = 880) => {
      if (!audio_enabled || !audio_ctx_ref.current) return;
      try {
        const ctx = audio_ctx_ref.current;
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.value = 0.2;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch {
        // ignore
      }
    },
    [audio_enabled]
  );

  useEffect(() => {
    if (running && remaining > 0 && remaining <= 10 && prev_remaining.current !== remaining) {
      play_beep();
    }
    if (running && remaining === 0 && prev_remaining.current !== 0) {
      play_beep(1.2, 1200);
    }
    prev_remaining.current = remaining;
  }, [remaining, running, play_beep]);

  const toggle_audio = () => {
    if (!audio_enabled) {
      try {
        if (!audio_ctx_ref.current) {
          audio_ctx_ref.current = new (
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
          )();
        }
        set_audio_enabled(true);
      } catch {
        // Audio not supported
      }
    } else {
      set_audio_enabled(false);
    }
  };

  const handle_start = () => {
    if (remaining === 0) {
      set_remaining(duration);
    }
    set_running(!running);
  };

  const handle_reset = () => {
    set_running(false);
    set_remaining(duration);
  };

  const handle_quick_pick = (pick: (typeof QUICK_PICKS)[0]) => {
    if (pick.seconds) {
      set_duration(pick.seconds);
      set_remaining(pick.seconds);
      set_running(false);
    } else {
      router.push(pick.href);
    }
  };

  const progress = duration > 0 ? remaining / duration : 0;
  const ringColor = running && remaining > 0 ? "#2ECC71" : "var(--secondary, #ab3514)";
  const status_text = remaining === 0 ? "Time's up!" : running ? "Counting down..." : "Ready";

  const btn_cls = (fs: boolean) =>
    `flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"} font-semibold transition-colors cursor-pointer`;
  const reset_cls = (fs: boolean) =>
    `flex items-center justify-center gap-2 rounded-2xl ${fs ? "py-4 sm:py-5 px-6 text-lg" : "py-3 sm:py-4 px-5 text-base"} font-semibold transition-colors disabled:opacity-40 bg-surface-container-low text-foreground hover:bg-surface-container-high cursor-pointer disabled:cursor-not-allowed`;

  return (
    <section className="w-full bg-primary text-primary-foreground py-12 md:py-20 px-4">
      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Mascot — absolute positioned on left, only md+ */}
        <Image
          src="/mascots/drake-timer.png"
          alt="Drake the Explorer holding a stopwatch"
          width={320}
          height={320}
          className="hidden md:block absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 w-56 lg:w-72 xl:w-80 object-contain drop-shadow-lg pointer-events-none"
          priority
        />

        {/* Headline */}
        <h1 className="font-headline font-black text-3xl sm:text-4xl md:text-6xl mb-4 leading-tight">
          Every Timer. Every Game.{" "}
          <span className="text-secondary">One Leaderboard.</span>
        </h1>

        {/* Rotating sub-headline */}
        <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 h-7 transition-opacity duration-500" aria-live="polite">
          {SUB_HEADLINES[sub_index]}
        </p>

        {/* Timer — centered */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <TimerShell
            timer_label="Countdown Timer"
            status_text={status_text}
            audio_enabled={audio_enabled}
            on_toggle_audio={toggle_audio}
            duration={{ value: duration, onChange: set_duration }}
            defaults={{ duration: 300 }}
            remaining={remaining}
            running={running}
            dark
            controls={({ is_fullscreen: fs }) => (
              <div className={`flex gap-3 ${fs ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
                <button onClick={handle_start} className={btn_cls(fs)}>
                  {running ? <><Pause className="w-5 h-5" /> Pause</> : remaining === 0 ? <><RotateCcw className="w-5 h-5" /> Restart</> : remaining < duration ? <><Play className="w-5 h-5" /> Resume</> : <><Play className="w-5 h-5" /> Start</>}
                </button>
                <button onClick={handle_reset} disabled={remaining === duration && !running} className={reset_cls(fs)}>
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
              </div>
            )}
          >
            {() => (
              <ProgressRing
                progress={progress}
                size="lg"
                color={ringColor}
                trackColor="rgba(255,255,255,0.15)"
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl md:text-6xl font-bold font-mono tracking-wider text-primary-foreground">
                    {format_time(remaining)}
                  </span>
                  {remaining === 0 && (
                    <span className="text-secondary text-sm font-semibold mt-1">Time&apos;s up!</span>
                  )}
                </div>
              </ProgressRing>
            )}
          </TimerShell>
        </div>

        {/* Quick-pick buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_PICKS.map((pick) => (
            <button
              key={pick.label}
              onClick={() => handle_quick_pick(pick)}
              className="px-5 py-2.5 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground text-sm font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer"
            >
              {pick.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
