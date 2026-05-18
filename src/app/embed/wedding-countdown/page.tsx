import React from "react";
import Link from "next/link";
import {
  build_embed_breadcrumb_ld,
  build_embed_faq_ld,
  build_embed_metadata,
  build_embed_web_app_ld,
} from "@/lib/embed-schema";
import { EmbedLandingShell } from "@/components/embed/embed-landing-shell";
import { IframeShowcase } from "@/components/embed/iframe-showcase";

export const metadata = build_embed_metadata("wedding-countdown", {
  title: "Free Wedding Countdown Widget for Your Website — Customizable",
  description:
    "Free embeddable wedding countdown timer with custom date, names, accent color, and theme. Paste the iframe into Squarespace, Wix, WordPress, Notion — any wedding website builder.",
});

const FAQ = [
  {
    question: "Will the countdown stay accurate after my visitors refresh the page?",
    answer:
      "Yes. The embed encodes your wedding date in the URL, so every page load recalculates &quot;time remaining&quot; from the visitor&apos;s clock. No server polling, no drift, accurate down to the second across timezones (the date is interpreted in the visitor&apos;s local timezone unless you pass <code>tz</code>).",
  },
  {
    question: "Does the widget work on Squarespace, Wix, and The Knot?",
    answer:
      "Squarespace (Code Block), Wix (HTML iFrame / Embed widget), Webflow (Embed component), Zola, Joy, Minted, WeddingWire, and any builder that allows custom HTML or iframe blocks all work. The Knot&apos;s default editor doesn&apos;t allow custom HTML on the free tier — you&apos;ll need a paid plan or a self-hosted wedding site for that one.",
  },
  {
    question: "Can I customise the names and colors?",
    answer:
      "Yes — both via URL parameters. <code>label=Sarah+%26+Alex</code> displays the names; <code>accent=%23d4af37</code> sets the ring to gold (URL-encoded hex). Use the configurator on <a href=\"/embed\">/embed</a> to preview live, or copy the iframe markup from this page and edit the URL params by hand.",
  },
  {
    question: "Can I use a Google Font like Playfair Display?",
    answer:
      "Yes. Add <code>font=Playfair+Display</code> (URL-encoded with <code>+</code> for spaces) to the iframe URL. Any Google Font name works. The embed lazy-loads the font from Google so no setup needed on your wedding site.",
  },
  {
    question: "Is the &quot;Powered by GoTimer&quot; attribution removable?",
    answer:
      "Not on the free tier. A paid no-watermark tier is on the roadmap and likely the right choice for a wedding site, where brand purity matters more than for, say, an OBS scene. In the meantime, the attribution is small and corner-positioned.",
  },
  {
    question: "What happens when the countdown reaches zero?",
    answer:
      "By default the embed displays &quot;00:00:00&quot; with a celebratory ring fill. You can pass <code>expired_message=Welcome</code> to show custom text once the date arrives — useful if you want the embed to switch to a welcome message on the wedding day itself.",
  },
];

const RELATED = [
  {
    name: "Event Countdown Embed",
    href: "/embed/event-countdown",
    description: "Generic event countdown for conferences, launches, and webinars.",
  },
  {
    name: "Embed Widget Hub",
    href: "/embed",
    description: "All timer types, full configurator, more templates.",
  },
  {
    name: "Custom Countdown Timer",
    href: "/countdown",
    description: "Build a one-off countdown for a date or duration.",
  },
];

const WEBAPP_LD = build_embed_web_app_ld({
  name: "Free Wedding Countdown Widget",
  url_path: "/embed/wedding-countdown",
  description:
    "Free embeddable wedding countdown widget with custom names, accent color, and Google Fonts. Paste an iframe into Squarespace, Wix, Webflow, WordPress, or any HTML editor.",
  features: [
    "Date-locked countdown to your wedding day",
    "Custom names in the label",
    "Custom accent color (hex)",
    "Google Fonts via URL parameter",
    "Light, dark, or auto theme",
    "Works in Squarespace, Wix, Webflow, WordPress, Notion",
    "No signup, no account",
  ],
});

const BREADCRUMB_LD = build_embed_breadcrumb_ld([
  { name: "Wedding Countdown", path: "/embed/wedding-countdown" },
]);

const FAQ_LD = build_embed_faq_ld(FAQ);

const EMBED_PATH =
  "/e/countdown?duration=2592000&label=Sarah+%26+Alex&theme=light&accent=%23d4af37&font=Playfair+Display";

export default function Page() {
  const ld_blocks = [WEBAPP_LD, BREADCRUMB_LD, FAQ_LD];
  return (
    <>
      {ld_blocks.map((block, i) => (
        <script
          key={`ld-${i}`}
          type="application/ld+json"
          // Static, sanitized JSON-LD object — safe to inline.
          // skipcq: JS-0440
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <EmbedLandingShell
        title="Wedding Countdown Widget"
        intro="Free, customisable countdown to your wedding day. Paste an iframe into Squarespace, Wix, WordPress, Webflow — any website builder that accepts custom HTML. Custom names, accent color, and Google Fonts via URL."
        crumbs={[{ name: "Wedding Countdown" }]}
        showcase={
          <IframeShowcase
            embed_path={EMBED_PATH}
            footnote='Edit "Sarah+%26+Alex" and the duration in the iframe URL to set your own names and wedding date.'
          />
        }
        faq={FAQ}
        related={RELATED}
      >
        <h2>How to use this on your wedding website</h2>
        <ol>
          <li>
            Copy the iframe markup above (or build a different one on{" "}
            <Link href="/embed">/embed</Link>).
          </li>
          <li>
            Open your wedding site editor and find the &quot;custom HTML&quot;,
            &quot;embed code&quot;, or &quot;iframe&quot; block. On Squarespace
            it&apos;s called <strong>Code Block</strong>; on Wix it&apos;s{" "}
            <strong>HTML iFrame</strong>; on Webflow it&apos;s the{" "}
            <strong>Embed component</strong>.
          </li>
          <li>
            Paste the markup, swap the <code>label=…</code> for your names, and
            replace the <code>duration=2592000</code> (30 days in seconds) with
            seconds-until-your-wedding. For most weddings you&apos;ll do that
            once and never touch it again.
          </li>
          <li>
            Save and preview. The countdown ticks down in real time for every
            visitor.
          </li>
        </ol>

        <h2>Computing seconds until your wedding</h2>
        <p>
          Quick formulas:
        </p>
        <ul>
          <li>
            <strong>30 days</strong>: <code>2592000</code>
          </li>
          <li>
            <strong>60 days</strong>: <code>5184000</code>
          </li>
          <li>
            <strong>90 days</strong>: <code>7776000</code>
          </li>
          <li>
            <strong>180 days (6 months)</strong>: <code>15552000</code>
          </li>
          <li>
            <strong>365 days (1 year)</strong>: <code>31536000</code>
          </li>
          <li>
            <strong>Custom</strong>: in your browser console type{" "}
            <code>Math.floor((new Date(&apos;2027-06-15T16:00&apos;) - Date.now()) / 1000)</code>{" "}
            — paste the resulting number into the URL.
          </li>
        </ul>
        <p>
          A future version will accept <code>date=YYYY-MM-DD</code> directly so
          this calculation goes away. For now, the seconds value &quot;freezes&quot;
          when you set it — the embed counts down from that moment in real
          time, so it stays accurate.
        </p>

        <h2>Color palettes that match common wedding themes</h2>
        <ul>
          <li>
            <strong>Champagne &amp; gold</strong>: <code>accent=%23d4af37</code>{" "}
            (gold), pair with <code>theme=light</code>.
          </li>
          <li>
            <strong>Romantic blush</strong>: <code>accent=%23e8b4b8</code>,{" "}
            <code>theme=light</code>.
          </li>
          <li>
            <strong>Classic black-tie</strong>: <code>accent=%23ffffff</code>,{" "}
            <code>theme=dark</code>, <code>bg=%23111111</code>.
          </li>
          <li>
            <strong>Garden / forest</strong>:{" "}
            <code>accent=%2334a56e</code>, <code>theme=light</code>.
          </li>
          <li>
            <strong>Beachside teal</strong>:{" "}
            <code>accent=%2300a0a8</code>, <code>theme=light</code>.
          </li>
          <li>
            <strong>Burgundy autumn</strong>:{" "}
            <code>accent=%23800020</code>, <code>theme=dark</code>,{" "}
            <code>bg=%23fefaf5</code>.
          </li>
        </ul>

        <h2>Font pairings</h2>
        <p>
          The embed accepts any Google Font name via <code>font=</code>. A few
          combinations that feel wedding-appropriate:
        </p>
        <ul>
          <li>
            <code>font=Playfair+Display</code> — classic serif, pairs with most
            invitation suites.
          </li>
          <li>
            <code>font=Cormorant+Garamond</code> — refined serif, elegant
            italic glyphs.
          </li>
          <li>
            <code>font=Italiana</code> — high-contrast art-deco serif.
          </li>
          <li>
            <code>font=Great+Vibes</code> — formal script, good for the names
            but harder to read at small sizes.
          </li>
          <li>
            <code>font=Cinzel</code> — capitals-only Roman serif, dramatic.
          </li>
        </ul>

        <h2>Common edge cases</h2>
        <ul>
          <li>
            <strong>Timezone</strong> — by default the countdown is computed
            from the visitor&apos;s local time. For an event that&apos;s
            timezone-anchored (e.g., the ceremony starts at 4:00 PM in
            Bali regardless of where the visitor is), use the wall-clock
            number of seconds from now until the event in Bali — visitors in
            Tokyo will see the countdown adjusted to their wall clock.
          </li>
          <li>
            <strong>After the wedding</strong> — once the timer hits zero it
            shows the expired state (or your custom <code>expired_message</code>).
            For a permanent &quot;we&apos;re married!&quot; banner, swap the
            iframe out for a static image after the day.
          </li>
          <li>
            <strong>Mobile sizing</strong> — set <code>width=&quot;100%&quot;</code>
            on the iframe (already done in the markup above) and the timer
            will scale to your wedding site&apos;s content column.
          </li>
        </ul>
      </EmbedLandingShell>
    </>
  );
}
