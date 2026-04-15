import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";

interface SearchResult {
  title: string;
  url: string;
  type: "timer" | "blog" | "page";
  description?: string;
}

// Static pages that aren't in the database
const STATIC_PAGES: SearchResult[] = [
  { title: "Countdown Timer", url: "/countdown-setup", type: "timer", description: "Free countdown timer with audio alerts and custom duration" },
  { title: "Chess Clock", url: "/chess-clock-setup", type: "timer", description: "Two-player chess clock timer" },
  { title: "Round Timer", url: "/round-timer-setup", type: "timer", description: "Track rounds and total elapsed time" },
  { title: "Board Games", url: "/board-games", type: "page", description: "Timers for board games and tabletop gaming" },
  { title: "Board Game Turn Timer", url: "/board-games/turn-timer", type: "timer", description: "Multi-player countdown turn timer" },
  { title: "Fitness Timers", url: "/fitness", type: "page", description: "HIIT, Tabata, EMOM, and workout timers" },
  { title: "EMOM Timer", url: "/fitness/emom", type: "timer", description: "Every Minute On the Minute workout timer" },
  { title: "Tabata Timer", url: "/fitness/tabata", type: "timer", description: "20/10 interval training protocol" },
  { title: "Stretching Timer", url: "/fitness/stretching", type: "timer", description: "Hold timer for flexibility training" },
  { title: "Rest Timer", url: "/fitness/rest-timer", type: "timer", description: "Countdown between sets for strength training" },
  { title: "Wellness Timers", url: "/wellness", type: "page", description: "Breathing, fasting, and sleep timers" },
  { title: "Breathing Exercise Timer", url: "/wellness/breathing", type: "timer", description: "Box breathing and 4-7-8 technique" },
  { title: "Sleep Timer", url: "/wellness/sleep", type: "timer", description: "Wind-down countdown for better rest" },
  { title: "Intermittent Fasting Timer", url: "/wellness/fasting", type: "timer", description: "16:8, 18:6, 20:4, OMAD tracker" },
  { title: "Productivity Timers", url: "/productivity", type: "page", description: "Study and classroom timers" },
  { title: "Study Timer", url: "/productivity/study", type: "timer", description: "Pomodoro and focus session countdown" },
  { title: "Classroom Timer", url: "/productivity/classroom", type: "timer", description: "Full-screen display for teachers" },
  { title: "Kitchen Timers", url: "/kitchen", type: "page", description: "Cooking, egg, and bread proofing timers" },
  { title: "Cooking Timer", url: "/kitchen/cooking", type: "timer", description: "Kitchen countdown with presets" },
  { title: "Egg Timer", url: "/kitchen/eggs", type: "timer", description: "Soft, medium, and hard boiled presets" },
  { title: "Bread Proofing Timer", url: "/kitchen/bread-proofing", type: "timer", description: "Dough rise countdown" },
  { title: "Multi-Timer", url: "/kitchen/multi-timer", type: "timer", description: "Run multiple kitchen timers at once" },
  { title: "Photography Timers", url: "/photography", type: "page", description: "Film development, darkroom, and exposure timers" },
  { title: "Film Development Timer", url: "/photography/film-development", type: "timer", description: "B&W, C-41, and E-6 process timing" },
  { title: "Long Exposure Calculator", url: "/photography/long-exposure-calculator", type: "timer", description: "Reciprocity failure compensation" },
  { title: "Stand Development Timer", url: "/photography/stand-development", type: "timer", description: "Rodinal and highly dilute developer timing" },
  { title: "Enlarger Timer", url: "/photography/enlarger-timer", type: "timer", description: "F-stop printing and test strips" },
  { title: "Cyanotype Timer", url: "/photography/cyanotype", type: "timer", description: "UV exposure timer for alternative process printing" },
  { title: "Photo Walk Timer", url: "/photography/photo-walk", type: "timer", description: "Timed photography challenges" },
];

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const lower_q = q.toLowerCase();
  const like_pattern = `%${q}%`;

  const results: SearchResult[] = [];

  // Search static pages
  for (const page of STATIC_PAGES) {
    if (
      page.title.toLowerCase().includes(lower_q) ||
      (page.description?.toLowerCase().includes(lower_q))
    ) {
      results.push(page);
    }
  }

  // Search database
  try {
    const db = get_db();

    // Timer pages from DB
    const timer_rows = db
      .prepare(
        `SELECT slug, title, meta_description FROM timer_pages
         WHERE status = 'published' AND (title LIKE ? OR meta_description LIKE ? OR slug LIKE ?)
         LIMIT 10`
      )
      .all(like_pattern, like_pattern, like_pattern) as { slug: string; title: string; meta_description: string }[];

    for (const row of timer_rows) {
      // Skip if already covered by a static page with the same slug
      if (results.some((r) => r.url === `/${row.slug}`)) continue;
      results.push({
        title: row.title,
        url: `/${row.slug}`,
        type: "timer",
        description: row.meta_description || undefined,
      });
    }

    // Blog posts
    const blog_rows = db
      .prepare(
        `SELECT slug, title, meta_description FROM blog_posts
         WHERE status = 'published' AND (title LIKE ? OR content LIKE ? OR meta_description LIKE ?)
         LIMIT 10`
      )
      .all(like_pattern, like_pattern, like_pattern) as { slug: string; title: string; meta_description: string }[];

    for (const row of blog_rows) {
      results.push({
        title: row.title,
        url: `/blog/${row.slug}`,
        type: "blog",
        description: row.meta_description || undefined,
      });
    }
  } catch {
    // DB unavailable — return static results only
  }

  return NextResponse.json({ results: results.slice(0, 15) });
}
