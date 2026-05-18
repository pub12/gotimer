"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, Play, Pencil, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerPage } from "@/components/timer/timer-page";
import FaqAccordion from "@/components/shared/faq-accordion";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { Stoplight } from "@/components/timer/plugins/stoplight";
import { DebatePreviousButton } from "@/components/timer/plugins/debate-controls";
import { PUBLIC_FORUM } from "@/lib/debate-formats";

interface Phase {
  name: string;
  seconds: number;
}

const RELATED_TIMERS = [
  {
    name: "Debate Timer Hub",
    href: "/productivity/debate-timer",
    description: "Pre-built Public Forum, LD, Policy, WSDC, and BP formats",
  },
  {
    name: "Public Forum",
    href: "/productivity/debate-timer/public-forum",
    description: "11-phase NSDA Public Forum round, 35 minutes total",
  },
  {
    name: "Lincoln-Douglas",
    href: "/productivity/debate-timer/lincoln-douglas",
    description: "Value-debate format with two cross-examinations",
  },
  {
    name: "Toastmasters Timer",
    href: "/productivity/toastmasters-timer",
    description: "Green/yellow/red signal cycles for club speeches",
  },
];

const FAQ = [
  {
    question: "How do I share a custom format with my team?",
    answer:
      "Build the phase list, then copy the URL from the share box (or your browser&apos;s address bar). The phases are encoded directly into the URL — anyone opening the link sees the same configuration without signing up.",
  },
  {
    question: "Can I save my custom format permanently?",
    answer:
      "Bookmark the URL after building. The phase list is encoded into the link itself, so any browser that loads the URL gets the same setup. There&apos;s nothing stored server-side and nothing to lose.",
  },
  {
    question: "What durations should I use for my district&apos;s format?",
    answer:
      "Start from the standard format (PF, LD, Policy, WSDC, BP) closest to yours and adjust speech durations to your district&apos;s rules. Most state and invitational tournaments shave 30 seconds off NSDA times — Florida and Texas being the most common exceptions.",
  },
  {
    question: "Does the previous-phase button work in custom mode?",
    answer:
      "Yes. The Previous button rewinds one phase at a time, resetting the phase timer. If you advanced through the wrong speech by mistake, hit Previous, pause, then resume when ready.",
  },
];

function encode_phases(phases: Phase[]): string {
  return encodeURIComponent(JSON.stringify(phases));
}

function decode_phases(value: string): Phase[] | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter(
        (p): p is Phase =>
          typeof p === "object" &&
          p !== null &&
          typeof p.name === "string" &&
          typeof p.seconds === "number" &&
          p.seconds > 0,
      )
      .slice(0, 30);
  } catch {
    return null;
  }
}

function format_mmss(total_seconds: number): string {
  const m = Math.floor(total_seconds / 60);
  const s = total_seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parse_mmss(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed.includes(":")) {
    const [mm, ss] = trimmed.split(":");
    const m = parseInt(mm, 10);
    const s = parseInt(ss, 10);
    if (Number.isNaN(m) || Number.isNaN(s) || s >= 60 || s < 0 || m < 0)
      return null;
    return m * 60 + s;
  }
  const n = parseInt(trimmed, 10);
  return Number.isNaN(n) ? null : n;
}

function DEFAULT_PHASES(): Phase[] {
  return PUBLIC_FORUM.steps.map((s) => ({
    name: s.name,
    seconds: s.duration,
  }));
}

function Content() {
  const params = useSearchParams();
  const initial = useMemo(() => {
    const raw = params.get("phases");
    return (raw && decode_phases(raw)) || DEFAULT_PHASES();
  }, [params]);

  const [phases, set_phases] = useState<Phase[]>(initial);
  const [mode, set_mode] = useState<"edit" | "run">("edit");
  const [copied, set_copied] = useState(false);
  const [share_url, set_share_url] = useState("");

  useEffect(() => {
    const encoded = encode_phases(phases);
    const url = `${window.location.pathname}?phases=${encoded}`;
    window.history.replaceState(null, "", url);
    set_share_url(`${window.location.origin}${url}`);
  }, [phases]);

  const total = phases.reduce((sum, p) => sum + p.seconds, 0);
  const can_run =
    phases.length > 0 && phases.every((p) => p.name.trim() && p.seconds > 0);

  if (mode === "run" && can_run) {
    return (
      <TimerPage
        key={phases.map((p) => `${p.name}:${p.seconds}`).join("|")}
        strategy={multiStepStrategy}
        config={{
          steps: phases.map((p) => ({ name: p.name, duration: p.seconds })),
        }}
        label="Custom Debate Timer"
        description={`${phases.length} phases · ${format_mmss(total)} total`}
        show_skip
        control_extra={<DebatePreviousButton />}
        on_configure={() => set_mode("edit")}
        below={
          <Stoplight
            mode="debate"
            caption="Last 60s = yellow · last 30s = red"
            yellow_at={60}
            red_at={30}
          />
        }
      />
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-20 pb-24 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link href="/productivity" className="hover:text-foreground">
            Productivity
          </Link>
          {" / "}
          <Link
            href="/productivity/debate-timer"
            className="hover:text-foreground"
          >
            Debate Timer
          </Link>
          {" / Custom"}
        </nav>

        <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-2">
          Custom Debate Timer Builder
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Build a debate format with any phase sequence. The URL encodes your
          phases — copy the link to share a pre-configured round with your team
          or post it on your school club page.
        </p>

        <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Phase list
            </h2>
            <span className="text-xs text-muted-foreground">
              {phases.length} phases · {format_mmss(total)} total
            </span>
          </div>
          <div className="space-y-2">
            {phases.map((phase, idx) => (
              <PhaseRow
                key={`phase-${idx}`}
                phase={phase}
                onChange={(p) => {
                  const next = [...phases];
                  next[idx] = p;
                  set_phases(next);
                }}
                onRemove={() => {
                  set_phases(phases.filter((_, i) => i !== idx));
                }}
                disableRemove={phases.length <= 1}
              />
            ))}
          </div>
          <button
            onClick={() =>
              set_phases([
                ...phases,
                { name: `Phase ${phases.length + 1}`, seconds: 60 },
              ])
            }
            className="mt-3 flex items-center gap-2 text-sm text-secondary hover:underline"
          >
            <Plus className="w-4 h-4" /> Add phase
          </button>
        </div>

        <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-4 md:p-6 mb-6">
          <h2 className="font-headline font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
            Shareable URL
          </h2>
          <div className="flex gap-2 items-stretch">
            <input
              readOnly
              value={share_url}
              className="flex-1 bg-surface-container-low rounded-xl px-3 py-2 text-xs text-foreground border border-border focus:outline-none"
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Shareable URL"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(share_url).then(() => {
                  set_copied(true);
                  setTimeout(() => set_copied(false), 1500);
                });
              }}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/90"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Bookmark or paste into your team chat. Anyone opening the link sees
            this exact phase list.
          </p>
        </div>

        <button
          disabled={!can_run}
          onClick={() => set_mode("run")}
          className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-2xl py-4 text-base font-semibold hover:bg-secondary/90 disabled:opacity-40"
        >
          <Play className="w-5 h-5" /> Run timer
        </button>

        <div className="seo-prose space-y-4 text-sm text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-headline [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-foreground mt-12">
          <h2>How the share URL works</h2>
          <p>
            The phase list lives in the URL itself — the{" "}
            <code className="text-xs bg-surface-container-low px-1.5 py-0.5 rounded">
              ?phases=
            </code>{" "}
            parameter encodes a JSON list of <code>{`{name, seconds}`}</code>{" "}
            entries. There&apos;s no signup, no database, and nothing to lose.
            When a coach pastes the link on their school club page or sends it
            to the team chat, anyone who clicks sees the timer pre-loaded with
            the same speech sequence.
          </p>

          <h2>Why a custom builder for debate?</h2>
          <p>
            Most state and invitational tournaments deviate from{" "}
            <Link href="/productivity/debate-timer">NSDA standard times</Link>{" "}
            in small but specific ways. Florida cuts PF rebuttal by 30 seconds.
            Texas TFA gives novice debaters longer prep. World Schools in some
            invitationals runs 6-minute speeches instead of 8. Hard-coding every
            permutation into a preset is impossible — but exposing the phase
            list to the user gets every district&apos;s rules into a single
            tool.
          </p>

          <h2>Stoplight signals in custom mode</h2>
          <p>
            The bottom panel shows green, yellow, and red lights. With a custom
            format, the lights are driven by time remaining in the active
            phase: <strong>green</strong> for the first portion,{" "}
            <strong>yellow</strong> in the last 60 seconds, and{" "}
            <strong>red</strong> with a flash in the last 30 seconds. If your
            format has its own protest signal (NDCA uses 1-minute and 30-second
            cards) you can call those from the visual countdown — phase
            transitions also fire an audio cue.
          </p>

          <h2>Judge controls — Previous and Skip</h2>
          <p>
            Two manual controls appear once the timer is running. <strong>Skip</strong>{" "}
            advances to the next phase early (use when a debater yields back time
            or skips a speech entirely). <strong>Previous</strong> rewinds one
            phase (use when you advanced by mistake, or when a speech needs
            replaying because a debater asks for a re-do).
          </p>
        </div>

        <div className="mt-12">
          <h2 className="font-headline font-bold text-lg text-foreground mb-4">
            Related Timers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED_TIMERS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group block p-4 bg-card rounded-xl shadow-[var(--shadow-soft)] hover:shadow-md transition-all"
              >
                <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors text-sm">
                  {t.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <FaqAccordion items={FAQ} title="Custom Debate Timer FAQ" />
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}

function PhaseRow({
  phase,
  onChange,
  onRemove,
  disableRemove,
}: {
  phase: Phase;
  onChange: (p: Phase) => void;
  onRemove: () => void;
  disableRemove: boolean;
}) {
  const [duration_text, set_duration_text] = useState(
    format_mmss(phase.seconds),
  );

  useEffect(() => {
    set_duration_text(format_mmss(phase.seconds));
  }, [phase.seconds]);

  return (
    <div className="flex gap-2 items-center">
      <Pencil className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <input
        value={phase.name}
        onChange={(e) => onChange({ ...phase, name: e.target.value })}
        placeholder="Phase name"
        className="flex-1 bg-surface-container-low rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:border-secondary"
      />
      <input
        value={duration_text}
        onChange={(e) => set_duration_text(e.target.value)}
        onBlur={() => {
          const parsed = parse_mmss(duration_text);
          if (parsed !== null && parsed > 0) {
            onChange({ ...phase, seconds: parsed });
          } else {
            set_duration_text(format_mmss(phase.seconds));
          }
        }}
        placeholder="MM:SS"
        className="w-20 bg-surface-container-low rounded-lg px-2 py-2 text-sm text-center border border-border focus:outline-none focus:border-secondary"
        aria-label="Duration MM:SS"
      />
      <button
        onClick={onRemove}
        disabled={disableRemove}
        className="text-muted-foreground hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Remove phase"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
