"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FaqAccordion from "@/components/shared/faq-accordion";
import {
  BrbDisplay,
  KEYFRAMES_CSS,
  type BrbDefaults,
  type ParsedBrbConfig,
} from "./overlay";

interface RelatedPreset {
  name: string;
  href: string;
  description: string;
}

interface BrbPresetLandingProps {
  /** The preset's own URL path, e.g. "/brb/starting-soon". */
  preset_path: string;
  /** Display name, e.g. "Stream Starting Soon Countdown". */
  h1: string;
  /** Short lead paragraph after the H1. */
  lead: string;
  /** Defaults baked into the embed preview + copy URL. */
  defaults: BrbDefaults;
  /** Main body content (~600-800 words of unique copy). */
  children: React.ReactNode;
  /** Per-preset FAQ. */
  faq: Array<{ question: string; answer: string }>;
  /** Sibling preset links (3 recommended). */
  related: RelatedPreset[];
}

function build_embed_url(base_path: string, defaults: BrbDefaults): string {
  const params = new URLSearchParams();
  params.set("embed", "1");
  if (defaults.mins !== undefined && defaults.mins !== 5)
    params.set("mins", String(defaults.mins));
  if (defaults.secs !== undefined && defaults.secs !== 0)
    params.set("secs", String(defaults.secs));
  if (defaults.label && defaults.label !== "Back soon")
    params.set("label", defaults.label);
  if (defaults.color && defaults.color !== "#ffffff")
    params.set("color", defaults.color.replace("#", ""));
  if (defaults.font && defaults.font !== "sans") params.set("font", defaults.font);
  if (defaults.bg && defaults.bg !== "transparent")
    params.set("bg", defaults.bg.replace("#", ""));
  if (defaults.size && defaults.size !== "xl") params.set("size", defaults.size);
  if (defaults.align && defaults.align !== "center") params.set("align", defaults.align);
  if (defaults.pulse) params.set("pulse", "1");
  if (defaults.autostart) params.set("autostart", "1");
  return `${base_path}?${params.toString()}`;
}

function defaults_to_cfg(d: BrbDefaults): ParsedBrbConfig {
  return {
    duration: Math.max(1, (d.mins ?? 5) * 60 + (d.secs ?? 0)),
    label: d.label ?? "Back soon",
    color: d.color ?? "#ffffff",
    font: d.font ?? "sans",
    bg: d.bg ?? "transparent",
    size: d.size ?? "xl",
    align: d.align ?? "center",
    pulse: d.pulse ?? false,
    autostart: d.autostart ?? false,
    sound: d.sound ?? "off",
  };
}

export function BrbPresetLanding({
  preset_path,
  h1,
  lead,
  defaults,
  children,
  faq,
  related,
}: BrbPresetLandingProps) {
  const cfg = useMemo(() => defaults_to_cfg(defaults), [defaults]);
  const [base, set_base] = useState(preset_path);
  const [copied, set_copied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      set_base(`${window.location.origin}${preset_path}`);
    }
  }, [preset_path]);

  const embed_url = useMemo(() => build_embed_url(base, defaults), [base, defaults]);

  // Cycle the preview countdown so the visitor sees animation.
  const total = cfg.duration;
  const [preview_seconds, set_preview_seconds] = useState(total);
  useEffect(() => {
    set_preview_seconds(total);
  }, [total]);
  useEffect(() => {
    const id = setInterval(() => {
      set_preview_seconds((prev) => (prev <= 0 ? total : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [total]);

  const on_copy = async () => {
    try {
      await navigator.clipboard.writeText(embed_url);
      set_copied(true);
      setTimeout(() => set_copied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-12 px-3 w-full md:pt-20 md:px-4">
        <div className="max-w-3xl w-full mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href="/streamer-tools"
              className="hover:text-foreground transition-colors"
            >
              Streamer Tools
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/brb" className="hover:text-foreground transition-colors">
              BRB Overlay
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">{h1}</span>
          </nav>
        </div>

        <section className="max-w-3xl w-full mx-auto mb-8">
          <h1 className="font-headline font-black text-3xl md:text-4xl text-foreground mb-3 leading-tight">
            {h1}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">{lead}</p>
        </section>

        {/* Preview + Copy URL */}
        <section className="max-w-3xl w-full mx-auto mb-12 bg-card rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="relative bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:32px_32px] aspect-video flex items-center justify-center">
            <style>{KEYFRAMES_CSS}</style>
            <div className="absolute inset-0">
              <BrbDisplay cfg={cfg} seconds={preview_seconds} position="relative" />
            </div>
            <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider text-white/70 font-mono px-2 py-0.5 bg-black/40 rounded">
              Live preview
            </div>
          </div>
          <div className="p-5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Paste this URL into OBS &gt; Browser Source
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={embed_url}
                className="flex-1 px-3 py-2 bg-surface-container-low rounded-lg text-foreground text-xs font-mono outline-none truncate"
                onFocus={(e) => e.currentTarget.select()}
              />
              <button
                type="button"
                onClick={on_copy}
                className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Set the Browser Source width and height to your canvas size (typically 1920×1080).{" "}
              <Link href="/brb#configurator" className="text-secondary underline">
                Need different settings? Use the configurator.
              </Link>
            </p>
          </div>
        </section>

        {/* Body content */}
        <section className="max-w-3xl w-full mx-auto seo-prose space-y-4 text-sm text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-headline [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3">
          {children}
        </section>

        {/* Related presets */}
        {related.length > 0 && (
          <section className="max-w-3xl w-full mx-auto mt-12">
            <h2 className="font-headline font-bold text-xl text-foreground mb-4">
              Other streamer countdowns
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((preset) => (
                <Link
                  key={preset.href}
                  href={preset.href}
                  className="group block p-4 bg-card rounded-xl shadow-[var(--shadow-soft)] hover:shadow-md transition-all"
                >
                  <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors text-sm">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="max-w-3xl w-full mx-auto mt-12">
            <FaqAccordion items={faq} title={`${h1} — FAQ`} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
