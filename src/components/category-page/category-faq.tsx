import React from "react";
import FaqAccordion from "@/components/shared/faq-accordion";
import type { SiteCategory } from "@/lib/site-categories";

interface CategoryFaqProps {
  category: SiteCategory;
}

export function CategoryFaq({ category }: CategoryFaqProps) {
  if (!category.faq || category.faq.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 px-4 bg-surface">
      <div className="max-w-3xl mx-auto">
        <FaqAccordion
          items={category.faq}
          title={`${category.name} FAQ`}
        />
      </div>
    </section>
  );
}
