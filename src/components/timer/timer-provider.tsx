"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useAudio, useFullscreen, useWakeLock } from "@/hooks/timer";
import { useTimerStateMachine } from "@/hooks/timer/use-timer-state-machine";
import type { TimerMachine } from "@/hooks/timer/use-timer-state-machine";
import type { TimerStrategy } from "@/lib/timer-strategies/types";
import type { SoundPreset } from "@/hooks/timer/use-audio";

export interface TimerContextValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  machine: TimerMachine<any>;
  audio: {
    enabled: boolean;
    toggle: () => void;
    play_beep: (duration?: number, frequency?: number) => void;
    play_preset: (preset: SoundPreset) => void;
  };
  fullscreen: {
    is_fullscreen: boolean;
    toggle: () => void;
    ref: React.RefObject<HTMLDivElement | null>;
  };
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function useTimer(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within a TimerProvider");
  return ctx;
}

interface TimerProviderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strategy: TimerStrategy<any>;
  config: unknown;
  children: React.ReactNode;
}

export function TimerProvider({ strategy, config, children }: TimerProviderProps) {
  const machine = useTimerStateMachine(strategy, config);
  const audio = useAudio();
  const fullscreen = useFullscreen();

  // Keep screen awake while timer is running or in fullscreen mode
  useWakeLock(machine.status === "running" || fullscreen.is_fullscreen);

  // Fire audio for warnings
  const fired_warnings = useRef(new Set<string>());
  useEffect(() => {
    for (const w of machine.warnings) {
      if (!fired_warnings.current.has(w.key)) {
        fired_warnings.current.add(w.key);
        audio.play_preset(w.type);
      }
    }
  }, [machine.warnings, audio]);

  // Reset fired warnings on reset
  useEffect(() => {
    if (machine.status === "idle") {
      fired_warnings.current.clear();
    }
  }, [machine.status]);

  const value: TimerContextValue = { machine, audio, fullscreen };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}
