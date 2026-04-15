import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FaqAccordion from "@/components/shared/faq-accordion";

interface RelatedTimer {
  name: string;
  href: string;
  description: string;
}

interface TimerSeoContentProps {
  timer_name: string;
  category_name: string;
  category_slug: string;
  children: React.ReactNode;
  faq: Array<{ question: string; answer: string }>;
  related_timers: RelatedTimer[];
}

export function TimerSeoContent({
  timer_name,
  category_name,
  category_slug,
  children,
  faq,
  related_timers,
}: TimerSeoContentProps) {
  return (
    <section className="w-full py-12 md:py-16 px-4 bg-surface">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link
            href={`/${category_slug}`}
            className="hover:text-foreground transition-colors"
          >
            {category_name}
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">{timer_name}</span>
        </nav>

        {/* Unique inline content */}
        <div className="seo-prose space-y-4 text-sm text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-headline [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3">
          {children}
        </div>

        {/* Related Timers */}
        {related_timers.length > 0 && (
          <div className="mt-12">
            <h2 className="font-headline font-bold text-lg text-foreground mb-4">
              Related Timers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related_timers.map((timer) => (
                <Link
                  key={timer.href}
                  href={timer.href}
                  className="group block p-4 bg-card rounded-xl shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200"
                >
                  <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors text-sm">
                    {timer.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {timer.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <div className="mt-12">
            <FaqAccordion items={faq} title={`${timer_name} FAQ`} />
          </div>
        )}
      </div>
    </section>
  );
}
