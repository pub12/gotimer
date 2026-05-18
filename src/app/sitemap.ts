import type { MetadataRoute } from "next";
import { get_db } from "@/lib/db";
import { STRATEGIES, PRESETS, CATEGORIES } from "@/lib/timer-registry";

// Force dynamic rendering so new blog posts and timer pages appear in the
// sitemap immediately after publishing — without requiring a full redeploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://gotimer.org";

  // Use a fixed date for static routes — new Date() changes on every render and
  // causes Google to treat lastmod as unreliable
  const staticDate = new Date("2026-04-15");

  // Non-timer static routes
  const static_routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: staticDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/blog`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/studio`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/public-challenges`, lastModified: staticDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/partners`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/privacy-policy`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/docs/embed`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/stopwatch/embed`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 },

    // Classroom Toolkit (niche-8) — non-timer tools, manually listed.
    { url: `${base}/classroom`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/classroom/name-picker`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/classroom/name-picker/wheel`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/classroom/name-picker/no-signup`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/classroom/group-generator`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/classroom/group-generator/teams-of-3`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/classroom/group-generator/teams-of-4`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/classroom/noise-meter`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/classroom/tally-counter`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Strategy routes (timer pages + setup pages), deduplicated
  const seen_urls = new Set<string>();
  const strategy_routes: MetadataRoute.Sitemap = [];

  for (const s of Object.values(STRATEGIES)) {
    const url = `${base}${s.route}`;
    if (!seen_urls.has(url)) {
      seen_urls.add(url);
      strategy_routes.push({
        url,
        lastModified: staticDate,
        changeFrequency: "monthly",
        priority: s.sitemapPriority,
      });
    }
    if (s.setupRoute) {
      const setup_url = `${base}${s.setupRoute}`;
      if (!seen_urls.has(setup_url)) {
        seen_urls.add(setup_url);
        strategy_routes.push({
          url: setup_url,
          lastModified: staticDate,
          changeFrequency: "monthly",
          priority: s.sitemapPriority,
        });
      }
    }
  }

  // Category landing pages
  const category_routes: MetadataRoute.Sitemap = Object.values(CATEGORIES).map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Preset sub-pages (skip presets whose route is a top-level strategy route)
  const strategy_route_set = new Set(Object.values(STRATEGIES).map((s) => s.route));
  const preset_routes: MetadataRoute.Sitemap = Object.values(PRESETS)
    .filter((p) => !strategy_route_set.has(p.route))
    .map((p) => ({
      url: `${base}${p.route}`,
      lastModified: staticDate,
      changeFrequency: "monthly" as const,
      priority: p.sitemapPriority,
    }));

  // Add public challenge URLs from database
  let challenge_routes: MetadataRoute.Sitemap = [];
  try {
    const db = get_db();
    const challenges = db
      .prepare(`SELECT id, updated_at FROM game_challenges WHERE is_public = 1`)
      .all() as { id: string; updated_at: string }[];

    challenge_routes = challenges.map((c) => ({
      url: `${base}/public-challenges/${c.id}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // If DB is unavailable, just return static routes
  }

  // Add published timer page URLs from database
  let timer_page_routes: MetadataRoute.Sitemap = [];
  try {
    const db = get_db();
    const timer_pages = db
      .prepare(`SELECT slug, updated_at FROM timer_pages WHERE status = 'published'`)
      .all() as { slug: string; updated_at: string }[];

    timer_page_routes = timer_pages.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable
  }

  // Add published blog post URLs from database
  let blog_routes: MetadataRoute.Sitemap = [];
  try {
    const db = get_db();
    const blog_posts = db
      .prepare(`SELECT slug, updated_at FROM blog_posts WHERE status = 'published'`)
      .all() as { slug: string; updated_at: string }[];

    blog_routes = blog_posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If DB is unavailable, skip blog routes
  }

  return [
    ...static_routes,
    ...strategy_routes,
    ...category_routes,
    ...preset_routes,
    ...challenge_routes,
    ...timer_page_routes,
    ...blog_routes,
  ];
}
