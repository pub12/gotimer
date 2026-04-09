import type { Metadata } from "next";
import Link from "next/link";
import { get_db } from "@/lib/db";
import { PostCard } from "@/components/blog/post-card";

export const metadata: Metadata = {
  title: "Blog | GoTimer",
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
}

interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  colour: string | null;
}

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category, page: page_param } = await searchParams;
  const current_page = Math.max(1, parseInt(page_param ?? "1", 10));
  const offset = (current_page - 1) * POSTS_PER_PAGE;

  const db = get_db();

  // Fetch categories for filter nav
  const categories = db
    .prepare(`SELECT id, slug, name, colour FROM blog_categories ORDER BY name ASC`)
    .all() as BlogCategory[];

  // Fetch posts (with optional category filter)
  let posts: BlogPost[];
  let total_count: number;

  if (category) {
    posts = db
      .prepare(
        `SELECT bp.id, bp.slug, bp.title, bp.content, bp.publish_date,
                bp.category_id, bc.name as category_name, bc.slug as category_slug, bc.colour as category_colour
         FROM blog_posts bp
         LEFT JOIN blog_categories bc ON bp.category_id = bc.id
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
                bp.category_id, bc.name as category_name, bc.slug as category_slug, bc.colour as category_colour
         FROM blog_posts bp
         LEFT JOIN blog_categories bc ON bp.category_id = bc.id
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

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Blog</h1>
        <p className="text-lg text-gray-600">
          Tips, guides, and strategies for timers in games and events.
        </p>
      </header>

      {/* Category filter */}
      {categories.length > 0 && (
        <nav className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/blog"
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              !category
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-300 text-gray-600 hover:border-gray-500"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                category === cat.slug
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-300 text-gray-600 hover:border-gray-500"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      )}

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.content?.slice(0, 200) ?? ""}
              date={post.publish_date}
              category_name={post.category_name}
              category_colour={post.category_colour}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total_pages > 1 && (
        <nav className="flex justify-center gap-2 mt-10" aria-label="Pagination">
          {Array.from({ length: total_pages }, (_, i) => i + 1).map((p) => {
            const href = category
              ? `/blog?category=${category}&page=${p}`
              : `/blog?page=${p}`;
            return (
              <Link
                key={p}
                href={href}
                className={`w-9 h-9 flex items-center justify-center rounded border text-sm transition-colors ${
                  p === current_page
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-600 hover:border-gray-500"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </nav>
      )}
    </main>
  );
}
