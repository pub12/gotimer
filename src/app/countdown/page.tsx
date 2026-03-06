"use client";
// Purpose: Countdown page for the Game Timer app. Reads time from query and displays a live countdown timer.

import React, { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Volume2, VolumeX, Settings, RotateCcw, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Header from "../../components/header";

/**
 * countdown_page component displays a live countdown timer based on the time query parameter.
 * Plays a beep sound for each of the last 10 seconds and a longer beep at 0.
 */
function CountdownPageContent() {
  // Get time from query params (in seconds)
  const search_params = useSearchParams();
  const router = useRouter();
  const initial_time = Number(search_params.get("time")) || 0;
  const [remaining, set_remaining] = useState(initial_time);
  const [running, set_running] = useState(true);
  const [audio_enabled, set_audio_enabled] = useState(false);
  const prev_remaining = useRef(remaining);
  const audio_context_ref = useRef<AudioContext | null>(null);

  // Toggle audio context and enabled state
  const toggle_audio = () => {
    if (!audio_enabled) {
      try {
        if (!audio_context_ref.current) {
          audio_context_ref.current = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })?.webkitAudioContext)();
        }
        set_audio_enabled(true);
      } catch {
        // Audio not supported in this browser
      }
    } else {
      set_audio_enabled(false);
    }
  };

  // Move play_beep outside useEffect and wrap in useCallback
  const play_beep = useCallback((duration = 0.15, frequency = 880) => {
    if (!audio_enabled || !audio_context_ref.current) return;
    try {
      const ctx = audio_context_ref.current as AudioContext;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.2;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Ignore errors
    }
  }, [audio_enabled, audio_context_ref]);

  // Countdown effect
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => {
      set_remaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  // Fix exhaustive-deps warning by moving play_beep inside useEffect
  useEffect(() => {
    if (
      running &&
      remaining > 0 &&
      remaining <= 10 &&
      prev_remaining.current !== remaining
    ) {
      play_beep(); // short beep
    }
    if (running && remaining === 0 && prev_remaining.current !== 0) {
      play_beep(1.2, 1200); // longer, higher beep at 0
    }
    prev_remaining.current = remaining;
  }, [remaining, running, play_beep]);

  // Handle navigation to countdown setup
  const handle_settings = () => {
    router.push("/countdown-setup");
  };

  // SVG ring constants
  const ring_size = 280;
  const stroke_width = 12;
  const radius = 134;
  const circumference = 2 * Math.PI * radius;
  const progress = initial_time > 0 ? remaining / initial_time : 0;
  const dash_offset = circumference * (1 - progress);

  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");

  return (
    <main className="min-h-screen flex flex-col bg-gray-100 pt-12 pb-4 px-3 w-full md:bg-gray-200 md:pt-20 md:px-4 md:items-center">
      <Header />
      <Navbar />
      <h1 className="sr-only">Countdown Timer Active</h1>

      <div className="relative bg-white rounded-2xl shadow-lg p-6 md:p-12 flex flex-col items-center gap-5 md:gap-6 w-full max-w-md md:max-w-lg mx-auto mt-4">
        {/* Sound toggle - absolute top-right */}
        <button
          aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
          onClick={toggle_audio}
          className={`absolute top-4 right-4 rounded-full p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 ${audio_enabled ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          {audio_enabled ? (
            <Volume2 className="text-blue-600 w-5 h-5" />
          ) : (
            <VolumeX className="text-gray-500 w-5 h-5" />
          )}
        </button>

        {/* Status badge */}
        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Countdown Timer Active
        </div>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm">Session in progress</p>

        {/* Circular progress ring with timer */}
        <div className="relative w-60 h-60 md:w-80 md:h-80 flex items-center justify-center">
          <svg
            viewBox={`0 0 ${ring_size} ${ring_size}`}
            className="w-full h-full -rotate-90"
          >
            {/* Gray track */}
            <circle
              cx={ring_size / 2}
              cy={ring_size / 2}
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={stroke_width}
            />
            {/* Blue progress arc */}
            <circle
              cx={ring_size / 2}
              cy={ring_size / 2}
              r={radius}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={stroke_width}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dash_offset}
              className="ring-progress-transition"
            />
          </svg>
          {/* Timer digits overlaid */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-2">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-7xl font-bold text-gray-800 font-mono">{minutes}</span>
                <span className="text-xs uppercase tracking-wider text-gray-400 mt-1">Minutes</span>
              </div>
              <span className="text-5xl md:text-7xl font-bold text-gray-800 mb-5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-7xl font-bold text-gray-800 font-mono">{seconds}</span>
                <span className="text-xs uppercase tracking-wider text-gray-400 mt-1">Seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Timer button */}
        <Button
          onClick={() => set_remaining(initial_time)}
          disabled={remaining === initial_time}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 md:py-5 w-full shadow-md text-base md:text-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Timer
        </Button>

        {/* Pause + Settings buttons */}
        <div className="flex gap-3 w-full">
          <Button
            onClick={() => set_running(!running)}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-4 md:py-5 flex-1 shadow-sm text-base md:text-lg font-semibold flex items-center justify-center gap-2"
          >
            {running ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Resume
              </>
            )}
          </Button>
          <Button
            onClick={handle_settings}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-4 md:py-5 flex-1 shadow-sm text-base md:text-lg font-semibold flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Button>
        </div>
      </div>

      <section className="w-full max-w-md mx-auto mt-6 px-1">
        <p className="text-xs text-gray-500 text-center mb-2">Free online countdown timer with audio alerts. Great for board game turns, trivia rounds, and focus sessions.</p>
        <nav className="flex flex-wrap justify-center gap-3 text-xs">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="text-gray-400">|</span>
          <Link href="/chess-clock-setup" className="text-blue-600 hover:text-blue-800">Chess Clock</Link>
          <span className="text-gray-400">|</span>
          <Link href="/round-timer-setup" className="text-blue-600 hover:text-blue-800">Turn Timer</Link>
        </nav>
      </section>
    </main>
  );
}

export default function CountdownPageWrapper() {
  return (
    <Suspense>
      <CountdownPageContent />
    </Suspense>
  );
}
