"use client";

import React from "react";
import Image from "next/image";
import type { WatermarkSpec } from "@/lib/embed/watermark-config";

interface Props {
  spec: WatermarkSpec;
  onClick?: () => void;
}

const POSITION_CLASSES: Record<WatermarkSpec["position"], string> = {
  "bottom-center": "absolute bottom-1.5 left-1/2 -translate-x-1/2",
  "bottom-right": "absolute bottom-1.5 right-2",
  "top-right": "absolute top-2 right-2",
};

const VARIANT_CLASSES: Record<WatermarkSpec["variant"], string> = {
  full: "text-[10px] text-muted-foreground/80 hover:text-foreground transition-colors px-1.5 py-0.5",
  minimal: "text-[9px] text-muted-foreground/70 hover:text-foreground transition-colors px-1.5 py-0.5",
  corner:
    "text-[9px] px-1.5 py-0.5 rounded bg-black/55 text-white/90 hover:bg-black/75 transition-colors shadow-sm",
};

const LOGO_SIZE: Record<WatermarkSpec["variant"], number> = {
  full: 12,
  minimal: 10,
  corner: 10,
};

export function EmbedWatermark({ spec, onClick }: Props) {
  if (!spec.show) return null;
  const logo_px = LOGO_SIZE[spec.variant];
  return (
    <a
      href={spec.href}
      target="_blank"
      rel="noopener"
      onClick={onClick}
      className={`${POSITION_CLASSES[spec.position]} ${VARIANT_CLASSES[spec.variant]} z-50 pointer-events-auto inline-flex items-center gap-1 leading-none font-medium whitespace-nowrap`}
      data-testid="embed-watermark"
    >
      <Image
        src="/gotimer_logo.png"
        alt=""
        width={logo_px}
        height={logo_px}
        className="rounded-sm"
        unoptimized
      />
      <span>{spec.link_text}</span>
    </a>
  );
}
