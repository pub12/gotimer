import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Embed a GoTimer on your site — URL params, iframe sizing, themes",
  description:
    "Every GoTimer URL embeds as an iframe. Customise theme, colors, fonts, watermark, messages, and more via URL parameters. Free. No signup.",
  alternates: { canonical: "https://gotimer.org/docs/embed" },
};

export default function EmbedDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Embed a GoTimer on your site</h1>
      <p>
        Every GoTimer works as an iframe. Grab a URL, paste it into your site,
        the OBS browser source, a Notion embed block, Google Slides, a
        classroom projector — anywhere. All customisation happens via URL
        parameters. No account needed. For a guided builder with live preview,
        visit <Link href="/embed">/embed</Link>.
      </p>

      <h2>Quickstart</h2>
      <pre><code>{`<iframe src="https://gotimer.org/e/countdown?duration=300"
  width="400" height="400" frameborder="0"></iframe>`}</code></pre>

      <p>
        The canonical embed URL is <code>https://gotimer.org/e/&lt;timer-type&gt;?…params…</code>.
        Long-form per-strategy URLs (<code>/countdown/embed</code>,{" "}
        <code>/chess-clock/embed</code>, <code>/round-timer/embed</code>,{" "}
        <code>/stopwatch/embed</code>) still work and are equivalent.
      </p>

      <h2>Parameters</h2>

      <h3>Core</h3>
      <ul>
        <li><code>label</code> — display label, defaults to timer type</li>
        <li><code>controls</code> — <code>full</code> | <code>minimal</code> | <code>none</code></li>
        <li><code>autostart</code> — <code>1</code> starts immediately</li>
        <li><code>started</code> — ISO timestamp; duration is offset by elapsed time</li>
      </ul>

      <h3>Appearance</h3>
      <ul>
        <li><code>theme</code> — <code>auto</code> | <code>light</code> | <code>dark</code> | <code>classroom</code> | <code>streaming</code> | <code>darkroom</code></li>
        <li><code>bg</code> — <code>transparent</code> or a hex colour like <code>%23112233</code></li>
        <li><code>accent</code> — hex colour for the timer ring</li>
        <li><code>font</code> — Google Font name, e.g. <code>Orbitron</code></li>
        <li><code>size</code> — <code>xs</code> | <code>sm</code> | <code>md</code> | <code>lg</code> | <code>xl</code> | <code>full</code></li>
      </ul>

      <h3>Messages</h3>
      <ul>
        <li><code>message</code> — text shown above the timer while running</li>
        <li><code>expired_message</code> — text shown when the timer hits zero</li>
      </ul>

      <h3>Watermark</h3>
      <ul>
        <li><code>branding</code> — <code>full</code> | <code>minimal</code> | <code>corner</code> | <code>hidden</code> (hidden requires <code>pro_token</code>)</li>
      </ul>

      <h2>Platform recipes</h2>

      <h3>OBS / Twitch browser source</h3>
      <pre><code>{`https://gotimer.org/e/countdown?duration=300&theme=streaming&bg=transparent&message=Back+in+5+minutes&branding=corner`}</code></pre>

      <h3>Notion embed block</h3>
      <pre><code>{`https://gotimer.org/e/countdown?duration=1500&label=Pomodoro&theme=light`}</code></pre>

      <h3>Classroom projector</h3>
      <pre><code>{`https://gotimer.org/e/countdown?duration=300&theme=classroom&autostart=1`}</code></pre>

      <h2>Auto-resize for parent pages</h2>
      <p>
        Every GoTimer embed posts <code>{`{ source: 'gotimer', type: 'resize', height }`}</code> to{" "}
        <code>window.parent</code>. Listen for it from the embedding page to
        auto-fit the iframe height to its content:
      </p>
      <pre><code>{`window.addEventListener("message", (e) => {
  if (e.data?.source !== "gotimer" || e.data.type !== "resize") return;
  document.querySelector("iframe.gotimer").style.height = e.data.height + "px";
});`}</code></pre>

      <h2>Platform-specific install guides</h2>
      <ul>
        <li><Link href="/embed/wordpress">WordPress embed guide</Link></li>
        <li><Link href="/embed/shopify">Shopify embed guide</Link></li>
        <li><Link href="/embed/notion">Notion embed guide</Link></li>
        <li><Link href="/embed/wedding-countdown">Wedding countdown widget</Link></li>
        <li><Link href="/embed/event-countdown">Event countdown embed</Link></li>
      </ul>
    </main>
  );
}
