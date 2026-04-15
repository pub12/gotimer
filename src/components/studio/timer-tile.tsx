"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Play, MoreVertical, Pencil, Copy, Trash2, FolderInput } from "lucide-react";

type TimerTileProps = {
  id: string;
  title: string;
  timer_type: string;
  icon: string;
  color: string;
  config: Record<string, unknown>;
  category_name?: string | null;
  on_deleted?: () => void;
  on_duplicated?: () => void;
  on_edit?: () => void;
};

const TYPE_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  countdown: { label: "Countdown", bg: "bg-sky-100", text: "text-sky-700" },
  stopwatch: { label: "Stopwatch", bg: "bg-emerald-100", text: "text-emerald-700" },
  pomodoro: { label: "Pomodoro", bg: "bg-rose-100", text: "text-rose-700" },
  interval: { label: "Interval", bg: "bg-amber-100", text: "text-amber-700" },
  tabata: { label: "Tabata", bg: "bg-violet-100", text: "text-violet-700" },
  hiit: { label: "HIIT", bg: "bg-orange-100", text: "text-orange-700" },
  "egg-timer": { label: "Egg Timer", bg: "bg-yellow-100", text: "text-yellow-700" },
};

// Map timer types to their actual routes
const TYPE_ROUTE_MAP: Record<string, string> = {
  "countdown": "/countdown",
  "countdown-timer": "/countdown",
  "chess-clock": "/chess-clock",
  "round-timer": "/round-timer",
  "interval": "/hiit-timer",
  "multi-step": "/photography/film-development",
  "ambient": "/photography/stand-development",
  "calculator-timer": "/photography/long-exposure-calculator",
  "pomodoro": "/pomodoro-timer",
  "stand-development": "/photography/stand-development",
  "film-development": "/photography/film-development",
  "long-exposure-timer": "/photography/long-exposure-calculator",
};

function build_timer_url(timer_type: string, config: Record<string, unknown>): string {
  const base = TYPE_ROUTE_MAP[timer_type] || `/${timer_type}`;
  const params = new URLSearchParams();
  Object.entries(config).forEach(([key, val]) => {
    if (val !== undefined && val !== null && key !== "steps") {
      params.set(key, String(val));
    }
  });
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function summarize_config(config: Record<string, unknown>): string {
  const parts: string[] = [];
  if (config.duration || config.minutes || config.seconds) {
    const mins = Number(config.minutes || 0);
    const secs = Number(config.seconds || 0);
    const total_dur = Number(config.duration || 0);
    if (total_dur) {
      const m = Math.floor(total_dur / 60);
      const s = total_dur % 60;
      parts.push(m > 0 ? `${m}m ${s}s` : `${s}s`);
    } else if (mins || secs) {
      parts.push(mins > 0 ? `${mins}m ${secs}s` : `${secs}s`);
    }
  }
  if (config.rounds) parts.push(`${config.rounds} rounds`);
  if (config.work && config.rest) parts.push(`${config.work}s / ${config.rest}s`);
  return parts.join(" \u00B7 ") || "Default settings";
}

export function TimerTile({
  id,
  title,
  timer_type,
  icon,
  color,
  config,
  category_name,
  on_deleted,
  on_duplicated,
  on_edit,
}: TimerTileProps) {
  const [menu_open, set_menu_open] = useState(false);
  const menu_ref = useRef<HTMLDivElement>(null);

  const type_info = TYPE_LABELS[timer_type] || {
    label: timer_type,
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  useEffect(() => {
    function handle_click_outside(e: MouseEvent) {
      if (menu_ref.current && !menu_ref.current.contains(e.target as Node)) {
        set_menu_open(false);
      }
    }
    if (menu_open) {
      document.addEventListener("mousedown", handle_click_outside);
    }
    return () => document.removeEventListener("mousedown", handle_click_outside);
  }, [menu_open]);

  const handle_delete = async () => {
    set_menu_open(false);
    try {
      const res = await fetch(`/api/studio/timers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Timer deleted");
        on_deleted?.();
      } else {
        toast.error("Failed to delete timer");
      }
    } catch {
      toast.error("Failed to delete timer");
    }
  };

  const handle_duplicate = async () => {
    set_menu_open(false);
    try {
      const res = await fetch("/api/studio/timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${title} (copy)`,
          type: timer_type,
          icon,
          accent_color: color,
          config_json: JSON.stringify(config),
        }),
      });
      if (res.ok) {
        toast.success("Timer duplicated");
        on_duplicated?.();
      } else {
        toast.error("Failed to duplicate timer");
      }
    } catch {
      toast.error("Failed to duplicate timer");
    }
  };

  return (
    <div className="relative bg-card rounded-[1rem] shadow-[var(--shadow-soft)] overflow-hidden group">
      {/* Color accent bar */}
      <div className="h-1" style={{ backgroundColor: color }} />

      <div className="p-4">
        {/* Top row: icon + menu */}
        <div className="flex items-start justify-between mb-2">
          <span className="text-2xl">{icon}</span>

          <div className="relative" ref={menu_ref}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => set_menu_open(!menu_open)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {menu_open && (
              <div className="absolute right-0 top-8 z-20 w-40 bg-card rounded-lg shadow-lg border py-1">
                {on_edit && (
                  <button
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-surface-container-low transition-colors"
                    onClick={() => {
                      set_menu_open(false);
                      on_edit();
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
                <button
                  className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-surface-container-low transition-colors"
                  onClick={handle_duplicate}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-surface-container-low transition-colors text-destructive"
                  onClick={handle_delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-headline font-black text-base leading-tight mb-1 truncate">
          {title}
        </h3>

        {/* Type badge */}
        <span
          className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${type_info.bg} ${type_info.text} mb-2`}
        >
          {type_info.label}
        </span>

        {/* Config summary */}
        <p className="text-xs text-muted-foreground italic mb-3 truncate">
          {summarize_config(config)}
        </p>

        {/* Bottom row: category + play */}
        <div className="flex items-center justify-between">
          {category_name ? (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {category_name}
            </span>
          ) : (
            <span />
          )}

          <Link href={build_timer_url(timer_type, config)}>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <Play className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
