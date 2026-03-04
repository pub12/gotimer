"use client";
// Purpose: Chess Clock page for the Game Timer app. Displays two player clocks, active/inactive states, and a pause button.

import React, { useState, useEffect, useRef, ChangeEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import { Button } from "../../components/ui/button";
import { Volume2, VolumeX, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * chess_clock_page component displays two player clocks, active/inactive states, and a pause button.
 */
function ChessClockPageContent() {
  // Get initial time from query params (in seconds)
  const search_params = useSearchParams();
  const router = useRouter();
  const initial_time = Number(search_params.get("time")) || 300;
  const [player_times, set_player_times] = useState([initial_time, initial_time]);
  const [active_player, set_active_player] = useState(0); // 0 or 1
  const [paused, set_paused] = useState(false);
  const [player_names, set_player_names] = useState(["Player 1", "Player 2"]);
  const [sound_on, set_sound_on] = useState(true);
  // Track if zero beep has been played for each player
  const zero_beeped = useRef([false, false]);

  // Play beep using Web Audio API
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

  // Beep logic for both players
  useEffect(() => {
    if (paused) return;
    player_times.forEach((time, idx) => {
      // Beep at zero (only once per player)
      if (time === 0 && !zero_beeped.current[idx]) {
        if (active_player === idx) play_beep(2, 1400);
        zero_beeped.current[idx] = true;
      }
      // Reset zero beep tracker if time is reset
      if (time > 0) {
        zero_beeped.current[idx] = false;
        // Beep every 30 seconds (but not at 0)
        if (time % 30 === 0 && time > 10 && active_player === idx) {
          play_beep(0.2, 880);
        }
        // Beep every second in last 10 seconds
        if (time <= 10 && time > 0 && active_player === idx) {
          play_beep(0.15, 1000);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player_times, paused, active_player]);

  // Countdown effect for active player
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

  // Format time as mm:ss
  const format_time = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Handle player button press
  const handle_player_press = (player: number) => {
    if (paused) return;
    if (active_player !== player && player_times[active_player] > 0) {
      set_active_player(player);
    }
  };

  // Handle pause
  const handle_pause = () => set_paused((p) => !p);

  // Handle navigation to chess clock setup
  const handle_settings = () => {
    router.push("/chess-clock-setup");
  };

  return (
    <main className="h-dvh flex flex-col bg-gray-50 pt-12 pb-2 px-2 w-full overflow-hidden md:min-h-screen md:h-auto md:overflow-auto md:pt-20 md:pb-0 md:px-2 md:justify-center md:items-center">
      <Header />
      <Navbar />
      <h1 className="sr-only md:not-sr-only md:text-5xl font-bold md:mb-6 text-center text-gray-900">
        Two-Player Chess Clock
      </h1>
      <div className="flex flex-col flex-1 w-full max-w-2xl mx-auto md:flex-none md:gap-8">
        {/* Sound toggle - inline with first player on mobile */}
        <div className="flex justify-center shrink-0 py-1 md:py-0">
          <button
            aria-label={sound_on ? "Disable Sound" : "Enable Sound"}
            onClick={() => set_sound_on((v) => !v)}
            className={`rounded-full ${sound_on ? "bg-blue-100" : "bg-gray-200"} p-1.5 md:p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            {sound_on ? (
              <Volume2 className="text-blue-600 w-5 h-5 md:w-10 md:h-10" />
            ) : (
              <VolumeX className="text-gray-500 w-5 h-5 md:w-10 md:h-10" />
            )}
          </button>
        </div>
        <div className="flex flex-col md:flex-row flex-1 w-full md:flex-none md:gap-8">
          {[0, 1].map((player) => (
            <div key={player} className="flex-1 flex flex-col items-center justify-center px-2">
              <input
                type="text"
                value={player_names[player]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const new_names = [...player_names];
                  new_names[player] = e.target.value;
                  set_player_names(new_names);
                }}
                className={`text-base md:text-4xl font-bold text-center border-b-2 border-gray-300 focus:border-blue-500 bg-transparent outline-none w-full max-w-xs transition-colors duration-200 ${active_player === player ? "text-green-700" : "text-gray-700"}`}
                aria-label={`Edit name for Player ${player + 1}`}
              />
              <span className="text-5xl md:text-8xl font-mono font-bold my-1 md:mb-6">
                {format_time(player_times[player])}
              </span>
              <Button
                onClick={() => handle_player_press(player === 0 ? 1 : 0)}
                className={`w-full text-2xl md:text-4xl py-4 md:py-10 rounded-2xl font-bold transition-all duration-200
                  ${active_player === player ? "bg-green-600 text-white shadow-2xl scale-[1.02] z-10" : "bg-gray-200 text-gray-500"}
                  ${player_times[player] === 0 ? "opacity-50 cursor-not-allowed" : ""}
                `}
                disabled={player_times[player] === 0 || paused}
              >
                {active_player === player ? "Your Move" : "Waiting"}
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 md:gap-4 items-center w-full py-1 md:mt-8 shrink-0">
          <Button
            onClick={handle_pause}
            className="flex-1 text-2xl md:text-3xl py-4 md:py-6 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-700"
          >
            {paused ? "Resume" : "Pause"}
          </Button>
          <button
            onClick={handle_settings}
            aria-label="Configure Settings"
            className="bg-gray-600 hover:bg-gray-700 text-white p-4 md:p-6 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
          >
            <Settings className="w-7 h-7 md:w-8 md:h-8" />
          </button>
        </div>
      </div>
      <section className="w-full max-w-2xl mx-auto mt-2 px-1 shrink-0">
        <p className="text-xs text-gray-500 text-center mb-2">Free online chess clock for two players. Perfect for chess, Scrabble, Go, and turn-based board games.</p>
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