import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { TimerEntry } from "@/lib/site-categories";

interface TimerCardProps {
  timer: TimerEntry;
  category_slug: string;
}

// Map timer slugs to their actual working routes
// Category-nested routes (e.g. /board-games/countdown) will be created later.
// For now, link to the existing working routes.
const TIMER_ROUTE_MAP: Record<string, string> = {
  // Board Games — existing routes
  "countdown": "/countdown",
  "chess-clock": "/chess-clock",
  "round-timer": "/round-timer",
  // CMS pages that have existing SEO URLs
  "pomodoro": "/pomodoro-timer",
  "hiit": "/hiit-timer",
  "meditation": "/meditation-timer",
  "adhd-focus": "/adhd-focus-timer",
  "presentation": "/presentation-timer",
  // DB-backed fitness pages at root routes
  "workout-timer": "/workout-timer",
  "boxing-timer": "/boxing-timer",
  "calisthenics-timer": "/calisthenics-timer",
};

export function TimerCard({ timer, category_slug }: TimerCardProps) {
  const href = TIMER_ROUTE_MAP[timer.slug] || `/${category_slug}/${timer.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-lg)] hover:scale-[1.02] transition-all duration-200 ease-out no-underline"
    >
      <div className="w-12 h-12 rounded-[0.75rem] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
        <span className="text-xl">⏱</span>
      </div>
      <h3 className="font-headline font-bold text-lg text-foreground group-hover:text-secondary transition-colors">
        {timer.name}
      </h3>
      <p className="text-sm text-muted-foreground flex-1">
        {timer.description}
      </p>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
        Launch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </Link>
  );
}
