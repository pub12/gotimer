"use client";

import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type GifPickerProps = {
  on_select: (url: string) => void;
  on_close: () => void;
};

type GiphyImage = {
  id: string;
  images: {
    fixed_height: { url: string; width: string; height: string };
    fixed_height_small: { url: string };
  };
  title: string;
};

export function GifPicker({ on_select, on_close }: GifPickerProps) {
  const [query, set_query] = useState("");
  const [results, set_results] = useState<GiphyImage[]>([]);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState("");

  const search = useCallback(
    async (q: string) => {
      if (!q.trim()) return;
      set_loading(true);
      set_error("");
      try {
        const res = await fetch(
          `/api/giphy?q=${encodeURIComponent(q)}&limit=20`
        );
        const data = await res.json();
        if (data.error) {
          set_error(data.error);
          return;
        }
        set_results(data.data || []);
      } catch {
        set_error("Failed to search GIFs");
      } finally {
        set_loading(false);
      }
    },
    []
  );

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">Search GIFs</h4>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={on_close}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search GIFs..."
            value={query}
            onChange={(e) => set_query(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search(query)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button size="sm" onClick={() => search(query)}>
          Search
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-2">{error}</p>}

      {loading && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
          {results.map((gif) => (
            <button
              key={gif.id}
              className="rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer bg-transparent border-none p-0"
              onClick={() => on_select(gif.images.fixed_height.url)}
            >
              <img
                src={gif.images.fixed_height_small.url}
                alt={gif.title}
                className="w-full h-24 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 text-center">
        <span className="text-xs text-muted-foreground">Powered by GIPHY</span>
      </div>
    </div>
  );
}
