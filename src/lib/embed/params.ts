export const RESERVED_KEYS = new Set<string>([
  "type",
  "started",
  "label",
  "theme",
  "controls",
  "branding",
  "autostart",
  "bg",
  "font",
  "size",
  "accent",
  "message",
  "expired_message",
  "on_expire",
  "repeat",
  "evergreen",
  "pro_token",
]);

export type Theme = "auto" | "light" | "dark" | "classroom" | "streaming" | "darkroom";
export type Controls = "full" | "minimal" | "none";
export type Branding = "full" | "minimal" | "corner" | "hidden";
export type SizePreset = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface EmbedParams {
  type: string;
  label: string;
  theme: Theme;
  controls: Controls;
  branding: Branding;
  autostart: boolean;
  started?: string;

  bg?: string;
  font?: string;
  size?: SizePreset;
  accent?: string;
  message?: string;
  expired_message?: string;
  on_expire?: string;
  repeat?: string;
  evergreen: boolean;

  pro_token?: string;

  config: Record<string, unknown>;
}

function coerce(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  return value;
}

function string_or(v: string | null, fallback: string): string {
  return v && v.length > 0 ? v : fallback;
}

function enum_or<T extends string>(v: string | null, allowed: readonly T[], fallback: T): T {
  if (v && (allowed as readonly string[]).includes(v)) return v as T;
  return fallback;
}

const THEMES: readonly Theme[] = ["auto", "light", "dark", "classroom", "streaming", "darkroom"];
const CONTROLS: readonly Controls[] = ["full", "minimal", "none"];
const BRANDING: readonly Branding[] = ["full", "minimal", "corner", "hidden"];
const SIZES: readonly SizePreset[] = ["xs", "sm", "md", "lg", "xl", "full"];

export function parse_embed_params(sp: URLSearchParams, type: string): EmbedParams {
  const config: Record<string, unknown> = {};
  sp.forEach((value, key) => {
    if (!RESERVED_KEYS.has(key)) {
      config[key] = coerce(value);
    }
  });

  const size_raw = sp.get("size");

  return {
    type,
    label: string_or(sp.get("label"), type),
    theme: enum_or(sp.get("theme"), THEMES, "auto"),
    controls: enum_or(sp.get("controls"), CONTROLS, "full"),
    branding: enum_or(sp.get("branding"), BRANDING, "full"),
    autostart: sp.get("autostart") === "true" || sp.get("autostart") === "1",
    started: sp.get("started") || undefined,

    bg: sp.get("bg") || undefined,
    font: sp.get("font") || undefined,
    size: size_raw && (SIZES as readonly string[]).includes(size_raw) ? (size_raw as SizePreset) : undefined,
    accent: sp.get("accent") || undefined,
    message: sp.get("message") || undefined,
    expired_message: sp.get("expired_message") || undefined,
    on_expire: sp.get("on_expire") || undefined,
    repeat: sp.get("repeat") || undefined,
    evergreen: sp.get("evergreen") === "1" || sp.get("evergreen") === "true",

    pro_token: sp.get("pro_token") || undefined,

    config,
  };
}

/**
 * Adjust duration-based config keys for an already-started timer so the
 * remaining time is correct on page load.
 */
export function apply_started_offset(
  config: Record<string, unknown>,
  started_iso: string | undefined,
): Record<string, unknown> {
  if (!started_iso) return config;
  const started = new Date(started_iso);
  if (isNaN(started.getTime())) return config;
  const elapsed = Math.floor((Date.now() - started.getTime()) / 1000);
  const next = { ...config };
  if (typeof next.duration === "number") {
    next.duration = Math.max(0, (next.duration as number) - elapsed);
  }
  if (typeof next.duration_per_player === "number") {
    next.duration_per_player = Math.max(
      0,
      (next.duration_per_player as number) - elapsed,
    );
  }
  return next;
}
