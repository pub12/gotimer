"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FaqAccordion from "@/components/shared/faq-accordion";
import { BrbConfigurator } from "./configurator";
import { BRB_FAQ } from "@/app/brb/faq";

function strip_html(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const PRESETS = [
  {
    name: "Stream Starting Soon",
    href: "/brb/starting-soon",
    blurb: "5-minute pre-stream countdown with a friendly 'starting soon' label",
  },
  {
    name: "Be Right Back",
    href: "/brb/be-right-back",
    blurb: "Quick intermission timer for bio breaks, snack runs, or tech checks",
  },
  {
    name: "Stream Ending",
    href: "/brb/stream-over",
    blurb: "Calm wind-down countdown for raid drops and goodbyes",
  },
  {
    name: "Raid Countdown",
    href: "/brb/raid-countdown",
    blurb: "Short, energetic countdown for outgoing raids and host targets",
  },
];

export function BrbLanding() {
  const faqLdJson = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: BRB_FAQ.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: strip_html(q.answer) },
        })),
      }),
    [],
  );
  return (
    <>
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: faqLdJson }}
      />
      <Navbar />

      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-12 px-3 w-full md:pt-20 md:px-4">
        {/* Breadcrumbs */}
        <div className="max-w-5xl w-full mx-auto">
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
            <span className="text-foreground font-medium">BRB Countdown Overlay</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-5xl w-full mx-auto mb-10">
          <h1 className="font-headline font-black text-3xl md:text-5xl text-foreground mb-3 leading-tight">
            OBS BRB &amp; Starting-Soon Countdown Overlay
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            A transparent countdown overlay for OBS Studio. Configure it entirely
            through the URL — no signup, no watermark, no extension. Paste the URL
            into a Browser Source and stream.
          </p>
        </section>

        {/* Configurator */}
        <section className="max-w-5xl w-full mx-auto mb-12">
          <BrbConfigurator />
        </section>

        {/* Quick Start */}
        <section className="max-w-3xl w-full mx-auto mb-16">
          <h2 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-6">
            Drop it into OBS in 5 steps
          </h2>
          <ol className="space-y-5">
            {QUICK_START_STEPS.map((step, idx) => (
              <li key={step.title} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-secondary text-secondary-foreground font-headline font-bold flex items-center justify-center text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Preset URLs */}
        <section className="max-w-5xl w-full mx-auto mb-16">
          <h2 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-2">
            Pre-built preset URLs
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            If you don&apos;t want to fiddle with the configurator, paste one of
            these straight into OBS. Each is its own scenario-specific page with
            its own URL — easy to bookmark and reuse across stream nights.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESETS.map((preset) => (
              <Link
                key={preset.href}
                href={preset.href}
                className="group block p-5 bg-card rounded-xl shadow-[var(--shadow-soft)] hover:shadow-md transition-all"
              >
                <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors mb-1.5">
                  {preset.name}
                </h3>
                <p className="text-sm text-muted-foreground">{preset.blurb}</p>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Need audio cues that actually fire?{" "}
            <Link href="/brb/sound-cue" className="text-secondary underline">
              Open the companion audio tab
            </Link>{" "}
            in a separate browser window and add it to OBS as an Audio Output
            Capture source.
          </p>
        </section>

        {/* URL parameter reference */}
        <section className="max-w-3xl w-full mx-auto mb-16">
          <h2 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            URL parameter reference
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Every visual setting is a query string parameter. Build URLs by hand
            once you know the spec — handy for chat-bot integrations and stream
            decks.
          </p>
          <div className="overflow-x-auto rounded-xl border border-surface-container-high">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-foreground">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold">Param</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Type</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Default</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Example</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {PARAM_TABLE.map((row) => (
                  <tr key={row.name} className="border-t border-surface-container-high">
                    <td className="px-4 py-2 font-mono text-foreground">{row.name}</td>
                    <td className="px-4 py-2">{row.type}</td>
                    <td className="px-4 py-2 font-mono text-xs">{row.def}</td>
                    <td className="px-4 py-2 font-mono text-xs">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Compatibility */}
        <section className="max-w-3xl w-full mx-auto mb-16">
          <h2 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Compatibility
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The overlay is plain HTML with a transparent background — it works
            with any streaming software that supports a browser source.
            We&apos;ve verified it with{" "}
            <strong>OBS Studio 30.x</strong> on macOS and Windows,{" "}
            <strong>Streamlabs Desktop</strong>, <strong>vMix</strong> (Webpage
            input), and <strong>XSplit Broadcaster</strong> (Webpage source). On
            mobile streaming apps the overlay also loads as a regular webpage,
            but transparency in third-party mobile broadcasters is hit-or-miss
            and typically requires app-specific configuration.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            For OBS, we also recommend listing the overlay in{" "}
            <a
              href="https://obsproject.com/forum/resources/categories/obs-studio.6/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline inline-flex items-center gap-1"
            >
              the official Resources directory
              <ExternalLink className="size-3" />
            </a>{" "}
            so other streamers can discover it through the OBS website itself.
          </p>
        </section>

        {/* Why this one */}
        <section className="max-w-3xl w-full mx-auto mb-16">
          <h2 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Why this overlay, and not the others?
          </h2>
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              There are a dozen browser-source countdown timers floating around
              the streamer ecosystem. Most fall into one of two camps. The first
              camp is the &quot;free with signup&quot; group — StreamElements,
              OWN3D, Streamlabs widgets — which give you a powerful editor but
              also require you to create an account, link your Twitch or
              YouTube, grant OAuth permissions, and accept that your overlay
              URL is now tied to that account&apos;s uptime. The second camp is
              the &quot;single-purpose hobby project&quot; group — a GitHub
              gist, a CodePen, a tutorial repo from 2019 — which works but
              looks visibly dated, has no parameter spec, and offers no FAQ if
              it breaks.
            </p>
            <p>
              This overlay sits in a third lane: free, no signup, no watermark,
              no analytics on the embed URL, and a documented parameter spec
              that you can build URLs against from a chat bot, a stream deck
              macro, or a Discord shortcut. The page is statically generated
              and cached at the edge — if our database goes down, the overlay
              keeps working, because everything the overlay needs is encoded in
              the URL itself.
            </p>
            <p>
              The trade-off is that you don&apos;t get a drag-and-drop visual
              editor with custom fonts and animations. If that&apos;s what you
              need, StreamElements is genuinely the best paid-by-account
              option. But if you want something that just works, has a URL
              short enough to type from memory, and never asks you to log in —
              this is that.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section className="max-w-3xl w-full mx-auto mb-16">
          <h2 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            What we collect (and don&apos;t)
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The bare overlay URL (<code className="font-mono text-xs">/brb?embed=1&amp;…</code>)
            loads no analytics scripts, no cookies, and no third-party tracking
            beacons. We deliberately keep the embedded surface clean so the
            page weight is minimal and there is no chance of a tracker
            flagging in your stream&apos;s outbound traffic. The landing page
            you&apos;re reading right now is a regular website page and follows
            our standard{" "}
            <Link href="/privacy-policy" className="text-secondary underline">
              privacy policy
            </Link>
            .
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl w-full mx-auto">
          <FaqAccordion items={BRB_FAQ} title="OBS BRB Overlay FAQ" />
        </section>
      </main>
      <Footer />
    </>
  );
}

const QUICK_START_STEPS = [
  {
    title: "Generate your URL above",
    body: "Use the configurator at the top of the page to dial in your minutes, label, color, font, size, and alignment. The URL updates live. Click Copy when you're happy.",
  },
  {
    title: "Open OBS Studio and pick a scene",
    body: "Switch to the scene where you want the countdown to appear — typically your 'Starting Soon' or 'BRB' scene, separate from your main camera scene.",
  },
  {
    title: "Add a Browser Source",
    body: "Click the + icon in the Sources panel, choose Browser, give it a name, click OK. In the properties dialog, paste your URL into the URL field. Set Width to 1920 and Height to 1080 (or match your canvas size for a full-screen overlay).",
  },
  {
    title: "Leave Custom CSS empty",
    body: "The overlay already sets a transparent background — you do not need to add any Custom CSS. Older guides recommend adding 'body { background: transparent }' as a precaution; with this overlay it is unnecessary and the page will be fine either way.",
  },
  {
    title: "Position and test",
    body: "Click OK to close the properties dialog. Drag the source to where you want the timer in your scene. The countdown starts automatically (if autostart=1 was in your URL) and will count down to zero. Switch scenes to test that the timer keeps running in the background.",
  },
];

const PARAM_TABLE = [
  { name: "mins", type: "int 0–999", def: "5", example: "?mins=10" },
  { name: "secs", type: "int 0–59", def: "0", example: "?secs=30" },
  { name: "label", type: "string (≤80 chars)", def: "Back soon", example: "?label=Back+at+3PM" },
  { name: "color", type: "hex", def: "ffffff", example: "?color=ffd700" },
  { name: "font", type: "sans/serif/mono", def: "sans", example: "?font=mono" },
  { name: "bg", type: "transparent or hex", def: "transparent", example: "?bg=000000" },
  { name: "size", type: "xl/lg/md", def: "xl", example: "?size=lg" },
  { name: "align", type: "center/left/right", def: "center", example: "?align=left" },
  { name: "pulse", type: "1/0", def: "0", example: "?pulse=1" },
  { name: "autostart", type: "1/0", def: "0", example: "?autostart=1" },
  { name: "embed", type: "1/0", def: "0", example: "?embed=1" },
];
