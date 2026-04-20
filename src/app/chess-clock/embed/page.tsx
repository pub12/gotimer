"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { chessClockStrategy } from "@/lib/timer-strategies/chess-clock";

function ChessClockEmbedContent() {
  const params = useSearchParams();
  let duration = Number(params.get("duration")) || 300;
  const controls = (params.get("controls") || "full") as "full" | "minimal" | "none";
  const branding = (params.get("branding") || "full") as "full" | "minimal";
  const label = params.get("label") || "Chess Clock";
  const started_str = params.get("started");

  if (started_str) {
    const started = new Date(started_str);
    if (!isNaN(started.getTime())) {
      const elapsed = Math.floor((Date.now() - started.getTime()) / 1000);
      duration = Math.max(0, duration - elapsed);
    }
  }

  return (
    <TimerEmbed
      strategy={chessClockStrategy}
      config={{ duration }}
      label={label}
      controls={controls}
      branding={branding}
    />
  );
}

export default function ChessClockEmbedPage() {
  return (
    <Suspense>
      <ChessClockEmbedContent />
    </Suspense>
  );
}
