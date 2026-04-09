"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Volume2, VolumeX, RotateCcw, Pause, Play } from "lucide-react";

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

function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const dash_offset = CIRCUMFERENCE * (1 - progress);
  return (
    <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="w-full h-full -rotate-90">
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={STROKE_WIDTH}
      />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dash_offset}
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
    </svg>
  );
}

function TimeDisplay({ seconds }: { seconds: number }) {
  const formatted = format_time(seconds);
  const parts = formatted.split(":");
  const labels =
    parts.length === 3
      ? ["Hours", "Minutes", "Seconds"]
      : ["Minutes", "Seconds"];

  return (
    <div className="flex items-baseline gap-1.5 sm:gap-2">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-800 mb-4 sm:mb-5">
              :
            </span>
          )}
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-800 font-mono">
              {part}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mt-1">
              {labels[i]}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ---- Countdown Timer ----
function CountdownTimer({
  duration,
  audio_enabled,
  play_beep,
}: {
  duration: number;
  audio_enabled: boolean;
  play_beep: (dur?: number, freq?: number) => void;
}) {
  const [remaining, set_remaining] = useState(duration);
  const [running, set_running] = useState(false);
  const prev_remaining = useRef(remaining);

  useEffect(() => {
    set_remaining(duration);
    set_running(false);
  }, [duration]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => {
      set_remaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  useEffect(() => {
    if (running && remaining > 0 && remaining <= 10 && prev_remaining.current !== remaining) {
      play_beep();
    }
    if (running && remaining === 0 && prev_remaining.current !== 0) {
      play_beep(1.2, 1200);
    }
    prev_remaining.current = remaining;
  }, [remaining, running, play_beep]);

  const progress = duration > 0 ? remaining / duration : 0;

  return {
    display: (
      <div className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-80 md:h-80 flex items-center justify-center">
        <ProgressRing progress={progress} color="#3B82F6" />
        <div className="absolute inset-0 flex items-center justify-center">
          <TimeDisplay seconds={remaining} />
        </div>
      </div>
    ),
    controls: (
      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={() => set_running(!running)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 sm:py-4 text-base font-semibold transition-colors"
        >
          {running ? (
            <>
              <Pause className="w-5 h-5" /> Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" /> {remaining < duration ? "Resume" : "Start"}
            </>
          )}
        </button>
        <button
          onClick={() => {
            set_remaining(duration);
            set_running(false);
          }}
          disabled={remaining === duration && !running}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-3 sm:py-4 px-5 text-base font-semibold transition-colors disabled:opacity-40"
        >
          <RotateCcw className="w-5 h-5" /> Reset
        </button>
      </div>
    ),
    status_text: remaining === 0 ? "Time's up!" : running ? "Counting down..." : "Ready",
  };
}

// ---- Stopwatch Timer ----
function StopwatchTimer() {
  const [elapsed, set_elapsed] = useState(0);
  const [running, set_running] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      set_elapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  return {
    display: (
      <div className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-80 md:h-80 flex items-center justify-center">
        <ProgressRing progress={1} color="#10B981" />
        <div className="absolute inset-0 flex items-center justify-center">
          <TimeDisplay seconds={elapsed} />
        </div>
      </div>
    ),
    controls: (
      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={() => set_running(!running)}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 sm:py-4 text-base font-semibold transition-colors"
        >
          {running ? (
            <>
              <Pause className="w-5 h-5" /> Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" /> {elapsed > 0 ? "Resume" : "Start"}
            </>
          )}
        </button>
        <button
          onClick={() => {
            set_elapsed(0);
            set_running(false);
          }}
          disabled={elapsed === 0 && !running}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-3 sm:py-4 px-5 text-base font-semibold transition-colors disabled:opacity-40"
        >
          <RotateCcw className="w-5 h-5" /> Reset
        </button>
      </div>
    ),
    status_text: running ? "Stopwatch running" : elapsed > 0 ? "Paused" : "Ready",
  };
}

// ---- Interval Timer ----
function IntervalTimer({
  work_seconds,
  rest_seconds,
  rounds,
  audio_enabled,
  play_beep,
}: {
  work_seconds: number;
  rest_seconds: number;
  rounds: number;
  audio_enabled: boolean;
  play_beep: (dur?: number, freq?: number) => void;
}) {
  const [phase, set_phase] = useState<"work" | "rest">("work");
  const [current_round, set_current_round] = useState(1);
  const [remaining, set_remaining] = useState(work_seconds);
  const [running, set_running] = useState(false);
  const [finished, set_finished] = useState(false);
  const prev_remaining = useRef(remaining);

  function reset_all() {
    set_phase("work");
    set_current_round(1);
    set_remaining(work_seconds);
    set_running(false);
    set_finished(false);
  }

  useEffect(() => {
    reset_all();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work_seconds, rest_seconds, rounds]);

  useEffect(() => {
    if (!running || finished) return;
    const interval = setInterval(() => {
      set_remaining((prev) => {
        if (prev > 1) return prev - 1;
        // Time to switch
        if (phase === "work") {
          if (rest_seconds > 0) {
            set_phase("rest");
            play_beep(0.5, 660);
            return rest_seconds;
          }
          // No rest, go to next round
          if (current_round < rounds) {
            set_current_round((r) => r + 1);
            play_beep(0.5, 660);
            return work_seconds;
          }
          // Done
          set_finished(true);
          set_running(false);
          play_beep(1.2, 1200);
          return 0;
        } else {
          // End of rest
          if (current_round < rounds) {
            set_phase("work");
            set_current_round((r) => r + 1);
            play_beep(0.3, 880);
            return work_seconds;
          }
          // Done
          set_finished(true);
          set_running(false);
          play_beep(1.2, 1200);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, finished, phase, current_round, rounds, work_seconds, rest_seconds, play_beep]);

  useEffect(() => {
    if (running && remaining > 0 && remaining <= 3 && prev_remaining.current !== remaining) {
      play_beep();
    }
    prev_remaining.current = remaining;
  }, [remaining, running, play_beep]);

  const phase_duration = phase === "work" ? work_seconds : rest_seconds;
  const progress = phase_duration > 0 ? remaining / phase_duration : 0;
  const ring_color = phase === "work" ? "#EF4444" : "#3B82F6";

  return {
    display: (
      <div className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-80 md:h-80 flex items-center justify-center">
        <ProgressRing progress={progress} color={ring_color} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 ${
              phase === "work" ? "text-red-500" : "text-blue-500"
            }`}
          >
            {finished ? "Done!" : phase === "work" ? "Work" : "Rest"}
          </span>
          <TimeDisplay seconds={remaining} />
          <span className="text-xs text-gray-400 mt-2">
            Round {current_round} / {rounds}
          </span>
        </div>
      </div>
    ),
    controls: (
      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={() => {
            if (finished) {
              reset_all();
            } else {
              set_running(!running);
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-2xl py-3 sm:py-4 text-base font-semibold transition-colors"
        >
          {finished ? (
            <>
              <RotateCcw className="w-5 h-5" /> Restart
            </>
          ) : running ? (
            <>
              <Pause className="w-5 h-5" /> Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" /> {remaining < phase_duration ? "Resume" : "Start"}
            </>
          )}
        </button>
        {!finished && (
          <button
            onClick={reset_all}
            disabled={remaining === work_seconds && current_round === 1 && phase === "work" && !running}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-3 sm:py-4 px-5 text-base font-semibold transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-5 h-5" /> Reset
          </button>
        )}
      </div>
    ),
    status_text: finished
      ? "Workout complete!"
      : running
      ? `${phase === "work" ? "Working" : "Resting"} - Round ${current_round}/${rounds}`
      : "Ready",
  };
}

// ---- Main Widget ----
export default function TimerWidget({ timer_type, config }: TimerWidgetProps) {
  const [audio_enabled, set_audio_enabled] = useState(false);
  const audio_context_ref = useRef<AudioContext | null>(null);

  const toggle_audio = () => {
    if (!audio_enabled) {
      try {
        if (!audio_context_ref.current) {
          audio_context_ref.current = new (
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })?.webkitAudioContext
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

  const play_beep = useCallback(
    (duration = 0.15, frequency = 880) => {
      if (!audio_enabled || !audio_context_ref.current) return;
      try {
        const ctx = audio_context_ref.current;
        if (ctx.state === "suspended") {
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
    },
    [audio_enabled]
  );

  let timer_result: { display: React.ReactNode; controls: React.ReactNode; status_text: string };

  if (timer_type === "stopwatch") {
    timer_result = StopwatchTimer();
  } else if (timer_type === "interval") {
    timer_result = IntervalTimer({
      work_seconds: config.work_seconds ?? 30,
      rest_seconds: config.rest_seconds ?? 10,
      rounds: config.rounds ?? 8,
      audio_enabled,
      play_beep,
    });
  } else {
    // countdown (default)
    timer_result = CountdownTimer({
      duration: config.duration ?? 60,
      audio_enabled,
      play_beep,
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-12 flex flex-col items-center gap-4 sm:gap-5 md:gap-6 w-full max-w-md md:max-w-lg mx-auto relative">
      {/* Audio toggle */}
      <button
        aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
        onClick={toggle_audio}
        className={`absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          audio_enabled ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {audio_enabled ? (
          <Volume2 className="text-blue-600 w-5 h-5" />
        ) : (
          <VolumeX className="text-gray-500 w-5 h-5" />
        )}
      </button>

      {/* Status */}
      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        {timer_type === "interval" ? "Interval Timer" : timer_type === "stopwatch" ? "Stopwatch" : "Countdown Timer"}
      </div>

      <p className="text-gray-500 text-sm">{timer_result.status_text}</p>

      {/* Timer display */}
      {timer_result.display}

      {/* Controls */}
      {timer_result.controls}
    </div>
  );
}
