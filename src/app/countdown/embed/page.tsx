"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";

function CountdownEmbedContent() {
  const params = useSearchParams();
  const duration = Number(params.get("duration")) || 300;
  const theme = params.get("theme") || "auto";
  const controls = (params.get("controls") || "full") as "full" | "minimal" | "none";
  const branding = (params.get("branding") || "full") as "full" | "minimal";

  return (
    <TimerEmbed
      strategy={countdownStrategy}
      config={{ duration }}
      label="Countdown Timer"
      theme={theme}
      controls={controls}
      branding={branding}
    />
  );
}

export default function CountdownEmbedPage() {
  return (
    <Suspense>
      <CountdownEmbedContent />
    </Suspense>
  );
}
