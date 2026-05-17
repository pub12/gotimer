import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { get_db } from "@/lib/db";
import { get_server_auth_user } from "hazo_auth/server-lib";
import TimerPageTemplate from "@/components/timer-page/timer-page-template";

// Route segments that must NOT be caught by this dynamic route
const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "challenges",
  "chess-clock",
  "chess-clock-setup",
  "countdown",
  "countdown-setup",
  "hazo_auth",
  "partners",
  "privacy-policy",
  "public-challenges",
  "round-timer",
  "round-timer-setup",
  "terms-of-service",
  "blog",
  "leaderboard",
  "board-games",
  "developers",
  // Category pages
  "photography",
  "fitness",
  "wellness",
  "productivity",
  "kitchen",
  // Studio
  "studio",
  "stopwatch",
]);

type TimerPage = {
  id: string;
  slug: string;
  title: string;
  intro_html: string;
  faq_json: string;
  meta_title: string;
  meta_description: string;
  timer_type: string;
  timer_config_json: string;
  character_id: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function get_page_by_slug(slug: string): TimerPage | null {
  try {
    const db = get_db();
    const page = db
      .prepare(`SELECT * FROM timer_pages WHERE slug = ?`)
      .get(slug) as TimerPage | undefined;
    return page ?? null;
  } catch {
    return null;
  }
}

async function is_admin(user_id: string): Promise<boolean> {
  try {
    const db = get_db();
    const result = db
      .prepare(
        `SELECT 1 FROM hazo_user_scopes us
         JOIN hazo_role_permissions rp ON us.role_id = rp.role_id
         JOIN hazo_permissions p ON rp.permission_id = p.id
         WHERE us.user_id = ? AND p.permission_name = 'admin_view_all_games'
         LIMIT 1`
      )
      .get(user_id);
    return result != null;
  } catch {
    return false;
  }
}

// Pre-render all published timer pages at build time for performance + SEO.
// `revalidate` enables Incremental Static Regeneration: pages are cached for 60s
// then re-rendered on the next request. This lets seed-script edits propagate
// to production without a full rebuild, while keeping fast static serving 99% of
// the time. Combined with `pm2 reload` after `npx tsx scripts/seed-timer-pages.ts`,
// changes are live within ~60 seconds.
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const db = get_db();
    const pages = db
      .prepare(`SELECT slug FROM timer_pages WHERE status = 'published'`)
      .all() as { slug: string }[];
    return pages.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    return {};
  }

  const page = get_page_by_slug(slug);
  if (!page || page.status !== "published") {
    return {};
  }

  const base = "https://gotimer.org";
  // Strip " | GoTimer" suffix if present — layout template already appends it
  const raw_title = page.meta_title || page.title;
  const title = raw_title.replace(/\s*[\|–—-]\s*GoTimer$/i, "");
  const description = page.meta_description || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${base}/${page.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function TimerPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Block reserved slugs — these are handled by their own routes
  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }

  const page = get_page_by_slug(slug);

  if (!page) {
    notFound();
  }

  let show_draft_banner = false;

  if (page.status !== "published") {
    // Draft page — only admins may preview
    const auth = await get_server_auth_user();
    if (!auth.authenticated) {
      notFound();
    }
    const admin = await is_admin(auth.user_id);
    if (!admin) {
      notFound();
    }
    show_draft_banner = true;
  }

  // Query related pages (other published timer pages, limit 4, exclude current)
  let related_pages: { title: string; slug: string; timer_type: string }[] = [];
  try {
    const db = get_db();
    related_pages = db
      .prepare(
        `SELECT title, slug, timer_type FROM timer_pages
         WHERE status = 'published' AND slug != ?
         ORDER BY published_at DESC
         LIMIT 4`
      )
      .all(page.slug) as { title: string; slug: string; timer_type: string }[];
  } catch {
    // ignore
  }

  // Content lives in the DB (kept in sync with src/lib/timer-page-content.ts
  // via scripts/seed-timer-pages.ts on every deploy). No render-time override
  // needed — admin UI edits are visible until next deploy overwrites them.
  return (
    <TimerPageTemplate
      page={page}
      related_pages={related_pages}
      is_draft={show_draft_banner}
    />
  );
}
