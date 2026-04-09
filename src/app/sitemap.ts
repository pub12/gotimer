import type { MetadataRoute } from "next";
import { get_db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://gotimer.org";

  const now = new Date();

  const static_routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/countdown-setup`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/countdown`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chess-clock-setup`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chess-clock`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/round-timer-setup`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/round-timer`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/public-challenges`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/partners`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
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
