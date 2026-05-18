"use client";

import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FaqAccordion from "@/components/shared/faq-accordion";
import { EMBED_HUB_FAQ } from "./faq";

/**
 * /embed hub — landing page for the embed-widget niche.
 *
 * Three things stacked top-to-bottom:
 *   1. Inline configurator with a live iframe preview + copy-iframe code box
 *   2. Pre-built template cards (wedding / event / Pomodoro / OBS BRB / sale)
 *   3. Platform-guide links + SEO body + FAQ
 */

interface TimerType {
  id: string;
  name: string;
  description: string;
  default_param: string;
  default_value: string;
  example_label: string;
}

const TIMER_TYPES: TimerType[] = [
  {
    id: "countdown",
    name: "Countdown",
    description: "Counts down from a fixed duration",
    default_param: "duration",
    default_value: "300",
    example_label: "Lunch break",
  },
  {
    id: "interval",
    name: "Pomodoro / Interval",
    description: "Work-rest cycles for focus or workouts",
    default_param: "work",
    default_value: "1500",
    example_label: "Pomodoro",
  },
  {
    id: "chess-clock",
    name: "Chess Clock",
    description: "Two-player time bank for board games",
    default_param: "duration_per_player",
    default_value: "600",
    example_label: "Chess",
  },
  {
    id: "round-timer",
    name: "Round Timer",
    description: "Rounds with rest, for HIIT and combat sports",
    default_param: "round_duration",
    default_value: "180",
    example_label: "HIIT round",
  },
  {
    id: "stopwatch",
    name: "Stopwatch",
    description: "Counts up with centisecond precision",
    default_param: "",
    default_value: "",
    example_label: "Stopwatch",
  },
];

type ThemeOption = "auto" | "light" | "dark";

const TEMPLATES = [
  {
    name: "Wedding Countdown",
    description: "Date-locked countdown for your venue site or save-the-dates",
    href: "/embed/wedding-countdown",
    iframe: "/e/countdown?duration=2592000&label=Sarah+and+Alex&theme=light&accent=%23d4af37",
  },
  {
    name: "Event Countdown",
    description: "Conference, product launch, webinar start time",
    href: "/embed/event-countdown",
    iframe: "/e/countdown?duration=86400&label=Doors+open&theme=auto",
  },
  {
    name: "Pomodoro on a Blog",
    description: "25/5 focus cycles embedded next to a study guide",
    href: "/productivity/pomodoro",
    iframe: "/e/interval?work=1500&rest=300&rounds=4&label=Pomodoro&theme=light",
  },
  {
    name: "OBS BRB Overlay",
    description: "Transparent 5-minute timer for streaming break scenes",
    href: "/brb",
    iframe: "/e/countdown?duration=300&theme=streaming&bg=transparent&message=Back+in+5+minutes",
  },
  {
    name: "Sale Countdown",
    description: "Flash-sale urgency banner for Shopify product pages",
    href: "/embed/shopify",
    iframe: "/e/countdown?duration=3600&label=Sale+ends&theme=dark&accent=%23ff3b3b",
  },
  {
    name: "Classroom Timer",
    description: "Projected activity timer for transitions and tests",
    href: "/productivity/classroom",
    iframe: "/e/countdown?duration=600&label=Silent+work&theme=classroom",
  },
];

const PLATFORM_GUIDES = [
  { name: "WordPress", href: "/embed/wordpress", description: "Block Editor, Classic Editor, Elementor, Gutenberg" },
  { name: "Shopify", href: "/embed/shopify", description: "Product pages, Custom Liquid, theme sections" },
  { name: "Notion", href: "/embed/notion", description: "Embed block, paste-as-embed, sizing tips" },
];

export default function EmbedHubContent() {
  const [type_id, set_type_id] = useState<string>("countdown");
  const [duration_seconds, set_duration_seconds] = useState<number>(300);
  const [label, set_label] = useState<string>("Lunch break");
  const [theme, set_theme] = useState<ThemeOption>("auto");
  const [accent, set_accent] = useState<string>("#E8613C");
  const [autostart, set_autostart] = useState<boolean>(false);
  const [copied, set_copied] = useState<boolean>(false);

  const timer_type = useMemo(
    () => TIMER_TYPES.find((t) => t.id === type_id) ?? TIMER_TYPES[0],
    [type_id],
  );

  const embed_path = useMemo(() => {
    const sp = new URLSearchParams();
    if (timer_type.default_param) {
      sp.set(timer_type.default_param, String(duration_seconds));
    }
    if (label) sp.set("label", label);
    if (theme !== "auto") sp.set("theme", theme);
    if (accent && accent !== "#E8613C") sp.set("accent", accent);
    if (autostart) sp.set("autostart", "1");
    const qs = sp.toString();
    return `/e/${timer_type.id}${qs ? `?${qs}` : ""}`;
  }, [timer_type, duration_seconds, label, theme, accent, autostart]);

  const iframe_code = useMemo(() => {
    return `<iframe src="https://gotimer.org${embed_path}"
  width="100%" height="320" frameborder="0"
  allow="autoplay" loading="lazy"
  style="border-radius:12px;border:0;max-width:480px;"></iframe>`;
  }, [embed_path]);

  const copy_iframe = useCallback(() => {
    navigator.clipboard
      .writeText(iframe_code)
      .then(() => {
        set_copied(true);
        setTimeout(() => set_copied(false), 2000);
      })
      .catch(() => {});
  }, [iframe_code]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4">
        {/* Hero */}
        <section className="w-full max-w-4xl mx-auto pt-6 pb-2">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">Embed Widgets</span>
          </nav>
          <h1 className="font-headline font-black text-3xl md:text-5xl text-foreground tracking-tight">
            Embed a Countdown Timer on Your Website
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Free iframe embed for every GoTimer — countdown, Pomodoro, chess
            clock, round timer, stopwatch. Configure below, copy the iframe,
            paste anywhere. No signup, no account.
          </p>
        </section>

        {/* Configurator + Live preview */}
        <section className="w-full max-w-5xl mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configurator */}
            <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-6 space-y-5">
              <h2 className="font-headline font-bold text-xl text-foreground">
                Configure your embed
              </h2>

              {/* Timer type */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                  Timer type
                </label>
                <select
                  value={type_id}
                  onChange={(e) => {
                    const next = TIMER_TYPES.find((t) => t.id === e.target.value);
                    set_type_id(e.target.value);
                    if (next) {
                      set_label(next.example_label);
                      if (next.default_value) {
                        set_duration_seconds(parseInt(next.default_value, 10));
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
                >
                  {TIMER_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              {timer_type.default_param && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={604800}
                    value={duration_seconds}
                    onChange={(e) =>
                      set_duration_seconds(Math.max(1, parseInt(e.target.value, 10) || 0))
                    }
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm font-mono text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>
              )}

              {/* Label */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                  Label
                </label>
                <input
                  type="text"
                  value={label}
                  maxLength={80}
                  onChange={(e) => set_label(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
                />
              </div>

              {/* Theme */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                  Theme
                </label>
                <div className="flex gap-2">
                  {(["auto", "light", "dark"] as ThemeOption[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set_theme(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        theme === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent + Autostart */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                    Accent
                  </label>
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => set_accent(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer border border-surface-container-high"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autostart}
                      onChange={(e) => set_autostart(e.target.checked)}
                      className="w-4 h-4 rounded accent-secondary"
                    />
                    <span className="text-sm text-foreground">Auto-start</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-6">
              <h2 className="font-headline font-bold text-xl text-foreground mb-4">
                Live preview
              </h2>
              <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-center min-h-[420px]">
                <iframe
                  key={embed_path}
                  src={embed_path}
                  width="100%"
                  height="420"
                  style={{ border: 0, borderRadius: 8, maxWidth: 420 }}
                  title="Embed preview"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                What your visitors will see. A small &quot;GoTimer.org&quot;
                link sits in the corner — backlinks are how we keep this
                free.
              </p>
            </div>
          </div>

          {/* Copy iframe */}
          <div className="mt-6 bg-card rounded-2xl shadow-[var(--shadow-soft)] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline font-bold text-lg text-foreground">
                Copy this iframe
              </h2>
              <button
                onClick={copy_iframe}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy iframe
                  </>
                )}
              </button>
            </div>
            <pre className="bg-primary text-primary-foreground rounded-xl p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {iframe_code}
            </pre>
            <p className="mt-3 text-xs text-muted-foreground">
              Paste into any HTML editor, &quot;custom code&quot; block, or
              WordPress / Shopify / Notion embed widget.
            </p>
          </div>
        </section>

        {/* Templates */}
        <section className="w-full max-w-5xl mx-auto py-10">
          <h2 className="font-headline font-bold text-2xl text-foreground mb-6">
            Pre-built embed templates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <div
                key={t.iframe}
                className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-5 flex flex-col"
              >
                <h3 className="font-headline font-bold text-lg text-foreground">
                  {t.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  {t.description}
                </p>
                <div className="bg-surface-container-low rounded-lg p-2 mb-3 min-h-[320px] flex items-center justify-center overflow-hidden">
                  <iframe
                    src={t.iframe}
                    width="100%"
                    height="320"
                    style={{ border: 0, borderRadius: 6 }}
                    title={`${t.name} preview`}
                    loading="lazy"
                  />
                </div>
                <Link
                  href={t.href}
                  className="text-xs text-secondary underline underline-offset-2 hover:text-foreground transition-colors mt-auto"
                >
                  Configure this template →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Platform guides */}
        <section className="w-full max-w-4xl mx-auto py-10">
          <h2 className="font-headline font-bold text-2xl text-foreground mb-6">
            Platform-specific install guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLATFORM_GUIDES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group block bg-card rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5"
              >
                <h3 className="font-headline font-bold text-lg text-foreground group-hover:text-secondary transition-colors">
                  {p.name} →
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Other builders (Squarespace, Wix, Webflow, Ghost, plain HTML) all
            accept iframe embeds — paste the markup above into any &quot;custom
            HTML&quot; or &quot;embed code&quot; block.
          </p>
        </section>

        {/* SEO body */}
        <section className="w-full py-10 md:py-12 px-4 bg-surface">
          <div className="max-w-3xl mx-auto seo-prose space-y-4 text-sm text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-headline [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3">
            <h2>What this embed is for</h2>
            <p>
              You want a working countdown, Pomodoro, or event timer inside
              someone else&apos;s page — your blog, your venue site, your
              Shopify product page, your Notion doc, your OBS scene. Hard to do
              with native HTML alone (no <code>&lt;timer&gt;</code> element
              exists). Easy to do with an iframe pointed at GoTimer&apos;s
              embed URL. That&apos;s what this page builds.
            </p>

            <h2>How the embed URL works</h2>
            <p>
              Every embed lives at{" "}
              <code>https://gotimer.org/e/&lt;timer-type&gt;?…params…</code>.
              The timer type is one of <code>countdown</code>,{" "}
              <code>interval</code> (Pomodoro), <code>chess-clock</code>,{" "}
              <code>round-timer</code>, <code>stopwatch</code>, or the others
              listed at <Link href="/docs/embed">/docs/embed</Link>. URL
              parameters customise everything: <code>duration=300</code> sets
              5 minutes; <code>theme=dark</code> switches to dark mode;{" "}
              <code>accent=%23ff3b3b</code> changes the ring color (URL-encoded
              hex); <code>autostart=1</code> starts immediately on load.
            </p>
            <p>
              The iframe URL is the &quot;source of truth&quot; — anything you
              can configure in the builder above is also expressible as URL
              parameters, so people who already know the syntax can skip the
              builder and just type the URL.
            </p>

            <h2>Why iframe and not a script tag?</h2>
            <p>
              An iframe sandbox guarantees the embed can&apos;t read or modify
              the parent page&apos;s DOM or cookies — important for sites
              embedding third-party widgets. Script-tag embeds give the widget
              full access to your page; iframes don&apos;t. The trade-off is
              that iframes can&apos;t auto-resize to fit content. GoTimer
              embeds work around this by posting a{" "}
              <code>{`{ source: 'gotimer', type: 'resize', height }`}</code>{" "}
              message to the parent window — if your page listens for it, you
              can resize the iframe dynamically. See{" "}
              <Link href="/docs/embed">/docs/embed</Link> for the resizer
              snippet.
            </p>

            <h2>Customisation options</h2>
            <ul>
              <li>
                <strong>Theme</strong> — <code>auto</code> (matches visitor&apos;s
                OS), <code>light</code>, <code>dark</code>, or special modes
                like <code>classroom</code> (oversized for projectors) and{" "}
                <code>streaming</code> (transparent background for OBS).
              </li>
              <li>
                <strong>Accent color</strong> — any hex value, e.g.{" "}
                <code>accent=%23d4af37</code> (gold for weddings) or{" "}
                <code>accent=%23ff3b3b</code> (red for sale urgency).
              </li>
              <li>
                <strong>Font</strong> — any Google Font name, e.g.{" "}
                <code>font=Orbitron</code> for a streaming overlay,{" "}
                <code>font=Playfair+Display</code> for a wedding page.
              </li>
              <li>
                <strong>Background</strong> — <code>bg=transparent</code> (OBS)
                or any hex like <code>bg=%23112233</code>.
              </li>
              <li>
                <strong>Messages</strong> — <code>message=Doors+open</code>{" "}
                while running and <code>expired_message=Show+starting</code>{" "}
                when the timer hits zero.
              </li>
              <li>
                <strong>Controls</strong> — <code>controls=full</code> (default),{" "}
                <code>controls=minimal</code> (start/pause only), or{" "}
                <code>controls=none</code> (display-only, useful for a wedding
                date you don&apos;t want visitors to mess with).
              </li>
            </ul>

            <h2>Where to put the &quot;Powered by GoTimer&quot; attribution</h2>
            <p>
              It&apos;s automatic — every free embed shows a small attribution
              link in the corner. It opens GoTimer in a new tab when clicked.
              You don&apos;t add anything; it&apos;s baked into the iframe
              render. If you want it removed entirely, that will land as a paid
              tier in the future. Today, the attribution is the price.
            </p>

            <h2>Site builders this is tested with</h2>
            <p>
              WordPress (Block Editor, Classic Editor, Elementor, Beaver
              Builder, Divi, Gutenberg), Shopify (Custom Liquid section,
              app-block themes, product page templates), Notion (Embed block),
              Squarespace (Code Block, page-level injection), Wix (HTML Embed
              widget), Webflow (Embed component), Ghost (HTML card), Google
              Sites (Embed → Embed code), Confluence, Jira, Slack canvases,
              plain HTML pages. If your editor has a &quot;custom HTML&quot;
              option, this works.
            </p>

            <h2>Why GoTimer offers free embeds at all</h2>
            <p>
              The attribution link is a backlink to GoTimer, and backlinks are
              how new sites get found on Google. Every embed across the
              internet is one more pointer back. It&apos;s a fair trade — you
              get a free, working timer with no signup; we get a small, opt-in
              piece of distribution. If your use case needs the attribution
              gone (a wedding site, a paid event landing), the paid tier is
              coming. In the meantime, the free version is genuinely free.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <FaqAccordion items={EMBED_HUB_FAQ} title="Embed Widget FAQ" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
