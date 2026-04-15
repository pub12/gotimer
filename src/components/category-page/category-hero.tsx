import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SiteCategory } from "@/lib/site-categories";

interface CategoryHeroProps {
  category: SiteCategory;
}

export function CategoryHero({ category }: CategoryHeroProps) {
  return (
    <section className="w-full bg-primary text-primary-foreground">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-1 text-center md:text-left">
            {/* Category pill badge */}
            <span className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide mb-6">
              {(() => { const Icon = category.icon; return <Icon className="w-4 h-4" />; })()}
              {category.name} Timers
            </span>

            {/* Heading */}
            <h1 className="font-headline font-black text-3xl md:text-5xl lg:text-6xl mb-4">
              {category.heading}
            </h1>

            {/* Description */}
            <p className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mb-8">
              {category.description}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button variant="default" size="lg" asChild>
                <Link href={category.hero_cta_href} className="no-underline text-base font-semibold">
                  {category.hero_cta}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side — icon area */}
          <div className="hidden md:flex items-center justify-center w-48 h-48">
            {(() => { const Icon = category.icon; return <Icon className="w-24 h-24 text-primary-foreground/20" />; })()}
          </div>
        </div>
      </div>
    </section>
  );
}
