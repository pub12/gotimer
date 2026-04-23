import type { Theme } from "./params";

export interface ThemeSpec {
  transparent: boolean;
  wrapper_class: string;
  oversized: boolean;
  inline_style?: { background?: string; color?: string };
}

const HEX_RE = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export function resolve_theme(input: {
  theme: Theme;
  bg?: string;
  accent?: string;
}): ThemeSpec {
  const base = base_for(input.theme);

  if (input.bg === "transparent" || input.theme === "streaming") {
    base.transparent = true;
    base.wrapper_class = base.wrapper_class.replace(/bg-\S+/g, "").trim() + " bg-transparent";
  } else if (input.bg && HEX_RE.test(input.bg)) {
    base.inline_style = { ...(base.inline_style || {}), background: input.bg };
    base.wrapper_class = base.wrapper_class.replace(/bg-\S+/g, "").trim();
  }

  return base;
}

function base_for(theme: Theme): ThemeSpec {
  switch (theme) {
    case "classroom":
      return {
        transparent: false,
        wrapper_class: "bg-white text-black",
        oversized: true,
      };
    case "streaming":
      return {
        transparent: true,
        wrapper_class: "bg-transparent text-white",
        oversized: false,
      };
    case "dark":
      return {
        transparent: false,
        wrapper_class: "bg-neutral-950 text-white",
        oversized: false,
      };
    case "light":
      return {
        transparent: false,
        wrapper_class: "bg-white text-neutral-900",
        oversized: false,
      };
    case "darkroom":
      return {
        transparent: false,
        wrapper_class: "bg-red-950 text-red-50",
        oversized: false,
      };
    case "auto":
    default:
      return {
        transparent: false,
        wrapper_class: "bg-surface text-foreground",
        oversized: false,
      };
  }
}
