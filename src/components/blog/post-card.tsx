import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  date: string | null;
  category_name: string | null;
  category_colour: string | null;
}

export function PostCard({ title, slug, excerpt, date, category_name }: PostCardProps) {
  const formatted_date = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : null;

  const read_time = Math.max(3, Math.ceil((excerpt?.length ?? 0) / 200));

  // Strip MDX/HTML from excerpt for clean preview
  const clean_excerpt = excerpt
    ?.replace(/\{\/\*.*?\*\/\}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#*_\[\]()>`]/g, "")
    .trim();

  return (
    <Link href={`/blog/${slug}`} className="block group no-underline">
      <article className="h-full bg-surface-container-low rounded-2xl overflow-hidden border border-surface-container-high hover:border-secondary/20 hover:-translate-y-1 hover:shadow-[var(--shadow-soft-lg)] transition-all duration-300 ease-out">
        {/* Image placeholder */}
        <div className="relative h-44 bg-gradient-to-br from-primary via-primary to-[#0d2654] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/mascots/prof-studying.png"
              alt="Blog post"
              width={120}
              height={120}
              className="w-24 h-24 object-contain drop-shadow-md opacity-80"
            />
          </div>
          {category_name && (
            <div className="absolute top-4 left-4">
              <span className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-[11px] font-bold font-headline uppercase tracking-wider">
                {category_name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {formatted_date && (
              <time dateTime={date ?? undefined}>{formatted_date}</time>
            )}
            {formatted_date && <span className="w-1 h-1 rounded-full bg-surface-container-highest" />}
            <span>{read_time} min read</span>
          </div>

          <h2 className="text-lg font-bold mb-2 text-foreground font-headline leading-snug line-clamp-2 group-hover:text-secondary transition-colors duration-300">
            {title}
          </h2>

          {clean_excerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {clean_excerpt}
            </p>
          )}

          <span className="inline-flex items-center gap-1 text-secondary font-bold text-sm group-hover:gap-2 transition-all duration-300">
            Read article <ChevronRight className="size-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}
