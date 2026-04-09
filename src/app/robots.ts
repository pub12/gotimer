import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api", "/hazo_auth"],
      },
    ],
    sitemap: "https://gotimer.org/sitemap.xml",
  };
}
