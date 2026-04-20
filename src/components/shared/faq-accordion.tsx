import React from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  /** @deprecated JSON-LD for FAQPage is no longer emitted (Google deprecated FAQ rich results Aug 2023) */
  skipJsonLd?: boolean;
}

/**
 * Renders FAQ items as expandable details/summary elements.
 * Content is admin-controlled (from the admin timer page editor) and not user-supplied,
 * so dangerouslySetInnerHTML is safe here - same pattern used in [slug]/page.tsx.
 *
 * Note: FAQPage JSON-LD was removed because Google deprecated FAQ rich results for most
 * sites in August 2023 and GSC flagged duplicate FAQPage structured data.
 */
export default function FaqAccordion({ items, title = "Frequently Asked Questions" }: FaqAccordionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-headline font-black text-2xl mb-4">{title}</h2>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <details
            key={idx}
            className="bg-card rounded-[0.75rem] shadow-[var(--shadow-soft)] overflow-hidden group"
          >
            <summary className="cursor-pointer px-5 py-4 font-headline font-semibold hover:bg-surface-container-low list-none flex items-center justify-between transition-colors duration-200">
              {item.question}
              <ChevronDown className="size-5 text-muted-foreground ml-2 transition-transform duration-200 group-open:rotate-180 shrink-0" />
            </summary>
            {/* Admin-controlled content only - not user-supplied. Safe for innerHTML. */}
            <div
              className="px-5 pb-4 pt-1 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
