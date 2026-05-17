"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, X, Plus, Volume2, VolumeX, Link2, Check } from "lucide-react";
import { TEA_PRESETS, DEFAULT_TEA_CUPS } from "@/lib/tea-presets";

interface Cup {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  running: boolean;
}

/**
 * Multi-cup brewing grid for the /kitchen/tea-timer/multi-cup leaf.
 *
 * Self-contained client component:
 * - 3 default cups (green/oolong/black) seeded from `DEFAULT_TEA_CUPS`
 * - Add/remove cups (1-6, mobile-capped at 4)
 * - Per-cup tea-type dropdown that resets duration to the type's default
 * - Per-cup start/pause/reset, individual chime on completion
 * - Shareable URL (?cups=...) encodes the current set
 */
export function TeaCupGrid() {
  const [cups, set_cups] = useState<Cup[]>(() => seed_from_url());
  const [audio_enabled, set_audio_enabled] = useState(false);
  const [link_copied, set_link_copied] = useState(false);
  const audio_ctx = useRef<AudioContext | null>(null);
  const beeped = useRef(new Set<string>());

  // Tick running cups
  useEffect(() => {
    const has_running = cups.some((c) => c.running && c.remaining > 0);
    if (!has_running) return;
    const interval = setInterval(() => {
      set_cups((prev) =>
        prev.map((c) =>
          c.running && c.remaining > 0 ? { ...c, remaining: c.remaining - 1 } : c,
        ),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [cups]);

  // Chime when a cup finishes
  useEffect(() => {
    if (!audio_enabled) return;
    for (const c of cups) {
      if (c.remaining === 0 && c.running && !beeped.current.has(c.id)) {
        beeped.current.add(c.id);
        play_beep(audio_ctx, 1.0, 900);
      }
    }
  }, [cups, audio_enabled]);

  // Persist to URL
  useEffect(() => {
    const encoded = encode_cups(cups);
    const url = `${window.location.pathname}${encoded ? `?cups=${encoded}` : ""}`;
    window.history.replaceState(null, "", url);
  }, [cups]);

  const start_all = useCallback(() => {
    set_cups((prev) =>
      prev.map((c) => (c.remaining > 0 ? { ...c, running: true } : c)),
    );
  }, []);

  const pause_all = useCallback(() => {
    set_cups((prev) => prev.map((c) => ({ ...c, running: false })));
  }, []);

  const reset_all = useCallback(() => {
    set_cups((prev) =>
      prev.map((c) => ({ ...c, remaining: c.duration, running: false })),
    );
    beeped.current.clear();
  }, []);

  const toggle_run = (id: string) => {
    set_cups((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, running: c.remaining > 0 ? !c.running : false }
          : c,
      ),
    );
  };

  const reset_one = (id: string) => {
    beeped.current.delete(id);
    set_cups((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, remaining: c.duration, running: false } : c,
      ),
    );
  };

  const remove_cup = (id: string) => {
    beeped.current.delete(id);
    set_cups((prev) => prev.filter((c) => c.id !== id));
  };

  const set_tea_type = (id: string, type_key: string) => {
    const preset = TEA_PRESETS[type_key];
    if (!preset) return;
    set_cups((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: preset.name,
              duration: preset.steep_seconds,
              remaining: preset.steep_seconds,
              running: false,
            }
          : c,
      ),
    );
  };

  const add_cup = () => {
    if (cups.length >= 6) return;
    const next_idx = cups.length;
    const default_keys = ["green", "oolong", "black", "white", "pu-erh", "herbal"];
    const key = default_keys[next_idx] || "green";
    const preset = TEA_PRESETS[key];
    set_cups((prev) => [
      ...prev,
      {
        id: `cup-${Date.now()}-${next_idx}`,
        name: preset.name,
        duration: preset.steep_seconds,
        remaining: preset.steep_seconds,
        running: false,
      },
    ]);
  };

  const toggle_audio = () => {
    if (!audio_enabled) {
      if (!audio_ctx.current) audio_ctx.current = new AudioContext();
      set_audio_enabled(true);
    } else {
      set_audio_enabled(false);
    }
  };

  const copy_link = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      set_link_copied(true);
      setTimeout(() => set_link_copied(false), 2000);
    });
  };

  const any_running = cups.some((c) => c.running);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 px-1">
        <button
          type="button"
          onClick={any_running ? pause_all : start_all}
          disabled={cups.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40"
        >
          {any_running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {any_running ? "Pause all" : "Start all"}
        </button>
        <button
          type="button"
          onClick={reset_all}
          disabled={cups.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-foreground text-sm disabled:opacity-40"
        >
          <RotateCcw className="w-4 h-4" />
          Reset all
        </button>
        <button
          type="button"
          onClick={add_cup}
          disabled={cups.length >= 6}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-foreground text-sm disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          Add cup
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggle_audio}
            aria-label={audio_enabled ? "Disable audio cues" : "Enable audio cues"}
            className="p-2 rounded-lg bg-surface-container-high text-foreground"
          >
            {audio_enabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={copy_link}
            aria-label="Copy shareable link"
            className="p-2 rounded-lg bg-surface-container-high text-foreground"
          >
            {link_copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Cup grid */}
      {cups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No cups yet. Tap{" "}
          <button
            type="button"
            onClick={add_cup}
            className="underline underline-offset-2"
          >
            Add cup
          </button>{" "}
          to start brewing.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cups.map((cup) => (
            <CupCard
              key={cup.id}
              cup={cup}
              on_toggle={() => toggle_run(cup.id)}
              on_reset={() => reset_one(cup.id)}
              on_remove={() => remove_cup(cup.id)}
              on_type_change={(t) => set_tea_type(cup.id, t)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CupCard({
  cup,
  on_toggle,
  on_reset,
  on_remove,
  on_type_change,
}: {
  cup: Cup;
  on_toggle: () => void;
  on_reset: () => void;
  on_remove: () => void;
  on_type_change: (type_key: string) => void;
}) {
  const done = cup.remaining === 0;
  const progress = cup.duration > 0 ? 1 - cup.remaining / cup.duration : 0;
  const mm = Math.floor(cup.remaining / 60)
    .toString()
    .padStart(1, "0");
  const ss = (cup.remaining % 60).toString().padStart(2, "0");
  const current_key =
    Object.keys(TEA_PRESETS).find(
      (k) => TEA_PRESETS[k].name === cup.name,
    ) ?? "";

  return (
    <div
      className={`rounded-xl p-4 border ${
        done
          ? "border-green-500/60 bg-green-500/5"
          : "border-border bg-surface-container-low"
      }`}
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <select
          value={current_key}
          onChange={(e) => on_type_change(e.target.value)}
          className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer min-w-0 flex-1"
          aria-label="Tea type"
        >
          {!current_key && (
            <option value="" disabled>
              {cup.name}
            </option>
          )}
          {Object.values(TEA_PRESETS).map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={on_remove}
          aria-label="Remove cup"
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        className={`text-4xl font-bold tabular-nums tracking-tight my-3 ${
          done ? "text-green-600" : "text-foreground"
        }`}
      >
        {done ? "Done!" : `${mm}:${ss}`}
      </div>

      <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${done ? "bg-green-500" : "bg-primary"}`}
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={on_toggle}
          disabled={done}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40"
        >
          {cup.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {cup.running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={on_reset}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-foreground text-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// URL serialization
// ---------------------------------------------------------------------------

function seed_from_url(): Cup[] {
  if (typeof window === "undefined") return defaults();
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("cups");
  if (!raw) return defaults();
  try {
    return raw.split("|").map((seg, i) => {
      const [name, dur] = seg.split(":");
      const duration = Number(dur);
      return {
        id: `cup-${i}`,
        name: decodeURIComponent(name),
        duration,
        remaining: duration,
        running: false,
      };
    });
  } catch {
    return defaults();
  }
}

function defaults(): Cup[] {
  return DEFAULT_TEA_CUPS.map((c) => ({
    ...c,
    remaining: c.duration,
    running: false,
  }));
}

function encode_cups(cups: Cup[]): string {
  if (cups.length === 0) return "";
  return cups.map((c) => `${encodeURIComponent(c.name)}:${c.duration}`).join("|");
}

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------

function play_beep(
  ctx_ref: React.MutableRefObject<AudioContext | null>,
  dur = 0.15,
  freq = 880,
) {
  try {
    if (!ctx_ref.current) ctx_ref.current = new AudioContext();
    const ctx = ctx_ref.current;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.2;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch {
    // No-op: audio not available.
  }
}
