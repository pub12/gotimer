import React, { Suspense } from "react";
import Link from "next/link";
import TimerWidget from "./timer-widget";
import FaqAccordion from "./faq-accordion";
import RelatedTimers from "./related-timers";
import CompetitionCta from "./competition-cta";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { DraftBanner } from "@/components/admin/draft-banner";
import { ChevronRight } from "lucide-react";

interface TimerPageTemplateProps {
  page: {
    title: string;
    slug: string;
    intro_html: string;
    faq_json: string;
    timer_type: string;
    timer_config_json: string;
    meta_title: string;
    meta_description: string;
  };
  related_pages?: { title: string; slug: string; timer_type: string }[];
  is_draft?: boolean;
}

/**
 * Main layout for dynamically generated timer pages. Two-column layout on desktop:
 * 60% timer + content (left), 40% sidebar (right). All HTML content rendered via
 * dangerouslySetInnerHTML is admin-controlled (entered via the admin editor), not
 * user-supplied, following the same security pattern as the existing [slug]/page.tsx.
 */
export default function TimerPageTemplate({
  page,
  related_pages,
  is_draft,
}: TimerPageTemplateProps) {
  // Parse FAQ
  let faq_items: { question: string; answer: string }[] = [];
  try {
    const parsed = JSON.parse(page.faq_json);
    if (Array.isArray(parsed)) {
      faq_items = parsed.filter(
        (item): item is { question: string; answer: string } =>
          typeof item === "object" &&
          item !== null &&
          typeof item.question === "string" &&
          typeof item.answer === "string"
      );
    }
  } catch {
    // malformed JSON
  }

  // Parse timer config
  let timer_config: Record<string, unknown> = {};
  try {
    timer_config = JSON.parse(page.timer_config_json);
  } catch {
    // malformed JSON
  }

  // Derive timer category label from type
  const timer_category =
    page.timer_type === "interval"
      ? "Workout Timers"
      : page.timer_type === "stopwatch"
        ? "Tracking Timers"
        : "Focus Timers";

  return (
    <>
      {is_draft && <DraftBanner />}
      <main
        className="min-h-screen flex flex-col bg-surface pt-12 pb-4 px-3 w-full md:pt-20 md:px-4"
        style={is_draft ? { paddingTop: "80px" } : undefined}
      >
        <Navbar />

        <div className="max-w-7xl mx-auto px-2 md:px-6 py-4 md:py-8 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors no-underline">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-muted-foreground">{timer_category}</span>
            <ChevronRight className="size-3.5" />
            <span className="text-primary font-bold">{page.title}</span>
          </nav>

          {/* Page title with mascot badge */}
          <div className="flex items-end gap-4 mb-8">
            <div className="bg-surface-container-highest rounded-xl p-3 shadow-sm shrink-0">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-3xl">
                {page.timer_type === "interval" ? "🏋️" : page.timer_type === "stopwatch" ? "⏱️" : "🦉"}
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tight text-primary">
                {page.title}
              </h1>
              <p className="text-muted-foreground font-medium text-sm mt-1">
                Session with{" "}
                <span className="text-secondary font-bold">
                  {page.timer_type === "interval" ? "Coach" : page.timer_type === "stopwatch" ? "Tracker" : "Focus the Scholar"}
                </span>
              </p>
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Column 1: Main Timer (60%) */}
            <div className="lg:col-span-6 space-y-8">
              {/* Timer widget */}
              <Suspense fallback={<div className="h-64 flex items-center justify-center text-muted-foreground">Loading timer...</div>}>
                <TimerWidget
                  timer_type={page.timer_type}
                  config={{
                    duration: (timer_config.duration as number) ?? undefined,
                    work_seconds: (timer_config.work_seconds as number) ?? undefined,
                    rest_seconds: (timer_config.rest_seconds as number) ?? undefined,
                    rounds: (timer_config.rounds as number) ?? undefined,
                  }}
                />
              </Suspense>

              {/* SEO content section — admin-controlled, not user-supplied */}
              {page.intro_html && (
                <div
                  className="timer-page-content max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.intro_html }}
                />
              )}

              {/* FAQ section */}
              {faq_items.length > 0 && <FaqAccordion items={faq_items} />}

              {/* Related timers */}
              {related_pages && related_pages.length > 0 && (
                <RelatedTimers pages={related_pages} />
              )}
            </div>

            {/* Column 2: Sidebar (40%) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Challenge a Friend */}
              <CompetitionCta timer_type={page.timer_type} />

              {/* Productivity Stats */}
              <div className="bg-surface-container-low rounded-xl p-6">
                <h3 className="font-headline font-bold text-foreground mb-4">Your Productivity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest rounded-xl p-4 text-center">
                    <p className="text-2xl font-headline font-black text-primary">0</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">PB Streak</p>
                  </div>
                  <div className="bg-surface-container-lowest rounded-xl p-4 text-center">
                    <p className="text-2xl font-headline font-black text-primary">0h</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Focused</p>
                  </div>
                </div>
              </div>

              {/* Mascot tip */}
              <div className="bg-accent/10 rounded-xl p-5 flex gap-3">
                <span className="text-2xl shrink-0">💡</span>
                <div>
                  <p className="font-headline font-bold text-sm text-foreground mb-1">Pro Tip</p>
                  <p className="text-sm text-muted-foreground">
                    Start with shorter sessions and build up. Consistency beats intensity for building focus habits.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
