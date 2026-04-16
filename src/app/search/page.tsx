import type { Metadata } from "next";
import Link from "next/link";
import { get_db } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { Timer, BookOpen, Layers, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search",
  description: "Search GoTimer for timers, tools, and articles.",
  robots: { index: false },
};

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

function search_all(query: string): SearchResult[] {
  const lower_q = query.toLowerCase();
  const like_pattern = `%${query}%`;
  const results: SearchResult[] = [];

  // Static pages
  for (const page of STATIC_PAGES) {
    if (
      page.title.toLowerCase().includes(lower_q) ||
      page.description?.toLowerCase().includes(lower_q)
    ) {
      results.push(page);
    }
  }

  // Database
  try {
    const db = get_db();

    const timer_rows = db
      .prepare(
        `SELECT slug, title, meta_description FROM timer_pages
         WHERE status = 'published' AND (title LIKE ? OR meta_description LIKE ? OR slug LIKE ?)
         LIMIT 20`
      )
      .all(like_pattern, like_pattern, like_pattern) as { slug: string; title: string; meta_description: string }[];

    for (const row of timer_rows) {
      if (results.some((r) => r.url === `/${row.slug}`)) continue;
      results.push({
        title: row.title,
        url: `/${row.slug}`,
        type: "timer",
        description: row.meta_description || undefined,
      });
    }

    const blog_rows = db
      .prepare(
        `SELECT slug, title, meta_description FROM blog_posts
         WHERE status = 'published' AND (title LIKE ? OR content LIKE ? OR meta_description LIKE ?)
         LIMIT 20`
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
    // DB unavailable
  }

  return results;
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query.length >= 2 ? search_all(query) : [];

  const timers = results.filter((r) => r.type === "timer" || r.type === "page");
  const articles = results.filter((r) => r.type === "blog");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16">
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <Search className="size-6 text-secondary" />
            <h1 className="text-2xl md:text-3xl font-black text-foreground font-headline">
              {query
                ? `Results for "${query}"`
                : "Search"}
            </h1>
            {query && (
              <span className="text-muted-foreground text-lg font-medium">
                ({results.length})
              </span>
            )}
          </div>

          {!query && (
            <p className="text-muted-foreground text-lg">
              Use the search bar above to find timers, tools, and articles.
            </p>
          )}

          {query && results.length === 0 && (
            <div className="text-center py-20">
              <Image
                src="/mascots/drake-searching.png"
                alt="No results found"
                width={160}
                height={160}
                className="w-32 h-32 object-contain mx-auto mb-4"
              />
              <p className="text-muted-foreground text-lg">
                No results found for &ldquo;{query}&rdquo;. Try a different search term.
              </p>
            </div>
          )}

          {/* Timers section */}
          {timers.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <Timer className="size-5 text-secondary" />
                <h2 className="font-headline font-black text-lg text-foreground">
                  Timers & Tools
                </h2>
                <span className="text-sm text-muted-foreground">({timers.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {timers.map((r) => (
                  <Link
                    key={r.url}
                    href={r.url}
                    className="group flex items-start gap-4 bg-surface-container-low rounded-[1rem] p-5 shadow-[var(--shadow-soft)] hover:scale-[1.02] transition-all duration-200 ease-out no-underline"
                  >
                    <div className="flex-shrink-0 w-11 h-11 rounded-[0.75rem] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                      {r.type === "page" ? <Layers className="w-5 h-5" /> : <Timer className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors">
                        {r.title}
                      </h3>
                      {r.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">{r.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Articles section */}
          {articles.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="size-5 text-secondary" />
                <h2 className="font-headline font-black text-lg text-foreground">
                  Articles
                </h2>
                <span className="text-sm text-muted-foreground">({articles.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles.map((r) => (
                  <Link
                    key={r.url}
                    href={r.url}
                    className="group flex items-start gap-4 bg-surface-container-low rounded-[1rem] p-5 shadow-[var(--shadow-soft)] hover:scale-[1.02] transition-all duration-200 ease-out no-underline"
                  >
                    <div className="flex-shrink-0 w-11 h-11 rounded-[0.75rem] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors">
                        {r.title}
                      </h3>
                      {r.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
