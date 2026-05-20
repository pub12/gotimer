import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FaqAccordion from "@/components/shared/faq-accordion";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_itemlist_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";

export const metadata = build_classroom_metadata(null, {
  title: "Free Classroom Tools — Name Picker, Group Generator, Noise Meter",
  description:
    "Free online tools for teachers: random name picker, group generator, classroom noise meter, tally counter, and visual classroom timer. No signup, no ads, works on smartboards.",
});

const HUB_FAQ = [
  {
    question: "Are these classroom tools really free? What&apos;s the catch?",
    answer:
      "Yes, all of these classroom tools are completely free with no signup, no ads, and no email gate. There is no catch. We pay for hosting because the rest of GoTimer (timers and challenges) is supported by occasional small donations and our own time. Everything teacher-facing on this hub will stay free indefinitely.",
  },
  {
    question: "Do these tools work on a smartboard or projector?",
    answer:
      "Yes. Each tool is built for full-screen use on any display — interactive whiteboards, classroom projectors, monitors, TVs, and Chromebooks. Press <strong>F11</strong> in any browser to enter full screen on Windows or ChromeOS, or use the green full-screen button on macOS. Large readable typography and high-contrast colours work from the back of the room.",
  },
  {
    question: "Do I need to install anything or create an account?",
    answer:
      "No. All four tools run inside the web browser. Nothing is installed, no extension is needed, and no account is created. Your class lists and counter state are stored in your browser&apos;s local storage on the same device, so they persist between visits but never leave your computer.",
  },
  {
    question: "Is any audio or student data recorded?",
    answer:
      "No. The noise meter uses the microphone <strong>only to read amplitude in real time</strong> — nothing is recorded, transmitted, or saved. Class lists used by the name picker and group generator are stored in <em>your</em> browser&apos;s local storage only; they never leave your device. The tally counter is purely local.",
  },
  {
    question: "Can I use these for a substitute teacher or shared classroom?",
    answer:
      "Yes. Bookmark this page (or any of the individual tool pages) on the classroom computer&apos;s home screen and a substitute can use them immediately without setup. Because state is stored locally per browser profile, each teacher who logs into a shared computer has their own class list, tally state, and last-used settings.",
  },
  {
    question: "Will these tools work on a Chromebook?",
    answer:
      "Yes — these tools are tested specifically on Chromebooks because so many classrooms run them. The name picker uses CSS transforms for the spinning wheel (not Canvas), keeping the animation smooth even on low-end Celeron Chromebooks. The noise meter falls back gracefully if the microphone is unavailable.",
  },
  {
    question: "Can students see my class list?",
    answer:
      "Students only see what you display on the projector. If you don&apos;t want last names visible, the name picker accepts first names, nicknames, or numbered placeholders (Student 1, Student 2, …). The class list is never shown unless the wheel is rendered or you scroll the input box into view.",
  },
  {
    question: "What if I&apos;m the only one in my school using GoTimer?",
    answer:
      "Then you&apos;re welcome here. These tools are designed for individual teachers — no admin setup, no IT approval needed, no licence, no roster sync. They&apos;re also commonly added to district-curated EdTech listicles like Edutopia, Larry Ferlazzo&apos;s blog, and WeAreTeachers, so if your district has a vetted-tools list, ask them to consider adding this one.",
  },
];

const TOOLS = [
  {
    position: 1,
    name: "Random Name Picker",
    url_path: "/classroom/name-picker",
    description:
      "Free spinning name wheel for cold-calling or random groups. Save your class list in this browser — no account, no upload.",
    emoji: "\u{1F3AF}",
  },
  {
    position: 2,
    name: "Group Generator",
    url_path: "/classroom/group-generator",
    description:
      "Random groups of any size from your class list. Seed for reproducible groups. Avoid repeating last week's pairs automatically.",
    emoji: "\u{1F465}",
  },
  {
    position: 3,
    name: "Classroom Noise Meter",
    url_path: "/classroom/noise-meter",
    description:
      "Free microphone-based noise meter with bouncy-ball, bar, and accessible color modes. Nothing recorded — privacy-first.",
    emoji: "\u{1F4E2}",
  },
  {
    position: 4,
    name: "Tally Counter",
    url_path: "/classroom/tally-counter",
    description:
      "Single counter or multi-counter grid. Tap to count behaviour, votes, attempts. Persists across reloads.",
    emoji: "\u{1F522}",
  },
  {
    position: 5,
    name: "Classroom Timer",
    url_path: "/productivity/classroom",
    description:
      "Large-display projectable countdown. Smartboard-ready — great for transitions, tests, and timed activities.",
    emoji: "⏱️",
  },
  {
    position: 6,
    name: "Study Timer",
    url_path: "/productivity/study",
    description:
      "Pomodoro-style focus sessions. Structured work/break cycles for independent study periods.",
    emoji: "\u{1F4DA}",
  },
  {
    position: 7,
    name: "Debate Timer",
    url_path: "/productivity/debate-timer",
    description:
      "Multi-phase debate round timer. Supports PF, LD, Policy, WSDC, and British Parliamentary formats.",
    emoji: "\u{1F5E3}️",
  },
  {
    position: 8,
    name: "Presentation Timer",
    url_path: "/productivity/presentation",
    description:
      "Count down student presentations. Full-screen display with configurable time limit.",
    emoji: "\u{1F4CA}",
  },
  {
    position: 9,
    name: "Breathing Timer",
    url_path: "/wellness/breathing",
    description:
      "Guided breathing for classroom brain breaks. Calm the room between activities.",
    emoji: "\u{1FAB7}",
  },
];

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Classroom Toolkit",
  url_path: "/classroom",
  description:
    "Free online toolkit for teachers — random name picker, random group generator, microphone-based noise meter, and tally counter. Works on smartboards and Chromebooks. No signup, no ads, no audio recorded.",
  features: [
    "Random name picker with spinning wheel and class-list save",
    "Random group generator with seed for reproducibility",
    "Microphone noise meter with bouncy-ball, bar, and color-only modes",
    "Single and multi-counter tally with localStorage persistence",
    "Smartboard and Chromebook friendly",
    "No signup, install, or account required",
    "No audio recorded, no student data uploaded",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([]);
const faqLd = build_classroom_faq_ld(HUB_FAQ);
const itemListLd = build_classroom_itemlist_ld(TOOLS);

export default function Page() {
  const ld_blocks = [webAppLd, breadcrumbLd, faqLd, itemListLd];
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
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4">
        <section className="w-full max-w-4xl mx-auto pt-6 pb-2">
          <h1 className="font-headline font-black text-4xl md:text-5xl text-foreground tracking-tight">
            Free Classroom Tools for Teachers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Four browser-based tools that just work — name picker, group
            generator, noise meter, tally counter. No signup, no ads, no audio
            recorded, no student data leaves your device.
          </p>
        </section>

        <section className="w-full max-w-4xl mx-auto py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map((t) => (
              <Link
                key={t.url_path}
                href={t.url_path}
                className="group block p-6 bg-card rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0" aria-hidden="true">
                    {t.emoji}
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-xl text-foreground group-hover:text-secondary transition-colors">
                      {t.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {t.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 p-4 bg-secondary/5 rounded-xl border border-secondary/20">
            <p className="text-sm text-foreground">
              Looking for a <strong>classroom timer</strong>? Try the{" "}
              <Link
                href="/productivity/classroom"
                className="text-secondary underline underline-offset-2 hover:text-foreground"
              >
                projectable countdown timer
              </Link>{" "}
              — large display, smartboard-ready, great for transitions and tests.
            </p>
          </div>
        </section>

        <section className="w-full py-10 md:py-12 px-4 bg-surface">
          <div className="max-w-3xl mx-auto seo-prose space-y-4 text-sm text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-headline [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3">
            <h2>Why a single classroom toolkit?</h2>
            <p>
              Most online classroom tools force you to bounce between three or
              four tabs — one for the name wheel, another for the group maker,
              a third for the noise display. Each is its own ad-laden site
              with its own signup flow. This hub puts the four we use most in
              one place, with one consistent design language and a single
              privacy promise: nothing leaves your device unless you choose to
              share it.
            </p>

            <h2>How teachers actually use these tools</h2>
            <ul>
              <li>
                <strong>Cold-call rotation</strong> — Open the{" "}
                <Link href="/classroom/name-picker">name picker</Link>, paste
                your roster once on Monday, leave the &quot;remove after
                pick&quot; toggle on. Spin during questioning so every student
                is called once before any repeat.
              </li>
              <li>
                <strong>Random groups for projects</strong> — Open the{" "}
                <Link href="/classroom/group-generator">group generator</Link>{" "}
                with the &quot;avoid last week&apos;s pairs&quot; toggle on. The
                shuffler biases against repeating pairs so groups stay fresh
                across multi-week units.
              </li>
              <li>
                <strong>Quiet work without yelling</strong> — Project the{" "}
                <Link href="/classroom/noise-meter">noise meter</Link> during
                seatwork. The bouncy balls float higher when the room is loud;
                students self-regulate without your voice rising.
              </li>
              <li>
                <strong>Behaviour and participation tracking</strong> — Open
                the <Link href="/classroom/tally-counter">tally counter</Link>{" "}
                in multi-counter mode, paste one column per behaviour or row,
                tap to record. The count persists across the period so you can
                report data at the end of class.
              </li>
              <li>
                <strong>Timed activities</strong> — Pair any tool with the{" "}
                <Link href="/productivity/classroom">classroom timer</Link>{" "}
                for transitions, tests, and group work.
              </li>
            </ul>

            <h2>What we don&apos;t do</h2>
            <p>
              We don&apos;t track students. We don&apos;t store class lists on
              a server. We don&apos;t require a Google or Apple sign-in. We
              don&apos;t insert ads into the tool itself. We don&apos;t
              analyse your microphone audio (the noise meter only reads
              amplitude on your device). If your district has a privacy review
              process, these tools are usually approved on first pass because
              there is no student PII handling and no data leaving the
              device.
            </p>

            <h2>Print, project, embed</h2>
            <p>
              All four tools work in browser full-screen (press <code>F11</code>{" "}
              on Windows / ChromeOS, the green full-screen button on macOS).
              The name picker and group generator pages are designed so the
              result displays full-width when projected. The group generator
              output is also legible if you print the browser tab (the cards
              reflow onto letter paper).
            </p>

            <h2>How this compares to wheelofnames and online-stopwatch</h2>
            <p>
              We are not trying to out-rank the giant single-purpose sites on
              head terms — wheelofnames.com has a 15-year backlink moat and
              owns &quot;name picker wheel&quot; on Google. What we do
              differently is keep the four most-used classroom tools in one
              consistent, signup-free, ad-free toolkit with explicit privacy
              guarantees. If you want a single bookmark in your classroom
              browser, that&apos;s us.
            </p>
          </div>
        </section>

        <section className="w-full py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <FaqAccordion items={HUB_FAQ} title="Classroom Toolkit FAQ" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
