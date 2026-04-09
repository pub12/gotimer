import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { get_db } from "@/lib/db";
import { mdxComponents } from "@/components/mdx";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  publish_date: string | null;
  updated_at: string | null;
  faq_json: string | null;
  category_id: string | null;
  category_name: string | null;
  category_colour: string | null;
  status: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = get_db();

  const post = db
    .prepare(
      `SELECT bp.title, bp.meta_title, bp.meta_description, bp.publish_date, bp.status
       FROM blog_posts bp WHERE bp.slug = ?`
    )
    .get(slug) as Pick<BlogPost, "title" | "meta_title" | "meta_description" | "publish_date" | "status"> | undefined;

  if (!post || post.status !== "published") {
    return { title: "Not Found | GoTimer" };
  }

  const title = post.meta_title || `${post.title} | GoTimer`;
  const description = post.meta_description || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      type: "article",
      publishedTime: post.publish_date ?? undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const db = get_db();

  const post = db
    .prepare(
      `SELECT bp.*, bc.name as category_name, bc.colour as category_colour
       FROM blog_posts bp
       LEFT JOIN blog_categories bc ON bp.category_id = bc.id
       WHERE bp.slug = ?`
    )
    .get(slug) as BlogPost | undefined;

  if (!post || post.status !== "published") {
    notFound();
  }

  // Parse FAQ JSON
  let faq_items: FaqItem[] = [];
  if (post.faq_json) {
    try {
      const parsed = JSON.parse(post.faq_json);
      if (Array.isArray(parsed)) {
        faq_items = parsed.filter((item) => item.question && item.answer);
      }
    } catch {
      // Invalid JSON, skip FAQ
    }
  }

  const formatted_date = post.publish_date
    ? new Date(post.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // JSON-LD is constructed entirely from our own structured data — not user HTML
  const faq_json_ld =
    faq_items.length > 0
      ? JSON.stringify({
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
        })
      : null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
      {faq_json_ld && (
        // nosec: JSON-LD built from structured DB fields, not raw user HTML
        // biome-ignore lint: intentional
        <script
          type="application/ld+json"
          // nosec
          dangerouslySetInnerHTML={{ __html: faq_json_ld }}
        />
      )}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8">
          {post.category_name && (
            <span
              className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-4"
              style={{
                backgroundColor: post.category_colour ? `${post.category_colour}20` : "#f3f4f6",
                color: post.category_colour ?? "#374151",
              }}
            >
              {post.category_name}
            </span>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
          {formatted_date && (
            <time className="text-sm text-gray-500" dateTime={post.publish_date ?? undefined}>
              {formatted_date}
            </time>
          )}
        </header>

        <article className="prose prose-gray max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        {faq_items.length > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <dl className="space-y-6">
              {faq_items.map((item, index) => (
                <div key={index}>
                  <dt className="font-semibold text-gray-900 mb-2">{item.question}</dt>
                  <dd className="text-gray-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </main>
    </>
  );
}
