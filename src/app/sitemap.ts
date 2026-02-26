import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gotimer.org";

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/countdown-setup`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/countdown`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chess-clock-setup`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/chess-clock`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/round-timer-setup`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/round-timer`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/challenges`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
