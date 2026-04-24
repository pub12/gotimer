import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { get_db } from "@/lib/db";
import { mdxComponents } from "@/components/mdx";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";

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
  character_image: string | null;
  character_name: string | null;
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
      `SELECT bp.title, bp.meta_title, bp.meta_description, bp.publish_date, bp.status,
              ci.file_path as character_image
       FROM blog_posts bp
       LEFT JOIN character_images ci ON bp.character_id = ci.id
       WHERE bp.slug = ?`
    )
    .get(slug) as (Pick<BlogPost, "title" | "meta_title" | "meta_description" | "publish_date" | "status"> & { character_image: string | null }) | undefined;

  if (!post || post.status !== "published") {
    return { title: "Not Found" };
  }

  // Strip " | GoTimer" suffix if present — layout template already appends it
  const raw_title = post.meta_title || post.title;
  const title = raw_title.replace(/\s*\|\s*GoTimer$/i, "");
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
      `SELECT bp.*, bc.name as category_name, bc.colour as category_colour,
              COALESCE(bp.featured_image, ci.file_path) as character_image, ci.character_name as character_name
       FROM blog_posts bp
       LEFT JOIN blog_categories bc ON bp.category_id = bc.id
       LEFT JOIN character_images ci ON bp.character_id = ci.id
       WHERE bp.slug = ?`
    )
    .get(slug) as BlogPost | undefined;

  if (!post || post.status !== "published") {
    notFound();
  }

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

  const read_time = Math.max(3, Math.ceil((post.content?.length ?? 0) / 1000));

  // nosec: JSON-LD built from structured DB fields (title, dates, slug), not user HTML
  const article_json_ld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || undefined,
    datePublished: post.publish_date || undefined,
    dateModified: post.updated_at || post.publish_date || undefined,
    author: {
      "@type": "Organization",
      name: "GoTimer",
      url: "https://gotimer.org",
    },
    publisher: {
      "@type": "Organization",
      name: "GoTimer",
      url: "https://gotimer.org",
      logo: {
        "@type": "ImageObject",
        url: "https://gotimer.org/gotimer_logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://gotimer.org/blog/${slug}`,
    },
  });

  return (
    <>
      {/* nosec: article_json_ld built from DB fields (title, dates), safe to inject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: article_json_ld }}
      />
      <Navbar />
      <main className="min-h-screen bg-surface pt-20">
        {/* Hero header */}
        <header className="relative overflow-hidden bg-primary">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-secondary/10 rotate-12 rounded-3xl" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-accent/8 -rotate-6 rounded-3xl" />

          <div className="relative max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm font-medium mb-8 no-underline transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to all articles
            </Link>

            <div className="flex items-end gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {post.category_name && (
                    <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold font-headline uppercase tracking-wider">
                      <Tag className="size-3" />
                      {post.category_name}
                    </span>
                  )}
                  {formatted_date && (
                    <span className="inline-flex items-center gap-1.5 text-primary-foreground/50 text-sm">
                      <Calendar className="size-3.5" />
                      <time dateTime={post.publish_date ?? undefined}>{formatted_date}</time>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-primary-foreground/50 text-sm">
                    <Clock className="size-3.5" />
                    {read_time} min read
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-[1.1] tracking-tight font-headline max-w-3xl">
                  {post.title}
                </h1>
              </div>

              <div className="hidden md:block shrink-0">
                <Image
                  src={post.character_image || "/mascots/prof-studying.png"}
                  alt={post.character_name || "GoTimer mascot"}
                  width={180}
                  height={180}
                  className="w-36 lg:w-44 h-36 lg:h-44 object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Article body */}
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <article className="blog-article-content py-12 md:py-16">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </article>
        </div>

        {/* FAQ section */}
        {faq_items.length > 0 && (
          <section className="border-t border-surface-container-high bg-surface-container-low">
            <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-20">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1 h-8 bg-secondary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black text-primary font-headline tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>
              <dl className="space-y-0 divide-y divide-surface-container-high">
                {faq_items.map((item, index) => (
                  <div key={index} className="py-6 first:pt-0 last:pb-0">
                    <dt className="font-headline font-bold text-lg text-foreground mb-2">
                      {item.question}
                    </dt>
                    <dd className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* Bottom nav */}
        <div className="border-t border-surface-container-high">
          <div className="max-w-4xl mx-auto px-6 md:px-8 py-8 pb-24 md:pb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-bold text-sm no-underline transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to all articles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
