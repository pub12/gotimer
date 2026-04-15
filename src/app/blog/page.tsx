import type { Metadata } from "next";
import Link from "next/link";
import { get_db } from "@/lib/db";
import { PostCard } from "@/components/blog/post-card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { ChevronRight, Clock, Tag } from "lucide-react";
import { BlogSearch } from "@/components/blog/blog-search";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and strategies for using timers in board games, escape rooms, trivia nights, and more.",
};

const POSTS_PER_PAGE = 10;

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  publish_date: string | null;
  category_id: string | null;
  category_name: string | null;
  category_slug: string | null;
  category_colour: string | null;
  character_image: string | null;
  character_name: string | null;
}

interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  colour: string | null;
}

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category, page: page_param, q: search_query } = await searchParams;
  const current_page = Math.max(1, parseInt(page_param ?? "1", 10));
  const offset = (current_page - 1) * POSTS_PER_PAGE;

  const db = get_db();

  const categories = db
    .prepare(`SELECT id, slug, name, colour FROM blog_categories ORDER BY name ASC`)
    .all() as BlogCategory[];

  let posts: BlogPost[];
  let total_count: number;
  const trimmed_query = search_query?.trim() || "";

  if (trimmed_query) {
    const like_pattern = `%${trimmed_query}%`;
    posts = db
      .prepare(
        `SELECT bp.id, bp.slug, bp.title, bp.content, bp.publish_date,
                bp.category_id, bc.name as category_name, bc.slug as category_slug, bc.colour as category_colour,
                ci.file_path as character_image, ci.character_name as character_name
         FROM blog_posts bp
         LEFT JOIN blog_categories bc ON bp.category_id = bc.id
         LEFT JOIN character_images ci ON bp.character_id = ci.id
         WHERE bp.status = 'published' AND (bp.title LIKE ? OR bp.content LIKE ?)
         ORDER BY bp.publish_date DESC
         LIMIT ? OFFSET ?`
      )
      .all(like_pattern, like_pattern, POSTS_PER_PAGE, offset) as BlogPost[];

    const count_row = db
      .prepare(
        `SELECT COUNT(*) as count FROM blog_posts
         WHERE status = 'published' AND (title LIKE ? OR content LIKE ?)`
      )
      .get(like_pattern, like_pattern) as { count: number };
    total_count = count_row.count;
  } else if (category) {
    posts = db
      .prepare(
        `SELECT bp.id, bp.slug, bp.title, bp.content, bp.publish_date,
                bp.category_id, bc.name as category_name, bc.slug as category_slug, bc.colour as category_colour,
                ci.file_path as character_image, ci.character_name as character_name
         FROM blog_posts bp
         LEFT JOIN blog_categories bc ON bp.category_id = bc.id
         LEFT JOIN character_images ci ON bp.character_id = ci.id
         WHERE bp.status = 'published' AND bc.slug = ?
         ORDER BY bp.publish_date DESC
         LIMIT ? OFFSET ?`
      )
      .all(category, POSTS_PER_PAGE, offset) as BlogPost[];

    const count_row = db
      .prepare(
        `SELECT COUNT(*) as count FROM blog_posts bp
         LEFT JOIN blog_categories bc ON bp.category_id = bc.id
         WHERE bp.status = 'published' AND bc.slug = ?`
      )
      .get(category) as { count: number };
    total_count = count_row.count;
  } else {
    posts = db
      .prepare(
        `SELECT bp.id, bp.slug, bp.title, bp.content, bp.publish_date,
                bp.category_id, bc.name as category_name, bc.slug as category_slug, bc.colour as category_colour,
                ci.file_path as character_image, ci.character_name as character_name
         FROM blog_posts bp
         LEFT JOIN blog_categories bc ON bp.category_id = bc.id
         LEFT JOIN character_images ci ON bp.character_id = ci.id
         WHERE bp.status = 'published'
         ORDER BY bp.publish_date DESC
         LIMIT ? OFFSET ?`
      )
      .all(POSTS_PER_PAGE, offset) as BlogPost[];

    const count_row = db
      .prepare(`SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'`)
      .get() as { count: number };
    total_count = count_row.count;
  }

  const total_pages = Math.ceil(total_count / POSTS_PER_PAGE);
  const featured_post = !category && !trimmed_query && current_page === 1 && posts.length > 0 ? posts[0] : null;
  const grid_posts = featured_post ? posts.slice(1) : posts;

  const featured_read_time = featured_post ? Math.max(3, Math.ceil((featured_post.content?.length ?? 0) / 1000)) : 0;
  const featured_excerpt = featured_post?.content
    ?.replace(/\{\/\*.*?\*\/\}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#*_\[\]()>`]/g, "")
    .trim()
    .slice(0, 220) ?? "";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-20">
        {/* Header with decorative background */}
        <div className="relative overflow-hidden bg-primary">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -right-32 -top-32 w-[500px] h-[500px] bg-secondary/8 rotate-12 rounded-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent/6 -rotate-6 rounded-3xl" />

          <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20 flex items-center justify-between">
            <div>
              <p className="text-secondary font-headline font-bold text-sm uppercase tracking-[0.2em] mb-3">
                GoTimer Blog
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-primary-foreground font-headline leading-[1.05]">
                The Time<br />Dimension
              </h1>
              <p className="text-primary-foreground/50 text-lg mt-4 max-w-lg">
                Guides, strategies, and insights on productivity, timing, and getting more done.
              </p>
              <div className="mt-6">
                <Suspense>
                  <BlogSearch />
                </Suspense>
              </div>
            </div>
            <Image
              src="/mascots/drake-timer.png"
              alt="Drake the Explorer with a stopwatch"
              width={180}
              height={180}
              className="hidden md:block w-36 lg:w-44 h-36 lg:h-44 object-contain drop-shadow-lg shrink-0"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
          {/* Featured Post */}
          {featured_post && (
            <section className="mb-16">
              <Link
                href={`/blog/${featured_post.slug}`}
                className="group block no-underline"
              >
                <div className="relative overflow-hidden rounded-2xl bg-surface-container-low border border-surface-container-high">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image area */}
                    <div className="lg:w-3/5 h-64 lg:h-[420px] bg-gradient-to-br from-primary via-primary to-[#0d2654] relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                          backgroundSize: "24px 24px",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <Image
                          src={featured_post.character_image || "/mascots/prof-studying.png"}
                          alt={featured_post.character_name || "Blog post character"}
                          width={600}
                          height={400}
                          className="max-w-full max-h-full object-contain drop-shadow-lg rounded-lg"
                        />
                      </div>
                      {/* Featured label */}
                      <div className="absolute top-6 left-6">
                        <span className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-xs font-bold font-headline uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-5">
                        {featured_post.category_name && (
                          <span className="text-xs font-bold font-headline uppercase tracking-wider text-secondary">
                            {featured_post.category_name}
                          </span>
                        )}
                        <span className="text-muted-foreground text-xs">
                          {featured_read_time} min read
                        </span>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-black text-foreground leading-tight font-headline mb-4 group-hover:text-secondary transition-colors duration-300">
                        {featured_post.title}
                      </h2>

                      <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-8">
                        {featured_excerpt}
                      </p>

                      <div className="mt-auto">
                        <span className="inline-flex items-center gap-2 text-secondary font-bold text-sm group-hover:gap-3 transition-all duration-300">
                          Read the full guide
                          <ChevronRight className="size-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Category filters + content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main column */}
            <section className="lg:col-span-8">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                <h3 className="text-xl font-black text-foreground font-headline">
                  {trimmed_query
                    ? `Results for "${trimmed_query}" (${total_count})`
                    : category
                      ? `Filtered: ${category}`
                      : "Latest Articles"}
                </h3>
              </div>

              {grid_posts.length === 0 && !featured_post ? (
                <div className="text-center py-24">
                  <Image
                    src="/mascots/drake-searching.png"
                    alt="Drake searching for articles"
                    width={160}
                    height={160}
                    className="w-32 h-32 object-contain mx-auto mb-4"
                  />
                  <p className="text-muted-foreground text-lg">
                    {trimmed_query
                      ? `No articles found for "${trimmed_query}". Try a different search.`
                      : "No articles yet. Check back soon."}
                  </p>
                </div>
              ) : grid_posts.length === 0 ? null : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {grid_posts.map((post) => (
                    <PostCard
                      key={post.id}
                      title={post.title}
                      slug={post.slug}
                      excerpt={post.content?.slice(0, 200) ?? ""}
                      date={post.publish_date}
                      category_name={post.category_name}
                      category_colour={post.category_colour}
                      character_image={post.character_image}
                      character_name={post.character_name}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {total_pages > 1 && (
                <nav className="flex justify-center gap-2 mt-12" aria-label="Pagination">
                  {Array.from({ length: total_pages }, (_, i) => i + 1).map((p) => {
                    const href = category
                      ? `/blog?category=${category}&page=${p}`
                      : `/blog?page=${p}`;
                    return (
                      <Link
                        key={p}
                        href={href}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ease-out no-underline ${
                          p === current_page
                            ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20"
                            : "bg-surface-container-low text-muted-foreground hover:bg-surface-container"
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </section>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="bg-surface-container-low rounded-2xl p-6 border border-surface-container-high">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="size-4 text-muted-foreground" />
                    <h4 className="font-headline font-bold text-sm text-foreground uppercase tracking-wider">Topics</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/blog"
                      className={`text-sm px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 ease-out no-underline border ${
                        !category
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-transparent text-muted-foreground border-surface-container-high hover:border-secondary/30 hover:text-foreground"
                      }`}
                    >
                      All
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/blog?category=${cat.slug}`}
                        className={`text-sm px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 ease-out no-underline border ${
                          category === cat.slug
                            ? "bg-secondary text-secondary-foreground border-secondary"
                            : "bg-transparent text-muted-foreground border-surface-container-high hover:border-secondary/30 hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
