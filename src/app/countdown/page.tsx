"use client";
// Purpose: Countdown page for the Game Timer app. Reads time from query and displays a live countdown timer.

import React, { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Volume2, VolumeX, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import Footer from "../../components/footer";

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-2 pt-20 w-full overflow-x-hidden">
      {/* Header */}
      <Header />
      {/* Navbar */}
      <Navbar />
      <h1 className="text-2xl md:text-5xl font-bold mb-6 text-center text-gray-900">
        Countdown Timer Active
      </h1>
      <div className="flex flex-col items-center gap-10 w-full max-w-md mx-auto">
        {/* Sound Toggle Icon Button */}
        <button
          aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
          onClick={toggle_audio}
          className={`mb-2 rounded-full ${audio_enabled ? "bg-blue-100 hover:bg-blue-200" : "bg-gray-200 hover:bg-gray-300"} p-4 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          style={{ fontSize: 40 }}
        >
          {audio_enabled ? (
            <Volume2 className="text-blue-600" size={40} />
          ) : (
            <VolumeX className="text-gray-500" size={40} />
          )}
        </button>
        {/* Responsive timer display */}
        <span
          className="font-mono font-bold tracking-widest select-none leading-none w-full text-center"
          style={{
            fontSize: "clamp(3rem, 25vw, 10rem)",
            wordBreak: "break-all",
            lineHeight: 1.1,
            display: "block",
          }}
        >
          {format_time(remaining)}
        </span>
        {/* Responsive Buttons: Reset above Pause/Resume */}
        <div className="flex flex-col gap-6 items-center w-full">
          <Button
            onClick={() => set_remaining(initial_time)}
            disabled={remaining === initial_time}
            className="text-white bg-red-600 hover:bg-red-700 focus:bg-red-800 text-2xl md:text-4xl px-0 py-8 rounded-2xl shadow-2xl w-full max-w-full disabled:opacity-60 font-bold"
            style={{ minHeight: "6rem" }}
          >
            Reset
          </Button>
          <div className="flex gap-4 items-center w-full max-w-full">
            <Button
              onClick={() => set_running(!running)}
              className="text-white bg-orange-500 hover:bg-orange-600 focus:bg-orange-700 text-2xl md:text-4xl px-0 py-8 rounded-2xl shadow-2xl flex-1 font-bold"
              style={{ minHeight: "6rem" }}
            >
              {running ? "Pause" : "Resume"}
            </Button>
            <button
              onClick={handle_settings}
              aria-label="Change Settings"
              className="bg-gray-600 hover:bg-gray-700 text-white p-6 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
              style={{ minHeight: "6rem", minWidth: "6rem" }}
            >
              <Settings size={40} />
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
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