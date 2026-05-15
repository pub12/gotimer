import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/category-page/category-page-template";
import { get_category } from "@/lib/site-categories";
import { get_db } from "@/lib/db";
import type { TimerEntry } from "@/lib/site-categories";

const category_base = get_category("fitness")!;

export const metadata: Metadata = {
  title: `${category_base.heading} | GoTimer`,
  description: category_base.description,
  alternates: { canonical: `https://gotimer.org/${category_base.slug}` },
  openGraph: {
    title: `${category_base.heading} | GoTimer`,
    description: category_base.description,
    url: `https://gotimer.org/${category_base.slug}`,
  },
};

export default async function Page() {
  let db_timers: TimerEntry[] = [];
  try {
    const db = get_db();
    const rows = db
      .prepare(
        `SELECT slug, title, meta_description FROM timer_pages WHERE status = 'published' AND category_slug = 'fitness' ORDER BY published_at ASC`
      )
      .all() as { slug: string; title: string; meta_description: string }[];
    db_timers = rows.map((r) => ({
      slug: r.slug,
      name: r.title.replace(/^Free\s+/i, "").replace(/\s+\|.*$/, ""),
      description: r.meta_description,
    }));
  } catch {
    // DB unavailable — render with preset timers only
  }

  const preset_slugs = new Set(category_base.timers.map((t) => t.slug));
  const extra = db_timers.filter((t) => !preset_slugs.has(t.slug));
  const category = {
    ...category_base,
    timers: [...category_base.timers, ...extra],
  };

  return <CategoryPageTemplate category={category} />;
}
