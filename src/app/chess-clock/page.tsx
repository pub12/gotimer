"use client";

import React, { useState, useEffect, useRef, useCallback, ChangeEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Pause, Play } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TimerShell from "@/components/shared/timer-shell";

function ChessClockPageContent() {
  const search_params = useSearchParams();
  const initial_time = Number(search_params.get("time")) || Number(search_params.get("duration")) || 300;

  const [user_duration, set_user_duration] = useState(initial_time);
  const [player_times, set_player_times] = useState([initial_time, initial_time]);
  const [active_player, set_active_player] = useState(0);
  const [paused, set_paused] = useState(true);
  const [player_names, set_player_names] = useState(["Player 1", "Player 2"]);
  const [audio_enabled, set_audio_enabled] = useState(false);
  const audio_context_ref = useRef<AudioContext | null>(null);
  const zero_beeped = useRef([false, false]);

  // Reset when duration changes
  useEffect(() => {
    set_player_times([user_duration, user_duration]);
    set_paused(true);
    set_active_player(0);
    zero_beeped.current = [false, false];
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

  // Audio alerts
  useEffect(() => {
    if (paused) return;
    player_times.forEach((time, idx) => {
      if (time === 0 && !zero_beeped.current[idx]) {
        if (active_player === idx) play_beep(2, 1400);
        zero_beeped.current[idx] = true;
      }
      if (time > 0) {
        zero_beeped.current[idx] = false;
        if (time <= 10 && time > 0 && active_player === idx) play_beep(0.15, 1000);
      }
    });
  }, [player_times, paused, active_player, play_beep]);

  // Countdown effect
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
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handle_player_press = (player: number) => {
    if (paused) return;
    if (active_player !== player && player_times[active_player] > 0) {
      set_active_player(player);
    }
  };

  const status_text = paused
    ? (player_times[0] === user_duration && player_times[1] === user_duration ? "Ready" : "Paused")
    : `${player_names[active_player]}'s turn`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Chess Clock</h1>
        <div className="mt-4 mb-8">
          <TimerShell
            timer_label="Chess Clock"
            status_text={status_text}
            audio_enabled={audio_enabled}
            on_toggle_audio={toggle_audio}
            duration={{ value: user_duration, onChange: set_user_duration }}
            defaults={{ duration: 300 }}
            controls={({ is_fullscreen: fs }) => (
              <div className={`flex gap-3 ${fs ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
                <button
                  onClick={() => set_paused(!paused)}
                  className={`flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"} font-semibold transition-colors`}
                >
                  {paused ? <><Play className="w-5 h-5" /> Start</> : <><Pause className="w-5 h-5" /> Pause</>}
                </button>
              </div>
            )}
          >
            {({ is_fullscreen: fs }) => (
              <div className={`flex flex-col gap-3 md:gap-4 w-full ${fs ? "max-w-xl" : ""}`}>
                {[0, 1].map((player) => {
                  const is_active = active_player === player && !paused;
                  const progress = user_duration > 0 ? player_times[player] / user_duration : 0;

                  return (
                    <button
                      key={player}
                      onClick={() => handle_player_press(player === 0 ? 1 : 0)}
                      disabled={player_times[player] === 0 || paused}
                      className={`w-full flex flex-col gap-3 rounded-2xl p-4 md:p-5 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${
                        is_active
                          ? "ring-2 ring-secondary bg-secondary/5"
                          : "bg-surface-container-low"
                      } ${player_times[player] === 0 ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center justify-between w-full">
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
                          className={`text-sm md:text-base font-headline font-bold bg-transparent outline-none max-w-[8rem] transition-colors duration-200 border-b border-dashed border-transparent hover:border-surface-container-highest focus:border-secondary ${
                            is_active ? "text-secondary" : "text-foreground"
                          }`}
                          aria-label={`Edit name for Player ${player + 1}`}
                        />
                        <span className={`text-xs font-headline font-bold uppercase tracking-wider transition-colors duration-300 ${
                          is_active ? "text-secondary" : "text-muted-foreground"
                        }`}>
                          {is_active ? "Your Move" : "Waiting"}
                        </span>
                      </div>

                      <div className={`${fs ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl"} font-headline font-black text-foreground text-center`}>
                        {format_time(player_times[player])}
                      </div>

                      <div className="w-full h-3 md:h-4 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bar-progress-transition ${
                            is_active
                              ? "bg-gradient-to-r from-secondary to-secondary/70"
                              : "bg-gradient-to-r from-surface-container-highest to-surface-container-high"
                          }`}
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </TimerShell>
        </div>

        <section className="w-full max-w-md mx-auto px-1 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Free online chess clock for two players. Perfect for chess, Scrabble, Go, and turn-based board games.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ChessClockPage() {
  return (
    <Suspense>
      <ChessClockPageContent />
    </Suspense>
  );
}
