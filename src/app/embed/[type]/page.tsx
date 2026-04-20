"use client";

import React, { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { get_strategy } from "@/lib/timer-strategies";

const RESERVED_KEYS = new Set([
  "type",
  "started",
  "label",
  "theme",
  "controls",
  "branding",
  "autostart",
]);

function parse_param_value(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
  return value;
}

function EmbedContent({ type }: { type: string }) {
  const search_params = useSearchParams();
  const strategy = get_strategy(type);

  if (!strategy) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-surface">
        <p className="text-muted-foreground text-sm">
          Unknown timer type: <code>{type}</code>
        </p>
      </div>
    );
  }

  const label = search_params.get("label") || type;
  const theme = search_params.get("theme") || "auto";
  const controls = (search_params.get("controls") || "full") as
    | "full"
    | "minimal"
    | "none";
  const branding = (search_params.get("branding") || "full") as
    | "full"
    | "minimal";
  const started_str = search_params.get("started");

  // Build config from all non-reserved search params
  const config: Record<string, unknown> = {};
  search_params.forEach((value, key) => {
    if (!RESERVED_KEYS.has(key)) {
      config[key] = parse_param_value(value);
    }
  });

  // If started is present, compute elapsed and adjust duration-based configs
  if (started_str) {
    const started = new Date(started_str);
    if (!isNaN(started.getTime())) {
      const elapsed = Math.floor((Date.now() - started.getTime()) / 1000);

      if (typeof config.duration === "number") {
        config.duration = Math.max(0, config.duration - elapsed);
      }
      if (typeof config.duration_per_player === "number") {
        config.duration_per_player = Math.max(
          0,
          config.duration_per_player - elapsed
        );
      }
    }
  }

  return (
    <TimerEmbed
      strategy={strategy}
      config={config}
      label={label}
      theme={theme}
      controls={controls}
      branding={branding}
    />
  );
}

export default function EmbedPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);

  return (
    <Suspense>
      <EmbedContent type={type} />
    </Suspense>
  );
}
