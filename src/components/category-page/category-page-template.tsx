import React from "react";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CategoryHero } from "./category-hero";
import { TimerGrid } from "./timer-grid";
import { CategoryFaq } from "./category-faq";
import type { SiteCategory } from "@/lib/site-categories";

interface CategoryPageTemplateProps {
  category: SiteCategory;
}

export function CategoryPageTemplate({ category }: CategoryPageTemplateProps) {
  return (
    <main className="min-h-screen flex flex-col bg-surface">
      <Header />
      <Navbar />

      {/* Breadcrumbs */}
      <div className="w-full bg-surface-container-low border-b border-surface-container-high">
        <div className="max-w-5xl mx-auto px-4 py-2">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span>/</span>
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <CategoryHero category={category} />

      {/* Timer Grid */}
      <TimerGrid category={category} />

      {/* FAQ */}
      <CategoryFaq category={category} />

      <Footer />
    </main>
  );
}
