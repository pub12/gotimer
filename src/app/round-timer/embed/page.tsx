"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { roundTimerStrategy } from "@/lib/timer-strategies/round-timer";

function RoundTimerEmbedContent() {
  const params = useSearchParams();
  const controls = (params.get("controls") || "full") as "full" | "minimal" | "none";
  const branding = (params.get("branding") || "full") as "full" | "minimal";

  return (
    <TimerEmbed
      strategy={roundTimerStrategy}
      config={{}}
      label="Round Timer"
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
