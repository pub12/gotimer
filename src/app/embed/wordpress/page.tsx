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

export const metadata = build_embed_metadata("wordpress", {
  title: "Embed a Countdown Timer in WordPress — Free, No Plugin Needed",
  description:
    "Step-by-step guide to embedding a free countdown timer in WordPress (Block Editor, Classic Editor, Elementor, Beaver Builder, Divi, Gutenberg). Paste an iframe — no plugin install.",
});

const FAQ = [
  {
    question: "Do I need to install a WordPress plugin for the countdown to work?",
    answer:
      "No. The embed is a plain iframe, which every WordPress editor supports natively via the Custom HTML block (Gutenberg) or HTML widget (Elementor / Beaver Builder / Divi). Zero plugins, zero PHP edits.",
  },
  {
    question: "Will it work on WordPress.com (the hosted version)?",
    answer:
      "It works on WordPress.com paid plans (Personal and up) which allow Custom HTML. The free WordPress.com tier blocks custom HTML embeds entirely — that&apos;s a hosted-WordPress limitation, not a GoTimer issue. Self-hosted WordPress (WordPress.org) always works.",
  },
  {
    question: "Will the countdown survive the Cloudflare or WP Rocket cache?",
    answer:
      "Yes. The HTML around the iframe gets cached, but the iframe itself loads fresh from gotimer.org on every page view — so the countdown is always live. No cache-busting required.",
  },
  {
    question: "Does the embed slow down my Lighthouse / PageSpeed score?",
    answer:
      "It adds about 40-60 KB of compressed JS (the embed renders client-side). Use <code>loading=&quot;lazy&quot;</code> on the iframe (the markup we generate already includes it) so the embed only loads when the visitor scrolls to it — that keeps your Largest Contentful Paint and Total Blocking Time scores unaffected.",
  },
  {
    question: "Can I add the same countdown to multiple pages?",
    answer:
      "Yes — paste the same iframe markup on as many pages or posts as you want. Each visitor sees the same countdown synced to the visitor&apos;s clock relative to the iframe&apos;s <code>duration</code> anchor.",
  },
  {
    question: "What about ACF, custom fields, or shortcodes?",
    answer:
      "For dynamically computed embeds (e.g., a per-product launch countdown driven by an ACF field), inject the iframe&apos;s <code>duration</code> from a custom field via a small PHP snippet in <code>functions.php</code> or a shortcode plugin. Pseudocode: <code>$seconds = get_field(&apos;launch_seconds&apos;); echo &apos;&lt;iframe src=&quot;https://gotimer.org/e/countdown?duration=&apos; . esc_attr($seconds) . &apos;&quot;&gt;&lt;/iframe&gt;&apos;;</code>",
  },
];

const RELATED = [
  {
    name: "Embed on Shopify",
    href: "/embed/shopify",
    description: "Same iframe, Shopify-specific instructions.",
  },
  {
    name: "Embed in Notion",
    href: "/embed/notion",
    description: "Notion Embed block walkthrough.",
  },
  {
    name: "Embed Widget Hub",
    href: "/embed",
    description: "Configurator with live preview.",
  },
  {
    name: "Wedding Countdown",
    href: "/embed/wedding-countdown",
    description: "Pre-tuned for wedding sites.",
  },
];

const WEBAPP_LD = build_embed_web_app_ld({
  name: "WordPress Countdown Timer Embed",
  url_path: "/embed/wordpress",
  description:
    "Free embeddable countdown timer for WordPress. Works with the Block Editor (Gutenberg), Classic Editor, Elementor, Beaver Builder, and Divi. No plugin installation required.",
  features: [
    "Native iframe — no WordPress plugin needed",
    "Block Editor (Gutenberg) Custom HTML block",
    "Elementor HTML widget",
    "Beaver Builder HTML module",
    "Divi Code module",
    "Cache-friendly (Cloudflare, WP Rocket, W3 Total Cache)",
    "Lazy-loaded — no impact on Lighthouse score",
    "No signup, no account, no plugin",
  ],
});

const BREADCRUMB_LD = build_embed_breadcrumb_ld([
  { name: "WordPress", path: "/embed/wordpress" },
]);

const FAQ_LD = build_embed_faq_ld(FAQ);

const HOWTO_LD = build_embed_howto_ld({
  name: "How to embed a countdown timer in WordPress",
  description:
    "Embed a free GoTimer countdown into any WordPress page or post — Block Editor, Classic Editor, Elementor, or Divi — in under two minutes.",
  total_time_iso: "PT2M",
  steps: [
    {
      name: "Configure the timer",
      text: "Visit gotimer.org/embed, choose timer type, duration, label, theme, and accent color, then click Copy iframe.",
      url: "https://gotimer.org/embed",
    },
    {
      name: "Open the WordPress page or post in edit mode",
      text: "In Block Editor: add a Custom HTML block where the timer should appear. In Elementor: drag in the HTML widget. In Classic Editor: switch to the Text tab. In Divi: drop in a Code module.",
    },
    {
      name: "Paste the iframe markup",
      text: "Paste the copied iframe markup into the HTML field. Do not wrap it in any additional tags — the iframe is self-contained.",
    },
    {
      name: "Preview and publish",
      text: "Hit Preview to confirm the timer renders and counts down. Save or Publish the page. The countdown is live for every visitor.",
    },
  ],
});

const EMBED_PATH =
  "/e/countdown?duration=86400&label=Launch+in&theme=auto&accent=%23E8613C";

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
        title="Embed a Countdown Timer in WordPress"
        intro="Free iframe embed — no plugin install, no PHP edits. Works with the Block Editor (Gutenberg), Classic Editor, Elementor, Beaver Builder, and Divi. Takes about two minutes."
        crumbs={[{ name: "WordPress" }]}
        showcase={
          <IframeShowcase
            embed_path={EMBED_PATH}
            footnote="This is exactly what your visitors will see. Copy the markup and paste it into a Custom HTML block."
          />
        }
        faq={FAQ}
        related={RELATED}
      >
        <h2>Block Editor (Gutenberg)</h2>
        <ol>
          <li>
            Open the page or post in the WordPress admin and click the{" "}
            <strong>+</strong> button to add a new block.
          </li>
          <li>
            Type <strong>HTML</strong> and select <strong>Custom HTML</strong>.
            (It&apos;s under the Formatting category.)
          </li>
          <li>Paste the iframe markup from above into the block.</li>
          <li>
            Click <strong>Preview</strong> in the block toolbar to see the
            timer render. Save the draft.
          </li>
          <li>Publish.</li>
        </ol>

        <h2>Classic Editor</h2>
        <ol>
          <li>Open the page or post.</li>
          <li>
            Click the <strong>Text</strong> tab (top-right of the editor area).
            This switches from the visual editor to the raw-HTML editor.
          </li>
          <li>
            Paste the iframe markup at the cursor position. Do not wrap it in{" "}
            <code>&lt;p&gt;</code> tags — the editor will add paragraph
            wrappers automatically that don&apos;t break the embed.
          </li>
          <li>
            Click <strong>Update</strong> to publish. Switch back to the Visual
            tab to confirm the embed appears (it will display as a small box
            with a placeholder).
          </li>
        </ol>

        <h2>Elementor</h2>
        <ol>
          <li>Edit the page in Elementor.</li>
          <li>
            Drag the <strong>HTML</strong> widget from the left panel onto the
            page.
          </li>
          <li>Paste the iframe markup into the HTML Code field.</li>
          <li>
            Hit <strong>Update</strong> in the bottom-left. The embed renders
            live in the Elementor preview.
          </li>
          <li>
            For sticky / floating placement, wrap the HTML widget in a section
            with Position: Fixed enabled.
          </li>
        </ol>

        <h2>Beaver Builder</h2>
        <ol>
          <li>Open the page in Beaver Builder.</li>
          <li>
            Add an <strong>HTML</strong> module from the Basic Modules tray.
          </li>
          <li>Paste the iframe markup into the HTML field.</li>
          <li>
            Save the row. Beaver Builder renders the embed live in the
            front-end preview.
          </li>
        </ol>

        <h2>Divi</h2>
        <ol>
          <li>Open the page in the Divi Builder.</li>
          <li>
            Click <strong>+</strong> to add a module and choose{" "}
            <strong>Code</strong>.
          </li>
          <li>Paste the iframe markup into the Content field.</li>
          <li>Save changes and exit the builder.</li>
        </ol>

        <h2>Troubleshooting common WordPress embed issues</h2>
        <h3>The iframe shows up blank</h3>
        <p>
          Almost always a caching plugin (WP Rocket, W3 Total Cache,
          LiteSpeed, Cloudflare APO) interfering. Two things to check:
        </p>
        <ul>
          <li>
            Clear the cache after pasting the embed for the first time.
          </li>
          <li>
            Verify your security plugin isn&apos;t adding an aggressive CSP
            header that blocks <code>frame-src</code>. The embed needs{" "}
            <code>frame-src https://gotimer.org</code> allowed (most defaults
            already permit it).
          </li>
        </ul>

        <h3>The Block Editor strips the iframe</h3>
        <p>
          You used a paragraph or heading block instead of Custom HTML. The
          Block Editor sanitises HTML inside text blocks. Use the dedicated
          Custom HTML block.
        </p>

        <h3>The Classic Editor wraps the iframe in &lt;p&gt; tags</h3>
        <p>
          Harmless — the embed still renders. If your theme&apos;s CSS adds
          margin to <code>&lt;p&gt;</code> elements, you may want to wrap the
          iframe in a <code>&lt;div class=&quot;no-margin&quot;&gt;</code>{" "}
          instead.
        </p>

        <h3>Mobile renders the embed too wide</h3>
        <p>
          Set <code>width=&quot;100%&quot;</code> on the iframe (already done
          in our generator) and the embed will scale to the parent
          container&apos;s width. If your theme has a fixed-width content
          column, also set <code>max-width</code> on the iframe&apos;s style.
        </p>

        <h2>Dynamic per-post countdowns with ACF</h2>
        <p>
          For automated workflows — say, every product post has a launch date
          and you want the countdown to drive itself from a custom field — add
          a small snippet to your theme&apos;s <code>functions.php</code>:
        </p>
        <pre>{`function gotimer_countdown_from_acf($atts) {
  $launch_date = get_field('launch_date');
  if (!$launch_date) return '';
  $seconds = max(0, strtotime($launch_date) - time());
  $url = 'https://gotimer.org/e/countdown?duration=' . esc_attr($seconds);
  return '<iframe src="' . $url . '" width="100%" height="320" frameborder="0" loading="lazy"></iframe>';
}
add_shortcode('gotimer_countdown', 'gotimer_countdown_from_acf');`}</pre>
        <p>
          Then drop <code>[gotimer_countdown]</code> into any post template
          and the countdown derives itself from the post&apos;s{" "}
          <code>launch_date</code> custom field.
        </p>

        <h2>Once you have it on one page</h2>
        <p>
          Try the configurator on <Link href="/embed">/embed</Link> for a
          different timer type — Pomodoro for a study blog, chess clock for a
          board-game review site, round timer for a fitness blog. Same iframe
          mechanic, every type supported.
        </p>
      </EmbedLandingShell>
    </>
  );
}
