"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { roundTimerStrategy } from "@/lib/timer-strategies/round-timer";

function RoundTimerEmbedContent() {
  const params = useSearchParams();
  const controls = (params.get("controls") || "full") as "full" | "minimal" | "none";
  const branding = (params.get("branding") || "full") as "full" | "minimal";
  const label = params.get("label") || "Round Timer";
  const started_str = params.get("started");

  const config: Record<string, unknown> = {};
  const round_duration = params.get("round_duration");
  const rest_duration = params.get("rest_duration");
  const rounds = params.get("rounds");

  if (round_duration) config.round_duration = Number(round_duration);
  if (rest_duration) config.rest_duration = Number(rest_duration);
  if (rounds) config.rounds = Number(rounds);

  if (started_str) {
    const started = new Date(started_str);
    if (!isNaN(started.getTime())) {
      const elapsed = Math.floor((Date.now() - started.getTime()) / 1000);
      if (typeof config.round_duration === "number") {
        config.round_duration = Math.max(0, config.round_duration - elapsed);
      }
    }
  }

  return (
    <TimerEmbed
      strategy={roundTimerStrategy}
      config={config}
      label={label}
      controls={controls}
      branding={branding}
    />
  );
}

export default function RoundTimerEmbedPage() {
  return (
    <Suspense>
      <RoundTimerEmbedContent />
    </Suspense>
  );
}
