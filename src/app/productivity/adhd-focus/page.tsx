"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { intervalStrategy } from "@/lib/timer-strategies/interval";

function Content() {
  const params = useSearchParams();
  const work = Number(params.get("work")) || 900;
  const rest = Number(params.get("rest")) || 300;
  const rounds = Number(params.get("rounds")) || 4;
  const [config, set_config] = useState({ work, rest, rounds });

  useEffect(() => {
    const p = new URLSearchParams();
    p.set("work", String(config.work));
    p.set("rest", String(config.rest));
    p.set("rounds", String(config.rounds));
    window.history.replaceState(null, "", `${window.location.pathname}?${p.toString()}`);
  }, [config.work, config.rest, config.rounds]);

  return (
    <TimerPage
      key={`${config.work}-${config.rest}-${config.rounds}`}
      strategy={intervalStrategy}
      config={config}
      label="ADHD Focus Timer"
      description="Shorter work intervals with frequent breaks designed for better focus. Low-distraction interface with audio cues."
      show_skip
      below={
        <div className="w-full max-w-xs mx-auto space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Work</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                step={5}
                value={config.work}
                onChange={(e) => set_config((c) => ({ ...c, work: Number(e.target.value) }))}
                className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
              />
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rest</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={5}
                value={config.rest}
                onChange={(e) => set_config((c) => ({ ...c, rest: Number(e.target.value) }))}
                className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
              />
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rounds</label>
            <input
              type="number"
              min={1}
              max={20}
              value={config.rounds}
              onChange={(e) => set_config((c) => ({ ...c, rounds: Number(e.target.value) }))}
              className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
            />
          </div>
        </div>
      }
    />
  );
}

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
