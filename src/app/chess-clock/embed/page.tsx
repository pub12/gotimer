"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { chessClockStrategy } from "@/lib/timer-strategies/chess-clock";
import { parse_embed_params, apply_started_offset } from "@/lib/embed/params";

function ChessClockEmbedContent() {
  const search_params = useSearchParams();
  const had_label = search_params.has("label");
  const params = parse_embed_params(search_params, "chess-clock");
  if (!had_label) params.label = "Chess Clock";
  // Default duration_per_player if not supplied
  if (params.config.duration_per_player === undefined) {
    // Previous page default was duration=300 and config passed as { duration }
    // but chess-clock strategy expects duration_per_player. Preserve previous
    // behaviour: use "duration" URL param if present, else 300.
    params.config.duration_per_player =
      typeof params.config.duration === "number" ? params.config.duration : 300;
  }
  const config = apply_started_offset(params.config, params.started);

  return <TimerEmbed strategy={chessClockStrategy} config={config} params={params} />;
}

export default function ChessClockEmbedPage() {
  return (
    <Suspense>
      <ChessClockEmbedContent />
    </Suspense>
  );
}
