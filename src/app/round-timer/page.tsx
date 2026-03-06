"use client";
// Purpose: Round Timer page for the Game Timer app. Displays total elapsed time and current round time with animated circular progress ring.

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Volume2, VolumeX, Settings, RotateCcw, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Header from "../../components/header";

export default function RoundTimerPage() {
  const router = useRouter();
  const [total_time, set_total_time] = useState(0);
  const [round_time, set_round_time] = useState(0);
  const [running, set_running] = useState(true);
  const [audio_enabled, set_audio_enabled] = useState(false);
  const [previous_round_times, set_previous_round_times] = useState<number[]>([]);
  const audio_context_ref = useRef<AudioContext | null>(null);

  const toggle_audio = () => {
    if (!audio_enabled) {
      try {
        if (!audio_context_ref.current) {
          audio_context_ref.current = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })?.webkitAudioContext)();
        }
        set_audio_enabled(true);
      } catch {
        // Audio not supported
      }
    } else {
      set_audio_enabled(false);
    }
  };

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      set_total_time((prev) => prev + 1);
      set_round_time((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const format_time = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handle_round_reset = () => {
    if (round_time > 0) {
      set_previous_round_times((prev) => [...prev, round_time]);
    }
    set_round_time(0);
  };

  const handle_pause = () => set_running((p) => !p);

  const handle_settings = () => {
    router.push("/round-timer-setup");
  };

  // SVG ring constants (same as countdown)
  const ring_size = 280;
  const stroke_width = 12;
  const radius = 134;
  const circumference = 2 * Math.PI * radius;
  // Ring fills over each minute, resets each minute
  const ring_progress = (round_time % 60) / 60;
  const dash_offset = circumference * (1 - ring_progress);

  const minutes = Math.floor(round_time / 60).toString().padStart(2, "0");
  const seconds = (round_time % 60).toString().padStart(2, "0");

  return (
    <main className="h-dvh flex flex-col bg-gray-100 pt-12 pb-2 px-2 w-full overflow-hidden md:min-h-screen md:h-auto md:overflow-auto md:bg-gray-200 md:pt-20 md:pb-4 md:px-4 md:items-center">
      <Header />
      <Navbar />
      <h1 className="sr-only">Total & Round Time Tracker</h1>

      <div className="relative bg-white rounded-2xl shadow-lg p-4 md:p-12 flex flex-col items-center gap-2 md:gap-6 w-full max-w-md md:max-w-lg mx-auto mt-2 md:mt-4">
        {/* Sound toggle */}
        <button
          aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
          onClick={toggle_audio}
          className={`absolute top-3 right-3 md:top-4 md:right-4 rounded-full p-1.5 md:p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 ${audio_enabled ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          {audio_enabled ? (
            <Volume2 className="text-blue-600 w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <VolumeX className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs md:text-sm font-semibold uppercase tracking-wide">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500" />
          Round Timer Active
        </div>

        {/* Subtitle */}
        <p className="text-gray-500 text-xs md:text-sm">
          Round {previous_round_times.length + 1} in progress
        </p>

        {/* Total time */}
        <div className="flex items-center gap-2 text-sm md:text-base font-mono text-gray-600">
          <span className="text-gray-400 text-xs md:text-sm uppercase tracking-wide font-sans">Total</span>
          <span className="font-semibold">{format_time(total_time)}</span>
        </div>

        {/* Circular progress ring with round time */}
        <div className="relative w-48 h-48 md:w-80 md:h-80 flex items-center justify-center flex-shrink-0">
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
            <div className="flex items-baseline gap-1 md:gap-2">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-7xl font-bold text-gray-800 font-mono">{minutes}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mt-0.5">Minutes</span>
              </div>
              <span className="text-4xl md:text-7xl font-bold text-gray-800 mb-4 md:mb-5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-7xl font-bold text-gray-800 font-mono">{seconds}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mt-0.5">Seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Round Reset button */}
        <Button
          onClick={handle_round_reset}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-2xl py-3 md:py-5 w-full shadow-md text-sm md:text-lg font-semibold flex items-center justify-center gap-2 shrink-0"
        >
          <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
          Round Reset
        </Button>

        {/* Round history */}
        {previous_round_times.length > 0 && (
          <div className="w-full max-h-16 md:max-h-48 overflow-y-auto shrink-0">
            <div className="flex flex-col gap-1 md:gap-2">
              {previous_round_times.map((time, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1 md:py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-xs md:text-base font-medium text-gray-700">
                    Round {index + 1}
                  </span>
                  <span className="text-xs md:text-base font-mono font-semibold text-gray-900">
                    {format_time(time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pause + Settings buttons */}
        <div className="flex gap-2 md:gap-3 w-full shrink-0">
          <Button
            onClick={handle_pause}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl md:rounded-2xl py-3 md:py-5 flex-1 shadow-sm text-sm md:text-lg font-semibold flex items-center justify-center gap-1.5 md:gap-2"
          >
            {running ? (
              <>
                <Pause className="w-4 h-4 md:w-5 md:h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 md:w-5 md:h-5" />
                Resume
              </>
            )}
          </Button>
          <Button
            onClick={handle_settings}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl md:rounded-2xl py-3 md:py-5 flex-1 shadow-sm text-sm md:text-lg font-semibold flex items-center justify-center gap-1.5 md:gap-2"
          >
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
            Settings
          </Button>
        </div>
      </div>

      <section className="w-full max-w-md mx-auto mt-1 md:mt-6 px-1 shrink-0">
        <p className="text-xs text-gray-500 text-center mb-1">Free online turn timer and round tracker. Ideal for board game tournaments, strategy games, and timeboxing sessions.</p>
        <nav className="flex flex-wrap justify-center gap-3 text-xs">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="text-gray-400">|</span>
          <Link href="/countdown-setup" className="text-blue-600 hover:text-blue-800">Countdown Timer</Link>
          <span className="text-gray-400">|</span>
          <Link href="/chess-clock-setup" className="text-blue-600 hover:text-blue-800">Chess Clock</Link>
        </nav>
      </section>
    </main>
  );
}
