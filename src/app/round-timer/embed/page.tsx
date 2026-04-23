"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { roundTimerStrategy } from "@/lib/timer-strategies/round-timer";
import { parse_embed_params, apply_started_offset } from "@/lib/embed/params";

function RoundTimerEmbedContent() {
  const search_params = useSearchParams();
  const had_label = search_params.has("label");
  const params = parse_embed_params(search_params, "round-timer");
  if (!had_label) params.label = "Round Timer";
  const config = apply_started_offset(params.config, params.started);

  return <TimerEmbed strategy={roundTimerStrategy} config={config} params={params} />;
}

export default function RoundTimerEmbedPage() {
  return (
    <Suspense>
      <RoundTimerEmbedContent />
    </Suspense>
  );
}
