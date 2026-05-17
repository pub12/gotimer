"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { SkipForward, SkipBack } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { useTimer } from "@/components/timer/timer-provider";
import { multiPlayerTurnTimerStrategy } from "@/lib/timer-strategies/multi-player-turn-timer";
import type {
  MPMode,
  MPConfig,
} from "@/lib/timer-strategies/multi-player-turn-timer";
import { PlayerRoster } from "./player-roster";
import {
  PlayerConfigurator,
  type MultiPlayerConfig,
} from "./player-configurator";

const VALID_MODES: MPMode[] = ["per-turn", "time-bank", "hybrid"];

function parse_mode(value: string | null, fallback: MPMode): MPMode {
  if (value && VALID_MODES.includes(value as MPMode)) return value as MPMode;
  return fallback;
}

function parse_int(value: string | null, fallback: number, min = 1, max = 86400): number {
  if (!value) return fallback;
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < min || n > max) return fallback;
  return n;
}

function parse_players(value: string | null, fallback: string[]): string[] {
  if (!value) return fallback;
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 8);
  if (parts.length < 2) return fallback;
  return parts;
}

interface MultiPlayerTurnTimerProps {
  /** Label shown above the timer ring. */
  label: string;
  /** Description text below the ring. */
  description?: string;
  /** Default config used when URL params are absent. */
  defaults: {
    player_names: string[];
    mode: MPMode;
    per_turn: number;
    bank: number;
    warning_at: number;
  };
  min_players?: number;
  max_players?: number;
  /** Rendered below the timer + roster (SEO content). */
  seo_content?: React.ReactNode;
}

interface InnerProps {
  show_back_button: boolean;
}

function ActionExtras({ show_back_button }: InnerProps) {
  const { machine } = useTimer();
  const { status, action } = machine;
  if (status !== "running") return null;
  return (
    <>
      {show_back_button && (
        <button
          type="button"
          onClick={() => action("previous_player")}
          className="flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl py-3 sm:py-4 px-4 text-base font-semibold transition-colors"
          aria-label="Previous player"
        >
          <SkipBack className="w-5 h-5" />
        </button>
      )}
      <button
        type="button"
        onClick={() => action("next_player")}
        className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl py-3 sm:py-4 px-6 text-base font-semibold transition-colors"
      >
        <SkipForward className="w-5 h-5" /> Next Player
      </button>
    </>
  );
}

function MultiPlayerTimerContent({
  label,
  description,
  defaults,
  min_players = 2,
  max_players = 8,
  seo_content,
}: MultiPlayerTurnTimerProps) {
  const params = useSearchParams();

  const initial_config: MultiPlayerConfig = useMemo(() => {
    return {
      player_names: parse_players(params.get("players"), defaults.player_names).slice(
        0,
        max_players,
      ),
      mode: parse_mode(params.get("mode"), defaults.mode),
      per_turn: parse_int(params.get("per_turn"), defaults.per_turn, 5, 86400),
      bank: parse_int(params.get("bank"), defaults.bank, 30, 86400),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const warning_at = parse_int(params.get("warning_at"), defaults.warning_at, 1, 600);

  const [config, set_config] = useState<MultiPlayerConfig>(initial_config);
  const [started, set_started] = useState(false);

  // Sync URL whenever config changes (configurator screen).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URLSearchParams(window.location.search);
    url.set("players", config.player_names.join(","));
    url.set("mode", config.mode);
    if (config.mode !== "time-bank") url.set("per_turn", String(config.per_turn));
    else url.delete("per_turn");
    if (config.mode !== "per-turn") url.set("bank", String(config.bank));
    else url.delete("bank");
    const search = url.toString();
    const path = window.location.pathname + (search ? `?${search}` : "");
    window.history.replaceState(null, "", path);
  }, [config]);

  const timer_config = useMemo<MPConfig>(
    () => ({
      player_names: config.player_names,
      mode: config.mode,
      per_turn: config.per_turn,
      bank: config.bank,
      warning_at,
    }),
    [config, warning_at],
  );

  if (!started) {
    return (
      <>
        <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
          <h1 className="sr-only">{label}</h1>
          <div className="mt-4 mb-6 w-full max-w-md mx-auto text-center">
            <h2 className="text-2xl font-headline font-bold text-foreground">{label}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <PlayerConfigurator
            config={config}
            on_change={set_config}
            on_start={() => set_started(true)}
            min_players={min_players}
            max_players={max_players}
          />
        </main>
        {seo_content}
      </>
    );
  }

  return (
    <TimerPage
      key={JSON.stringify(timer_config)}
      strategy={multiPlayerTurnTimerStrategy}
      config={timer_config}
      label={label}
      description={description}
      on_configure={() => set_started(false)}
      control_extra={<ActionExtras show_back_button={true} />}
      below={
        <div className="w-full mt-4">
          <PlayerRoster />
        </div>
      }
      seo_content={seo_content}
    />
  );
}

export function MultiPlayerTurnTimerView(props: MultiPlayerTurnTimerProps) {
  return (
    <Suspense>
      <MultiPlayerTimerContent {...props} />
    </Suspense>
  );
}
