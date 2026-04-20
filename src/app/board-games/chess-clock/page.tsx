"use client";

import React, { Suspense } from "react";
import { TimerPage } from "@/components/timer/timer-page";
import { chessClockStrategy } from "@/lib/timer-strategies/chess-clock";

function Content() {
  return (
    <TimerPage
      strategy={chessClockStrategy}
      config={{ duration_per_player: 600, increment: 0 }}
      label="Board Game Chess Clock"
      description="Two-player time control for competitive board games."
    />
  );
}

export default function Page() {
  return <Suspense><Content /></Suspense>;
}
