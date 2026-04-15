"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DurationInput } from "@/components/shared/timer-shell";
import { toast } from "sonner";
import { Zap, X } from "lucide-react";
import { TimerPreviewPanel } from "./timer-preview";

type Category = { id: string; name: string };

interface EditTimerDialogProps {
  open: boolean;
  on_close: () => void;
  on_saved: () => void;
  timer: {
    id: string; title: string; type: string; icon: string;
    accent_color: string; config_json: string; category_id: string | null;
  } | null;
}

const THEMES = [
  { id: "", name: "Default", bg: "", ring: "" },
  { id: "ocean", name: "Ocean", bg: "#0c4a6e", ring: "#0ea5e9" },
  { id: "emerald", name: "Emerald", bg: "#064e3b", ring: "#10b981" },
  { id: "violet", name: "Violet", bg: "#2e1065", ring: "#8b5cf6" },
  { id: "rose", name: "Rose", bg: "#4c0519", ring: "#f43f5e" },
  { id: "amber", name: "Amber", bg: "#451a03", ring: "#f59e0b" },
  { id: "slate", name: "Slate", bg: "#1e293b", ring: "#94a3b8" },
  { id: "lime", name: "Lime", bg: "#1a2e05", ring: "#84cc16" },
  { id: "darkroom", name: "Darkroom", bg: "#0a0a0a", ring: "#cc0000" },
];

const ICONS = ["⏱️", "🔥", "🏋️", "🧘", "🎲", "📷", "🍳", "📚", "🎯", "💪", "🧠", "🌙"];

/**
 * Renders the actual timer components (TimerProvider + TimerShellV2)
 * scaled down to fit inside the preview panel.
 * The TimerShellV2 fullscreen button works natively.
 */
export function EditTimerDialog({ open, on_close, on_saved, timer }: EditTimerDialogProps) {
  const [title, set_title] = useState("");
  const [icon, set_icon] = useState("⏱️");
  const [category_id, set_category_id] = useState<string | null>(null);
  const [duration, set_duration] = useState(300);
  const [work, set_work] = useState(30);
  const [rest, set_rest] = useState(10);
  const [rounds, set_rounds] = useState(8);
  const [theme_id, set_theme_id] = useState("");
  const [fs_scale, set_fs_scale] = useState(100);
  const [flash_at, set_flash_at] = useState(5);
  const [categories, set_categories] = useState<Category[]>([]);
  const [show_new_category, set_show_new_category] = useState(false);
  const [new_category_name, set_new_category_name] = useState("");
  const [saving, set_saving] = useState(false);
  // Key to force re-mount the timer preview when config changes
  const [preview_key, set_preview_key] = useState(0);

  useEffect(() => {
    if (open && timer) {
      set_title(timer.title);
      set_icon(timer.icon);
      set_category_id(timer.category_id);
      const config = typeof timer.config_json === "string"
        ? JSON.parse(timer.config_json || "{}") : timer.config_json || {};
      if (config.duration) set_duration(config.duration as number);
      if (config.work) set_work(config.work as number);
      if (config.rest) set_rest(config.rest as number);
      if (config.rounds) set_rounds(config.rounds as number);
      set_theme_id((config.theme as string) || "");
      set_fs_scale((config.scale as number) || 100);
      set_flash_at((config.flash as number) ?? 5);
      set_preview_key((k) => k + 1);
      fetch("/api/studio/categories")
        .then((r) => r.json())
        .then((d) => set_categories(Array.isArray(d) ? d : d.categories || []))
        .catch(() => set_categories([]));
    }
  }, [open, timer]);

  // Remount preview when duration changes
  useEffect(() => { set_preview_key((k) => k + 1); }, [duration, work, rest, rounds]);

  const active_theme = THEMES.find((t) => t.id === theme_id) || THEMES[0];

  const handle_save = async () => {
    if (!timer || !title.trim()) return;
    set_saving(true);
    let final_category_id = category_id;
    if (show_new_category && new_category_name.trim()) {
      try {
        const cat_res = await fetch("/api/studio/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: new_category_name.trim() }),
        });
        if (cat_res.ok) {
          const new_cat = await cat_res.json();
          final_category_id = new_cat.id;
        }
      } catch { /* ignore */ }
    }
    const old_config = typeof timer.config_json === "string"
      ? JSON.parse(timer.config_json || "{}") : timer.config_json || {};
    const config = { ...old_config, theme: theme_id, scale: fs_scale, flash: flash_at };
    if (is_countdown) config.duration = duration;
    if (is_interval) { config.work = work; config.rest = rest; config.rounds = rounds; }
    try {
      const res = await fetch(`/api/studio/timers/${timer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), icon, accent_color: active_theme.ring || "#E8613C", category_id: final_category_id, config_json: JSON.stringify(config) }),
      });
      if (res.ok) { toast.success("Timer updated"); on_saved(); on_close(); }
      else { toast.error((await res.json()).error || "Failed to update"); }
    } catch { toast.error("Failed to update timer"); }
    finally { set_saving(false); }
  };

  if (!open || !timer) return null;
  const is_countdown = timer.type === "countdown" || timer.type === "countdown-timer";
  const is_interval = timer.type === "interval";

  // Build the config object for the preview
  const preview_config = is_interval
    ? { work, rest, rounds }
    : { duration };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={on_close} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl border overflow-hidden w-[min(94vw,780px)] h-[min(85vh,520px)] flex">

        {/* Left: Settings */}
        <div className="w-[320px] shrink-0 flex flex-col border-r">
          <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
            <h2 className="text-sm font-semibold">Edit Timer</h2>
            <button onClick={on_close} className="rounded-sm opacity-70 hover:opacity-100 p-1"><X className="w-4 h-4" /></button>
          </div>

          <div className="overflow-y-auto flex-1 px-4 pb-2 space-y-3">
            <Input value={title} onChange={(e) => set_title(e.target.value)} placeholder="Timer name" className="h-9 text-sm" />

            {is_countdown && <DurationInput value={duration} onChange={set_duration} />}
            {is_interval && (
              <div className="flex gap-2 text-xs">
                <label className="flex items-center gap-1 text-muted-foreground">W<input type="number" min={5} value={work} onChange={(e) => set_work(Math.max(5, +e.target.value))}
                  className="w-12 text-center bg-surface-container-high rounded px-1 py-1 text-foreground font-medium outline-none" />s</label>
                <label className="flex items-center gap-1 text-muted-foreground">R<input type="number" min={0} value={rest} onChange={(e) => set_rest(Math.max(0, +e.target.value))}
                  className="w-12 text-center bg-surface-container-high rounded px-1 py-1 text-foreground font-medium outline-none" />s</label>
                <label className="flex items-center gap-1 text-muted-foreground">×<input type="number" min={1} value={rounds} onChange={(e) => set_rounds(Math.max(1, +e.target.value))}
                  className="w-10 text-center bg-surface-container-high rounded px-1 py-1 text-foreground font-medium outline-none" /></label>
              </div>
            )}

            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Theme</label>
              <div className="flex gap-1.5 flex-wrap">
                {THEMES.map((t) => (
                  <button key={t.id} onClick={() => set_theme_id(t.id)} title={t.name}
                    className={`w-6 h-6 rounded-full overflow-hidden flex items-center justify-center hover:scale-110 transition-transform ${theme_id === t.id ? "ring-2 ring-foreground ring-offset-1" : ""}`}
                    style={{ backgroundColor: t.bg || "var(--primary)" }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.ring || "var(--secondary)" }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground mb-0.5 block">Size {fs_scale}%</label>
                <input type="range" min={50} max={200} step={5} value={fs_scale} onChange={(e) => set_fs_scale(+e.target.value)} className="w-full h-1 accent-secondary" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1"><Zap className="w-2.5 h-2.5" />Flash {flash_at || "Off"}</label>
                <input type="range" min={0} max={30} step={1} value={flash_at} onChange={(e) => set_flash_at(+e.target.value)} className="w-full h-1 accent-secondary" />
              </div>
            </div>

            {show_new_category ? (
              <div className="flex gap-1.5">
                <input
                  value={new_category_name}
                  onChange={(e) => set_new_category_name(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 h-8 px-2 border border-input rounded-md text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && new_category_name.trim()) {
                      try {
                        const res = await fetch("/api/studio/categories", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name: new_category_name.trim() }),
                        });
                        if (res.ok) {
                          const new_cat = await res.json();
                          set_categories((prev) => [...prev, new_cat]);
                          set_category_id(new_cat.id);
                          set_show_new_category(false);
                          set_new_category_name("");
                        }
                      } catch { /* ignore */ }
                    }
                  }}
                />
                <button
                  className="text-xs text-muted-foreground hover:text-foreground px-1.5"
                  onClick={() => { set_show_new_category(false); set_new_category_name(""); }}
                >Cancel</button>
              </div>
            ) : (
              <select value={category_id || ""} onChange={(e) => {
                if (e.target.value === "__new__") {
                  set_show_new_category(true);
                  set_category_id(null);
                } else {
                  set_category_id(e.target.value || null);
                }
              }}
                className="w-full h-8 px-2 border border-input rounded-md text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Uncategorized</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="__new__">+ New Category</option>
              </select>
            )}

            <div className="flex gap-0.5 flex-wrap">
              {ICONS.map((e) => (
                <button key={e} onClick={() => set_icon(e)}
                  className={`w-7 h-7 rounded flex items-center justify-center text-sm ${icon === e ? "bg-primary text-primary-foreground" : "hover:bg-surface-container-low"}`}>{e}</button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 px-4 py-3 border-t shrink-0">
            <Button variant="outline" size="sm" onClick={on_close}>Cancel</Button>
            <Button size="sm" disabled={saving || !title.trim()} onClick={handle_save}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Right: Actual timer component preview */}
        <div className="flex-1 min-w-0 hidden sm:block bg-surface-container-low">
          <TimerPreviewPanel
            key={preview_key}
            timer_type={timer.type}
            config={preview_config}
            label={title || timer.type}
          />
        </div>
      </div>
    </div>
  );
}
