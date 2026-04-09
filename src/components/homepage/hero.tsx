"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Minus, Plus, RotateCcw, Volume2, VolumeX } from "lucide-react";

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

// SVG ring constants
const RING_SIZE = 240;
const STROKE_WIDTH = 10;
const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

  const adjust_duration = (delta: number) => {
    if (running) return;
    const new_dur = Math.max(60, Math.min(3600, duration + delta));
    set_duration(new_dur);
    set_remaining(new_dur);
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
  const dash_offset = CIRCUMFERENCE * (1 - progress);

  return (
    <section className="w-full bg-[#1A1A2E] text-white py-12 md:py-20 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Every Timer. Every Game.{" "}
          <span className="text-[#FF6B35]">One Leaderboard.</span>
        </h1>

        {/* Rotating sub-headline */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 h-7 transition-opacity duration-500">
          {SUB_HEADLINES[sub_index]}
        </p>

        {/* Timer widget */}
        <div className="flex flex-col items-center gap-6 mb-8">
          {/* Progress ring with time */}
          <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
            <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="w-full h-full -rotate-90">
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="#2C3E50"
                strokeWidth={STROKE_WIDTH}
              />
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={running && remaining > 0 ? "#2ECC71" : "#FF6B35"}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dash_offset}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl md:text-6xl font-bold font-mono tracking-wider">
                {format_time(remaining)}
              </span>
              {remaining === 0 && (
                <span className="text-[#FF6B35] text-sm font-semibold mt-1">Time&apos;s up!</span>
              )}
            </div>
          </div>

          {/* Duration adjust controls (only when not running) */}
          {!running && remaining === duration && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => adjust_duration(-60)}
                disabled={duration <= 60}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-30"
                aria-label="Decrease 1 minute"
              >
                <Minus className="w-6 h-6" />
              </button>
              <span className="text-lg font-medium text-gray-300 w-20 text-center">
                {Math.floor(duration / 60)} min
              </span>
              <button
                onClick={() => adjust_duration(60)}
                disabled={duration >= 3600}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-30"
                aria-label="Increase 1 minute"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Start / Pause / Reset controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handle_start}
              className="px-10 py-3.5 rounded-2xl bg-[#FF6B35] hover:bg-[#e85a28] text-white text-lg font-bold transition-colors flex items-center gap-2"
            >
              {running ? (
                <>
                  <Pause className="w-5 h-5" /> Pause
                </>
              ) : remaining === 0 ? (
                <>
                  <RotateCcw className="w-5 h-5" /> Restart
                </>
              ) : remaining < duration ? (
                <>
                  <Play className="w-5 h-5" /> Resume
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Start
                </>
              )}
            </button>

            {(running || remaining < duration) && remaining > 0 && (
              <button
                onClick={handle_reset}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-lg font-semibold transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Reset
              </button>
            )}

            <button
              onClick={toggle_audio}
              aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
              className={`p-3 rounded-full transition-colors ${
                audio_enabled ? "bg-[#FF6B35]/20 text-[#FF6B35]" : "bg-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {audio_enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick-pick buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_PICKS.map((pick) => (
            <button
              key={pick.label}
              onClick={() => handle_quick_pick(pick)}
              className="px-5 py-2.5 rounded-full border border-[#FF6B35]/40 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white text-sm font-medium transition-colors"
            >
              {pick.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
