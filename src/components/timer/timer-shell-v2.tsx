"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Volume2, VolumeX, Maximize, Minimize, Pencil,
  Link2, Check, Palette, Zap, Settings, Share2,
} from "lucide-react";
import { useTimer } from "./timer-provider";
import { SaveTimerButton } from "@/components/studio/save-timer-button";
import { ShareDialog } from "./share-dialog";

// ---- Theme presets (same as original TimerShell) ----
const THEME_PRESETS = [
  { id: "",        name: "Default",   bg: "",        ring: "",        btn: "" },
  { id: "ocean",   name: "Ocean",     bg: "#0c4a6e", ring: "#0ea5e9", btn: "#0ea5e9" },
  { id: "emerald", name: "Emerald",   bg: "#064e3b", ring: "#10b981", btn: "#10b981" },
  { id: "violet",  name: "Violet",    bg: "#2e1065", ring: "#8b5cf6", btn: "#8b5cf6" },
  { id: "rose",    name: "Rose",      bg: "#4c0519", ring: "#f43f5e", btn: "#f43f5e" },
  { id: "amber",   name: "Amber",     bg: "#451a03", ring: "#f59e0b", btn: "#f59e0b" },
  { id: "slate",   name: "Slate",     bg: "#1e293b", ring: "#94a3b8", btn: "#94a3b8" },
  { id: "lime",    name: "Lime",      bg: "#1a2e05", ring: "#84cc16", btn: "#84cc16" },
  // Darkroom mode for photography
  { id: "darkroom", name: "Darkroom", bg: "#0a0a0a", ring: "#cc0000", btn: "#cc0000" },
];

function get_theme(id: string) {
  return THEME_PRESETS.find((t) => t.id === id) || THEME_PRESETS[0];
}

interface TimerShellV2Props {
  /** Timer label for the status pill */
  label: string;
  /** Timer type for save feature */
  timer_type?: string;
  /** Timer config for save feature */
  timer_config?: Record<string, unknown>;
  /** Main timer display content */
  children: React.ReactNode;
  /** Control buttons */
  controls: React.ReactNode;
  /** Additional content below the main display */
  below?: React.ReactNode;
  /** Use dark background (non-fullscreen) */
  dark?: boolean;
  /** Current remaining seconds — for flash effect */
  remaining?: number;
  /** Whether the timer is actively running */
  running?: boolean;
  /** Callback to return to the configuration/setup screen. When provided, a settings icon is shown. */
  on_configure?: () => void;
  /** Force the fullscreen layout without actually being in fullscreen mode. Used for preview panels. */
  force_fullscreen?: boolean;
  /** Initial title to pre-populate the editable title field */
  initial_title?: string;
}

export function TimerShellV2({
  label,
  timer_type,
  timer_config,
  children,
  controls,
  below,
  dark,
  remaining,
  running,
  on_configure,
  force_fullscreen,
  initial_title,
}: TimerShellV2Props) {
  const { audio, fullscreen } = useTimer();
  const { is_fullscreen: native_fullscreen, ref, toggle: toggle_fullscreen } = fullscreen;
  const is_fullscreen = native_fullscreen || !!force_fullscreen;

  const [user_title, set_user_title] = useState(initial_title || "");
  const [editing_title, set_editing_title] = useState(false);
  const [link_copied, set_link_copied] = useState(false);
  const [fs_scale, set_fs_scale] = useState(100);
  const [theme_id, set_theme_id] = useState("");
  const [show_color_picker, set_show_color_picker] = useState(false);
  const [flash_at, set_flash_at] = useState(5);
  const [show_flash_config, set_show_flash_config] = useState(false);
  const [show_share, set_show_share] = useState(false);

  const active_theme = get_theme(theme_id);

  const copy_share_link = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      set_link_copied(true);
      setTimeout(() => set_link_copied(false), 2000);
    }).catch(() => {});
  };

  const btn_bg = dark || is_fullscreen
    ? "bg-white/10 hover:bg-white/20"
    : "bg-surface-container-high hover:bg-surface-container-highest";
  const btn_text = dark || is_fullscreen
    ? "text-primary-foreground/60"
    : "text-muted-foreground";

  const is_flashing = !!(running && remaining !== undefined && remaining > 0 && remaining <= flash_at);

  // Fullscreen CSS variable overrides
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
    ...(active_theme.btn ? { "--secondary": active_theme.btn, "--secondary-foreground": "#ffffff" } : {}),
  } as React.CSSProperties : undefined;

  const fs_bg = active_theme.bg || undefined;

  // ---- FULLSCREEN RENDER ----
  if (is_fullscreen) {
    return (
      <div
        ref={ref}
        style={{ ...fullscreen_vars, backgroundColor: fs_bg || "var(--primary)" } as React.CSSProperties}
        className={`${force_fullscreen ? "absolute inset-0" : "fixed inset-0 z-[9999]"} flex flex-col items-center justify-center p-6 ${is_flashing ? "animate-timer-flash" : ""}`}
      >
        {/* Top bar */}
        <div className="absolute top-5 left-6 right-6 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/gotimer_logo.png" alt="GoTimer" width={36} height={36} className="w-9 h-9" />
            <span className="font-headline font-black text-lg text-foreground">GoTimer.org</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label={audio.enabled ? "Disable Sound" : "Enable Sound"}
              onClick={audio.toggle}
              className={`rounded-full p-2.5 flex items-center justify-center transition-colors ${
                audio.enabled ? "bg-secondary/20 text-secondary" : "bg-surface-container-high hover:bg-surface-container-highest text-muted-foreground"
              }`}
            >
              {audio.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
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

        {/* Main content — scaled */}
        <div
          className="flex flex-col items-center gap-3 w-full"
          style={{ transform: `scale(${fs_scale / 100})`, transformOrigin: "center center" }}
        >
          {/* Editable title */}
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

          {children}
          {below}
          {controls}
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-5 left-6 right-6 sm:bottom-6 sm:left-8 sm:right-8 flex items-center justify-between">
          {/* Status pill */}
          <div className="flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            {label}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Configure / Back to setup */}
            {on_configure && (
              <button
                onClick={on_configure}
                className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-1.5 transition-all duration-200 bg-surface-container-high text-muted-foreground hover:text-foreground hover:bg-surface-container-highest"
              >
                <Settings className="w-3.5 h-3.5" />
                Setup
              </button>
            )}
            {/* Share */}
            <button
              onClick={copy_share_link}
              className={`inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-1.5 transition-all duration-200 ${
                link_copied
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-surface-container-high text-muted-foreground hover:text-foreground hover:bg-surface-container-highest"
              }`}
            >
              {link_copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
              {link_copied ? "Copied!" : "Share"}
            </button>

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
                    <input type="range" min={0} max={30} step={1} value={flash_at}
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
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.ring || "var(--secondary)" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Size slider */}
            <div className="flex items-center gap-2">
              <input type="range" min={50} max={200} step={5} value={fs_scale}
                onChange={(e) => set_fs_scale(Number(e.target.value))}
                className="w-20 sm:w-28 h-1.5 accent-secondary rounded-full appearance-none bg-surface-container-highest cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono w-8">{fs_scale}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- NON-FULLSCREEN RENDER ----
  return (
    <div
      ref={ref}
      className={
        dark
          ? "flex flex-col items-center gap-5 w-full max-w-md md:max-w-lg mx-auto relative"
          : "bg-card rounded-[1rem] shadow-[var(--shadow-soft-lg)] p-4 sm:p-6 md:p-10 flex flex-col items-center gap-5 w-full max-w-md md:max-w-lg mx-auto relative"
      }
    >
      {/* Fixed fullscreen button - always visible in bottom-right corner */}
      <button
        aria-label="Full Screen"
        onClick={toggle_fullscreen}
        className="fixed bottom-5 right-5 z-50 rounded-full p-3 flex items-center justify-center transition-colors bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90"
      >
        <Maximize className="w-5 h-5" />
      </button>

      {children}
      {below}
      {controls}

      {/* Bottom row: pill + utility icons */}
      <div className="flex items-center justify-center gap-3 w-full flex-wrap">
        <div className="flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          {label}
        </div>
        <button
          aria-label={audio.enabled ? "Disable Sound" : "Enable Sound"}
          onClick={audio.toggle}
          className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${
            audio.enabled ? "bg-secondary/10" : btn_bg
          }`}
        >
          {audio.enabled ? <Volume2 className="text-secondary w-4 h-4" /> : <VolumeX className={`${btn_text} w-4 h-4`} />}
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
        {/* Save to Studio */}
        {timer_type && (
          <SaveTimerButton
            timer_type={timer_type}
            title={user_title || label}
            config={timer_config || {}}
          />
        )}
        {/* Configure / Back to setup */}
        {on_configure && (
          <button
            aria-label="Timer Settings"
            onClick={on_configure}
            className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${btn_bg}`}
            title="Back to setup"
          >
            <Settings className={`${btn_text} w-4 h-4`} />
          </button>
        )}
      </div>

      {/* Share dialog */}
      <ShareDialog
        open={show_share}
        on_close={() => set_show_share(false)}
        timer_path={typeof window !== "undefined" ? window.location.pathname : "/"}
        timer_type={timer_type || label.toLowerCase().replace(/\s+/g, "-")}
        config={timer_config || {}}
        label={user_title || label}
      />
    </div>
  );
}
