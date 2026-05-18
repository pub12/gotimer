import React from "react";
import Link from "next/link";
import {
  build_embed_breadcrumb_ld,
  build_embed_faq_ld,
  build_embed_howto_ld,
  build_embed_metadata,
  build_embed_web_app_ld,
} from "@/lib/embed-schema";
import { EmbedLandingShell } from "@/components/embed/embed-landing-shell";
import { IframeShowcase } from "@/components/embed/iframe-showcase";

export const metadata = build_embed_metadata("shopify", {
  title: "Free Shopify Countdown Timer — Embed on Any Product Page",
  description:
    "Free embeddable countdown timer for Shopify product pages, collection pages, and homepage banners. No app install — paste an iframe via Custom Liquid or Theme Editor. Works on every Shopify theme.",
});

const FAQ = [
  {
    question: "Do I need a Shopify app to use this?",
    answer:
      "No. The countdown is a plain iframe — every Shopify theme supports custom HTML via the Custom Liquid section type (Online Store 2.0 themes) or via direct theme code edits. No app, no monthly fee, no theme lock-in.",
  },
  {
    question: "Will it work on Dawn, Sense, Refresh, and other Online Store 2.0 themes?",
    answer:
      "Yes — and on every legacy theme too. OS 2.0 themes give you the easiest path because you can drag a Custom Liquid block into any section without editing theme code. For non-OS-2.0 themes, paste the iframe into <code>product.liquid</code> or your theme&apos;s template file.",
  },
  {
    question: "Can I use this for a flash sale countdown that auto-resets per visit?",
    answer:
      "Set <code>duration=3600</code> (1 hour) and the timer counts down 1 hour from each visitor&apos;s page load. For a hard-deadline sale where every visitor sees the same end moment, compute the seconds-until-sale-ends and bake that into the iframe URL; on the sale-end day swap to an &quot;expired&quot; banner.",
  },
  {
    question: "Will the embed slow my Shopify store?",
    answer:
      "Minimal — the iframe is lazy-loaded (the markup includes <code>loading=&quot;lazy&quot;</code>), so it only requests the embed when the visitor scrolls to it. No impact on Shopify&apos;s online-store speed score for above-the-fold sections.",
  },
  {
    question: "Can I make every product page have its own countdown automatically?",
    answer:
      "Yes — use a Shopify metafield. Add a <code>launch_date</code> metafield to the product, then in your product template read the metafield and inject the seconds-remaining into the iframe URL. Example Liquid: <code>{% assign secs = product.metafields.custom.launch_date | date: &quot;%s&quot; | minus: &quot;now&quot; | date: &quot;%s&quot; %}</code> followed by the iframe with <code>duration={% raw %}{{ secs }}{% endraw %}</code>.",
  },
  {
    question: "Does this satisfy Shopify Plus / B2B store requirements?",
    answer:
      "Yes — the iframe is just HTML, with no Shopify app permissions, no customer-data access, no checkout interference. Suitable for B2B catalogs and Shopify Plus stores with strict review policies.",
  },
];

const RELATED = [
  {
    name: "Event Countdown Embed",
    href: "/embed/event-countdown",
    description: "Generic event countdown — useful for sales and product drops.",
  },
  {
    name: "Embed on WordPress",
    href: "/embed/wordpress",
    description: "Same iframe, WordPress-specific install steps.",
  },
  {
    name: "Embed Widget Hub",
    href: "/embed",
    description: "Live configurator with preview.",
  },
];

const WEBAPP_LD = build_embed_web_app_ld({
  name: "Shopify Countdown Timer",
  url_path: "/embed/shopify",
  description:
    "Free embeddable countdown timer for Shopify product pages, collections, and homepage banners. Works on Dawn, Sense, Refresh, and every other Online Store 2.0 theme. No app install required.",
  features: [
    "Native iframe — no Shopify app required",
    "Custom Liquid section on Online Store 2.0 themes",
    "Direct template injection for legacy themes",
    "Metafield-driven per-product countdowns",
    "Lazy-loaded — minimal speed-score impact",
    "Works on Shopify Plus and B2B catalogs",
    "No signup, no account, no app",
  ],
});

const BREADCRUMB_LD = build_embed_breadcrumb_ld([
  { name: "Shopify", path: "/embed/shopify" },
]);

const FAQ_LD = build_embed_faq_ld(FAQ);

const HOWTO_LD = build_embed_howto_ld({
  name: "How to add a countdown timer to a Shopify product page",
  description:
    "Embed a free GoTimer countdown into any Shopify product page, collection, or homepage in under three minutes — no app, no Shopify Plus required.",
  total_time_iso: "PT3M",
  steps: [
    {
      name: "Configure your countdown",
      text: "Visit gotimer.org/embed, pick countdown type, set duration in seconds, choose theme and accent color, and click Copy iframe.",
      url: "https://gotimer.org/embed",
    },
    {
      name: "Open Shopify Theme Editor",
      text: "In your Shopify admin, go to Online Store → Themes → Customize on your live theme.",
    },
    {
      name: "Add a Custom Liquid section",
      text: "On the product or homepage template, click Add section and choose Custom Liquid (available on all Online Store 2.0 themes).",
    },
    {
      name: "Paste the iframe and save",
      text: "Paste the copied iframe markup into the Custom Liquid content field and click Save. The countdown is now live on every page using that template.",
    },
  ],
});

const EMBED_PATH =
  "/e/countdown?duration=3600&label=Sale+ends&theme=dark&accent=%23ff3b3b";

export default function Page() {
  const ld_blocks = [WEBAPP_LD, BREADCRUMB_LD, FAQ_LD, HOWTO_LD];
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
        title="Shopify Countdown Timer"
        intro="Free iframe embed for Shopify product pages, collection pages, and homepage banners. No app install, no monthly fee, no theme lock-in. Works on Dawn, Sense, Refresh, and every Online Store 2.0 theme."
        crumbs={[{ name: "Shopify" }]}
        showcase={
          <IframeShowcase
            embed_path={EMBED_PATH}
            footnote="A flash-sale 1-hour countdown — paste this into a Custom Liquid section above your Add to Cart button."
          />
        }
        faq={FAQ}
        related={RELATED}
      >
        <h2>Method 1 — Custom Liquid (Online Store 2.0 themes, recommended)</h2>
        <p>
          If you&apos;re on Dawn, Sense, Refresh, Craft, Crave, Studio, Origin,
          Colorblock, or any 2021+ Shopify theme, this is the fastest path —
          no theme code edits needed.
        </p>
        <ol>
          <li>
            In Shopify admin, go to <strong>Online Store → Themes</strong> and
            click <strong>Customize</strong> on your live theme.
          </li>
          <li>
            From the template dropdown (top center), choose{" "}
            <strong>Products → Default product</strong> (or whichever
            template).
          </li>
          <li>
            On the left sidebar, click <strong>Add section</strong> and select
            <strong> Custom Liquid</strong>.
          </li>
          <li>
            Drag the Custom Liquid section to the position you want (above
            &quot;Add to cart&quot; is the highest-converting spot for sale
            urgency).
          </li>
          <li>
            Paste the iframe markup from above into the section&apos;s{" "}
            <strong>Custom Liquid</strong> content field.
          </li>
          <li>
            Click <strong>Save</strong>. The countdown now appears on every
            product page using that template.
          </li>
        </ol>

        <h2>Method 2 — Direct template injection (legacy themes)</h2>
        <p>
          For pre-OS-2.0 themes (Debut, Brooklyn, Narrative, Boundless, and
          older custom themes):
        </p>
        <ol>
          <li>
            In Shopify admin, go to <strong>Online Store → Themes → Actions →
            Edit code</strong>.
          </li>
          <li>
            In the file tree, open <code>sections/product-template.liquid</code>{" "}
            (or <code>templates/product.liquid</code> on the oldest themes).
          </li>
          <li>
            Find the area where the &quot;Add to cart&quot; button lives. Just
            above it, paste the iframe markup wrapped in a{" "}
            <code>&lt;div&gt;</code>:
          </li>
        </ol>
        <pre>{`<div class="gotimer-sale-countdown">
  <iframe src="https://gotimer.org/e/countdown?duration=3600&label=Sale+ends&theme=dark&accent=%23ff3b3b"
    width="100%" height="320" frameborder="0" loading="lazy"
    style="border-radius:12px;border:0;max-width:480px;"></iframe>
</div>`}</pre>
        <ol start={4}>
          <li>
            Click <strong>Save</strong>. Refresh a product page in another tab
            to confirm.
          </li>
        </ol>

        <h2>Method 3 — Homepage banner (any theme)</h2>
        <ol>
          <li>
            In Theme Editor, switch the template dropdown to{" "}
            <strong>Home page</strong>.
          </li>
          <li>
            Click <strong>Add section</strong> and pick{" "}
            <strong>Custom Liquid</strong>.
          </li>
          <li>Drag it to the top of the page (above the hero slider).</li>
          <li>
            Paste the iframe. For a sticky top banner, wrap it with:
          </li>
        </ol>
        <pre>{`<div style="position:sticky;top:0;z-index:50;background:#111;padding:8px;text-align:center;">
  <iframe src="https://gotimer.org/e/countdown?duration=3600&theme=dark&accent=%23ff3b3b&controls=none"
    width="100%" height="60" frameborder="0" loading="lazy" style="border:0;max-width:600px;"></iframe>
</div>`}</pre>

        <h2>Per-product countdowns via metafield</h2>
        <p>
          If every product has its own launch or sale-end date, drive the
          countdown from a metafield instead of hard-coding the duration.
        </p>
        <ol>
          <li>
            In Shopify admin: <strong>Settings → Custom data → Products</strong>.
          </li>
          <li>
            Add a metafield with namespace <code>custom</code>, key{" "}
            <code>launch_date</code>, type <strong>Date and time</strong>.
          </li>
          <li>
            On each product page, set the launch date in the metafield UI.
          </li>
          <li>
            In your product template (Custom Liquid section or theme code),
            compute seconds remaining and inject into the iframe URL:
          </li>
        </ol>
        <pre>{`{%- assign launch = product.metafields.custom.launch_date -%}
{%- if launch -%}
  {%- assign secs = launch | date: "%s" | minus: "now" | date: "%s" -%}
  {%- if secs > 0 -%}
    <iframe src="https://gotimer.org/e/countdown?duration={{ secs }}&label=Launch+in&theme=dark&accent=%23ff3b3b"
      width="100%" height="320" frameborder="0" loading="lazy"></iframe>
  {%- endif -%}
{%- endif -%}`}</pre>

        <h2>Conversion best-practices for sale countdowns</h2>
        <ul>
          <li>
            <strong>Place it above the buy button</strong>, not below — the
            urgency signal must come before the decision moment.
          </li>
          <li>
            <strong>Use red accent</strong> (<code>accent=%23ff3b3b</code>) and{" "}
            <strong>dark theme</strong> for highest contrast on
            mobile-checkout flows.
          </li>
          <li>
            <strong>Hide the controls</strong> (<code>controls=none</code>) so
            shoppers can&apos;t pause or restart the timer.
          </li>
          <li>
            <strong>Pair with a discount code in the label</strong> — the
            label can repeat the code (<code>label=Code+FLASH+at+checkout</code>).
          </li>
          <li>
            <strong>Don&apos;t fake the countdown</strong> — if the &quot;sale
            ends in 1 hour&quot; resets on every visit, savvy shoppers notice
            and trust drops. Use a real deadline if possible.
          </li>
        </ul>

        <h2>Testing checklist before going live</h2>
        <ul>
          <li>Preview on desktop, tablet, and mobile (Shopify Theme Editor has all three).</li>
          <li>Visit the product page in an incognito window to confirm the embed renders.</li>
          <li>Check that the iframe doesn&apos;t interfere with the Add-to-cart click area on mobile.</li>
          <li>If you use Shopify&apos;s Online Store speed test, run it before and after — the lazy-load attribute should keep the score unchanged.</li>
        </ul>

        <p>
          Looking for a Pomodoro-style timer for a productivity-focused
          product (like a study planner)? Try{" "}
          <Link href="/embed">the embed hub configurator</Link> with timer
          type set to Pomodoro / Interval.
        </p>
      </EmbedLandingShell>
    </>
  );
}
