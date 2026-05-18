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

export const metadata = build_embed_metadata("notion", {
  title: "Notion Countdown Timer — Free Embed for Any Page or Database",
  description:
    "Free embeddable countdown timer for Notion pages, databases, and wikis. Paste the URL into a Notion embed block — no integration setup, no API token, no signup. Pomodoro, sprint, and deadline timers.",
});

const FAQ = [
  {
    question: "Why isn&apos;t there a built-in Notion countdown widget?",
    answer:
      "Notion intentionally keeps its block library narrow. For dynamic content (timers, weather, polls) it ships an Embed block that accepts any iframe URL — that&apos;s the official mechanism for adding non-native widgets. GoTimer&apos;s embed is designed to feel native inside that block.",
  },
  {
    question: "Will the timer keep counting if I close my Notion tab and reopen later?",
    answer:
      "Yes — the countdown is anchored by the iframe URL&apos;s <code>duration</code> parameter, and each page load recomputes time remaining from that anchor. Close and reopen the page: the countdown picks up exactly where the clock says it should be.",
  },
  {
    question: "Can I add multiple timers to the same Notion page?",
    answer:
      "Yes — each Embed block is independent. Add a Pomodoro timer at the top of your daily note, a project countdown in your project hub, a sprint timer on your retro page. Each iframe runs on its own.",
  },
  {
    question: "Will it work in a Notion Team or Enterprise workspace with strict embed policies?",
    answer:
      "Notion&apos;s embed allowlist permits any HTTPS URL by default. Enterprise admins can restrict embeds to a specific domain list — if your workspace blocks <code>gotimer.org</code>, ask your admin to allow it. The embed is purely visual; no data leaves the iframe.",
  },
  {
    question: "Does the embed work on shared / published Notion pages?",
    answer:
      "Yes — when you publish a Notion page to the web (Share → Publish), the iframe renders for all public visitors. The countdown stays accurate because each visitor&apos;s browser computes the remaining time locally.",
  },
  {
    question: "Can I embed a Pomodoro timer instead of a countdown?",
    answer:
      "Yes — use <code>https://gotimer.org/e/interval?work=1500&amp;rest=300&amp;rounds=4</code> for a classic 25/5 Pomodoro. The embed page on <a href=\"/embed\">/embed</a> has a configurator for all timer types — pick &quot;Pomodoro / Interval&quot; and customise the cycle.",
  },
];

const RELATED = [
  {
    name: "Embed on WordPress",
    href: "/embed/wordpress",
    description: "Block Editor / Elementor / Classic Editor walkthroughs.",
  },
  {
    name: "Embed on Shopify",
    href: "/embed/shopify",
    description: "Custom Liquid / Theme Editor instructions.",
  },
  {
    name: "Embed Widget Hub",
    href: "/embed",
    description: "Live configurator with preview.",
  },
  {
    name: "Pomodoro Timer",
    href: "/productivity/pomodoro",
    description: "Standalone Pomodoro — useful as a Notion embed too.",
  },
];

const WEBAPP_LD = build_embed_web_app_ld({
  name: "Notion Countdown Timer Embed",
  url_path: "/embed/notion",
  description:
    "Free embeddable countdown, Pomodoro, and event timer for Notion pages, databases, and wikis. Drop the URL into a Notion Embed block — no integration setup, no API token, no signup.",
  features: [
    "Native Notion Embed block support",
    "Countdown, Pomodoro, sprint, and event timer types",
    "Multiple independent timers per page",
    "Works on shared / published Notion pages",
    "No Notion integration setup required",
    "No signup, no account, no API token",
  ],
});

const BREADCRUMB_LD = build_embed_breadcrumb_ld([
  { name: "Notion", path: "/embed/notion" },
]);

const FAQ_LD = build_embed_faq_ld(FAQ);

const HOWTO_LD = build_embed_howto_ld({
  name: "How to embed a countdown timer in Notion",
  description:
    "Add a free GoTimer countdown or Pomodoro timer to any Notion page using the native Embed block — under one minute, no Notion integration setup.",
  total_time_iso: "PT1M",
  steps: [
    {
      name: "Build the timer URL",
      text: "Visit gotimer.org/embed, pick countdown or Pomodoro, set duration and label, click Copy iframe, then copy just the URL inside the src attribute (or use the URL from this page).",
      url: "https://gotimer.org/embed",
    },
    {
      name: "Add an Embed block in Notion",
      text: "In your Notion page, type /embed and press Enter to insert an Embed block.",
    },
    {
      name: "Paste the timer URL",
      text: "Paste the GoTimer embed URL into the Embed block dialog and click Embed Link. The timer appears inline.",
    },
    {
      name: "Resize the embed",
      text: "Drag the embed's bottom-right handle to resize. For sidebar widgets, narrow it to 50% width; for a full-page Pomodoro, expand to full width.",
    },
  ],
});

const EMBED_PATH =
  "/e/countdown?duration=1500&label=Deep+work&theme=light&accent=%23E8613C";

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
        title="Notion Countdown Timer Embed"
        intro="Free countdown, Pomodoro, sprint, and deadline timer for any Notion page or database. Drop the URL into a Notion Embed block — no integration setup, no API token, no signup."
        crumbs={[{ name: "Notion" }]}
        showcase={
          <IframeShowcase
            embed_path={EMBED_PATH}
            footnote="Copy just the URL (the src=&quot;…&quot; value) and paste it into a Notion Embed block."
          />
        }
        faq={FAQ}
        related={RELATED}
      >
        <h2>How to embed in Notion (30 seconds)</h2>
        <ol>
          <li>
            On the Notion page where you want the timer, type{" "}
            <code>/embed</code> and press <strong>Enter</strong>. Notion
            inserts a blank Embed block with a paste-URL prompt.
          </li>
          <li>
            Paste the GoTimer URL — for the deep-work timer above, paste{" "}
            <code>https://gotimer.org/e/countdown?duration=1500&amp;label=Deep+work</code>{" "}
            (or any embed URL from <Link href="/embed">/embed</Link>).
          </li>
          <li>
            Click <strong>Embed Link</strong>. The timer renders inline.
          </li>
          <li>
            Drag the bottom-right corner to resize. Notion remembers the size
            for that block.
          </li>
        </ol>

        <h2>Best Notion use cases</h2>
        <h3>Daily Pomodoro on your home page</h3>
        <p>
          Add a 25-minute Pomodoro to the top of your Notion home page so it
          starts the moment you sit down. URL:
        </p>
        <pre>{`https://gotimer.org/e/interval?work=1500&rest=300&rounds=4&label=Pomodoro&theme=light&autostart=1`}</pre>

        <h3>Sprint countdown on a project hub</h3>
        <p>
          Two-week sprint? Bake the seconds-remaining into the URL:
        </p>
        <pre>{`https://gotimer.org/e/countdown?duration=1209600&label=Sprint+end&theme=auto&accent=%23ff3b3b`}</pre>

        <h3>Meeting time-box in a meeting notes template</h3>
        <p>
          Add a 30-minute countdown at the top of every meeting note. The
          timer resets when each new instance of the template is opened, since{" "}
          <code>duration</code> is computed from page load.
        </p>
        <pre>{`https://gotimer.org/e/countdown?duration=1800&label=Meeting&theme=light&accent=%230066cc`}</pre>

        <h3>Deadline countdown in a wiki</h3>
        <p>
          Year-end planning page, OKR deadline, conference submission. Compute
          seconds-until-deadline once and embed:
        </p>
        <pre>{`https://gotimer.org/e/countdown?duration=2592000&label=Q4+deadline&theme=dark&accent=%23ff3b3b`}</pre>

        <h2>Sizing tips for Notion</h2>
        <ul>
          <li>
            <strong>Sidebar widget</strong> — drag the embed to ~50% width and{" "}
            ~280px height. The default GoTimer renders cleanly at that size.
          </li>
          <li>
            <strong>Hero header</strong> — full-width, ~400px tall. Pair with
            a covered image above and a heading below.
          </li>
          <li>
            <strong>Inline in body text</strong> — use Notion&apos;s split-view
            layout (drag the embed next to a text block) for a writing
            page with a focus timer beside the prose.
          </li>
          <li>
            <strong>Database card cover</strong> — Notion doesn&apos;t allow
            embeds inside database cards directly, but you can link a page
            inside a database to a full Notion sub-page that contains the
            embed.
          </li>
        </ul>

        <h2>Pomodoro vs. countdown — which to pick for Notion</h2>
        <ul>
          <li>
            <strong>Pomodoro / Interval</strong>: cycles between work and rest
            automatically. Best for daily focus pages. URL pattern:{" "}
            <code>/e/interval?work=1500&amp;rest=300&amp;rounds=4</code>.
          </li>
          <li>
            <strong>Countdown</strong>: counts down once to zero. Best for
            sprint deadlines, OKR end dates, meeting time-boxes. URL pattern:{" "}
            <code>/e/countdown?duration=…</code>.
          </li>
          <li>
            <strong>Stopwatch</strong>: counts up. Best for tracking how long
            something took (a meeting, a writing session, a debug
            investigation). URL pattern: <code>/e/stopwatch</code>.
          </li>
        </ul>

        <h2>Limitations to know about</h2>
        <ul>
          <li>
            <strong>Notion mobile app</strong> — the embed renders inside the
            in-app browser. Some older versions of the Notion app block
            iframes entirely on mobile. The web version (Notion in Chrome /
            Safari on mobile) always works.
          </li>
          <li>
            <strong>Synced blocks</strong> — embeds inside a Notion synced
            block render in all locations the synced block appears, but each
            instance is independent (no shared state). Useful if you want the
            same timer config in five workspace areas.
          </li>
          <li>
            <strong>Published Notion pages</strong> — the embed shows up for
            public visitors of the published page; same iframe, same
            countdown. Notion sometimes lazy-loads embeds aggressively on
            published pages, so the first paint may show a loading skeleton
            for a fraction of a second.
          </li>
        </ul>

        <p>
          For more advanced embed options (themes, accent colors, fonts,
          messages), use <Link href="/embed">the embed configurator</Link>{" "}
          with the live preview — everything you can configure there is
          embeddable in Notion the same way.
        </p>
      </EmbedLandingShell>
    </>
  );
}
