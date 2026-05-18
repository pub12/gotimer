"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FaqAccordion from "@/components/shared/faq-accordion";

/**
 * Shared chrome + SEO scaffold for the /classroom toolkit pages.
 *
 * These are not timers, so they don't use TimerPage. ClassroomShell provides
 * the same site chrome (Navbar, Footer) and an SEO content section with
 * breadcrumbs, related-tool cards, and an FAQ accordion — matching the look
 * of TimerSeoContent so the toolkit feels native to the rest of the site.
 */

interface RelatedTool {
  name: string;
  href: string;
  description: string;
}

interface BreadcrumbCrumb {
  name: string;
  href?: string;
}

interface ClassroomShellProps {
  /** Visible H1 / page title (also used as the FAQ heading). */
  title: string;
  /** Subtitle / value-prop one-liner directly below the H1. */
  intro?: string;
  /** Breadcrumb crumbs after Home > Classroom Tools. The last has no href. */
  crumbs: BreadcrumbCrumb[];
  /** The interactive tool itself, rendered above the SEO body. */
  tool: React.ReactNode;
  /** Long-form unique copy (prose). */
  children: React.ReactNode;
  faq?: Array<{ question: string; answer: string }>;
  related?: RelatedTool[];
}

export function ClassroomShell({
  title,
  intro,
  crumbs,
  tool,
  children,
  faq = [],
  related = [],
}: ClassroomShellProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4">
        {/* Hero */}
        <section className="w-full max-w-3xl mx-auto pt-6 pb-2">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href="/classroom"
              className="hover:text-foreground transition-colors"
            >
              Classroom Tools
            </Link>
            {crumbs.map((c, i) => (
              <React.Fragment key={`${c.name}-${i}`}>
                <ChevronRight className="size-3" />
                {c.href ? (
                  <Link
                    href={c.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {c.name}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{c.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          <h1 className="font-headline font-black text-3xl md:text-4xl text-foreground tracking-tight">
            {title}
          </h1>
          {intro && (
            <p className="mt-3 text-base text-muted-foreground max-w-2xl">
              {intro}
            </p>
          )}
        </section>

        {/* Tool */}
        <section className="w-full py-6 md:py-10 px-2 md:px-4">{tool}</section>

        {/* SEO body */}
        <section className="w-full py-10 md:py-12 px-4 bg-surface">
          <div className="max-w-3xl mx-auto">
            <div className="seo-prose space-y-4 text-sm text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-headline [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3">
              {children}
            </div>

            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="font-headline font-bold text-lg text-foreground mb-4">
                  Related Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      className="group block p-4 bg-card rounded-xl shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors text-sm">
                        {r.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {r.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {faq.length > 0 && (
              <div className="mt-12">
                <FaqAccordion items={faq} title={`${title} FAQ`} />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
