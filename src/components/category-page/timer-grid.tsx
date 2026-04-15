import React from "react";
import { TimerCard } from "./timer-card";
import type { SiteCategory } from "@/lib/site-categories";

interface TimerGridProps {
  category: SiteCategory;
}

export function TimerGrid({ category }: TimerGridProps) {
  return (
    <section className="w-full py-12 md:py-16 px-4 bg-surface">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-headline font-black text-2xl md:text-3xl text-foreground mb-3">
          {category.grid_heading}
        </h2>
        <p className="text-muted-foreground mb-8">
          {category.timers.length} tools available
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {category.timers.map((timer) => (
            <TimerCard
              key={timer.slug}
              timer={timer}
              category_slug={category.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
