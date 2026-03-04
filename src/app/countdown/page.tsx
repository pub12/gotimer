"use client";
// Purpose: Countdown page for the Game Timer app. Reads time from query and displays a live countdown timer.

import React, { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Volume2, VolumeX, Settings } from "lucide-react";
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

  // Format time as mm:ss
  const format_time = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Handle navigation to countdown setup
  const handle_settings = () => {
    router.push("/countdown-setup");
  };

  return (
    <main className="h-dvh flex flex-col bg-gray-50 pt-12 pb-2 px-3 w-full overflow-hidden md:min-h-screen md:h-auto md:overflow-auto md:pt-20 md:pb-0 md:px-2 md:justify-center md:items-center">
      <Header />
      <Navbar />
      <h1 className="sr-only md:not-sr-only md:text-5xl font-bold md:mb-6 text-center text-gray-900">
        Countdown Timer Active
      </h1>
      <div className="flex flex-col items-center flex-1 justify-between w-full max-w-md mx-auto md:flex-none md:gap-10 md:justify-center">
        {/* Sound Toggle */}
        <button
          aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
          onClick={toggle_audio}
          className={`rounded-full ${audio_enabled ? "bg-blue-100" : "bg-gray-200"} p-1.5 md:p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 shrink-0 mt-2 md:mt-0`}
        >
          {audio_enabled ? (
            <Volume2 className="text-blue-600 w-5 h-5 md:w-10 md:h-10" />
          ) : (
            <VolumeX className="text-gray-500 w-5 h-5 md:w-10 md:h-10" />
          )}
        </button>
        {/* Timer display - takes up available space */}
        <span
          className="font-mono font-bold tracking-widest select-none leading-none w-full text-center"
          style={{
            fontSize: "clamp(4rem, 25vw, 10rem)",
            wordBreak: "break-all",
            lineHeight: 1.1,
            display: "block",
          }}
        >
          {format_time(remaining)}
        </span>
        {/* Buttons - big and at the bottom */}
        <div className="flex flex-col gap-3 md:gap-6 items-center w-full shrink-0">
          <Button
            onClick={() => set_remaining(initial_time)}
            disabled={remaining === initial_time}
            className="text-white bg-red-600 hover:bg-red-700 focus:bg-red-800 text-2xl md:text-4xl px-0 py-5 md:py-8 rounded-2xl shadow-2xl w-full max-w-full disabled:opacity-60 font-bold"
          >
            Reset
          </Button>
          <div className="flex gap-3 md:gap-4 items-center w-full max-w-full">
            <Button
              onClick={() => set_running(!running)}
              className="text-white bg-orange-500 hover:bg-orange-600 focus:bg-orange-700 text-2xl md:text-4xl px-0 py-5 md:py-8 rounded-2xl shadow-2xl flex-1 font-bold"
            >
              {running ? "Pause" : "Resume"}
            </Button>
            <button
              onClick={handle_settings}
              aria-label="Change Settings"
              className="bg-gray-600 hover:bg-gray-700 text-white p-5 md:p-6 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
            >
              <Settings className="w-8 h-8 md:w-10 md:h-10" />
            </button>
          </div>
        </div>
      </div>
      <section className="w-full max-w-md mx-auto mt-4 px-1 shrink-0">
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