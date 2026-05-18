"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

interface IframeShowcaseProps {
  /** Embed path starting with /e/ — e.g. /e/countdown?duration=300&label=Foo */
  embed_path: string;
  /** Preview iframe height in pixels. Default 280. */
  preview_height?: number;
  /** Width of the rendered iframe in the published markup. Default "100%". */
  iframe_width?: string;
  /** Height of the rendered iframe in the published markup. Default "320". */
  iframe_height?: number;
  /** Heading above the snippet. Default "Copy this iframe". */
  heading?: string;
  /** Optional helper line under the snippet. */
  footnote?: string;
}

/**
 * Live preview + copy-iframe widget — reusable across embed landing pages.
 *
 * Renders a side-by-side preview (left) and code box with copy button
 * (right). Mobile collapses to stacked. The published iframe markup is
 * derived from the same embed_path used for the preview, so what users
 * copy is what they see.
 */
export function IframeShowcase({
  embed_path,
  preview_height = 420,
  iframe_width = "100%",
  iframe_height = 420,
  heading = "Copy this iframe",
  footnote,
}: IframeShowcaseProps) {
  const [copied, set_copied] = useState(false);

  const iframe_code = useMemo(() => {
    return `<iframe src="https://gotimer.org${embed_path}"
  width="${iframe_width}" height="${iframe_height}" frameborder="0"
  allow="autoplay" loading="lazy"
  style="border-radius:12px;border:0;max-width:480px;"></iframe>`;
  }, [embed_path, iframe_width, iframe_height]);

  const copy = useCallback(() => {
    navigator.clipboard
      .writeText(iframe_code)
      .then(() => {
        set_copied(true);
        setTimeout(() => set_copied(false), 2000);
      })
      .catch(() => {});
  }, [iframe_code]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Preview */}
      <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Live preview
        </div>
        <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-center" style={{ minHeight: preview_height }}>
          <iframe
            src={embed_path}
            width="100%"
            height={preview_height}
            style={{ border: 0, borderRadius: 8, maxWidth: 420 }}
            title="Embed preview"
            loading="lazy"
          />
        </div>
      </div>

      {/* Code + copy */}
      <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-5 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </div>
          <button
            type="button"
            onClick={copy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy iframe
              </>
            )}
          </button>
        </div>
        <pre className="bg-primary text-primary-foreground rounded-xl p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all flex-1">
          {iframe_code}
        </pre>
        {footnote && (
          <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>
        )}
      </div>
    </div>
  );
}
