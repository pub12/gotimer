"use client";

import React, { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { get_strategy } from "@/lib/timer-strategies";
import { parse_embed_params, apply_started_offset } from "@/lib/embed/params";

function EmbedContent({ type }: { type: string }) {
  const search_params = useSearchParams();
  const strategy = get_strategy(type);

  if (!strategy) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-surface">
        <p className="text-muted-foreground text-sm">
          Unknown timer type: <code>{type}</code>
        </p>
      </div>
    );
  }

  const params = parse_embed_params(search_params, type);
  const config = apply_started_offset(params.config, params.started);

  return <TimerEmbed strategy={strategy} config={config} params={params} />;
}

export default function EmbedPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  return (
    <Suspense>
      <EmbedContent type={type} />
    </Suspense>
  );
}
