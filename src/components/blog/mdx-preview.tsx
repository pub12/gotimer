"use client";

import { useEffect, useState, type ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";

export function MdxPreview({ source }: { source: string }) {
  const [content, set_content] = useState<ReactNode>(null);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const { default: Content } = await evaluate(source, {
          ...(runtime as unknown as Parameters<typeof evaluate>[1]),
          remarkPlugins: [remarkGfm],
        });
        if (!cancelled) {
          set_content(<Content components={mdxComponents} />);
          set_error(null);
        }
      } catch (e) {
        if (!cancelled) set_error(e instanceof Error ? e.message : String(e));
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [source]);

  return (
    <div className="relative">
      {error && (
        <div className="sticky top-0 z-10 mb-3 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700 whitespace-pre-wrap">
          MDX error: {error}
        </div>
      )}
      <div className="blog-article-content">{content}</div>
    </div>
  );
}
