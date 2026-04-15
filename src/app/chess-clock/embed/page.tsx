"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { chessClockStrategy } from "@/lib/timer-strategies/chess-clock";

function ChessClockEmbedContent() {
  const params = useSearchParams();
  const duration = Number(params.get("duration")) || 300;
  const controls = (params.get("controls") || "full") as "full" | "minimal" | "none";
  const branding = (params.get("branding") || "full") as "full" | "minimal";

  return (
    <TimerEmbed
      strategy={chessClockStrategy}
      config={{ duration }}
      label="Chess Clock"
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
