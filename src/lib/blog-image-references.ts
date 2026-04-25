export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
};

export type UsageEntry = {
  post_id: string;
  post_title: string;
  post_slug: string;
};

function escape_regex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function build_pattern(filename: string): RegExp {
  return new RegExp(
    `/blog-images/${escape_regex(filename)}(?=[^a-zA-Z0-9._-]|$)`,
    "g"
  );
}

export function is_referenced(content: string, filename: string): boolean {
  return build_pattern(filename).test(content);
}

export function build_usage_map(
  posts: BlogPostRow[],
  filenames: string[]
): Map<string, UsageEntry[]> {
  const patterns = filenames.map((fn) => ({ filename: fn, re: build_pattern(fn) }));
  const result = new Map<string, UsageEntry[]>();
  for (const { filename } of patterns) result.set(filename, []);

  for (const post of posts) {
    for (const { filename, re } of patterns) {
      re.lastIndex = 0;
      if (re.test(post.content)) {
        result.get(filename)!.push({
          post_id: post.id,
          post_title: post.title,
          post_slug: post.slug,
        });
      }
    }
  }

  return result;
}

export function rewrite_references(
  content: string,
  old_filename: string,
  new_filename: string
): string {
  return content.replace(
    build_pattern(old_filename),
    `/blog-images/${new_filename}`
  );
}
