"use client";

import React from "react";
import type { WatermarkSpec } from "@/lib/embed/watermark-config";

interface Props {
  spec: WatermarkSpec;
  onClick?: () => void;
}

const POSITION_CLASSES: Record<WatermarkSpec["position"], string> = {
  "bottom-center": "fixed bottom-2 left-1/2 -translate-x-1/2",
  "bottom-right": "fixed bottom-2 right-3",
  "top-right": "fixed top-3 right-4",
};

const VARIANT_CLASSES: Record<WatermarkSpec["variant"], string> = {
  full: "text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1",
  minimal: "text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors px-2 py-1",
  corner:
    "text-[10px] px-2 py-1 rounded bg-black/60 text-white/90 hover:bg-black/80 transition-colors shadow-sm",
};

export function EmbedWatermark({ spec, onClick }: Props) {
  if (!spec.show) return null;
  return (
    <a
      href={spec.href}
      target="_blank"
      rel="noopener"
      onClick={onClick}
      className={`${POSITION_CLASSES[spec.position]} ${VARIANT_CLASSES[spec.variant]} z-50 pointer-events-auto`}
      data-testid="embed-watermark"
    >
      {spec.link_text}
    </a>
  );
}
