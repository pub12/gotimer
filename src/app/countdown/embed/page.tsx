"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { parse_embed_params, apply_started_offset } from "@/lib/embed/params";

function CountdownEmbedContent() {
  const search_params = useSearchParams();
  const had_label = search_params.has("label");
  const params = parse_embed_params(search_params, "countdown");
  if (!had_label) params.label = "Countdown Timer";
  // Default duration if not supplied
  if (params.config.duration === undefined) params.config.duration = 300;
  const config = apply_started_offset(params.config, params.started);

  return <TimerEmbed strategy={countdownStrategy} config={config} params={params} />;
}

export default function CountdownEmbedPage() {
  return (
    <Suspense>
      <CountdownEmbedContent />
    </Suspense>
  );
}
