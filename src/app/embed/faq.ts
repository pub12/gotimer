/**
 * Embed hub FAQ — kept in a plain TS file so both the server `page.tsx`
 * (which builds the FAQPage JSON-LD) and the client `content.tsx` (which
 * renders the accordion) can import it. Importing arrays out of a
 * `"use client"` file produces a server-side proxy that isn&apos;t a real
 * array, which breaks `.map()` in the JSON-LD builder.
 */

export const EMBED_HUB_FAQ = [
  {
    question: "Is the embed free? Do I need a GoTimer account?",
    answer:
      "Yes, free. No signup, no account, no email required. Paste the iframe URL into your site and the timer renders immediately. A small &quot;Powered by GoTimer&quot; link sits in the corner — that&apos;s the only condition.",
  },
  {
    question: "Can I remove the &quot;Powered by GoTimer&quot; attribution?",
    answer:
      "Not on the free tier — the attribution is what funds the free service (every embed acts as a backlink to GoTimer, which is how the site earns its visibility). A paid tier to remove the watermark is on the roadmap; in the meantime the attribution is intentionally small and unobtrusive.",
  },
  {
    question: "Which website builders does the iframe work in?",
    answer:
      "Any builder that accepts an HTML embed or iframe block: WordPress (Custom HTML block, Elementor HTML widget), Shopify (Custom Liquid section), Squarespace (Code Block), Wix (HTML Embed), Webflow (Embed component), Ghost (HTML card), Notion (Embed block), Google Sites (Embed → Embed code), Confluence, Jira, plain HTML pages, Slack canvases, and so on. If your editor has a &quot;custom HTML&quot; or &quot;embed&quot; option, this will work.",
  },
  {
    question: "Will the embed work in OBS Studio for streamers?",
    answer:
      "Yes — add the iframe URL as a Browser Source in OBS. Use <code>?theme=streaming&bg=transparent</code> for a transparent background that composites over your scene cleanly. See <a href=\"/brb\">the BRB overlay hub</a> for OBS-tuned presets.",
  },
  {
    question: "Does the timer keep running if a visitor refreshes the page?",
    answer:
      "Yes. Pass <code>started=&lt;ISO timestamp&gt;</code> as a URL parameter and the embed offsets the remaining duration by elapsed time on each page load. If you want a fixed future date (wedding, product launch), use a date-based embed instead — see the Wedding Countdown landing page.",
  },
  {
    question: "Can the timer auto-start when the page loads?",
    answer:
      "Yes — add <code>?autostart=1</code> to the URL. Useful for landing-page countdowns and classroom timers projected at the start of an activity.",
  },
  {
    question: "Does the embed track visitors or send analytics to GoTimer?",
    answer:
      "No personal data is collected from embed visitors. GoTimer fires anonymous aggregate counters (embed view, theme used) so we can see which embeds are popular, but no cookies, no IP storage, no fingerprinting on the embed iframe itself. The parent page&apos;s own analytics are unaffected.",
  },
  {
    question: "What if my site has a strict Content Security Policy?",
    answer:
      "The embed runs in an iframe sandbox — your CSP needs to allow <code>frame-src https://gotimer.org</code>. Most permissive default CSPs already allow this. If you see a blank iframe, check your browser&apos;s console for a CSP violation.",
  },
];
