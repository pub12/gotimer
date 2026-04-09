import Link from "next/link";

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  date: string | null;
  category_name: string | null;
  category_colour: string | null;
}

export function PostCard({ title, slug, excerpt, date, category_name, category_colour }: PostCardProps) {
  const formatted_date = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <Link href={`/blog/${slug}`} className="block group">
      <article className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all bg-white">
        <div className="flex items-center gap-3 mb-3">
          {category_name && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: category_colour ? `${category_colour}20` : "#f3f4f6",
                color: category_colour ?? "#374151",
              }}
            >
              {category_name}
            </span>
          )}
          {formatted_date && (
            <time className="text-xs text-gray-500" dateTime={date ?? undefined}>
              {formatted_date}
            </time>
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
          {title}
        </h2>
        {excerpt && (
          <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p>
        )}
      </article>
    </Link>
  );
}
