import React from "react";
import Link from "next/link";
import { Timer, Clock, Activity } from "lucide-react";

interface RelatedPage {
  title: string;
  slug: string;
  timer_type: string;
}

interface RelatedTimersProps {
  pages: RelatedPage[];
}

function TimerIcon({ type }: { type: string }) {
  switch (type) {
    case "interval":
      return <Activity className="w-5 h-5 text-secondary" />;
    case "stopwatch":
      return <Clock className="w-5 h-5 text-accent" />;
    default:
      return <Timer className="w-5 h-5 text-primary" />;
  }
}

export default function RelatedTimers({ pages }: RelatedTimersProps) {
  if (pages.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-headline font-black mb-4">Related Timers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/${page.slug}`}
            className="flex items-center gap-3 bg-card rounded-[1rem] p-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-lg)] transition-all no-underline group"
          >
            <div className="shrink-0 w-10 h-10 bg-surface-container-low rounded-[0.75rem] flex items-center justify-center group-hover:bg-surface-container-high transition-colors">
              <TimerIcon type={page.timer_type} />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {page.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
