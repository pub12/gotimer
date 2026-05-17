"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { TimerProvider, useTimer } from "@/components/timer/timer-provider";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";

export type BrbFont = "mono" | "serif" | "sans";
export type BrbSize = "xl" | "lg" | "md";
export type BrbAlign = "center" | "left" | "right";
export type BrbSound = "bell" | "chime" | "off";

export interface BrbDefaults {
  mins?: number;
  secs?: number;
  label?: string;
  color?: string;
  font?: BrbFont;
  bg?: string;
  size?: BrbSize;
  align?: BrbAlign;
  pulse?: boolean;
  autostart?: boolean;
  sound?: BrbSound;
}

interface ParsedBrbConfig {
  duration: number;
  label: string;
  color: string;
  font: BrbFont;
  bg: string;
  size: BrbSize;
  align: BrbAlign;
  pulse: boolean;
  autostart: boolean;
  sound: BrbSound;
}

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;
const FONTS: BrbFont[] = ["mono", "serif", "sans"];
const SIZES: BrbSize[] = ["xl", "lg", "md"];
const ALIGNS: BrbAlign[] = ["center", "left", "right"];
const SOUNDS: BrbSound[] = ["bell", "chime", "off"];

function clamp_int(value: string | null, min: number, max: number, fallback: number): number {
  if (value === null) return fallback;
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function parse_hex(value: string | null, fallback: string): string {
  if (value === null) return fallback;
  if (!HEX_RE.test(value)) return fallback;
  return value.startsWith("#") ? value : `#${value}`;
}

function parse_enum<T extends string>(
  value: string | null,
  allowed: T[],
  fallback: T,
): T {
  if (value === null) return fallback;
  return (allowed as string[]).includes(value) ? (value as T) : fallback;
}

function parse_bool(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback;
  return value === "1" || value === "true";
}

function parse_label(value: string | null, fallback: string): string {
  if (value === null) return fallback;
  // useSearchParams already decodes "+" and "%20"; just strip any HTML.
  const stripped = value.replace(/<[^>]*>/g, "").trim();
  return stripped.slice(0, 80) || fallback;
}

function parse_bg(value: string | null, fallback: string): string {
  if (value === null) return fallback;
  if (value === "transparent") return "transparent";
  return parse_hex(value, fallback);
}

function parse_params(
  params: URLSearchParams,
  defaults: BrbDefaults | undefined,
): ParsedBrbConfig {
  const d: Required<BrbDefaults> = {
    mins: defaults?.mins ?? 5,
    secs: defaults?.secs ?? 0,
    label: defaults?.label ?? "Back soon",
    color: defaults?.color ?? "#ffffff",
    font: defaults?.font ?? "sans",
    bg: defaults?.bg ?? "transparent",
    size: defaults?.size ?? "xl",
    align: defaults?.align ?? "center",
    pulse: defaults?.pulse ?? false,
    autostart: defaults?.autostart ?? false,
    sound: defaults?.sound ?? "off",
  };

  const mins = clamp_int(params.get("mins"), 0, 999, d.mins);
  const secs = clamp_int(params.get("secs"), 0, 59, d.secs);
  const duration = Math.max(1, mins * 60 + secs);

  return {
    duration,
    label: parse_label(params.get("label"), d.label),
    color: parse_hex(params.get("color"), d.color),
    font: parse_enum(params.get("font"), FONTS, d.font),
    bg: parse_bg(params.get("bg"), d.bg),
    size: parse_enum(params.get("size"), SIZES, d.size),
    align: parse_enum(params.get("align"), ALIGNS, d.align),
    pulse: parse_bool(params.get("pulse"), d.pulse),
    autostart: parse_bool(params.get("autostart"), d.autostart),
    sound: parse_enum(params.get("sound"), SOUNDS, d.sound),
  };
}

const FONT_STACKS: Record<BrbFont, string> = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
};

const SIZE_CSS: Record<BrbSize, { time: string; label: string }> = {
  xl: { time: "clamp(120px, 24vw, 480px)", label: "clamp(20px, 3vw, 60px)" },
  lg: { time: "clamp(80px, 16vw, 320px)", label: "clamp(16px, 2.4vw, 48px)" },
  md: { time: "clamp(48px, 9vw, 180px)", label: "clamp(14px, 1.8vw, 32px)" },
};

const ALIGN_CSS: Record<BrbAlign, { justify: string; text: string; padding: string }> = {
  center: { justify: "center", text: "center", padding: "0" },
  left: { justify: "flex-start", text: "left", padding: "0 0 0 5vw" },
  right: { justify: "flex-end", text: "right", padding: "0 5vw 0 0" },
};

function format_mmss(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const KEYFRAMES_CSS = `
  @keyframes brb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(1.04); }
  }
  @keyframes brb-flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .brb-pulse { animation: brb-pulse 1s ease-in-out infinite; }
  .brb-flash { animation: brb-flash 0.6s ease-in-out infinite; }
`;

interface BrbDisplayProps {
  cfg: ParsedBrbConfig;
  /** Seconds to render (mm:ss). */
  seconds: number;
  /** Position: "fixed" fills viewport (overlay use); "relative" fills its container (preview use). */
  position?: "fixed" | "relative";
}

/**
 * Pure visual render of the overlay — no timer machine. Used by the
 * fullscreen overlay (position="fixed") and by the configurator preview
 * (position="relative"). Animation classes are applied automatically
 * based on `seconds` and `cfg.pulse`.
 */
export function BrbDisplay({ cfg, seconds, position = "fixed" }: BrbDisplayProps) {
  const is_pulse_phase = cfg.pulse && seconds > 0 && seconds <= 10;
  const is_done = seconds === 0;
  const size = SIZE_CSS[cfg.size];
  const align = ALIGN_CSS[cfg.align];
  const font_family = FONT_STACKS[cfg.font];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position,
        inset: position === "fixed" ? 0 : undefined,
        width: position === "relative" ? "100%" : undefined,
        height: position === "relative" ? "100%" : undefined,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems:
          align.justify === "flex-start"
            ? "flex-start"
            : align.justify === "flex-end"
              ? "flex-end"
              : "center",
        padding: align.padding,
        color: cfg.color,
        fontFamily: font_family,
        fontVariantNumeric: "tabular-nums",
        textAlign: align.text as React.CSSProperties["textAlign"],
        background: cfg.bg,
        textShadow: "0 2px 16px rgba(0,0,0,0.45)",
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontSize: size.time,
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
        className={is_done ? "brb-flash" : is_pulse_phase ? "brb-pulse" : undefined}
      >
        {format_mmss(seconds)}
      </div>
      {cfg.label && (
        <div
          style={{
            marginTop: "0.4em",
            fontSize: size.label,
            fontWeight: 500,
            opacity: 0.95,
            letterSpacing: "0.02em",
          }}
        >
          {cfg.label}
        </div>
      )}
    </div>
  );
}

function OverlayInner({ cfg }: { cfg: ParsedBrbConfig }) {
  const { machine } = useTimer();
  const { display, status, start } = machine;

  useEffect(() => {
    if (cfg.autostart && status === "idle") {
      const id = setTimeout(start, 50);
      return () => clearTimeout(id);
    }
  }, [cfg.autostart, status, start]);

  return (
    <>
      <style>{`
        html, body { background: ${cfg.bg} !important; margin: 0; padding: 0; }
        ${KEYFRAMES_CSS}
      `}</style>
      <BrbDisplay cfg={cfg} seconds={display.primary_time} position="fixed" />
    </>
  );
}

function OverlayContent({ defaults }: { defaults?: BrbDefaults }) {
  const params = useSearchParams();
  const cfg = useMemo(() => parse_params(params, defaults), [params, defaults]);

  return (
    <TimerProvider strategy={countdownStrategy} config={{ duration: cfg.duration }}>
      <OverlayInner cfg={cfg} />
    </TimerProvider>
  );
}

/**
 * Bare countdown overlay for OBS Browser Source. Renders nothing else —
 * no nav, no footer, transparent background by default. All visual config
 * comes from URL query parameters (see parse_params). Pass `defaults` to
 * pre-fill values for preset routes.
 */
export function BrbOverlay({ defaults }: { defaults?: BrbDefaults }) {
  return (
    <Suspense fallback={null}>
      <OverlayContent defaults={defaults} />
    </Suspense>
  );
}

export type { ParsedBrbConfig };
export { parse_params, format_mmss, KEYFRAMES_CSS };
