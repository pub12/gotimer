"use client";

import React, { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { SaveTimerButton } from "@/components/studio/save-timer-button";
import { format_time } from "@/components/timer/timer-display";
import {
  Play, Pause, RotateCcw, X, Plus, Maximize, Minimize,
  Volume2, VolumeX, Link2, Check, Trash2, Pencil,
} from "lucide-react";

interface SubTimer {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  running: boolean;
}

function parse_timers_from_url(params: URLSearchParams): SubTimer[] | null {
  const raw = params.get("timers");
  if (!raw) return null;
  try {
    return raw.split("|").map((seg, i) => {
      const [name, dur] = seg.split(":");
      return { id: `t-${i}`, name: decodeURIComponent(name), duration: Number(dur), remaining: Number(dur), running: false };
    });
  } catch { return null; }
}

function encode_timers(timers: SubTimer[]): string {
  return timers.map((t) => `${encodeURIComponent(t.name)}:${t.duration}`).join("|");
}

const MULTI_TIMER_FAQ = [
  {
    question: "When do I need multiple timers instead of one?",
    answer:
      "Any time you are cooking <strong>two or more dishes with different cook times</strong>. Thanksgiving dinner, holiday meals, weeknight multi-dish dinners, and meal prep sessions all benefit from independent timers. Instead of mentally tracking when the potatoes went in versus the roast, each timer runs its own countdown with a clear label.",
  },
  {
    question: "How many timers can I run at once?",
    answer:
      "There is <strong>no fixed limit</strong>. You can add as many timers as you need. Each timer runs independently with its own start, pause, and reset controls. For extremely complex meals (10+ items), use the &quot;Start All&quot; button to begin everything at once after staggering your cook starts.",
  },
  {
    question: "Can I edit a timer while it is running?",
    answer:
      "Yes. Click the <strong>pencil icon</strong> next to any timer name to edit both the name and remaining time. The timer pauses automatically while you edit. This is useful when a recipe takes longer than expected or you want to relabel a timer mid-cook.",
  },
  {
    question: "Can I share my timer setup with someone else?",
    answer:
      "Yes. Click the <strong>link icon</strong> in the bottom toolbar to copy the current URL, which encodes all your timer names and durations. Send the link to anyone — they will see the exact same timer setup when they open it. Great for sharing recipes or coordinating with a cooking partner.",
  },
  {
    question: "What happens when a timer finishes?",
    answer:
      "The completed timer turns <strong>green</strong>, displays &quot;Done!&quot;, and triggers an audio alert (if audio is enabled). Other timers continue running independently. You can reset individual timers or clear all timers at once using the &quot;Reset All&quot; button.",
  },
];

const MULTI_TIMER_RELATED = [
  { name: "Cooking Timer", href: "/kitchen/cooking", description: "Single kitchen timer with quick presets for common durations" },
  { name: "Egg Timer", href: "/kitchen/eggs", description: "Dedicated presets for soft, medium, and hard boiled eggs" },
  { name: "Bread Proofing Timer", href: "/kitchen/bread-proofing", description: "Track dough rise and fermentation times" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple single countdown for any timed activity" },
  { name: "Round Timer", href: "/round-timer", description: "Multi-round sequential timer for structured cooking intervals" },
];

function MultiTimerContent() {
  const search_params = useSearchParams();
  const url_timers = parse_timers_from_url(search_params);

  const [timers, set_timers] = useState<SubTimer[]>(url_timers || []);
  const [new_name, set_new_name] = useState("");
  const [new_min, set_new_min] = useState(5);
  const [new_sec, set_new_sec] = useState(0);
  const [audio_enabled, set_audio_enabled] = useState(false);
  const [is_fullscreen, set_is_fullscreen] = useState(false);
  const [link_copied, set_link_copied] = useState(false);
  const [editing_id, set_editing_id] = useState<string | null>(null);
  const [edit_min, set_edit_min] = useState(0);
  const [edit_sec, set_edit_sec] = useState(0);
  const fs_ref = useRef<HTMLDivElement>(null);
  const audio_ctx = useRef<AudioContext | null>(null);
  const beeped = useRef(new Set<string>());
  const counter = useRef(0);

  // Tick running timers
  useEffect(() => {
    const has_running = timers.some((t) => t.running && t.remaining > 0);
    if (!has_running) return;
    const interval = setInterval(() => {
      set_timers((prev) => prev.map((t) => {
        if (!t.running || t.remaining <= 0) return t;
        return { ...t, remaining: t.remaining - 1 };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [timers]);

  // Audio alerts when a timer completes
  useEffect(() => {
    if (!audio_enabled) return;
    for (const t of timers) {
      if (t.remaining === 0 && t.running && !beeped.current.has(t.id)) {
        beeped.current.add(t.id);
        play_beep(1.2, 1200);
      }
    }
  }, [timers, audio_enabled]);

  // Update URL with timer config
  useEffect(() => {
    if (timers.length === 0) return;
    const encoded = encode_timers(timers);
    const url = `${window.location.pathname}?timers=${encoded}`;
    window.history.replaceState(null, "", url);
  }, [timers]);

  // Fullscreen listeners
  useEffect(() => {
    const h = () => set_is_fullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const play_beep = (dur = 0.15, freq = 880) => {
    try {
      if (!audio_ctx.current) audio_ctx.current = new AudioContext();
      const ctx = audio_ctx.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = freq; gain.gain.value = 0.2;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + dur);
    } catch { /* */ }
  };

  const toggle_audio = () => {
    if (!audio_enabled) {
      if (!audio_ctx.current) audio_ctx.current = new AudioContext();
      set_audio_enabled(true);
    } else set_audio_enabled(false);
  };

  const toggle_fs = () => {
    if (!document.fullscreenElement) fs_ref.current?.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  const add_timer = () => {
    const dur = new_min * 60 + new_sec;
    if (dur <= 0) return;
    counter.current++;
    set_timers((prev) => [...prev, {
      id: `t-${Date.now()}-${counter.current}`,
      name: new_name.trim() || `Timer ${prev.length + 1}`,
      duration: dur, remaining: dur, running: false,
    }]);
    set_new_name("");
  };

  const start_all = () => set_timers((prev) => prev.map((t) => t.remaining > 0 ? { ...t, running: true } : t));
  const pause_all = () => set_timers((prev) => prev.map((t) => ({ ...t, running: false })));
  const reset_all = () => { set_timers((prev) => prev.map((t) => ({ ...t, remaining: t.duration, running: false }))); beeped.current.clear(); };
  const clear_all = () => { set_timers([]); beeped.current.clear(); };

  const copy_link = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      set_link_copied(true);
      setTimeout(() => set_link_copied(false), 2000);
    });
  };

  const [edit_name, set_edit_name] = useState("");

  const start_edit = (t: SubTimer) => {
    // Pause the timer while editing
    set_timers((prev) => prev.map((x) => x.id === t.id ? { ...x, running: false } : x));
    set_editing_id(t.id);
    set_edit_name(t.name);
    // Use remaining time (not original duration) so user can adjust mid-countdown
    set_edit_min(Math.floor(t.remaining / 60));
    set_edit_sec(t.remaining % 60);
  };

  const save_edit = (id: string) => {
    const new_remaining = edit_min * 60 + edit_sec;
    if (new_remaining > 0) {
      set_timers((prev) => prev.map((t) => t.id === id ? {
        ...t,
        name: edit_name.trim() || t.name,
        duration: Math.max(t.duration, new_remaining), // Keep original duration for progress bar, or increase if new time is larger
        remaining: new_remaining,
      } : t));
    }
    set_editing_id(null);
  };

  const has_any_running = timers.some((t) => t.running);
  const all_done = timers.length > 0 && timers.every((t) => t.remaining <= 0);

  // Build config for saving
  const save_config: Record<string, unknown> = {
    timers: encode_timers(timers),
  };

  const fs_vars = is_fullscreen ? {
    "--foreground": "#ffffff",
    "--muted-foreground": "rgba(255,255,255,0.5)",
    "--surface-container-high": "rgba(255,255,255,0.15)",
    "--surface-container-highest": "rgba(255,255,255,0.25)",
    "--surface-container-low": "rgba(255,255,255,0.08)",
    "--secondary": "#ab3514",
    "--secondary-foreground": "#ffffff",
  } as React.CSSProperties : {};

  return (
    <div ref={fs_ref} style={is_fullscreen ? { ...fs_vars, backgroundColor: "var(--primary)" } : {}}>
      {/* Fixed fullscreen button - always visible */}
      {!is_fullscreen && (
        <button
          aria-label="Full Screen"
          onClick={toggle_fs}
          className="fixed bottom-5 right-5 z-50 rounded-full p-3 flex items-center justify-center transition-colors bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90"
        >
          <Maximize className="w-5 h-5" />
        </button>
      )}
      {!is_fullscreen && <Navbar />}
      <main className={`min-h-screen flex flex-col ${is_fullscreen ? "justify-center px-6" : "bg-surface pt-14 pb-4 px-3 md:pt-20 md:px-4"}`}>
        <div className={`w-full mx-auto space-y-4 ${is_fullscreen ? "max-w-2xl" : "max-w-lg mt-8"}`}>
          <h1 className={`font-headline font-black text-center ${is_fullscreen ? "text-xl text-white" : "text-2xl text-foreground"}`}>
            Multi-Timer
          </h1>
          {!is_fullscreen && <p className="text-sm text-muted-foreground text-center">Run multiple independent countdown timers at once.</p>}

          {/* Add timer row */}
          <div className="flex items-end gap-2 flex-wrap">
            <div className="flex-1 min-w-[100px]">
              <input value={new_name} onChange={(e) => set_new_name(e.target.value)} placeholder="e.g., Pasta"
                onKeyDown={(e) => { if (e.key === "Enter") add_timer(); }}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${is_fullscreen ? "bg-white/10 text-white placeholder:text-white/40" : "bg-surface-container-low text-foreground"}`} />
            </div>
            <div className="flex items-center gap-1">
              <input type="number" min={0} value={new_min} onChange={(e) => set_new_min(Math.max(0, +e.target.value))}
                className={`w-14 px-2 py-2 rounded-xl text-sm text-center outline-none ${is_fullscreen ? "bg-white/10 text-white" : "bg-surface-container-low text-foreground"}`} />
              <span className={`text-xs ${is_fullscreen ? "text-white/50" : "text-muted-foreground"}`}>m</span>
              <input type="number" min={0} max={59} value={new_sec} onChange={(e) => set_new_sec(Math.max(0, Math.min(59, +e.target.value)))}
                className={`w-14 px-2 py-2 rounded-xl text-sm text-center outline-none ${is_fullscreen ? "bg-white/10 text-white" : "bg-surface-container-low text-foreground"}`} />
              <span className={`text-xs ${is_fullscreen ? "text-white/50" : "text-muted-foreground"}`}>s</span>
            </div>
            <button onClick={add_timer} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Bulk actions */}
          {timers.length > 0 && (
            <div className="flex gap-2 justify-end flex-wrap">
              {!has_any_running ? (
                <button onClick={start_all} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs font-semibold flex items-center gap-1">
                  <Play className="w-3 h-3" />Start All
                </button>
              ) : (
                <button onClick={pause_all} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${is_fullscreen ? "bg-white/10 text-white" : "bg-surface-container-high text-foreground"}`}>
                  <Pause className="w-3 h-3" />Pause All
                </button>
              )}
              <button onClick={reset_all} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${is_fullscreen ? "bg-white/10 text-white" : "bg-surface-container-high text-foreground"}`}>
                <RotateCcw className="w-3 h-3" />Reset All
              </button>
              <button onClick={clear_all} className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 text-destructive bg-destructive/10">
                <Trash2 className="w-3 h-3" />Clear All
              </button>
            </div>
          )}

          {/* Timer cards */}
          <div className="space-y-3">
            {timers.map((t) => {
              const progress = t.duration > 0 ? t.remaining / t.duration : 0;
              const is_done = t.remaining <= 0;
              const is_low = t.remaining > 0 && t.remaining <= 60;
              const is_editing = editing_id === t.id;

              return (
                <div key={t.id} className={`rounded-xl p-4 border-l-4 transition-all ${
                  is_done ? "border-emerald-500 bg-emerald-500/10" : is_low ? "border-red-500 bg-red-500/5" : t.running ? `border-secondary ${is_fullscreen ? "bg-white/5" : "bg-secondary/5"}` : `border-transparent ${is_fullscreen ? "bg-white/5" : "bg-surface-container-low"}`
                }`}>
                  {!is_editing ? (
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold text-sm flex items-center gap-1 ${is_fullscreen ? "text-white" : "text-foreground"}`}>
                        {t.name}
                        <button onClick={() => start_edit(t)} className="opacity-30 hover:opacity-100 transition-opacity" title="Edit timer">
                          <Pencil className="w-3 h-3" />
                        </button>
                      </span>
                      <span className={`font-headline font-black text-2xl ${is_done ? "text-emerald-500" : is_low ? "text-red-500" : is_fullscreen ? "text-white" : "text-foreground"}`}>
                        {is_done ? "Done!" : format_time(t.remaining)}
                      </span>
                    </div>
                  ) : (
                    <div className={`mb-3 p-3 rounded-lg space-y-2 ${is_fullscreen ? "bg-white/10" : "bg-surface-container-high/50"}`}>
                      <input value={edit_name} onChange={(e) => set_edit_name(e.target.value)}
                        placeholder="Timer name"
                        className={`w-full px-2 py-1.5 rounded text-sm font-semibold outline-none ${is_fullscreen ? "bg-white/10 text-white" : "bg-background text-foreground"}`} />
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${is_fullscreen ? "text-white/50" : "text-muted-foreground"}`}>Time:</span>
                        <input type="number" min={0} value={edit_min} onChange={(e) => set_edit_min(Math.max(0, +e.target.value))}
                          className={`w-14 px-2 py-1.5 rounded text-sm text-center outline-none ${is_fullscreen ? "bg-white/10 text-white" : "bg-background text-foreground"}`} />
                        <span className={`text-xs ${is_fullscreen ? "text-white/50" : "text-muted-foreground"}`}>m</span>
                        <input type="number" min={0} max={59} value={edit_sec} onChange={(e) => set_edit_sec(Math.max(0, Math.min(59, +e.target.value)))}
                          className={`w-14 px-2 py-1.5 rounded text-sm text-center outline-none ${is_fullscreen ? "bg-white/10 text-white" : "bg-background text-foreground"}`} />
                        <span className={`text-xs ${is_fullscreen ? "text-white/50" : "text-muted-foreground"}`}>s</span>
                        <button onClick={() => save_edit(t.id)} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-xs font-semibold ml-auto">Save</button>
                        <button onClick={() => set_editing_id(null)} className={`px-2 py-1.5 text-xs ${is_fullscreen ? "text-white/50" : "text-muted-foreground"}`}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className={`w-full h-1.5 rounded-full mb-2 overflow-hidden ${is_fullscreen ? "bg-white/10" : "bg-surface-container-high"}`}>
                    <div className={`h-full rounded-full transition-all duration-1000 ${is_done ? "bg-emerald-500" : is_low ? "bg-red-500" : "bg-secondary"}`}
                      style={{ width: `${progress * 100}%` }} />
                  </div>

                  <div className="flex gap-2 items-center">
                    {!is_done && (
                      <button onClick={() => set_timers((p) => p.map((x) => x.id === t.id ? { ...x, running: !x.running } : x))}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${t.running ? (is_fullscreen ? "bg-white/10 text-white" : "bg-surface-container-high text-foreground") : "bg-secondary text-secondary-foreground"}`}>
                        {t.running ? <><Pause className="w-3 h-3" />Pause</> : <><Play className="w-3 h-3" />Start</>}
                      </button>
                    )}
                    <button onClick={() => { set_timers((p) => p.map((x) => x.id === t.id ? { ...x, remaining: x.duration, running: false } : x)); beeped.current.delete(t.id); }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${is_fullscreen ? "bg-white/10 text-white/70" : "bg-surface-container-high text-foreground"}`}>
                      Reset
                    </button>
                    <button onClick={() => set_timers((p) => p.filter((x) => x.id !== t.id))}
                      className="ml-auto text-xs text-destructive/60 hover:text-destructive">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {timers.length === 0 && (
            <div className={`text-center py-12 ${is_fullscreen ? "text-white/40" : "text-muted-foreground"}`}>
              <p className="text-sm">Add timers above to get started.</p>
            </div>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className={`flex items-center justify-center gap-3 w-full mt-6 flex-wrap ${is_fullscreen ? "absolute bottom-5 left-6 right-6" : "max-w-lg mx-auto"}`}>
          <div className="flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Multi-Timer
          </div>
          <button onClick={toggle_audio} className={`rounded-full p-1.5 ${audio_enabled ? "bg-secondary/10" : is_fullscreen ? "bg-white/10" : "bg-surface-container-high"}`}>
            {audio_enabled ? <Volume2 className="text-secondary w-4 h-4" /> : <VolumeX className={`w-4 h-4 ${is_fullscreen ? "text-white/50" : "text-muted-foreground"}`} />}
          </button>
          <button onClick={toggle_fs} className={`rounded-full p-1.5 ${is_fullscreen ? "bg-white/10" : "bg-surface-container-high"}`}>
            {is_fullscreen ? <Minimize className="w-4 h-4 text-white/50" /> : <Maximize className="w-4 h-4 text-muted-foreground" />}
          </button>
          <button onClick={copy_link} className={`rounded-full p-1.5 ${link_copied ? "bg-emerald-100 text-emerald-700" : is_fullscreen ? "bg-white/10 text-white/50" : "bg-surface-container-high text-muted-foreground"}`}>
            {link_copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
          <SaveTimerButton timer_type="multi-timer" title="Multi-Timer" config={save_config} />
        </div>
      </main>
      {!is_fullscreen && (
        <TimerSeoContent
          timer_name="Multi-Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={MULTI_TIMER_FAQ}
          related_timers={MULTI_TIMER_RELATED}
        >
          <h2>When You Need More Than One Timer</h2>
          <p>
            A single kitchen timer works fine for boiling pasta. But real cooking — a Thanksgiving turkey
            with three sides, a weeknight stir-fry with rice timing, or a Sunday meal prep session with
            six containers — demands parallel tracking. Trying to manage multiple countdowns on one timer
            (or worse, in your head) leads to overcooked vegetables, forgotten oven items, and unnecessary
            stress. This multi-timer solves the problem by giving each dish its own named, independent
            countdown.
          </p>
          <p>
            Add as many timers as you need, give each one a descriptive name (e.g., &quot;Roast
            Chicken&quot;, &quot;Mashed Potatoes&quot;, &quot;Gravy&quot;), and start them at staggered
            intervals as each dish goes on the heat. Each timer runs independently — you can pause,
            reset, or edit any single timer without affecting the others.
          </p>

          <h2>Perfect For These Kitchen Scenarios</h2>
          <ul>
            <li><strong>Holiday meals</strong> — Thanksgiving, Christmas, and Easter dinners involve 4-8 dishes with overlapping cook times. Name each timer after the dish and start them as each item goes in.</li>
            <li><strong>Multi-course dinners</strong> — Coordinate appetizer, main course, and dessert timing so each course is ready exactly when you need it.</li>
            <li><strong>Meal prep Sundays</strong> — When batch-cooking grains, proteins, and roasted vegetables simultaneously, each item has its own timer and its own alert.</li>
            <li><strong>Baking day</strong> — Track proofing, baking, and cooling times for multiple loaves or batches of cookies. Works alongside our dedicated <a href="/kitchen/bread-proofing">bread proofing timer</a> for single-loaf focus.</li>
            <li><strong>BBQ and smoking</strong> — Low-and-slow cooking with multiple meats at different stages. Set long timers (hours) for brisket alongside short timers for corn and sides.</li>
          </ul>

          <h2>How to Manage Parallel Cooking Tasks</h2>
          <p>
            The secret to timing a multi-dish meal is working backwards from your serving time. Identify
            the dish with the longest cook time — that sets your start. Then calculate when each
            subsequent dish needs to start so everything finishes within a 5-10 minute window. Here is
            a practical example for a dinner at 7:00 PM:
          </p>
          <ol>
            <li><strong>5:00 PM</strong> — Start the roast chicken timer (120 min). Add a timer named &quot;Chicken&quot; set to 2 hours.</li>
            <li><strong>6:00 PM</strong> — Start the roasted vegetables timer (45 min). Add &quot;Vegetables&quot; at 45 minutes.</li>
            <li><strong>6:30 PM</strong> — Start the rice timer (20 min). Add &quot;Rice&quot; at 20 minutes.</li>
            <li><strong>6:45 PM</strong> — Start the gravy timer (15 min). Add &quot;Gravy&quot; at 15 minutes.</li>
          </ol>
          <p>
            Each timer alerts you independently when its dish is ready, so nothing gets forgotten. For
            single-dish timing, our <a href="/kitchen/cooking">cooking timer</a> with preset buttons
            may be faster.
          </p>

          <h2>How to Use This Multi-Timer</h2>
          <ol>
            <li><strong>Name your timer</strong> — Type a descriptive name (e.g., &quot;Pasta&quot;) in the input field.</li>
            <li><strong>Set the duration</strong> — Enter minutes and seconds using the number inputs.</li>
            <li><strong>Add the timer</strong> — Click the + button or press Enter. Repeat for each dish.</li>
            <li><strong>Start individually or all at once</strong> — Use each timer&apos;s Start button, or &quot;Start All&quot; if everything goes on the heat simultaneously.</li>
            <li><strong>Enable audio</strong> — Click the speaker icon to receive audio alerts when each timer completes.</li>
            <li><strong>Share your setup</strong> — Click the link icon to copy a URL that preserves your timer names and durations for next time.</li>
          </ol>

          <h2>Tips for Complex Meal Timing</h2>
          <ul>
            <li><strong>Add resting timers</strong> — Meats need rest time after cooking. Add a separate &quot;Chicken Rest&quot; timer for 10-15 minutes and start it when the cooking timer finishes.</li>
            <li><strong>Use full-screen mode</strong> — In a busy kitchen, the full-screen display makes all timers visible from across the room. Mount a tablet on the counter or use a wall-mounted screen.</li>
            <li><strong>Edit mid-cook</strong> — If something needs more time, tap the pencil icon to adjust without resetting. The timer pauses while you edit and can resume with the new duration.</li>
            <li><strong>Bookmark recurring setups</strong> — If you make the same multi-dish meal weekly, the shareable URL preserves your exact timer configuration for one-click access next time.</li>
          </ul>
        </TimerSeoContent>
      )}
      {!is_fullscreen && <Footer />}
    </div>
  );
}

export default function Page() {
  return <Suspense><MultiTimerContent /></Suspense>;
}
