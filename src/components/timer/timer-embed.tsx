"use client";

import React, { Suspense, useEffect } from "react";
import { TimerProvider, useTimer } from "./timer-provider";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { EmbedWatermark } from "./embed-watermark";
import { EmbedMessage } from "./embed-message";
import type { TimerStrategy } from "@/lib/timer-strategies/types";
import type { TimerDisplayVariant } from "./timer-display";
import type { EmbedParams } from "@/lib/embed/params";
import { resolve_theme } from "@/lib/embed/theme";
import { resolve_watermark } from "@/lib/embed/watermark-config";
import { fire_embed_view, fire_watermark_click } from "@/lib/ga-events";

interface TimerEmbedProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strategy: TimerStrategy<any>;
  config: unknown;
  params: EmbedParams;
  display_variant?: TimerDisplayVariant;
  show_skip?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<EmbedParams["size"]>, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-none w-full",
};

function InjectFont({ font }: { font?: string }) {
  if (!font) return null;
  const safe = font.replace(/[^a-zA-Z0-9 \-]/g, "");
  if (!safe) return null;
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(safe)}:wght@400;600;700&display=swap`;
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={href} />
      <style>{`.gotimer-embed-root{font-family:'${safe}',system-ui,sans-serif}`}</style>
    </>
  );
}

function EmbedInner({
  params,
  display_variant = "ring",
  show_skip,
}: {
  params: EmbedParams;
  display_variant?: TimerDisplayVariant;
  show_skip?: boolean;
}) {
  const { machine } = useTimer();
  const { display } = machine;
  const is_complete = display.progress <= 0;

  const theme_spec = resolve_theme({
    theme: params.theme,
    bg: params.bg,
    accent: params.accent,
  });
  const watermark_spec = resolve_watermark({
    branding: params.branding,
    theme: params.theme,
    pro_token: params.pro_token,
    label: params.label,
  });

  useEffect(() => {
    fire_embed_view(params.type, params.theme, params.branding);
  }, [params.type, params.theme, params.branding]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.parent === window) return; // not iframed
    const emit = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ source: "gotimer", type: "resize", height }, "*");
    };
    emit();
    const observer = new ResizeObserver(emit);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  const size_class = params.size ? SIZE_CLASSES[params.size] : "max-w-sm";
  const accent_style: React.CSSProperties = params.accent
    ? ({ ["--gotimer-accent"]: params.accent } as React.CSSProperties)
    : {};

  return (
    <div
      className={`gotimer-embed-root flex flex-col items-center justify-center min-h-screen p-4 ${theme_spec.wrapper_class} ${theme_spec.oversized ? "text-2xl" : ""}`}
      style={{ ...theme_spec.inline_style, ...accent_style }}
    >
      <InjectFont font={params.font} />
      <div className={`flex flex-col items-center gap-4 w-full ${size_class}`}>
        <EmbedMessage
          message={params.message}
          expired_message={params.expired_message}
          is_complete={is_complete}
        />
        <TimerDisplay
          time={display.primary_time}
          progress={display.progress}
          variant={display_variant}
          color={params.accent || display.ring_color}
          phase_label={display.phase_label}
        />
        {params.controls !== "none" && <TimerControls show_skip={show_skip} />}
      </div>
      <EmbedWatermark
        spec={watermark_spec}
        onClick={() => fire_watermark_click(params.type, watermark_spec.variant)}
      />
    </div>
  );
}

export function TimerEmbed({ strategy, config, params, display_variant, show_skip }: TimerEmbedProps) {
  return (
    <Suspense>
      <TimerProvider strategy={strategy} config={config}>
        <EmbedInner params={params} display_variant={display_variant} show_skip={show_skip} />
      </TimerProvider>
    </Suspense>
  );
}
