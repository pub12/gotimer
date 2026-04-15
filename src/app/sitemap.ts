import type { MetadataRoute } from "next";
import { get_db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://gotimer.org";

  // Use a fixed date for static routes — new Date() changes on every render and
  // causes Google to treat lastmod as unreliable
  const staticDate = new Date("2026-04-15");

  const static_routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: staticDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/countdown-setup`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/countdown`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chess-clock-setup`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chess-clock`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/round-timer-setup`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/round-timer`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    // Blog
    { url: `${base}/blog`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.8 },
    // Category landing pages
    { url: `${base}/board-games`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/photography`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/fitness`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/wellness`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/productivity`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/kitchen`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 },
    // Board games sub-pages
    { url: `${base}/board-games/turn-timer`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    // Fitness sub-pages
    { url: `${base}/fitness/emom`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/fitness/tabata`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/fitness/stretching`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/fitness/rest-timer`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    // Wellness sub-pages
    { url: `${base}/wellness/breathing`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/wellness/sleep`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/wellness/fasting`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    // Productivity sub-pages
    { url: `${base}/productivity/study`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/productivity/classroom`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    // Kitchen sub-pages
    { url: `${base}/kitchen/cooking`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kitchen/eggs`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kitchen/bread-proofing`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kitchen/multi-timer`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    // Photography sub-pages
    { url: `${base}/photography/film-development`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/photography/long-exposure-calculator`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/photography/stand-development`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/photography/cyanotype`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/photography/enlarger-timer`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/photography/photo-walk`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    // Studio
    { url: `${base}/studio`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/public-challenges`, lastModified: staticDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/partners`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/privacy-policy`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.3 },
  ];

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

  return [...static_routes, ...challenge_routes, ...timer_page_routes, ...blog_routes];
}
