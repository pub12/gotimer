"use client";
// Purpose: Chess Clock page for the Game Timer app. Displays two player clocks with circular progress rings, active/inactive states, and a pause button.

import React, { useState, useEffect, useRef, ChangeEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import { Button } from "../../components/ui/button";
import { Volume2, VolumeX, Settings, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";

function ChessClockPageContent() {
  const search_params = useSearchParams();
  const router = useRouter();
  const initial_time = Number(search_params.get("time")) || 300;
  const [player_times, set_player_times] = useState([initial_time, initial_time]);
  const [active_player, set_active_player] = useState(0);
  const [paused, set_paused] = useState(false);
  const [player_names, set_player_names] = useState(["Player 1", "Player 2"]);
  const [sound_on, set_sound_on] = useState(true);
  const zero_beeped = useRef([false, false]);

  const play_beep = (duration = 0.15, frequency = 880) => {
    if (!sound_on) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.2;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
      oscillator.onended = () => ctx.close();
    } catch {
      // Ignore errors
    }
  };

  useEffect(() => {
    if (paused) return;
    player_times.forEach((time, idx) => {
      if (time === 0 && !zero_beeped.current[idx]) {
        if (active_player === idx) play_beep(2, 1400);
        zero_beeped.current[idx] = true;
      }
      if (time > 0) {
        zero_beeped.current[idx] = false;
        if (time % 30 === 0 && time > 10 && active_player === idx) {
          play_beep(0.2, 880);
        }
        if (time <= 10 && time > 0 && active_player === idx) {
          play_beep(0.15, 1000);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player_times, paused, active_player]);

  useEffect(() => {
    if (paused) return;
    if (player_times[active_player] <= 0) return;
    const interval = setInterval(() => {
      set_player_times((times) => {
        const new_times = [...times];
        if (new_times[active_player] > 0) new_times[active_player] -= 1;
        return new_times;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active_player, paused, player_times]);

  const format_time = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handle_player_press = (player: number) => {
    if (paused) return;
    if (active_player !== player && player_times[active_player] > 0) {
      set_active_player(player);
    }
  };

  const handle_pause = () => set_paused((p) => !p);

  const handle_settings = () => {
    router.push("/chess-clock-setup");
  };

  // SVG ring constants (same as countdown)
  const ring_size = 280;
  const stroke_width = 12;
  const radius = 134;
  const circumference = 2 * Math.PI * radius;

  return (
    <main className="h-dvh flex flex-col bg-gray-100 pt-12 pb-2 px-2 w-full overflow-hidden md:min-h-screen md:h-auto md:overflow-auto md:bg-gray-200 md:pt-20 md:pb-4 md:px-4 md:items-center">
      <Header />
      <Navbar />
      <h1 className="sr-only">Two-Player Chess Clock</h1>

      <div className="relative bg-white rounded-2xl shadow-lg p-4 md:p-12 flex flex-col items-center gap-2 md:gap-6 w-full max-w-2xl md:max-w-3xl mx-auto mt-2 md:mt-4 flex-1 md:flex-none">
        {/* Sound toggle */}
        <button
          aria-label={sound_on ? "Disable Sound" : "Enable Sound"}
          onClick={() => set_sound_on((v) => !v)}
          className={`absolute top-3 right-3 md:top-4 md:right-4 rounded-full p-1.5 md:p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 ${sound_on ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          {sound_on ? (
            <Volume2 className="text-blue-600 w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <VolumeX className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 rounded-full px-3 py-1 text-xs md:text-sm font-semibold uppercase tracking-wide">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500" />
          Chess Clock Active
        </div>

        {/* Subtitle */}
        <p className="text-gray-500 text-xs md:text-sm">Tap a player card to switch turns</p>

        {/* Two player cards - side by side on mobile too */}
        <div className="flex flex-row gap-2 md:gap-6 w-full flex-1 md:flex-none items-stretch">
          {[0, 1].map((player) => {
            const is_active = active_player === player;
            const progress = initial_time > 0 ? player_times[player] / initial_time : 0;
            const dash_offset = circumference * (1 - progress);

            return (
              <button
                key={player}
                onClick={() => handle_player_press(player === 0 ? 1 : 0)}
                disabled={player_times[player] === 0 || paused}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 md:gap-4 rounded-xl md:rounded-2xl p-2 md:p-6 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${
                  is_active
                    ? "ring-2 ring-green-400 bg-green-50/30"
                    : "bg-gray-50"
                } ${player_times[player] === 0 ? "opacity-50" : ""}`}
              >
                {/* Player name input */}
                <input
                  type="text"
                  value={player_names[player]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    e.stopPropagation();
                    const new_names = [...player_names];
                    new_names[player] = e.target.value;
                    set_player_names(new_names);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-xs md:text-base font-semibold text-center border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none w-full max-w-[8rem] transition-colors duration-200 ${
                    is_active ? "text-green-700" : "text-gray-600"
                  }`}
                  aria-label={`Edit name for Player ${player + 1}`}
                />

                {/* SVG circular progress ring */}
                <div className="relative w-28 h-28 md:w-52 md:h-52 flex items-center justify-center">
                  <svg
                    viewBox={`0 0 ${ring_size} ${ring_size}`}
                    className="w-full h-full -rotate-90"
                  >
                    <circle
                      cx={ring_size / 2}
                      cy={ring_size / 2}
                      r={radius}
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth={stroke_width}
                    />
                    <circle
                      cx={ring_size / 2}
                      cy={ring_size / 2}
                      r={radius}
                      fill="none"
                      stroke={is_active ? "#22C55E" : "#D1D5DB"}
                      strokeWidth={stroke_width}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dash_offset}
                      className="ring-progress-transition"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl md:text-4xl font-bold font-mono text-gray-800">
                      {format_time(player_times[player])}
                    </span>
                  </div>
                </div>

                {/* Status label */}
                <span className={`text-xs md:text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
                  is_active ? "text-green-600" : "text-gray-400"
                }`}>
                  {is_active ? "Your Move" : "Waiting"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pause + Settings buttons */}
        <div className="flex gap-2 md:gap-3 w-full shrink-0">
          <Button
            onClick={handle_pause}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl md:rounded-2xl py-3 md:py-5 flex-1 shadow-sm text-sm md:text-lg font-semibold flex items-center justify-center gap-1.5 md:gap-2"
          >
            {paused ? (
              <>
                <Play className="w-4 h-4 md:w-5 md:h-5" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 md:w-5 md:h-5" />
                Pause
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

      <section className="w-full max-w-2xl mx-auto mt-1 md:mt-6 px-1 shrink-0">
        <p className="text-xs text-gray-500 text-center mb-1">Free online chess clock for two players. Perfect for chess, Scrabble, Go, and turn-based board games.</p>
        <nav className="flex flex-wrap justify-center gap-3 text-xs">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="text-gray-400">|</span>
          <Link href="/countdown-setup" className="text-blue-600 hover:text-blue-800">Countdown Timer</Link>
          <span className="text-gray-400">|</span>
          <Link href="/round-timer-setup" className="text-blue-600 hover:text-blue-800">Turn Timer</Link>
        </nav>
      </section>
    </main>
  );
}

export default function ChessClockPage() {
  return (
    <Suspense>
      <ChessClockPageContent />
    </Suspense>
  );
}
