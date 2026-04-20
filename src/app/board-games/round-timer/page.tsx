"use client";

import React, { Suspense } from "react";
import { TimerPage } from "@/components/timer/timer-page";
import { roundTimerStrategy } from "@/lib/timer-strategies/round-timer";

function Content() {
  return (
    <TimerPage
      strategy={roundTimerStrategy}
      config={{ round_duration: 180, rest_duration: 60, rounds: 3 }}
      label="Board Game Round Timer"
      description="Track rounds and total game time for any board game."
    />
  );
}

export default function Page() {
  return <Suspense><Content /></Suspense>;
}
