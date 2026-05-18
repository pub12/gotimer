"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import {
  Volume2, VolumeX, Maximize, Minimize, Pencil, Minus, Plus, Palette, Zap, Share2, Code2,
} from "lucide-react";
import { SaveTimerButton } from "@/components/studio/save-timer-button";
import { ShareDialog } from "@/components/timer/share-dialog";
import { EmbedCodeGenerator } from "@/components/embed/embed-code-generator";

const MAX_DURATION = 86400; // 24 hours

function format_duration_display(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return s > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (s > 0) return `${m}m ${s}s`;
  return `${m} min`;
}

function format_duration_edit(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function parse_duration_input(text: string): number | null {
  const trimmed = text.trim();
  // HH:MM:SS
  const hms = trimmed.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
  if (hms) return Math.max(1, Math.min(MAX_DURATION, parseInt(hms[1]) * 3600 + parseInt(hms[2]) * 60 + parseInt(hms[3])));
  // MM:SS
  const ms = trimmed.match(/^(\d{1,3}):(\d{1,2})$/);
  if (ms) return Math.max(1, Math.min(MAX_DURATION, parseInt(ms[1]) * 60 + parseInt(ms[2])));
  // Plain number (treat as minutes if <= 1440, else seconds)
  const num = parseInt(trimmed);
  if (!isNaN(num) && num > 0) return Math.max(1, Math.min(MAX_DURATION, num <= 1440 ? num * 60 : num));
  return null;
}

// ---- Editable Duration Input (supports HH:MM:SS) ----
function DurationInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [editing, set_editing] = useState(false);
  const [text, set_text] = useState("");

  function start_edit() {
    set_text(format_duration_edit(value));
    set_editing(true);
  }

  function commit() {
    set_editing(false);
    const parsed = parse_duration_input(text);
    if (parsed !== null) onChange(parsed);
  }

  // Step size: 1h if > 2h, 5m if > 30m, else 1m
  const step = value >= 7200 ? 3600 : value >= 1800 ? 300 : 60;

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => set_text(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
          autoFocus
          placeholder={value >= 3600 ? "H:MM:SS" : "MM:SS"}
          className="w-28 text-center font-headline font-black text-base bg-surface-container-high rounded-[0.5rem] px-3 py-1.5 text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, value - step))}
        disabled={value <= step}
        className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-foreground flex items-center justify-center transition-colors disabled:opacity-30"
        aria-label={`Decrease ${step >= 3600 ? "1 hour" : step >= 300 ? "5 minutes" : "1 minute"}`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={start_edit}
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-container-high rounded-[0.5rem] px-3 py-1 transition-colors min-w-[4.5rem] text-center border border-dashed border-transparent hover:border-surface-container-highest"
        title="Click to type exact time (H:MM:SS or MM:SS)"
      >
        {format_duration_display(value)}
        <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
      </button>
      <button
        onClick={() => onChange(Math.min(MAX_DURATION, value + step))}
        disabled={value >= MAX_DURATION}
        className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-foreground flex items-center justify-center transition-colors disabled:opacity-30"
        aria-label={`Increase ${step >= 3600 ? "1 hour" : step >= 300 ? "5 minutes" : "1 minute"}`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ---- Theme presets (background + ring/accent) ----
const THEME_PRESETS = [
  { id: "",        name: "Default",   bg: "",        ring: "",        btn: "" },
  { id: "ocean",   name: "Ocean",     bg: "#0c4a6e", ring: "#0ea5e9", btn: "#0ea5e9" },
  { id: "emerald", name: "Emerald",   bg: "#064e3b", ring: "#10b981", btn: "#10b981" },
  { id: "violet",  name: "Violet",    bg: "#2e1065", ring: "#8b5cf6", btn: "#8b5cf6" },
  { id: "rose",    name: "Rose",      bg: "#4c0519", ring: "#f43f5e", btn: "#f43f5e" },
  { id: "amber",   name: "Amber",     bg: "#451a03", ring: "#f59e0b", btn: "#f59e0b" },
  { id: "slate",   name: "Slate",     bg: "#1e293b", ring: "#94a3b8", btn: "#94a3b8" },
  { id: "lime",    name: "Lime",      bg: "#1a2e05", ring: "#84cc16", btn: "#84cc16" },
];

function get_theme(id: string) {
  return THEME_PRESETS.find((t) => t.id === id) || THEME_PRESETS[0];
}

// ---- Types ----
export interface TimerShellProps {
  timer_label: string;
  children: (ctx: { is_fullscreen: boolean; scale: number; ring_color?: string }) => React.ReactNode;
  controls: (ctx: { is_fullscreen: boolean; accent_color?: string }) => React.ReactNode;
  status_text: string;
  audio_enabled: boolean;
  on_toggle_audio: () => void;
  duration?: { value: number; onChange: (v: number) => void };
  interval?: {
    work: number; on_work_change: (v: number) => void;
    rest: number; on_rest_change: (v: number) => void;
    rounds: number; on_rounds_change: (v: number) => void;
  };
  extra_params?: Record<string, string>;
  defaults?: Record<string, number>;
  dark?: boolean;
  /** Current remaining seconds — enables screen flash in last N seconds */
  remaining?: number;
  /** Whether the timer is actively running */
  running?: boolean;
  /** UTC start time of the running timer — passed to ShareDialog for live sharing */
  started_at?: Date | null;
  /** Preset or strategy id (e.g. "countdown", "interval"). When provided, an Embed
   *  button is shown in the toolbar that opens the EmbedCodeGenerator modal. */
  timer_type?: string;
  /** Config object passed to the embed generator alongside timer_type. */
  timer_config?: Record<string, unknown>;
}

export default function TimerShell({
  timer_label,
  children,
  controls,
  status_text,
  audio_enabled,
  on_toggle_audio,
  duration,
  interval,
  extra_params,
  defaults,
  dark,
  remaining,
  running,
  started_at,
  timer_type,
  timer_config,
}: TimerShellProps) {
  const search_params = useSearchParams();
  const pathname = usePathname();

  const initial_title = search_params.get("title") || search_params.get("label") || "";
  const initial_scale = Math.max(50, Math.min(200, Number(search_params.get("size")) || 100));
  const initial_theme = search_params.get("theme") || "";
  const initial_flash = Math.max(0, Math.min(60, Number(search_params.get("flash")) || 5));
  const [user_title, set_user_title] = useState(initial_title);
  const [editing_title, set_editing_title] = useState(false);
  const [is_fullscreen, set_is_fullscreen] = useState(false);
  const [fs_scale, set_fs_scale] = useState(initial_scale);
  const [theme_id, set_theme_id] = useState(initial_theme);
  const [show_color_picker, set_show_color_picker] = useState(false);
  const [flash_at, set_flash_at] = useState(initial_flash);
  const [show_flash_config, set_show_flash_config] = useState(false);
  const [show_share, set_show_share] = useState(false);
  const [show_embed, set_show_embed] = useState(false);
  const fullscreen_ref = useRef<HTMLDivElement>(null);

  const active_theme = get_theme(theme_id);

  // Build query params (shared between URL sync and share link)
  const build_params = useCallback(() => {
    const params = new URLSearchParams();
    if (user_title) params.set("title", user_title);
    if (duration && defaults?.duration && duration.value !== defaults.duration) {
      params.set("duration", String(duration.value));
    }
    if (interval) {
      if (defaults?.work && interval.work !== defaults.work) params.set("work", String(interval.work));
      if (defaults?.rest !== undefined && interval.rest !== defaults.rest) params.set("rest", String(interval.rest));
      if (defaults?.rounds && interval.rounds !== defaults.rounds) params.set("rounds", String(interval.rounds));
    }
    if (fs_scale !== 100) params.set("size", String(fs_scale));
    if (theme_id) params.set("theme", theme_id);
    if (flash_at !== 5) params.set("flash", String(flash_at));
    if (extra_params) {
      for (const [k, v] of Object.entries(extra_params)) params.set(k, v);
    }
    return params;
  }, [user_title, duration, interval, fs_scale, theme_id, flash_at, extra_params, defaults]);

  // Update URL silently. Skip when the URL would be unchanged to avoid Safari's
  // 100-replaceState-per-10s rate limit (which manifests as buttons not hydrating).
  useEffect(() => {
    const qs = build_params().toString();
    const next_url = `${pathname}${qs ? `?${qs}` : ""}`;
    const current_url = window.location.pathname + window.location.search;
    if (current_url !== next_url) {
      window.history.replaceState(null, "", next_url);
    }
  }, [build_params, pathname]);

  // Fullscreen
  const toggle_fullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      fullscreen_ref.current?.requestFullscreen().catch(() => set_is_fullscreen(true));
    } else {
      document.exitFullscreen().catch(() => set_is_fullscreen(false));
    }
  }, []);

  useEffect(() => {
    function on_change() { set_is_fullscreen(!!document.fullscreenElement); }
    document.addEventListener("fullscreenchange", on_change);
    return () => document.removeEventListener("fullscreenchange", on_change);
  }, []);

  useEffect(() => {
    if (!is_fullscreen || document.fullscreenElement) return;
    function on_keydown(e: KeyboardEvent) { if (e.key === "Escape") set_is_fullscreen(false); }
    document.addEventListener("keydown", on_keydown);
    return () => document.removeEventListener("keydown", on_keydown);
  }, [is_fullscreen]);

  const btn_bg = dark
    ? "bg-white/10 hover:bg-white/20"
    : "bg-surface-container-high hover:bg-surface-container-highest";
  const btn_text = dark ? "text-primary-foreground/60" : "text-muted-foreground";

  // In fullscreen, override CSS variables for contrast on dark bg
  const fs_bg = active_theme.bg || undefined; // custom bg or default (--primary)
  const fullscreen_vars = is_fullscreen ? {
    "--foreground": "#ffffff",
    "--muted-foreground": "rgba(255,255,255,0.5)",
    "--on-surface": "#ffffff",
    "--on-surface-variant": "rgba(255,255,255,0.5)",
    "--surface-container-high": "rgba(255,255,255,0.15)",
    "--surface-container-highest": "rgba(255,255,255,0.25)",
    "--surface-container-low": "rgba(255,255,255,0.08)",
    "--surface-container": "rgba(255,255,255,0.10)",
    "--card": "rgba(255,255,255,0.08)",
    "--card-foreground": "#ffffff",
    // Override secondary/accent with theme ring color for pill, buttons, etc.
    ...(active_theme.btn ? { "--secondary": active_theme.btn, "--secondary-foreground": "#ffffff" } : {}),
  } as React.CSSProperties : undefined;

  // Flash state: active when running, remaining > 0, and within flash_at threshold
  const is_flashing = !!(running && remaining !== undefined && remaining > 0 && remaining <= flash_at);

  // ---- NON-FULLSCREEN RENDER ----
  if (!is_fullscreen) {
    return (
      <div
        ref={fullscreen_ref}
        className={
          dark
            ? "flex flex-col items-center gap-5 w-full max-w-md md:max-w-lg mx-auto relative"
            : "bg-card rounded-[1rem] shadow-[var(--shadow-soft-lg)] p-4 sm:p-6 md:p-10 flex flex-col items-center gap-5 w-full max-w-md md:max-w-lg mx-auto relative"
        }
      >
        {/* Timer display */}
        {children({ is_fullscreen: false, scale: 100, ring_color: active_theme.ring || undefined })}

        {/* Duration / Interval — compact row below ring */}
        {duration && <DurationInput value={duration.value} onChange={duration.onChange} />}
        {interval && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              Work
              <input type="number" min={5} max={600} value={interval.work}
                onChange={(e) => interval.on_work_change(Math.max(5, Number(e.target.value)))}
                className="w-16 text-center bg-surface-container-high rounded-[0.5rem] px-2 py-1 text-foreground font-medium outline-none focus:ring-2 focus:ring-secondary/30"
              /><span>s</span>
            </label>
            <label className="flex items-center gap-2 text-muted-foreground">
              Rest
              <input type="number" min={0} max={300} value={interval.rest}
                onChange={(e) => interval.on_rest_change(Math.max(0, Number(e.target.value)))}
                className="w-16 text-center bg-surface-container-high rounded-[0.5rem] px-2 py-1 text-foreground font-medium outline-none focus:ring-2 focus:ring-secondary/30"
              /><span>s</span>
            </label>
            <label className="flex items-center gap-2 text-muted-foreground">
              Rounds
              <input type="number" min={1} max={99} value={interval.rounds}
                onChange={(e) => interval.on_rounds_change(Math.max(1, Number(e.target.value)))}
                className="w-16 text-center bg-surface-container-high rounded-[0.5rem] px-2 py-1 text-foreground font-medium outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </label>
          </div>
        )}

        {/* Controls */}
        {controls({ is_fullscreen: false, accent_color: active_theme.btn || undefined })}

        {/* Bottom row: pill + utility icons */}
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            {timer_label}
          </div>
          <button
            aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
            onClick={on_toggle_audio}
            className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${
              audio_enabled ? "bg-secondary/10" : btn_bg
            }`}
          >
            {audio_enabled ? <Volume2 className="text-secondary w-4 h-4" /> : <VolumeX className={`${btn_text} w-4 h-4`} />}
          </button>
          <button
            aria-label="Full Screen"
            onClick={toggle_fullscreen}
            className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${btn_bg}`}
          >
            <Maximize className={`${btn_text} w-4 h-4`} />
          </button>
          <button
            onClick={() => set_show_share(true)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${btn_bg} ${btn_text} hover:text-foreground`}
            aria-label="Share live timer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          {timer_type && (
            <button
              onClick={() => set_show_embed(true)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${btn_bg} ${btn_text} hover:text-foreground`}
              aria-label="Embed this timer"
            >
              <Code2 className="w-3.5 h-3.5" />
              Embed
            </button>
          )}
          {/* Save to Studio */}
          <SaveTimerButton
            timer_type={timer_label.toLowerCase().replace(/\s+/g, "-")}
            title={user_title || timer_label}
            config={{
              ...(duration ? { duration: duration.value } : {}),
              ...(interval ? { work: interval.work, rest: interval.rest, rounds: interval.rounds } : {}),
            }}
          />
        </div>

        {/* Share dialog */}
        <ShareDialog
          open={show_share}
          on_close={() => set_show_share(false)}
          timer_path={pathname}
          timer_type={timer_label.toLowerCase().replace(/\s+/g, "-")}
          config={{
            ...(duration ? { duration: duration.value } : {}),
            ...(interval ? { work: interval.work, rest: interval.rest, rounds: interval.rounds } : {}),
          }}
          label={user_title || timer_label}
          started_at={started_at}
          running={running}
        />

        {/* Embed code modal */}
        {timer_type && (
          <EmbedCodeGenerator
            open={show_embed}
            on_close={() => set_show_embed(false)}
            timer_type={timer_type}
            timer_name={user_title || timer_label}
            timer_config={timer_config || {
              ...(duration ? { duration: duration.value } : {}),
              ...(interval ? { work: interval.work, rest: interval.rest, rounds: interval.rounds } : {}),
            }}
          />
        )}
      </div>
    );
  }

  // ---- FULLSCREEN RENDER ----
  return (
    <div
      ref={fullscreen_ref}
      style={{ ...fullscreen_vars, backgroundColor: fs_bg || "var(--primary)" } as React.CSSProperties}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 ${is_flashing ? "animate-timer-flash" : ""}`}
    >
      {/* Top bar — logo + audio/exit */}
      <div className="absolute top-5 left-6 right-6 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/gotimer_logo.png" alt="GoTimer" width={36} height={36} className="w-9 h-9" />
          <span className="font-headline font-black text-lg text-foreground">GoTimer.org</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
            onClick={on_toggle_audio}
            className={`rounded-full p-2.5 flex items-center justify-center transition-colors ${
              audio_enabled ? "bg-secondary/20 text-secondary" : "bg-surface-container-high hover:bg-surface-container-highest text-muted-foreground"
            }`}
          >
            {audio_enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            aria-label="Exit Full Screen"
            onClick={toggle_fullscreen}
            className="rounded-full p-2.5 flex items-center justify-center transition-colors bg-surface-container-high hover:bg-surface-container-highest text-muted-foreground"
          >
            <Minimize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content — vertically centered, ALL scaled together */}
      <div
        className="flex flex-col items-center gap-3 w-full"
        style={{ transform: `scale(${fs_scale / 100})`, transformOrigin: "center center" }}
      >
        {/* Large editable title */}
        <div className="w-full max-w-2xl text-center">
          {editing_title ? (
            <input
              type="text"
              value={user_title}
              onChange={(e) => set_user_title(e.target.value)}
              onBlur={() => set_editing_title(false)}
              onKeyDown={(e) => { if (e.key === "Enter") set_editing_title(false); }}
              autoFocus
              placeholder="Add a title..."
              className="w-full text-center font-headline font-black text-3xl sm:text-4xl md:text-5xl bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none border-b-2 border-secondary/30 focus:border-secondary pb-1"
            />
          ) : (
            <button
              onClick={() => set_editing_title(true)}
              className="inline-flex items-center gap-3 text-center font-headline font-black text-3xl sm:text-4xl md:text-5xl text-muted-foreground hover:text-secondary transition-colors cursor-pointer bg-transparent border-none"
            >
              {user_title || "Add a title..."}
              <Pencil className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/40" />
            </button>
          )}
        </div>

        {/* Status text */}
        <p className="text-sm text-muted-foreground">{status_text}</p>

        {/* Timer display */}
        {children({ is_fullscreen: true, scale: fs_scale, ring_color: active_theme.ring || undefined })}

        {/* Duration / Interval controls */}
        {duration && <DurationInput value={duration.value} onChange={duration.onChange} />}
        {interval && (
          <div className="flex items-center justify-center gap-4 text-sm">
            <label className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
              Work
              <input type="number" min={5} max={600} value={interval.work}
                onChange={(e) => interval.on_work_change(Math.max(5, Number(e.target.value)))}
                className="w-16 text-center bg-surface-container-high rounded-[0.5rem] px-2 py-1.5 text-foreground font-medium outline-none focus:ring-2 focus:ring-secondary/30"
              /><span>s</span>
            </label>
            <label className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
              Rest
              <input type="number" min={0} max={300} value={interval.rest}
                onChange={(e) => interval.on_rest_change(Math.max(0, Number(e.target.value)))}
                className="w-16 text-center bg-surface-container-high rounded-[0.5rem] px-2 py-1.5 text-foreground font-medium outline-none focus:ring-2 focus:ring-secondary/30"
              /><span>s</span>
            </label>
            <label className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
              Rounds
              <input type="number" min={1} max={99} value={interval.rounds}
                onChange={(e) => interval.on_rounds_change(Math.max(1, Number(e.target.value)))}
                className="w-16 text-center bg-surface-container-high rounded-[0.5rem] px-2 py-1.5 text-foreground font-medium outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </label>
          </div>
        )}

        {/* Control buttons */}
        {controls({ is_fullscreen: true, accent_color: active_theme.btn || undefined })}
      </div>

      {/* Bottom bar — pill left, share + slider right */}
      <div className="absolute bottom-5 left-6 right-6 sm:bottom-6 sm:left-8 sm:right-8 flex items-center justify-between">
        {/* Status pill — bottom left */}
        <div className="flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          {timer_label}
        </div>

        {/* Share + Size slider — bottom right */}
        <div className="flex items-center gap-4">
          {/* Share button */}
          <button
            onClick={() => set_show_share(true)}
            className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-1.5 transition-all duration-200 bg-surface-container-high text-muted-foreground hover:text-foreground hover:bg-surface-container-highest"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          {timer_type && (
            <button
              onClick={() => set_show_embed(true)}
              className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-1.5 transition-all duration-200 bg-surface-container-high text-muted-foreground hover:text-foreground hover:bg-surface-container-highest"
              aria-label="Embed this timer"
            >
              <Code2 className="w-3.5 h-3.5" />
              Embed
            </button>
          )}

          {/* Flash config */}
          <div className="relative">
            <button
              onClick={() => set_show_flash_config(!show_flash_config)}
              className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${
                flash_at > 0
                  ? "bg-surface-container-high hover:bg-surface-container-highest text-muted-foreground"
                  : "bg-surface-container text-muted-foreground/40"
              }`}
              aria-label="Flash alert settings"
            >
              <Zap className="w-4 h-4" />
            </button>
            {show_flash_config && (
              <div className="absolute bottom-full right-0 mb-2 bg-surface-container-high rounded-xl p-3 shadow-lg min-w-[10rem]">
                <p className="text-xs text-muted-foreground font-medium mb-2">Flash screen in last</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={flash_at}
                    onChange={(e) => set_flash_at(Number(e.target.value))}
                    className="flex-1 h-1.5 accent-secondary rounded-full appearance-none bg-surface-container-highest cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="text-xs text-foreground font-mono w-6 text-right">{flash_at}s</span>
                </div>
                {flash_at === 0 && <p className="text-[10px] text-muted-foreground mt-1">Flash disabled</p>}
              </div>
            )}
          </div>

          {/* Theme picker */}
          <div className="relative">
            <button
              onClick={() => set_show_color_picker(!show_color_picker)}
              className="rounded-full p-1.5 flex items-center justify-center transition-colors bg-surface-container-high hover:bg-surface-container-highest text-muted-foreground"
              aria-label="Change theme"
            >
              {theme_id ? (
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: active_theme.ring }} />
              ) : (
                <Palette className="w-4 h-4" />
              )}
            </button>
            {show_color_picker && (
              <div className="absolute bottom-full right-0 mb-2 bg-surface-container-high rounded-xl p-2.5 flex gap-2 shadow-lg">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { set_theme_id(t.id); set_show_color_picker(false); }}
                    className={`w-7 h-7 rounded-full transition-transform hover:scale-110 overflow-hidden flex items-center justify-center ${
                      theme_id === t.id ? "ring-2 ring-white ring-offset-1 ring-offset-transparent" : ""
                    }`}
                    style={{ backgroundColor: t.bg || "var(--primary)" }}
                    title={t.name}
                  >
                    {/* Inner ring color indicator */}
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.ring || "var(--secondary)" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Size slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={50}
              max={200}
              step={5}
              value={fs_scale}
              onChange={(e) => set_fs_scale(Number(e.target.value))}
              className="w-20 sm:w-28 h-1.5 accent-secondary rounded-full appearance-none bg-surface-container-highest cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-xs text-muted-foreground font-mono w-8">{fs_scale}%</span>
          </div>
        </div>
      </div>

      {/* Share dialog (also available in fullscreen) */}
      <ShareDialog
        open={show_share}
        on_close={() => set_show_share(false)}
        timer_path={pathname}
        timer_type={timer_label.toLowerCase().replace(/\s+/g, "-")}
        config={{
          ...(duration ? { duration: duration.value } : {}),
          ...(interval ? { work: interval.work, rest: interval.rest, rounds: interval.rounds } : {}),
        }}
        label={user_title || timer_label}
      />

      {/* Embed code modal (also available in fullscreen) */}
      {timer_type && (
        <EmbedCodeGenerator
          open={show_embed}
          on_close={() => set_show_embed(false)}
          timer_type={timer_type}
          timer_name={user_title || timer_label}
          timer_config={timer_config || {
            ...(duration ? { duration: duration.value } : {}),
            ...(interval ? { work: interval.work, rest: interval.rest, rounds: interval.rounds } : {}),
          }}
        />
      )}
    </div>
  );
}

export { DurationInput };
