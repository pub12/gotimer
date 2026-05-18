"use client";

import React, { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { get_strategy } from "@/lib/timer-strategies";
import { parse_embed_params, apply_started_offset } from "@/lib/embed/params";

/**
 * Canonical short-form embed iframe URL: /e/[strategy-id]?…params…
 *
 * Renders the same stripped-chrome TimerEmbed as the long-form
 * /<strategy>/embed routes — but lives at a shorter URL that's easier
 * to paste into iframe markup. The route is noindex via /e/layout.tsx.
 */

function EmbedShortContent({ slug }: { slug: string }) {
  const search_params = useSearchParams();
  const strategy = get_strategy(slug);

  if (!strategy) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-surface">
        <p className="text-muted-foreground text-sm">
          Unknown timer type: <code>{slug}</code>
        </p>
      </div>
    );
  }

  const params = parse_embed_params(search_params, slug);
  const config = apply_started_offset(params.config, params.started);

  return <TimerEmbed strategy={strategy} config={config} params={params} />;
}

export default function EmbedShortPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Suspense>
      <EmbedShortContent slug={slug} />
    </Suspense>
  );
}
