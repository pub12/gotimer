import type { MetadataRoute } from "next";
import { get_db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://gotimer.org";

  const static_routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/countdown-setup`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/countdown`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chess-clock-setup`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chess-clock`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/round-timer-setup`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/round-timer`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/public-challenges`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/challenges`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/partners`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
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

  return [...static_routes, ...challenge_routes];
}
