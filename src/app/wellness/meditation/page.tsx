"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 600;
  const [duration, set_duration] = useState(initial);

  useEffect(() => {
    const url = `${window.location.pathname}?duration=${duration}`;
    window.history.replaceState(null, "", url);
  }, [duration]);

  return (
    <TimerPage
      key={duration}
      strategy={countdownStrategy}
      config={{ duration }}
      label="Meditation Timer"
      description="Set your session length for guided mindfulness practice. A gentle alert sounds when time is up."
      below={<DurationInput value={duration} onChange={set_duration} />}
    />
  );
}

export default function Page() {
  return <Suspense><Content /></Suspense>;
}
