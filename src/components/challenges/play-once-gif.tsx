"use client";

import React, { useRef, useEffect, useState } from "react";

type PlayOnceGifProps = {
  src: string;
  alt: string;
  className?: string;
};

export function PlayOnceGif({ src, alt, className }: PlayOnceGifProps) {
  const img_ref = useRef<HTMLImageElement>(null);
  const canvas_ref = useRef<HTMLCanvasElement>(null);
  const [frozen, set_frozen] = useState(false);

  useEffect(() => {
    const img = img_ref.current;
    const canvas = canvas_ref.current;
    if (!img || !canvas) return;

    let timer: ReturnType<typeof setTimeout>;

    const freeze = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx || !img.naturalWidth) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      set_frozen(true);
    };

    const on_load = () => {
      // Freeze after 4 seconds — enough time for most GIFs to play once
      timer = setTimeout(freeze, 4000);
    };

    if (img.complete) {
      on_load();
    } else {
      img.addEventListener("load", on_load);
    }

    return () => {
      clearTimeout(timer);
      img.removeEventListener("load", on_load);
    };
  }, [src]);

  return (
    <>
      <img
        ref={img_ref}
        src={src}
        alt={alt}
        className={className}
        style={{ display: frozen ? "none" : undefined }}
      />
      <canvas
        ref={canvas_ref}
        className={className}
        style={{ display: frozen ? undefined : "none" }}
      />
    </>
  );
}
