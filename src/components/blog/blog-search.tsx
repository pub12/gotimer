"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { fire_search_event } from "@/lib/ga-events";

export function BlogSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      fire_search_event(trimmed);
    }

    startTransition(() => {
      if (trimmed) {
        router.push(`/blog?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/blog");
      }
    });
  }

  function handleClear() {
    setQuery("");
    startTransition(() => {
      router.push("/blog");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-primary-foreground/40 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-full pl-10 pr-10 py-2.5 rounded-full bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 text-sm font-medium border border-primary-foreground/10 focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all duration-200"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
      {isPending && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2 size-4 border-2 border-primary-foreground/20 border-t-secondary rounded-full animate-spin" />
      )}
    </form>
  );
}
