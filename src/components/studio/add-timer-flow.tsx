"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPicker } from "./icon-picker";
import { ColorPicker } from "./color-picker";
import { toast } from "sonner";
import {
  Timer, Clock, RotateCcw, Dumbbell, Brain, Wind, CookingPot,
  Target, Camera, Egg, BookOpen, GraduationCap, Presentation,
  Focus, Moon, Utensils, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// All available timer types
interface TimerTypeOption {
  type: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  default_config: Record<string, unknown>;
}

const TIMER_TYPES: TimerTypeOption[] = [
  // Board Games
  { type: "countdown", name: "Countdown Timer", description: "Set a time limit and count down", icon: Timer, category: "Board Games", default_config: { duration: 300 } },
  { type: "chess-clock", name: "Chess Clock", description: "Two-player turn timer", icon: Clock, category: "Board Games", default_config: { duration: 300 } },
  { type: "round-timer", name: "Round Timer", description: "Track rounds and total time", icon: RotateCcw, category: "Board Games", default_config: {} },
  // Fitness
  { type: "interval", name: "HIIT Timer", description: "Work/rest interval training", icon: Dumbbell, category: "Fitness", default_config: { work: 30, rest: 10, rounds: 8 } },
  { type: "interval", name: "Tabata Timer", description: "20s work / 10s rest x 8", icon: Dumbbell, category: "Fitness", default_config: { work: 20, rest: 10, rounds: 8 } },
  // Wellness
  { type: "countdown", name: "Meditation Timer", description: "Guided mindfulness with alerts", icon: Brain, category: "Wellness", default_config: { duration: 900 } },
  { type: "countdown", name: "Breathing Timer", description: "Box breathing exercises", icon: Wind, category: "Wellness", default_config: { duration: 240 } },
  { type: "countdown", name: "Sleep Timer", description: "Wind-down countdown", icon: Moon, category: "Wellness", default_config: { duration: 1800 } },
  // Productivity
  { type: "countdown", name: "Pomodoro Timer", description: "25 min focus + 5 min break", icon: Target, category: "Productivity", default_config: { duration: 1500 } },
  { type: "countdown", name: "Study Timer", description: "Timed study blocks", icon: BookOpen, category: "Productivity", default_config: { duration: 2700 } },
  { type: "countdown", name: "ADHD Focus Timer", description: "Short focus intervals", icon: Focus, category: "Productivity", default_config: { duration: 600 } },
  { type: "countdown", name: "Classroom Timer", description: "Activity timer for teachers", icon: GraduationCap, category: "Productivity", default_config: { duration: 600 } },
  { type: "countdown", name: "Presentation Timer", description: "Meeting and talk timer", icon: Presentation, category: "Productivity", default_config: { duration: 1200 } },
  // Kitchen
  { type: "countdown", name: "Cooking Timer", description: "General kitchen timer", icon: CookingPot, category: "Kitchen", default_config: { duration: 600 } },
  { type: "countdown", name: "Egg Timer", description: "Perfect eggs every time", icon: Egg, category: "Kitchen", default_config: { duration: 420 } },
  { type: "countdown", name: "Fasting Timer", description: "Intermittent fasting tracker", icon: Utensils, category: "Wellness", default_config: { duration: 57600 } },
  // Photography
  { type: "multi-step", name: "Film Development", description: "Multi-step B&W, C-41, E-6", icon: Camera, category: "Photography", default_config: { steps: [] } },
  { type: "countdown", name: "Long Exposure", description: "Reciprocity-corrected countdown", icon: Camera, category: "Photography", default_config: { duration: 30 } },
];

// Group by category
function group_types(): Record<string, TimerTypeOption[]> {
  const groups: Record<string, TimerTypeOption[]> = {};
  for (const t of TIMER_TYPES) {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  }
  return groups;
}

type StudioCategory = { id: string; name: string };

interface AddTimerFlowProps {
  open: boolean;
  on_close: () => void;
  on_saved: () => void;
}

export function AddTimerFlow({ open, on_close, on_saved }: AddTimerFlowProps) {
  const [step, set_step] = useState<"select" | "configure">("select");
  const [selected, set_selected] = useState<TimerTypeOption | null>(null);

  // Configure step state
  const [title, set_title] = useState("");
  const [icon, set_icon] = useState("⏱️");
  const [color, set_color] = useState("#E8613C");
  const [category_id, set_category_id] = useState<string | null>(null);
  const [categories, set_categories] = useState<StudioCategory[]>([]);
  const [duration, set_duration] = useState(300);
  const [work, set_work] = useState(30);
  const [rest, set_rest] = useState(10);
  const [rounds, set_rounds] = useState(8);
  const [saving, set_saving] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (open) {
      set_step("select");
      set_selected(null);
      set_title("");
      set_icon("⏱️");
      set_color("#E8613C");
      set_category_id(null);
    }
  }, [open]);

  // Fetch categories when entering configure step
  useEffect(() => {
    if (step === "configure") {
      fetch("/api/studio/categories")
        .then((r) => r.json())
        .then((d) => set_categories(Array.isArray(d) ? d : d.categories || []))
        .catch(() => set_categories([]));
    }
  }, [step]);

  const handle_type_select = (t: TimerTypeOption) => {
    set_selected(t);
    set_title(t.name);
    // Set defaults from config
    if (t.default_config.duration) set_duration(t.default_config.duration as number);
    if (t.default_config.work) set_work(t.default_config.work as number);
    if (t.default_config.rest) set_rest(t.default_config.rest as number);
    if (t.default_config.rounds) set_rounds(t.default_config.rounds as number);
    set_step("configure");
  };

  const handle_save = async () => {
    if (!selected || !title.trim()) return;
    set_saving(true);

    const config: Record<string, unknown> = { ...selected.default_config };
    if (selected.type === "countdown" || selected.type === "multi-step") {
      config.duration = duration;
    }
    if (selected.type === "interval") {
      config.work = work;
      config.rest = rest;
      config.rounds = rounds;
    }

    try {
      const res = await fetch("/api/studio/timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          type: selected.type,
          icon,
          accent_color: color,
          category_id,
          config_json: JSON.stringify(config),
        }),
      });
      if (res.ok) {
        toast.success(`"${title.trim()}" saved to Studio`);
        on_saved();
        on_close();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save timer");
    } finally {
      set_saving(false);
    }
  };

  const format_duration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
    return sec > 0 ? `${m}m ${sec}s` : `${m} min`;
  };

  const grouped = group_types();

  if (!open) return null;

  // STEP 1: Type selector
  if (step === "select") {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" onClick={on_close} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl border w-[min(92vw,600px)] max-h-[80vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
            <h2 className="text-base font-semibold">Add Timer</h2>
            <button onClick={on_close} className="rounded-sm opacity-70 hover:opacity-100 p-1"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-muted-foreground px-5 pb-2">Choose a timer type</p>
          <div className="overflow-y-auto flex-1 px-5 pb-5 space-y-5">
            {Object.entries(grouped).map(([cat, types]) => (
              <div key={cat}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{cat}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {types.map((t, i) => {
                    const Icon = t.icon;
                    return (
                      <button key={`${t.type}-${i}`} onClick={() => handle_type_select(t)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{t.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Configure & save
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={on_close} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl border w-[min(92vw,440px)] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <h2 className="text-base font-semibold">Configure {selected?.name}</h2>
          <button onClick={on_close} className="rounded-sm opacity-70 hover:opacity-100 p-1"><X className="w-4 h-4" /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-2 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Name</label>
            <Input value={title} onChange={(e) => set_title(e.target.value)} placeholder="Timer name" />
          </div>

          {(selected?.type === "countdown" || selected?.type === "multi-step") && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">Duration</label>
              <div className="flex items-center gap-3">
                <Input type="number" min={1} value={Math.floor(duration / 60)}
                  onChange={(e) => set_duration(Math.max(1, Number(e.target.value)) * 60)}
                  className="w-20 text-center" />
                <span className="text-sm text-muted-foreground">minutes</span>
                <span className="text-xs text-muted-foreground ml-auto">({format_duration(duration)})</span>
              </div>
            </div>
          )}

          {selected?.type === "interval" && (
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium mb-1 block">Work (s)</label>
                <Input type="number" min={5} value={work} onChange={(e) => set_work(Number(e.target.value))} className="text-center" /></div>
              <div><label className="text-xs font-medium mb-1 block">Rest (s)</label>
                <Input type="number" min={0} value={rest} onChange={(e) => set_rest(Number(e.target.value))} className="text-center" /></div>
              <div><label className="text-xs font-medium mb-1 block">Rounds</label>
                <Input type="number" min={1} value={rounds} onChange={(e) => set_rounds(Number(e.target.value))} className="text-center" /></div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1.5 block">Category</label>
            <select value={category_id || ""} onChange={(e) => set_category_id(e.target.value || null)}
              className="w-full h-10 px-3 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Uncategorized</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div><label className="text-sm font-medium mb-1.5 block">Icon</label>
            <IconPicker value={icon} onChange={set_icon} /></div>

          <div><label className="text-sm font-medium mb-1.5 block">Color</label>
            <ColorPicker value={color} onChange={set_color} /></div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t shrink-0">
          <Button variant="outline" size="sm" onClick={() => set_step("select")}>Back</Button>
          <Button size="sm" disabled={saving || !title.trim()} onClick={handle_save}>
            {saving ? "Saving..." : "Save to Studio"}
          </Button>
        </div>
      </div>
    </div>
  );
}
