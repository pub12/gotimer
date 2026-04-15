import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Timer, Clock } from "lucide-react";
import { SITE_CATEGORIES, type SiteCategory, type TimerEntry } from "@/lib/site-categories";

// Duration timers that stay at root level
const QUICK_TIMERS = [
  { label: "5 min", href: "/5-minute-timer" },
  { label: "10 min", href: "/10-minute-timer" },
  { label: "15 min", href: "/15-minute-timer" },
  { label: "20 min", href: "/20-minute-timer" },
  { label: "25 min", href: "/25-minute-timer" },
  { label: "30 min", href: "/30-minute-timer" },
  { label: "45 min", href: "/45-minute-timer" },
  { label: "60 min", href: "/60-minute-timer" },
];

// Map timer slugs to existing routes (only for timers with non-standard paths)
const TIMER_ROUTE_MAP: Record<string, string> = {
  "countdown": "/countdown",
  "chess-clock": "/chess-clock",
  "round-timer": "/round-timer",
  "pomodoro": "/pomodoro-timer",
  "hiit": "/hiit-timer",
  "meditation": "/meditation-timer",
  "adhd-focus": "/adhd-focus-timer",
  "presentation": "/presentation-timer",
};

function TimerCard({ timer, category_slug }: { timer: TimerEntry; category_slug: string }) {
  const href = TIMER_ROUTE_MAP[timer.slug] || `/${category_slug}/${timer.slug}`;
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 bg-surface-container-low rounded-[1rem] p-5 shadow-[var(--shadow-soft)] hover:scale-[1.02] transition-all duration-200 ease-out no-underline"
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-[0.75rem] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
        <Timer className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors">
          {timer.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">{timer.description}</p>
      </div>
    </Link>
  );
}

function CategoryGroup({ category }: { category: SiteCategory }) {
  // Show only featured timers (max 3)
  const featured = category.timers.filter((t) =>
    category.featured_timers.includes(t.slug),
  );

  return (
    <div className="mb-12 md:mb-16">
      {/* Group header — both name and "View all" are clickable */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href={`/${category.slug}`}
          className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
        >
          {(() => { const Icon = category.icon; return <Icon className="w-5 h-5 text-secondary" />; })()}
          <h3 className="font-headline font-black text-lg md:text-xl text-foreground">
            {category.name}
          </h3>
        </Link>
        <Link
          href={`/${category.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors no-underline"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Timer cards (3 per group) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {featured.map((timer) => (
          <TimerCard
            key={timer.slug}
            timer={timer}
            category_slug={category.slug}
          />
        ))}
      </div>
    </div>
  );
}

export default function CategoryGrid() {
  return (
    <section className="w-full py-12 md:py-16 px-4 bg-surface">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col items-center mb-12">
          <Image
            src="/mascots/drake-timer.png"
            alt="Drake the Explorer holding a stopwatch"
            width={120}
            height={120}
            className="w-24 h-24 md:w-28 md:h-28 object-contain mb-4"
          />
          <h2 className="font-headline font-black text-2xl md:text-4xl text-center text-foreground mb-3">
            A Timer for Everything
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Pick your activity. We handle the rest.
          </p>
        </div>

        {/* Quick Timers — pill row with background panel and clock icons */}
        <div className="mb-12 md:mb-16 bg-surface-container-low rounded-[1.25rem] p-6 md:p-8 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-headline font-black text-lg md:text-xl text-foreground">
              Quick Timers
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {QUICK_TIMERS.map((qt) => (
              <Link
                key={qt.href}
                href={qt.href}
                className="inline-flex items-center gap-2 px-5 py-3 bg-card rounded-xl text-base md:text-lg font-semibold text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors no-underline shadow-sm border border-surface-container-high"
              >
                <Timer className="w-4 h-4 opacity-50" />
                {qt.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Category groups */}
        {SITE_CATEGORIES.map((category) => (
          <CategoryGroup key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
