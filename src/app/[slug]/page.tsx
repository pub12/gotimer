import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { DraftBanner } from "@/components/admin/draft-banner";
import { get_db } from "@/lib/db";
import { get_server_auth_user } from "hazo_auth/server-lib";

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

type FaqItem = {
  question: string;
  answer: string;
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
  const title = page.meta_title || page.title;
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

  // Parse FAQ JSON
  let faq_items: FaqItem[] = [];
  try {
    const parsed = JSON.parse(page.faq_json);
    if (Array.isArray(parsed)) {
      faq_items = parsed.filter(
        (item): item is FaqItem =>
          typeof item === "object" &&
          item !== null &&
          typeof item.question === "string" &&
          typeof item.answer === "string"
      );
    }
  } catch {
    // malformed JSON — ignore
  }

  // Build FAQPage JSON-LD
  const faq_jsonld =
    faq_items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq_items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {show_draft_banner && <DraftBanner />}
      <main
        className="min-h-screen flex flex-col items-center bg-background p-4 pt-20"
        style={show_draft_banner ? { paddingTop: "80px" } : undefined}
      >
        <Navbar />

        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{page.title}</h1>

          {/* Intro HTML — content comes from admin-entered data, sanitized server-side */}
          {page.intro_html && (
            <div
              className="prose prose-lg max-w-none mb-8"
              // nosec: content is admin-controlled and not user-supplied
              dangerouslySetInnerHTML={{ __html: page.intro_html }}
            />
          )}

          {/* Timer widget placeholder */}
          <div className="bg-card rounded-xl border p-8 text-center mb-8 text-muted-foreground">
            Timer widget goes here
          </div>

          {/* FAQ section */}
          {faq_items.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {faq_items.map((item, idx) => (
                  <details
                    key={idx}
                    className="bg-card rounded-lg border overflow-hidden"
                  >
                    <summary className="cursor-pointer px-4 py-3 font-medium hover:bg-muted/50 list-none flex items-center justify-between">
                      {item.question}
                      <span className="text-muted-foreground text-lg leading-none ml-2">+</span>
                    </summary>
                    <div
                      className="px-4 pb-4 pt-2 text-muted-foreground"
                      // nosec: content is admin-controlled and not user-supplied
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* FAQPage JSON-LD */}
        {faq_jsonld && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faq_jsonld) }}
          />
        )}
      </main>
    </>
  );
}
