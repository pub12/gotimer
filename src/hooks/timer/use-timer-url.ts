"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

/**
 * Bidirectional URL sync for timer configuration.
 * Reads initial config from searchParams, writes changes back silently.
 */
export function useTimerUrl(
  params: Record<string, string | number | undefined>,
  defaults?: Record<string, string | number>,
) {
  const search_params = useSearchParams();
  const pathname = usePathname();

  /** Read a param from the URL, falling back to default */
  const get_param = useCallback(
    (key: string, fallback?: string | number): string | undefined => {
      return search_params.get(key) ?? (fallback !== undefined ? String(fallback) : undefined);
    },
    [search_params],
  );

  /** Read a numeric param */
  const get_number = useCallback(
    (key: string, fallback?: number): number => {
      const val = search_params.get(key);
      if (val !== null) {
        const num = Number(val);
        if (!isNaN(num)) return num;
      }
      return fallback ?? 0;
    },
    [search_params],
  );

  /** Build the current query string from params, excluding defaults */
  const build_query = useCallback(() => {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === "") continue;
      const default_val = defaults?.[key];
      if (default_val !== undefined && String(value) === String(default_val)) continue;
      qs.set(key, String(value));
    }
    return qs;
  }, [params, defaults]);

  /** Silently update the URL */
  useEffect(() => {
    const qs = build_query().toString();
    window.history.replaceState(null, "", `${pathname}${qs ? `?${qs}` : ""}`);
  }, [build_query, pathname]);

  /** Generate a shareable URL */
  const build_share_url = useCallback(() => {
    const qs = build_query().toString();
    return `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;
  }, [build_query, pathname]);

  return { get_param, get_number, build_share_url };
}
