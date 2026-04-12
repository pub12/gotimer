"use client";

import React, { useEffect, useState, useRef, useCallback, Suspense } from "react";
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

const RING_NORMAL = "relative w-56 h-56 sm:w-60 sm:h-60 md:w-80 md:h-80 flex items-center justify-center";
const RING_FULLSCREEN = "relative w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] md:w-[34rem] md:h-[34rem] flex items-center justify-center";

function format_time(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function RoundTimerContent() {
  const [total_time, set_total_time] = useState(0);
  const [round_time, set_round_time] = useState(0);
  const [running, set_running] = useState(false);
  const [audio_enabled, set_audio_enabled] = useState(false);
  const [previous_round_times, set_previous_round_times] = useState<number[]>([]);
  const audio_context_ref = useRef<AudioContext | null>(null);

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

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      set_total_time((p) => p + 1);
      set_round_time((p) => p + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Beep every minute
  useEffect(() => {
    if (running && round_time > 0 && round_time % 60 === 0) play_beep(0.3, 660);
  }, [round_time, running, play_beep]);

  const handle_round_reset = () => {
    if (round_time > 0) set_previous_round_times((prev) => [...prev, round_time]);
    set_round_time(0);
  };

  const ring_progress = (round_time % 60) / 60;
  const minutes = Math.floor(round_time / 60).toString().padStart(2, "0");
  const seconds = (round_time % 60).toString().padStart(2, "0");
  const round_number = previous_round_times.length + 1;
  const status_text = running ? `Round ${round_number} in progress` : total_time > 0 ? "Paused" : "Ready";

  const btn_cls = (fs: boolean) =>
    `flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"} font-semibold transition-colors`;
  const outline_cls = (fs: boolean) =>
    `flex-1 flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl ${fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"} font-semibold transition-colors`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Round Timer</h1>
        <div className="mt-4 mb-8">
          <TimerShell
            timer_label="Round Timer"
            status_text={status_text}
            audio_enabled={audio_enabled}
            on_toggle_audio={toggle_audio}
            controls={({ is_fullscreen: fs }) => (
              <div className="flex flex-col gap-3 w-full max-w-sm">
                <button onClick={handle_round_reset} className={btn_cls(fs)}>
                  <RotateCcw className="w-5 h-5" /> Next Round
                </button>
                <button onClick={() => set_running(!running)} className={outline_cls(fs)}>
                  {running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> {total_time > 0 ? "Resume" : "Start"}</>}
                </button>
              </div>
            )}
          >
            {({ is_fullscreen: fs }) => (
              <>
                {/* Total time */}
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                  <span className="text-xs uppercase tracking-wide font-headline font-bold">Total</span>
                  <span className="font-semibold">{format_time(total_time)}</span>
                </div>

                <div className={RING_NORMAL}>
                  <ProgressRing progress={ring_progress} color="var(--secondary)" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`flex items-baseline ${fs ? "gap-3" : "gap-1.5"}`}>
                      <div className="flex flex-col items-center">
                        <span className={`${fs ? "text-7xl sm:text-8xl" : "text-4xl sm:text-5xl md:text-7xl"} font-headline font-black text-foreground`}>{minutes}</span>
                        <span className={`${fs ? "text-sm" : "text-[10px] sm:text-xs"} uppercase tracking-wider text-muted-foreground mt-1`}>Minutes</span>
                      </div>
                      <span className={`${fs ? "text-7xl sm:text-8xl mb-8" : "text-4xl sm:text-5xl md:text-7xl mb-4 sm:mb-5"} font-headline font-black text-foreground`}>:</span>
                      <div className="flex flex-col items-center">
                        <span className={`${fs ? "text-7xl sm:text-8xl" : "text-4xl sm:text-5xl md:text-7xl"} font-headline font-black text-foreground`}>{seconds}</span>
                        <span className={`${fs ? "text-sm" : "text-[10px] sm:text-xs"} uppercase tracking-wider text-muted-foreground mt-1`}>Seconds</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Round history */}
                {!fs && previous_round_times.length > 0 && (
                  <div className="w-full max-h-24 md:max-h-48 overflow-y-auto">
                    <div className="flex flex-col gap-1.5">
                      {previous_round_times.map((time, i) => (
                        <div key={i} className="flex justify-between items-center py-2 px-3 bg-surface-container-low rounded-xl">
                          <span className="text-xs md:text-sm font-headline font-bold text-foreground">Round {i + 1}</span>
                          <span className="text-xs md:text-sm font-mono font-semibold text-foreground">{format_time(time)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TimerShell>
        </div>

        <section className="w-full max-w-md mx-auto px-1 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Free online turn timer and round tracker. Ideal for board game tournaments, strategy games, and timeboxing sessions.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function RoundTimerPage() {
  return (
    <Suspense>
      <RoundTimerContent />
    </Suspense>
  );
}
