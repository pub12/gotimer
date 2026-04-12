"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Pause, Play } from "lucide-react";
import TimerShell from "@/components/shared/timer-shell";

interface TimerWidgetProps {
  timer_type: string; // "countdown" | "interval" | "stopwatch"
  config: {
    duration?: number;
    work_seconds?: number;
    rest_seconds?: number;
    rounds?: number;
  };
}

function format_time(total_seconds: number): string {
  const h = Math.floor(total_seconds / 3600);
  const m = Math.floor((total_seconds % 3600) / 60);
  const s = total_seconds % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

// SVG ring constants
const RING_SIZE = 280;
const STROKE_WIDTH = 12;
const RADIUS = 134;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RING_NORMAL = "relative w-56 h-56 sm:w-60 sm:h-60 md:w-80 md:h-80 flex items-center justify-center";
const RING_FULLSCREEN = "relative w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] md:w-[34rem] md:h-[34rem] flex items-center justify-center";

function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const dash_offset = CIRCUMFERENCE * (1 - progress);
  return (
    <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="w-full h-full -rotate-90">
      <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none"
        stroke="var(--surface-container-high)" strokeWidth={STROKE_WIDTH} />
      <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none"
        stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dash_offset}
        style={{ transition: "stroke-dashoffset 0.3s ease" }} />
    </svg>
  );
}

function TimeDisplay({ seconds }: { seconds: number; large?: boolean }) {
  const formatted = format_time(seconds);
  const parts = formatted.split(":");
  const has_hours = parts.length === 3;
  const labels = has_hours ? ["Hours", "Minutes", "Seconds"] : ["Minutes", "Seconds"];

  // Smaller digits when HH:MM:SS to fit inside ring
  const digit_class = has_hours
    ? "text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground"
    : "text-4xl sm:text-5xl md:text-7xl font-headline font-black text-foreground";
  const colon_class = has_hours
    ? "text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground mb-3 sm:mb-4"
    : "text-4xl sm:text-5xl md:text-7xl font-headline font-black text-foreground mb-4 sm:mb-5";
  const label_class = "text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1";

  return (
    <div className={`flex items-baseline ${has_hours ? "gap-1 sm:gap-1.5" : "gap-1.5 sm:gap-2"}`}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={colon_class}>:</span>}
          <div className="flex flex-col items-center">
            <span className={digit_class}>{part}</span>
            <span className={label_class}>{labels[i]}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ---- Countdown Timer ----
function useCountdownTimer(duration: number, play_beep: (dur?: number, freq?: number) => void) {
  const [remaining, set_remaining] = useState(duration);
  const [running, set_running] = useState(false);
  const prev_remaining = useRef(remaining);

  useEffect(() => { set_remaining(duration); set_running(false); }, [duration]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => set_remaining((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  useEffect(() => {
    if (running && remaining > 0 && remaining <= 10 && prev_remaining.current !== remaining) play_beep();
    if (running && remaining === 0 && prev_remaining.current !== 0) play_beep(1.2, 1200);
    prev_remaining.current = remaining;
  }, [remaining, running, play_beep]);

  const progress = duration > 0 ? remaining / duration : 0;

  return {
    remaining, running, progress, set_running,
    reset: () => { set_remaining(duration); set_running(false); },
    status_text: remaining === 0 ? "Time's up!" : running ? "Counting down..." : "Ready",
  };
}

// ---- Stopwatch Timer ----
function useStopwatchTimer() {
  const [elapsed, set_elapsed] = useState(0);
  const [running, set_running] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => set_elapsed((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  return {
    elapsed, running, set_running,
    reset: () => { set_elapsed(0); set_running(false); },
    status_text: running ? "Stopwatch running" : elapsed > 0 ? "Paused" : "Ready",
  };
}

// ---- Interval Timer ----
function useIntervalTimer(work_seconds: number, rest_seconds: number, rounds: number, play_beep: (dur?: number, freq?: number) => void) {
  const [phase, set_phase] = useState<"work" | "rest">("work");
  const [current_round, set_current_round] = useState(1);
  const [remaining, set_remaining] = useState(work_seconds);
  const [running, set_running] = useState(false);
  const [finished, set_finished] = useState(false);
  const prev_remaining = useRef(remaining);

  function reset_all() {
    set_phase("work"); set_current_round(1); set_remaining(work_seconds); set_running(false); set_finished(false);
  }

  useEffect(() => { reset_all(); }, [work_seconds, rest_seconds, rounds]);

  useEffect(() => {
    if (!running || finished) return;
    const interval = setInterval(() => {
      set_remaining((prev) => {
        if (prev > 1) return prev - 1;
        if (phase === "work") {
          if (rest_seconds > 0) { set_phase("rest"); play_beep(0.5, 660); return rest_seconds; }
          if (current_round < rounds) { set_current_round((r) => r + 1); play_beep(0.5, 660); return work_seconds; }
          set_finished(true); set_running(false); play_beep(1.2, 1200); return 0;
        } else {
          if (current_round < rounds) { set_phase("work"); set_current_round((r) => r + 1); play_beep(0.3, 880); return work_seconds; }
          set_finished(true); set_running(false); play_beep(1.2, 1200); return 0;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, finished, phase, current_round, rounds, work_seconds, rest_seconds, play_beep]);

  useEffect(() => {
    if (running && remaining > 0 && remaining <= 3 && prev_remaining.current !== remaining) play_beep();
    prev_remaining.current = remaining;
  }, [remaining, running, play_beep]);

  const phase_duration = phase === "work" ? work_seconds : rest_seconds;
  const progress = phase_duration > 0 ? remaining / phase_duration : 0;
  const ring_color = phase === "work" ? "var(--secondary)" : "var(--primary)";

  return {
    phase, current_round, remaining, running, finished, progress, ring_color, phase_duration, rounds,
    set_running, reset_all,
    status_text: finished ? "Workout complete!" : running ? `${phase === "work" ? "Working" : "Resting"} - Round ${current_round}/${rounds}` : "Ready",
  };
}

// ---- Main Widget ----
export default function TimerWidget({ timer_type, config }: TimerWidgetProps) {
  const search_params = useSearchParams();
  const [audio_enabled, set_audio_enabled] = useState(false);
  const audio_context_ref = useRef<AudioContext | null>(null);

  // Read initial values from URL query params
  const initial_duration = Number(search_params.get("duration")) || config.duration || 60;
  const initial_work = Number(search_params.get("work")) || config.work_seconds || 30;
  const initial_rest = Number(search_params.get("rest")) || config.rest_seconds || 10;
  const initial_rounds = Number(search_params.get("rounds")) || config.rounds || 8;

  const [user_duration, set_user_duration] = useState(initial_duration);
  const [user_work, set_user_work] = useState(initial_work);
  const [user_rest, set_user_rest] = useState(initial_rest);
  const [user_rounds, set_user_rounds] = useState(initial_rounds);

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

  // Timer hooks
  const countdown = useCountdownTimer(user_duration, play_beep);
  const stopwatch = useStopwatchTimer();
  const interval = useIntervalTimer(user_work, user_rest, user_rounds, play_beep);

  const timer_label = timer_type === "interval" ? "Interval Timer" : timer_type === "stopwatch" ? "Stopwatch" : "Countdown Timer";

  const status_text = timer_type === "stopwatch" ? stopwatch.status_text
    : timer_type === "interval" ? interval.status_text
    : countdown.status_text;

  const btn_cls = (fs: boolean) =>
    `flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"} font-semibold transition-colors`;
  const reset_cls = (fs: boolean) =>
    `flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl ${fs ? "py-4 sm:py-5 px-6 text-lg" : "py-3 sm:py-4 px-5 text-base"} font-semibold transition-colors disabled:opacity-40`;

  return (
    <TimerShell
      timer_label={timer_label}
      status_text={status_text}
      audio_enabled={audio_enabled}
      on_toggle_audio={toggle_audio}
      duration={timer_type === "countdown" ? { value: user_duration, onChange: set_user_duration } : undefined}
      interval={timer_type === "interval" ? {
        work: user_work, on_work_change: set_user_work,
        rest: user_rest, on_rest_change: set_user_rest,
        rounds: user_rounds, on_rounds_change: set_user_rounds,
      } : undefined}
      defaults={{
        duration: config.duration ?? 60,
        work: config.work_seconds ?? 30,
        rest: config.rest_seconds ?? 10,
        rounds: config.rounds ?? 8,
      }}
      remaining={timer_type === "countdown" ? countdown.remaining : timer_type === "interval" ? interval.remaining : undefined}
      running={timer_type === "countdown" ? countdown.running : timer_type === "interval" ? interval.running : stopwatch.running}
      controls={({ is_fullscreen: fs }) => {
        if (timer_type === "stopwatch") {
          return (
            <div className={`flex gap-3 ${fs ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
              <button onClick={() => stopwatch.set_running(!stopwatch.running)}
                className={btn_cls(fs).replace("bg-secondary", "bg-accent").replace("hover:bg-secondary/90", "hover:bg-accent/90").replace("text-secondary-foreground", "text-white")}>
                {stopwatch.running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> {stopwatch.elapsed > 0 ? "Resume" : "Start"}</>}
              </button>
              <button onClick={stopwatch.reset} disabled={stopwatch.elapsed === 0 && !stopwatch.running} className={reset_cls(fs)}>
                <RotateCcw className="w-5 h-5" /> Reset
              </button>
            </div>
          );
        }
        if (timer_type === "interval") {
          return (
            <div className={`flex gap-3 ${fs ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
              <button onClick={() => interval.finished ? interval.reset_all() : interval.set_running(!interval.running)} className={btn_cls(fs)}>
                {interval.finished ? <><RotateCcw className="w-5 h-5" /> Restart</> : interval.running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> {interval.remaining < interval.phase_duration ? "Resume" : "Start"}</>}
              </button>
              {!interval.finished && (
                <button onClick={interval.reset_all} disabled={interval.remaining === user_work && interval.current_round === 1 && interval.phase === "work" && !interval.running} className={reset_cls(fs)}>
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
              )}
            </div>
          );
        }
        // countdown
        return (
          <div className={`flex gap-3 ${fs ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
            <button onClick={() => countdown.set_running(!countdown.running)} className={btn_cls(fs)}>
              {countdown.running ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> {countdown.remaining < user_duration ? "Resume" : "Start"}</>}
            </button>
            <button onClick={countdown.reset} disabled={countdown.remaining === user_duration && !countdown.running} className={reset_cls(fs)}>
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
          </div>
        );
      }}
    >
      {({ ring_color }) => {
        const rc = ring_color || "var(--secondary)";
        if (timer_type === "stopwatch") {
          return (
            <div className={RING_NORMAL}>
              <ProgressRing progress={1} color={ring_color || "var(--accent)"} />
              <div className="absolute inset-0 flex items-center justify-center">
                <TimeDisplay seconds={stopwatch.elapsed} large={false} />
              </div>
            </div>
          );
        }
        if (timer_type === "interval") {
          return (
            <div className={RING_NORMAL}>
              <ProgressRing progress={interval.progress} color={ring_color || interval.ring_color} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xs sm:text-sm font-headline font-black uppercase tracking-widest mb-1 ${interval.phase === "work" ? "text-secondary" : "text-primary"}`}>
                  {interval.finished ? "Done!" : interval.phase === "work" ? "Work" : "Rest"}
                </span>
                <TimeDisplay seconds={interval.remaining} large={false} />
                <span className="text-xs mt-2 text-muted-foreground">
                  Round {interval.current_round} / {interval.rounds}
                </span>
              </div>
            </div>
          );
        }
        // countdown
        return (
          <div className={RING_NORMAL}>
            <ProgressRing progress={countdown.progress} color={rc} />
            <div className="absolute inset-0 flex items-center justify-center">
              <TimeDisplay seconds={countdown.remaining} large={false} />
            </div>
          </div>
        );
      }}
    </TimerShell>
  );
}
