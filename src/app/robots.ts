import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth", "/developers"],
      },
    ],
    sitemap: "https://gotimer.org/sitemap.xml",
  };
}
