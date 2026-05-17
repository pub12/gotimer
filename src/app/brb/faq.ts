/**
 * Canonical FAQ for the /brb hub. Used by:
 *   - layout.tsx — to emit FAQPage JSON-LD
 *   - page.tsx (BrbLanding) — to render the on-page FAQ accordion
 *
 * Keep answers HTML-flavored (the accordion supports inline tags);
 * the schema emitter in layout.tsx strips tags before serialising.
 */
export const BRB_FAQ = [
  {
    question: "Why does my BRB overlay show a black or white background instead of transparent?",
    answer:
      "OBS Browser Source supports CSS transparency natively — the page itself sets <code>html, body { background: transparent }</code>, so you should not need to add any Custom CSS. If you still see a solid background, check three things: (1) your URL contains <code>?embed=1</code> (without it you get the full landing page, not the bare overlay), (2) you have not overridden the background via the <code>bg=</code> query parameter, and (3) in OBS, the Browser Source &gt; Properties &gt; Custom CSS field is empty or only contains <code>body { background: transparent; }</code>. Older guides sometimes recommend adding <code>* { margin: 0; overflow: hidden; }</code> — that is unnecessary here and can occasionally cause clipping at edges.",
  },
  {
    question: "Why doesn't the sound play in OBS?",
    answer:
      "OBS Studio mutes audio from Browser Sources by default — this is a long-standing OBS choice, not a limitation of the overlay. There are two workarounds. <strong>Option 1 (recommended):</strong> open <a href=\"/brb/sound-cue\">our companion audio tab</a> in a separate browser window, then in OBS add an <em>Audio Output Capture</em> source that captures your browser's audio. The audio tab uses the same URL parameters as the overlay so the cue fires at the same moment. <strong>Option 2:</strong> right-click your Browser Source in OBS &gt; Properties &gt; check &quot;Control audio via OBS&quot;. This routes the page's audio into OBS's audio mixer, but it is unreliable on some versions of OBS — the companion tab is more dependable.",
  },
  {
    question: "Will this work with Streamlabs Desktop / vMix / XSplit?",
    answer:
      "Yes. The overlay is plain HTML/CSS with no platform-specific code. Streamlabs Desktop is essentially OBS with a different skin, so all the OBS instructions apply unchanged. vMix supports browser-source URLs natively (HTML5 page templates). XSplit users should use the <em>Webpage</em> source type. In all four cases, set the source width and height to match the area of your scene where you want the timer, set the URL to your generated embed URL, and the transparent background will composite cleanly over whatever is below it in the scene.",
  },
  {
    question: "How do I make the timer big enough to read from across the room?",
    answer:
      "Use the <code>size=xl</code> parameter (the default) and set the Browser Source dimensions to your full canvas size (e.g. 1920×1080). The font size is defined in viewport units (vw), so it scales with the source's width — a larger source means larger digits. If you only want the timer in a small corner of your scene, use <code>size=md</code> and a smaller source. If you want absolutely huge digits (e.g. 40% of canvas height), use <code>size=xl</code> and crop the source to roughly 800×400 — the digits will fill it.",
  },
  {
    question: "Can the timer count up instead of down?",
    answer:
      "Not on this page — for a count-up display use <a href=\"/stopwatch/embed\">our stopwatch embed</a> instead. The BRB overlay is intentionally a countdown only, because the vast majority of streamer use cases (starting soon, BRB, intermission, raid out) call for a finite duration with a known end. A count-up display is more common for elapsed-time scenarios (workout, focus session) and lives on the stopwatch route.",
  },
  {
    question: "Does the timer keep counting if I switch to a different OBS scene?",
    answer:
      "Yes — by default, OBS keeps Browser Sources alive across scene switches, so the timer continues counting even when the source is hidden. If you have the &quot;Shutdown source when not visible&quot; option enabled in the source properties, the timer will reset every time you switch back. For most BRB use cases (starting soon, intermission) you want this option <strong>unchecked</strong> so the countdown is accurate when you cut back to your camera.",
  },
  {
    question: "Why is there no signup, account, or login?",
    answer:
      "Most competing &quot;free&quot; streamer-overlay services (StreamElements, OWN3D, Streamlabs widgets) require you to create an account, link your Twitch or YouTube, and grant OAuth permissions — typically because they monetize the funnel into upsold widget packs. We don't. The overlay is a static page that reads URL parameters and renders. There is no analytics on the embed URL itself, no cookies, and no third-party scripts on the bare overlay. You paste a URL into OBS and it works forever, regardless of whether this site is up — bookmark the URL and you have a working overlay even if you cancel us or we shut down.",
  },
  {
    question: "Can I customize the font further (e.g. brand font)?",
    answer:
      "The query string supports three font families — <code>sans</code> (system sans-serif), <code>serif</code> (system serif), and <code>mono</code> (system monospace). We deliberately do not load Google Fonts or other webfonts on the overlay, because external font requests can fail intermittently and silently break overlays in the middle of a stream. If you need a specific brand font, the cleanest approach is to add a CSS source in OBS that injects an <code>@font-face</code> rule pointing at a font file on your local machine, then override the font-family in your Browser Source &gt; Custom CSS. Drop us a note via the feedback link if there is a font you want supported natively.",
  },
];
