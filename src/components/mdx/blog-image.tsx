"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function BlogImage({ src, alt, caption, width = 800, height = 450 }: BlogImageProps) {
  const [errored, set_errored] = useState(false);

  return (
    <figure className="my-6">
      {errored ? (
        <div
          className="w-full max-w-[280px] mx-auto rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col items-center justify-center gap-3 text-muted-foreground"
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <ImageIcon className="size-10 opacity-30" />
          <span className="text-sm opacity-50">{alt}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="max-w-full h-auto rounded-xl mx-auto"
          style={{ width: Math.min(width, 280) }}
          onError={() => set_errored(true)}
        />
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
