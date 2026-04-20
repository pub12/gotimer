"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerProvider } from "./timer-provider";
import { TimerShellV2 } from "./timer-shell-v2";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { useTimer } from "./timer-provider";
import type { TimerStrategy } from "@/lib/timer-strategies/types";
import type { TimerDisplayVariant } from "./timer-display";

interface TimerPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strategy: TimerStrategy<any>;
  config: unknown;
  label: string;
  description?: string;
  display_variant?: TimerDisplayVariant;
  show_skip?: boolean;
  below?: React.ReactNode;
  display_children?: React.ReactNode;
  control_extra?: React.ReactNode;
  dark?: boolean;
  /** Callback to return to setup/configuration screen */
  on_configure?: () => void;
  /** SEO content rendered below timer controls */
  seo_content?: React.ReactNode;
  /** Initial title to pre-populate the editable title field */
  initial_title?: string;
}

function TimerPageInner({
  label,
  description,
  display_variant = "ring",
  show_skip,
  below,
  display_children,
  control_extra,
  dark,
  on_configure,
  seo_content,
  initial_title,
}: Omit<TimerPageProps, "strategy" | "config">) {
  const { machine } = useTimer();
  const { display, status } = machine;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">{label}</h1>
        <div className="mt-4 mb-8">
          <TimerShellV2
            label={label}
            timer_type={label.toLowerCase().replace(/\s+/g, "-")}
            dark={dark}
            remaining={display.primary_time}
            running={status === "running"}
            on_configure={on_configure}
            initial_title={initial_title}
            controls={
              <TimerControls
                show_skip={show_skip}
                extra_actions={control_extra}
              />
            }
            below={below}
          >
            <TimerDisplay
              time={display.primary_time}
              progress={display.progress}
              variant={display_variant}
              color={display.ring_color}
              phase_label={display.phase_label}
              sub_label={
                display.step_info
                  ? `Step ${display.step_info.current + 1} of ${display.step_info.total}`
                  : display.extra?.current_round
                    ? `Round ${display.extra.current_round}/${display.extra.rounds}`
                    : undefined
              }
            >
              {display_children}
            </TimerDisplay>
          </TimerShellV2>
        </div>

        {description && (
          <section className="w-full max-w-md mx-auto px-1 text-center">
            <p className="text-xs text-muted-foreground mb-2">{description}</p>
          </section>
        )}

        {seo_content}
      </main>
      <Footer />
    </>
  );
}

export function TimerPage({ strategy, config, ...rest }: TimerPageProps) {
  return (
    <Suspense>
      <TimerProvider strategy={strategy} config={config}>
        <TimerPageInner {...rest} />
      </TimerProvider>
    </Suspense>
  );
}
