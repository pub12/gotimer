# OBS Project Resources — Submission Copy

Ready-to-submit listing for **obsproject.com/forum/resources/categories/obs-studio.6/** (or the closest Free Overlays sub-category at submission time). Submit yourself when ready; this doc just preps the copy so the form is a paste-and-go.

---

## Resource title (short)

> Free BRB / Starting-Soon Countdown Overlay (transparent, no signup)

## Tagline (one line)

> A URL-configurable, transparent-background countdown overlay for Browser Source — no account, no watermark, no extension.

## Short description (~30 words, used in directory listings)

> Free transparent countdown overlay for OBS Browser Source. URL-driven configuration (mins, label, color, font, size, align, pulse). No signup, no watermark, no analytics on the embed URL.

## Long description (~150-200 words, used on the resource page itself)

> GoTimer&apos;s BRB Overlay is a free, transparent-background countdown timer for OBS Browser Source. The entire visual configuration — duration, label, text color, font family, alignment, size, and pulse-on-last-10s animation — is set via URL query parameters, so you can build a working overlay URL from a Stream Deck macro or a chat bot without ever opening a UI.
>
> Four pre-built scenario URLs are included for the common use cases: Starting Soon, Be Right Back, Stream Ending, and Twitch Raid Countdown. Each is its own bookmarkable URL with its own pre-filled settings. For custom durations or colors, the configurator at gotimer.org/brb generates URLs interactively — paste the result into OBS &gt; + &gt; Browser Source &gt; URL.
>
> Key differentiators: <strong>no account</strong> (the overlay reads the URL and renders — there is nothing to log into), <strong>no watermark</strong>, <strong>no Google Fonts dependency</strong> (uses system font stacks, so the overlay can&apos;t break mid-stream because a CDN went down), and <strong>no analytics on the embed URL itself</strong>. The URL is the entire contract — bookmark it and it works forever.
>
> Optional companion audio tab at gotimer.org/brb/sound-cue routes chime cues into an OBS Audio Output Capture source (OBS mutes Browser Source audio by default, so audio fires from the second tab while the overlay handles visuals).

## URLs

- **Resource page**: <https://gotimer.org/brb>
- **Live demo**: <https://gotimer.org/brb?embed=1&mins=5&label=Back+soon&color=ffd700&pulse=1&autostart=1>
- **Documentation / parameter spec**: <https://gotimer.org/brb#configurator>

## License / cost

> Free, no account required. No watermark on the bare overlay. The URL contains the full configuration so it works independently of the host site&apos;s availability — bookmark it and you have a working overlay regardless of upstream status.

## Compatibility

- OBS Studio 27.x and newer (verified on 30.x, macOS &amp; Windows)
- Streamlabs Desktop (uses the OBS Browser Source under the hood)
- vMix (Webpage input)
- XSplit Broadcaster (Webpage source)

## Recommended OBS settings

- **Source type**: Browser
- **URL**: paste from configurator at gotimer.org/brb
- **Width / Height**: match canvas (typically 1920×1080)
- **Custom CSS**: leave empty (overlay sets transparent bg natively)
- **Shutdown source when not visible**: unchecked (so timer persists across scene switches)
- **Refresh browser when scene becomes active**: unchecked (so timer doesn&apos;t reset)

## Screenshots to attach

1. **In-OBS preview** — Browser Source dialog open with the embed URL pasted, showing the countdown rendered transparently over a sample game scene.
2. **Live preview from configurator** — Screenshot of the /brb hub page showing the live preview and configurator form side-by-side.
3. **All four presets** — A 2×2 grid showing the four scenario presets (Starting Soon / BRB / Stream Over / Raid) each rendered in OBS.

## Tags / keywords (if the form supports them)

> countdown, timer, brb, starting-soon, transparent, browser-source, free, no-signup, raid, intermission, overlay

## Author bio (if requested)

> GoTimer.org maintains a library of free browser-based timers for focus, fitness, board games, kitchen, and streaming. Built around the principle that timers should be URLs, not apps — you bookmark a link and it works on every device you own, including the one you don&apos;t own yet.

---

## Submission checklist

- [ ] Verify <https://gotimer.org/brb?embed=1&mins=5&label=Back+soon&color=ffd700&pulse=1&autostart=1> renders correctly in a fresh OBS install (no Custom CSS, transparent bg).
- [ ] Capture the three screenshots above (1920×1080, PNG, &lt;500KB each).
- [ ] Read three recently-approved OBS Resources listings to match the tone (typically neutral, slightly understated, no exclamation marks).
- [ ] Submit via <https://obsproject.com/forum/resources/categories/obs-studio.6/> — pick the Browser Source / Overlays sub-category.
- [ ] After approval, add the OBS Resources URL to the /brb landing&apos;s "Compatibility" section as social proof.

## Post-approval tracking

- Expect the listing to drive 50-150 referral clicks/month once established (per plan §2.3).
- First-week traffic shows up in `referrer` analytics from `obsproject.com` — confirms the listing is live and indexed.
- After 30 days, identify which preset URL gets the most direct traffic from the listing; promote it more prominently in the resource description.
