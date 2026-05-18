export const NOISE_METER_FAQ = [
  {
    question: "Does the noise meter record any audio?",
    answer:
      "<strong>No.</strong> The microphone signal is read by the browser&apos;s Web Audio API in real time only — we compute amplitude (a single number per frame) and discard the audio. Nothing is stored locally, nothing is transmitted, nothing is recorded. Confirm in your browser&apos;s developer tools network tab: no requests carry audio data.",
  },
  {
    question: "Why does the browser ask for microphone permission?",
    answer:
      "Browsers require explicit permission for microphone access on every page — that&apos;s a security feature of the web platform, not an indication that we&apos;re recording. The permission grant lets the noise meter <em>read</em> the microphone&apos;s amplitude. The audio doesn&apos;t leave the page.",
  },
  {
    question: "What if a student denies microphone permission accidentally?",
    answer:
      "The page falls back to a clear &quot;Try again&quot; CTA with instructions. To re-grant permission: click the lock icon (or microphone icon) in the address bar → set Microphone to Allow → reload the page → tap &quot;Enable microphone&quot;. On Chromebooks managed by a district, IT may have to whitelist gotimer.org for microphone access.",
  },
  {
    question: "Which display mode should I use?",
    answer:
      "<strong>Bouncy balls</strong> is the most engaging for elementary classrooms — students see the balls float and fall with the room. <strong>Bars</strong> is more clinical and works well for middle/high school. <strong>Color-only</strong> is the accessibility option: a large green/red panel that flips when the room crosses the threshold, with no animation. Pick whichever your students respond to.",
  },
  {
    question: "How sensitive should the threshold be?",
    answer:
      "Default 18% works for most classroom acoustics. Increase the threshold (slide right) if the meter is too easily triggered by normal teacher voice or HVAC noise. Decrease it if students learn to whisper at exactly the threshold to game the meter. Spend a minute calibrating with your specific microphone and room before relying on it.",
  },
  {
    question: "Does the bouncy ball animation work on a Chromebook?",
    answer:
      "Yes — the Canvas animation runs comfortably at 60fps on low-spec Chromebooks. We use a single Canvas with eight balls (not a complex physics simulation), so CPU and GPU load are minimal. If you see frame drops, switch to bars or color-only mode to reduce the rendering cost.",
  },
  {
    question: "Can I project the noise meter on a smartboard?",
    answer:
      "Yes. Press <code>F11</code> (Windows / ChromeOS) or use the green button (macOS) to enter browser full-screen on the classroom computer. The Canvas scales to the display. The threshold slider stays visible at the bottom so you can tune mid-lesson.",
  },
  {
    question: "What microphone does the meter use?",
    answer:
      "The default input device selected in the browser/OS — usually the built-in laptop microphone. If a teacher uses a USB lapel mic, the meter reads that mic. To pick a specific mic, change the OS default input before opening the page. Most classrooms get the most useful reading from the laptop&apos;s built-in mic because it&apos;s positioned where students&apos; voices reach it.",
  },
];
