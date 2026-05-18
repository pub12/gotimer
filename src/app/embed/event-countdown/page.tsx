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

export const metadata = build_embed_metadata("event-countdown", {
  title: "Free Event Countdown Embed — Conferences, Launches, Webinars",
  description:
    "Free embeddable event countdown timer for product launches, conferences, webinars, sales, and ticket-on-sale dates. Paste an iframe into any HTML page. Custom theme, accent, and label.",
});

const FAQ = [
  {
    question: "What kinds of events is this useful for?",
    answer:
      "Product launches, conference start times, webinar countdowns, ticket on-sale dates, Black Friday and Cyber Monday sales, app release dates, course enrollment closing, Kickstarter campaign deadlines, podcast episode drops, livestream start times. Anything with a date that visitors should see ticking down.",
  },
  {
    question: "Does it support a fixed UTC date so visitors in every timezone see the same end time?",
    answer:
      "Pass the number of seconds remaining as <code>duration=N</code> — the visitor&apos;s browser then counts down from page load, so the end moment is wall-clock-consistent worldwide. For a UTC-anchored launch (&quot;9 AM UTC on Friday&quot;), compute the seconds until that UTC moment at the time you set the embed. Future versions will accept <code>iso=2027-06-15T09:00:00Z</code> directly.",
  },
  {
    question: "Can I add urgency styling for sales — bold red ring, flashing under 5 minutes?",
    answer:
      "Set <code>accent=%23ff3b3b</code> for red and <code>theme=dark</code> for a black background. There&apos;s no flashing-under-N-seconds option yet (the standalone <a href=\"/countdown\">countdown page</a> has it via the <code>flash_at</code> parameter; embed support is planned).",
  },
  {
    question: "Does the embed track visitor analytics?",
    answer:
      "No — embed visitors are never tracked individually. GoTimer fires aggregate counters (theme, timer type) for usage analytics but stores no cookies and no IP-level data on the embed iframe. Your page&apos;s own analytics are unaffected.",
  },
  {
    question: "Can I auto-start the countdown the moment the page loads?",
    answer:
      "It always counts down automatically — there&apos;s nothing to start. The <code>autostart=1</code> parameter only matters for Pomodoro and HIIT interval embeds where the timer has an explicit start button.",
  },
  {
    question: "What if my event has a postponement and I need to change the date?",
    answer:
      "Edit the iframe URL — change <code>duration=…</code> to the new remaining seconds and save your page. Visitors will see the updated countdown on next page load. No re-publishing required at GoTimer&apos;s end.",
  },
];

const RELATED = [
  {
    name: "Wedding Countdown Widget",
    href: "/embed/wedding-countdown",
    description: "Same engine, tuned for wedding sites.",
  },
  {
    name: "Sale Countdown on Shopify",
    href: "/embed/shopify",
    description: "Step-by-step add-to-Shopify-product-page guide.",
  },
  {
    name: "Embed on WordPress",
    href: "/embed/wordpress",
    description: "WordPress block / Elementor / Classic Editor instructions.",
  },
  {
    name: "Embed Widget Hub",
    href: "/embed",
    description: "Full configurator with live preview.",
  },
];

const WEBAPP_LD = build_embed_web_app_ld({
  name: "Free Event Countdown Embed",
  url_path: "/embed/event-countdown",
  description:
    "Free embeddable event countdown for product launches, conferences, webinars, and sales. Custom theme, accent color, and label via URL parameters.",
  features: [
    "Auto-counting countdown to an event time",
    "Custom label (event name)",
    "Custom accent color and theme",
    "Optional custom message and expired message",
    "Works in WordPress, Shopify, Notion, Webflow, plain HTML",
    "No signup, no account",
  ],
});

const BREADCRUMB_LD = build_embed_breadcrumb_ld([
  { name: "Event Countdown", path: "/embed/event-countdown" },
]);

const FAQ_LD = build_embed_faq_ld(FAQ);

const EMBED_PATH =
  "/e/countdown?duration=86400&label=Doors+open&theme=auto&accent=%23E8613C";

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
        title="Event Countdown Embed"
        intro="Free embeddable countdown for launches, conferences, webinars, sales, and any other date-driven event. Drop the iframe onto a landing page in two minutes."
        crumbs={[{ name: "Event Countdown" }]}
        showcase={
          <IframeShowcase
            embed_path={EMBED_PATH}
            footnote='Change "Doors+open" to your event name and "duration=86400" (24 hours) to the seconds until your event.'
          />
        }
        faq={FAQ}
        related={RELATED}
      >
        <h2>What this is for</h2>
        <p>
          Product launches, conference start times, webinar &quot;register
          now&quot; pages, Kickstarter campaign deadlines, Black Friday sales,
          app release dates, ticket on-sale moments. Anything with a fixed
          future date where visitors should see urgency ticking down in real
          time. Paste the iframe markup above into your landing page and the
          countdown starts immediately on page load — no setup, no JavaScript
          on your side.
        </p>

        <h2>Pre-baked recipes for common event types</h2>
        <h3>Product launch (8 hours out)</h3>
        <p>
          <code>
            /e/countdown?duration=28800&amp;label=Launch&amp;theme=dark&amp;accent=%23ff3b3b
          </code>
        </p>
        <h3>Webinar (90 minutes out)</h3>
        <p>
          <code>
            /e/countdown?duration=5400&amp;label=Webinar+begins&amp;theme=light&amp;accent=%230066cc
          </code>
        </p>
        <h3>Flash sale (1 hour)</h3>
        <p>
          <code>
            /e/countdown?duration=3600&amp;label=Sale+ends&amp;theme=dark&amp;accent=%23ff3b3b&amp;message=Use+code+FLASH
          </code>
        </p>
        <h3>Conference doors (24 hours)</h3>
        <p>
          <code>
            /e/countdown?duration=86400&amp;label=Doors+open&amp;theme=auto
          </code>
        </p>
        <h3>Kickstarter / Indiegogo campaign close (7 days)</h3>
        <p>
          <code>
            /e/countdown?duration=604800&amp;label=Campaign+ends&amp;accent=%2300a86b
          </code>
        </p>

        <h2>URL parameter reference</h2>
        <ul>
          <li>
            <code>duration</code> — required. Seconds remaining at the time
            you bake the URL into your page. The embed counts down from that
            anchor on every page load.
          </li>
          <li>
            <code>label</code> — text shown above or near the timer.
            URL-encoded (spaces → <code>+</code>, special chars → <code>%XX</code>).
          </li>
          <li>
            <code>theme</code> — <code>auto</code>, <code>light</code>,{" "}
            <code>dark</code>, <code>streaming</code> (transparent for OBS),{" "}
            <code>classroom</code> (oversized text).
          </li>
          <li>
            <code>accent</code> — ring color, hex (<code>%23</code> for{" "}
            <code>#</code>).
          </li>
          <li>
            <code>message</code> — secondary line shown while running.
          </li>
          <li>
            <code>expired_message</code> — text shown when the timer hits
            zero. Default is &quot;00:00:00&quot;; useful when you want the
            timer to switch to something like &quot;Event live now&quot; or{" "}
            &quot;Doors open — head to lobby&quot;.
          </li>
          <li>
            <code>controls</code> — <code>full</code> (default) shows
            pause/restart, <code>none</code> hides them entirely (cleanest for
            a public event countdown where you don&apos;t want random visitors
            messing with it).
          </li>
        </ul>

        <h2>Pairing with a landing page</h2>
        <p>
          For launch landing pages, the countdown is usually the visual anchor
          above the fold. Two practical patterns:
        </p>
        <ol>
          <li>
            <strong>Below the headline, above the email signup</strong> — the
            countdown creates urgency, the signup converts the visitor.
            <code>controls=none</code> keeps the design clean.
          </li>
          <li>
            <strong>Floating banner at the top of the page</strong> — set the
            iframe to <code>height=60</code> and use a compact configuration:{" "}
            <code>/e/countdown?duration=…&amp;theme=dark&amp;accent=%23ff3b3b&amp;controls=none</code>.
            Good for sticky sale-ending bars.
          </li>
        </ol>

        <h2>For event organisers running multiple countdowns</h2>
        <p>
          Each iframe is independent — embed five countdowns on one page if
          you want to show multiple session times. Set distinct{" "}
          <code>label</code> values so visitors can tell them apart. For a
          schedule grid (&quot;Workshop A starts in 1:23:45 / Workshop B
          starts in 2:45:12 / …&quot;), drop one iframe per cell.
        </p>
        <p>
          For larger schedules consider <Link href="/countdown">the standalone
          countdown page</Link> linked as a separate URL per session —
          easier than maintaining a wall of iframes, and each session URL is
          shareable on social.
        </p>
      </EmbedLandingShell>
    </>
  );
}
