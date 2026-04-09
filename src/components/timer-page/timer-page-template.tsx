import React from "react";
import TimerWidget from "./timer-widget";
import FaqAccordion from "./faq-accordion";
import RelatedTimers from "./related-timers";
import CompetitionCta from "./competition-cta";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { DraftBanner } from "@/components/admin/draft-banner";

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
 * Main layout for dynamically generated timer pages. All HTML content rendered via
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

  return (
    <>
      {is_draft && <DraftBanner />}
      <main
        className="min-h-screen flex flex-col bg-gray-100 pt-12 pb-4 px-3 w-full md:bg-gray-200 md:pt-20 md:px-4"
        style={is_draft ? { paddingTop: "80px" } : undefined}
      >
        <Navbar />

        {/* Above fold: Timer widget */}
        <div className="mt-4 mb-8">
          <TimerWidget
            timer_type={page.timer_type}
            config={{
              duration: (timer_config.duration as number) ?? undefined,
              work_seconds: (timer_config.work_seconds as number) ?? undefined,
              rest_seconds: (timer_config.rest_seconds as number) ?? undefined,
              rounds: (timer_config.rounds as number) ?? undefined,
            }}
          />
        </div>

        {/* Competition CTA */}
        <div className="w-full max-w-3xl mx-auto px-1">
          <CompetitionCta timer_type={page.timer_type} />
        </div>

        {/* SEO content section */}
        <div className="w-full max-w-3xl mx-auto px-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            {page.title}
          </h1>

          {page.intro_html && (
            <div
              className="prose prose-lg max-w-none mb-8"
              /* nosemgrep: admin-controlled content, same pattern as [slug]/page.tsx */
              dangerouslySetInnerHTML={{ __html: page.intro_html }}
            />
          )}

          {/* FAQ section */}
          <FaqAccordion items={faq_items} />

          {/* Related timers */}
          {related_pages && related_pages.length > 0 && (
            <RelatedTimers pages={related_pages} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
