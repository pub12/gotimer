import React from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

/**
 * Renders FAQ items as expandable details/summary elements with FAQPage JSON-LD.
 * Content is admin-controlled (from the admin timer page editor) and not user-supplied,
 * so dangerouslySetInnerHTML is safe here - same pattern used in [slug]/page.tsx.
 */
export default function FaqAccordion({ items }: FaqAccordionProps) {
  if (items.length === 0) return null;

  const faq_jsonld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <details key={idx} className="bg-white rounded-lg border overflow-hidden group">
              <summary className="cursor-pointer px-4 py-3 font-medium hover:bg-gray-50 list-none flex items-center justify-between">
                {item.question}
                <span className="text-gray-400 text-lg leading-none ml-2 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              {/* nosemgrep: admin-controlled content, not user-supplied - safe for innerHTML */}
              <div
                className="px-4 pb-4 pt-2 text-gray-600"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq_jsonld) }}
      />
    </>
  );
}
