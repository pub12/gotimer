import { verify_pro_token } from "./pro-tokens";
import type { Branding, Theme } from "./params";

export type WatermarkVariant = "full" | "minimal" | "corner";
export type WatermarkPosition = "bottom-center" | "bottom-right" | "top-right";

export interface WatermarkSpec {
  show: boolean;
  variant: WatermarkVariant;
  position: WatermarkPosition;
  link_text: string;
  href: string;
}

const BASE_URL = "https://gotimer.org/?utm_source=embed&utm_medium=watermark";

export function resolve_watermark(input: {
  branding: Branding;
  theme?: Theme;
  pro_token?: string;
  label?: string;
}): WatermarkSpec {
  const hidden_requested = input.branding === "hidden";
  const token_ok = hidden_requested && input.pro_token
    ? verify_pro_token(input.pro_token).valid
    : false;

  if (hidden_requested && token_ok) {
    return {
      show: false,
      variant: "minimal",
      position: "bottom-center",
      link_text: "",
      href: BASE_URL,
    };
  }

  if (input.theme === "streaming") {
    return {
      show: true,
      variant: "corner",
      position: "bottom-right",
      link_text: "gotimer.org",
      href: BASE_URL,
    };
  }

  if (input.theme === "classroom") {
    return {
      show: true,
      variant: "minimal",
      position: "top-right",
      link_text: "gotimer.org",
      href: BASE_URL,
    };
  }

  if (input.branding === "minimal" || hidden_requested) {
    return {
      show: true,
      variant: "minimal",
      position: "bottom-center",
      link_text: "GoTimer.org",
      href: BASE_URL,
    };
  }

  if (input.branding === "corner") {
    return {
      show: true,
      variant: "corner",
      position: "bottom-right",
      link_text: "gotimer.org",
      href: BASE_URL,
    };
  }

  return {
    show: true,
    variant: "full",
    position: "bottom-center",
    link_text: "⏱ Powered by GoTimer — Free online timers",
    href: BASE_URL,
  };
}
