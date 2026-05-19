"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  BrbDisplay,
  KEYFRAMES_CSS,
  type BrbAlign,
  type BrbFont,
  type BrbSize,
  type ParsedBrbConfig,
} from "./overlay";

interface ConfiguratorState {
  mins: number;
  secs: number;
  label: string;
  color: string;
  font: BrbFont;
  bg: string;
  size: BrbSize;
  align: BrbAlign;
  pulse: boolean;
  autostart: boolean;
}

const INITIAL: ConfiguratorState = {
  mins: 5,
  secs: 0,
  label: "Back soon",
  color: "#ffd700",
  font: "sans",
  bg: "transparent",
  size: "xl",
  align: "center",
  pulse: true,
  autostart: true,
};

function build_url(base_path: string, state: ConfiguratorState): string {
  const params = new URLSearchParams();
  params.set("embed", "1");
  if (state.mins !== 5) params.set("mins", String(state.mins));
  if (state.secs !== 0) params.set("secs", String(state.secs));
  if (state.label !== "Back soon") params.set("label", state.label);
  if (state.color.toLowerCase() !== "#ffffff" && state.color !== "#ffd700")
    params.set("color", state.color.replace("#", ""));
  if (state.color === "#ffd700") params.set("color", "ffd700");
  if (state.font !== "sans") params.set("font", state.font);
  if (state.bg !== "transparent")
    params.set("bg", state.bg.replace("#", ""));
  if (state.size !== "xl") params.set("size", state.size);
  if (state.align !== "center") params.set("align", state.align);
  if (state.pulse) params.set("pulse", "1");
  if (state.autostart) params.set("autostart", "1");
  return `${base_path}?${params.toString()}`;
}

function to_parsed_cfg(state: ConfiguratorState): ParsedBrbConfig {
  return {
    duration: Math.max(1, state.mins * 60 + state.secs),
    label: state.label,
    color: state.color,
    font: state.font,
    bg: state.bg === "transparent" ? "transparent" : state.bg,
    size: state.size,
    align: state.align,
    pulse: state.pulse,
    autostart: state.autostart,
    sound: "off",
  };
}

export function BrbConfigurator() {
  const [state, set_state] = useState<ConfiguratorState>(INITIAL);
  const [copied, set_copied] = useState(false);
  const [base_url, set_base_url] = useState("/brb");

  useEffect(() => {
    if (typeof window !== "undefined") {
      set_base_url(`${window.location.origin}/brb`);
    }
  }, []);

  const cfg = useMemo(() => to_parsed_cfg(state), [state]);
  const embed_url = useMemo(() => build_url(base_url, state), [base_url, state]);

  // Live-cycle a preview countdown so the user can see pulse + flash without
  // touching OBS. Resets whenever the user changes mins/secs.
  const total = Math.max(1, state.mins * 60 + state.secs);
  const [preview_seconds, set_preview_seconds] = useState(total);
  useEffect(() => {
    set_preview_seconds(total);
  }, [total]);
  useEffect(() => {
    if (!state.autostart) {
      set_preview_seconds(total);
      return;
    }
    const id = setInterval(() => {
      set_preview_seconds((prev) => (prev <= 0 ? total : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [state.autostart, total]);

  const on_copy = async () => {
    try {
      await navigator.clipboard.writeText(embed_url);
      set_copied(true);
      setTimeout(() => set_copied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="w-full bg-card rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Live preview */}
        <div className="relative overflow-hidden bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:32px_32px] aspect-video md:aspect-auto md:min-h-[420px] flex items-center justify-center">
          <style>{KEYFRAMES_CSS}</style>
          <div className="absolute inset-0">
            <BrbDisplay cfg={cfg} seconds={preview_seconds} position="relative" />
          </div>
          <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider text-white/70 font-mono px-2 py-0.5 bg-black/40 rounded">
            Preview (transparency checker bg)
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <Field label="Minutes">
              <input
                type="number"
                min={0}
                max={999}
                value={state.mins}
                onChange={(e) =>
                  set_state({ ...state, mins: Math.max(0, parseInt(e.target.value) || 0) })
                }
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-sm outline-none"
              />
            </Field>
            <Field label="Seconds">
              <input
                type="number"
                min={0}
                max={59}
                value={state.secs}
                onChange={(e) =>
                  set_state({
                    ...state,
                    secs: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)),
                  })
                }
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-sm outline-none"
              />
            </Field>
          </div>

          <Field label="Label">
            <input
              type="text"
              value={state.label}
              maxLength={60}
              onChange={(e) => set_state({ ...state, label: e.target.value })}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-sm outline-none"
            />
          </Field>

          <div className="flex gap-2">
            <Field label="Text color">
              <input
                type="color"
                value={state.color}
                onChange={(e) => set_state({ ...state, color: e.target.value })}
                className="w-full h-9 bg-surface-container-low rounded-lg cursor-pointer"
              />
            </Field>
            <Field label="Background">
              <select
                value={state.bg === "transparent" ? "transparent" : "solid"}
                onChange={(e) =>
                  set_state({
                    ...state,
                    bg: e.target.value === "transparent" ? "transparent" : "#000000",
                  })
                }
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
              >
                <option value="transparent">Transparent (OBS default)</option>
                <option value="solid">Solid color</option>
              </select>
            </Field>
          </div>
          {state.bg !== "transparent" && (
            <Field label="Background color">
              <input
                type="color"
                value={state.bg}
                onChange={(e) => set_state({ ...state, bg: e.target.value })}
                className="w-full h-9 bg-surface-container-low rounded-lg cursor-pointer"
              />
            </Field>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Field label="Font">
              <select
                value={state.font}
                onChange={(e) =>
                  set_state({ ...state, font: e.target.value as BrbFont })
                }
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
              >
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
                <option value="mono">Mono</option>
              </select>
            </Field>
            <Field label="Size">
              <select
                value={state.size}
                onChange={(e) =>
                  set_state({ ...state, size: e.target.value as BrbSize })
                }
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
              >
                <option value="xl">XL</option>
                <option value="lg">LG</option>
                <option value="md">MD</option>
              </select>
            </Field>
            <Field label="Align">
              <select
                value={state.align}
                onChange={(e) =>
                  set_state({ ...state, align: e.target.value as BrbAlign })
                }
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
              >
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </Field>
          </div>

          <div className="flex gap-4 pt-1">
            <Checkbox
              label="Pulse on last 10s"
              checked={state.pulse}
              onChange={(v) => set_state({ ...state, pulse: v })}
            />
            <Checkbox
              label="Autostart"
              checked={state.autostart}
              onChange={(v) => set_state({ ...state, autostart: v })}
            />
          </div>

          <div className="pt-3 border-t border-surface-container-high">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Your OBS Browser-Source URL
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={embed_url}
                className="flex-1 px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-xs font-mono outline-none truncate"
                onFocus={(e) => e.currentTarget.select()}
              />
              <button
                type="button"
                onClick={on_copy}
                className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Paste this into <strong>OBS Studio → + → Browser Source → URL</strong>. Set width/height to your canvas size.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block flex-1">
      <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded cursor-pointer accent-secondary"
      />
      {label}
    </label>
  );
}
