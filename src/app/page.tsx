// Purpose: Home page for GoTimer. Instant-start timer hero, category grid, leaderboard teaser,
// social proof, how-it-works, blog placeholder, and SEO FAQ.
import React, { Suspense } from "react";
import Link from "next/link";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Footer from "../components/footer";
import Hero from "../components/homepage/hero";
import CategoryGrid from "../components/homepage/category-grid";
import LeaderboardTeaser from "../components/homepage/leaderboard-teaser";
import SocialProof from "../components/homepage/social-proof";
import FaqAccordion from "../components/shared/faq-accordion";
import { Button } from "../components/ui/button";
import { Timer, Play, Palette, BookOpen, ArrowRight } from "lucide-react";

// Static FAQ structured data for SEO - no user input, safe to serialize
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is GoTimer free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, GoTimer is completely free. All 28+ timers — including Countdown, Chess Clock, Round Timer, HIIT, Pomodoro, and more — work without an account. Creating challenges and tracking scores requires a free account.",
      },
    },
    {
      "@type": "Question",
      name: "What is a chess clock for board games?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A chess clock is a two-player timer where each player has their own countdown. After making a move, you tap the clock to switch to your opponent's timer. This ensures both players have equal time and keeps the game moving. While traditionally used for chess, chess clocks work great for Scrabble, Go, and any turn-based game.",
      },
    },
    {
      "@type": "Question",
      name: "What timers do you have for workouts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GoTimer has a full suite of fitness timers: HIIT Timer for high-intensity intervals, Tabata Timer for 20/10 protocols, EMOM Timer for every-minute-on-the-minute workouts, a Stretching Timer for hold-based routines, and a Rest Timer for tracking recovery between sets.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use GoTimer for cooking?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! GoTimer includes a Cooking Timer with common presets (5, 10, 15, 20, 30, 45, and 60 minutes), an Egg Timer for perfect soft, medium, or hard-boiled eggs, a Bread Proofing Timer for long rises, and a Multi-Timer that lets you run several independent timers at once.",
      },
    },
    {
      "@type": "Question",
      name: "Do you have photography and darkroom timers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! GoTimer offers specialized photography timers including a Film Development Timer for B&W, C-41, and E-6 processes with push/pull and temperature compensation, a Long Exposure Calculator for reciprocity failure correction, a Stand Development Timer, an Enlarger Timer with F-stop timing, and a Cyanotype UV exposure timer.",
      },
    },
    {
      "@type": "Question",
      name: "Does GoTimer work on mobile phones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, GoTimer is designed to be mobile-friendly. It works in any modern web browser on phones, tablets, and desktop computers. No app download is needed — just visit gotimer.org in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use GoTimer for ADHD focus sessions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! GoTimer's Pomodoro Timer and Study Timer are great for ADHD focus sessions. Set a 25-minute focus block, and the audio alerts help you stay aware of time without constantly checking the clock. The full-screen display and simple interface minimize distractions. Use the round timer to track multiple focus blocks throughout the day.",
      },
    },
  ],
});

const FAQ_ITEMS = [
  {
    question: "Is GoTimer free to use?",
    answer:
      'Yes, GoTimer is completely free. All 28+ timers &mdash; including <a href="/countdown-setup" class="text-secondary underline">Countdown</a>, <a href="/chess-clock-setup" class="text-secondary underline">Chess Clock</a>, <a href="/round-timer-setup" class="text-secondary underline">Round Timer</a>, <a href="/fitness/hiit" class="text-secondary underline">HIIT</a>, <a href="/pomodoro-timer" class="text-secondary underline">Pomodoro</a>, and more &mdash; work without an account. Creating challenges and tracking scores requires a free account.',
  },
  {
    question: "What is a chess clock for board games?",
    answer:
      'A <a href="/chess-clock-setup" class="text-secondary underline">chess clock</a> is a two-player timer where each player has their own countdown. After making a move, you tap the clock to switch to your opponent&apos;s timer. This ensures both players have equal time and keeps the game moving. While traditionally used for chess, chess clocks work great for Scrabble, Go, and any turn-based game. For group games, try the <a href="/board-games/turn-timer" class="text-secondary underline">Turn Timer</a>.',
  },
  {
    question: "What timers do you have for workouts?",
    answer:
      'GoTimer has a full suite of <a href="/fitness" class="text-secondary underline">fitness timers</a>: <a href="/fitness/hiit" class="text-secondary underline">HIIT Timer</a> for high-intensity intervals, <a href="/fitness/tabata" class="text-secondary underline">Tabata Timer</a> for 20/10 protocols, <a href="/fitness/emom" class="text-secondary underline">EMOM Timer</a> for every-minute-on-the-minute workouts, a <a href="/fitness/stretching" class="text-secondary underline">Stretching Timer</a> for hold-based routines, and a <a href="/fitness/rest-timer" class="text-secondary underline">Rest Timer</a> for tracking recovery between sets.',
  },
  {
    question: "Can I use GoTimer for cooking?",
    answer:
      'Yes! GoTimer includes a <a href="/kitchen/cooking" class="text-secondary underline">Cooking Timer</a> with common presets, an <a href="/kitchen/eggs" class="text-secondary underline">Egg Timer</a> for perfect soft, medium, or hard-boiled eggs, a <a href="/kitchen/bread-proofing" class="text-secondary underline">Bread Proofing Timer</a> for long rises, and a <a href="/kitchen/multi-timer" class="text-secondary underline">Multi-Timer</a> that lets you run several independent timers at once.',
  },
  {
    question: "Do you have photography and darkroom timers?",
    answer:
      'Yes! GoTimer offers specialized <a href="/photography" class="text-secondary underline">photography timers</a> including a <a href="/photography/film-development" class="text-secondary underline">Film Development Timer</a> for B&amp;W, C-41, and E-6 processes with push/pull and temperature compensation, a <a href="/photography/long-exposure-calculator" class="text-secondary underline">Long Exposure Calculator</a> for reciprocity failure correction, a <a href="/photography/stand-development" class="text-secondary underline">Stand Development Timer</a>, an <a href="/photography/enlarger-timer" class="text-secondary underline">Enlarger Timer</a> with F-stop timing, and a <a href="/photography/cyanotype" class="text-secondary underline">Cyanotype</a> UV exposure timer.',
  },
  {
    question: "Does GoTimer work on mobile phones?",
    answer:
      "Yes, GoTimer is designed to be mobile-friendly. It works in any modern web browser on phones, tablets, and desktop computers. No app download is needed &mdash; just visit gotimer.org in your browser.",
  },
  {
    question: "Can I use GoTimer for ADHD focus sessions?",
    answer:
      'Yes! GoTimer&apos;s <a href="/pomodoro-timer" class="text-secondary underline">Pomodoro Timer</a> and <a href="/productivity/study" class="text-secondary underline">Study Timer</a> are great for ADHD focus sessions. Set a 25-minute focus block, and the audio alerts help you stay aware of time without constantly checking the clock. The full-screen display and simple interface minimize distractions. Use the <a href="/round-timer-setup" class="text-secondary underline">Round Timer</a> to track multiple focus blocks throughout the day.',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: Timer,
    step: "1",
    title: "Pick a Timer",
    description: "Choose from Pomodoro, HIIT, board game, or any of our 10+ timer categories.",
  },
  {
    icon: Play,
    step: "2",
    title: "Start It",
    description: "Hit start and go. No sign-up needed. Works on any device, any browser.",
  },
  {
    icon: Palette,
    step: "3",
    title: "Customize It",
    description: "Go fullscreen, pick a theme, set alerts, and share your timer with a link.",
  },
];

export default function HomePage() {

  return (
    <main className="min-h-screen flex flex-col items-center bg-surface">
      {/* Static JSON-LD structured data for SEO — no user input, safe to inject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
      <Header />
      <Navbar />

      {/* 1. Hero with instant-start timer */}
      <div className="w-full pt-14">
        <Suspense>
          <Hero />
        </Suspense>
      </div>

      {/* 2. Timer Category Grid */}
      <CategoryGrid />

      {/* 3. How It Works */}
      <section className="w-full py-12 md:py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline font-black text-2xl md:text-4xl text-center text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Three steps. Zero friction.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="flex flex-col items-center text-center bg-surface-container-low rounded-[1rem] p-6 shadow-[var(--shadow-soft)] hover:scale-[1.02] transition-all duration-200 ease-out"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                    Step {item.step}
                  </span>
                  <h3 className="font-headline font-black text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Social Proof Strip */}
      <SocialProof />

      {/* 5. Leaderboard Teaser */}
      <LeaderboardTeaser />

      {/* 6. Blog / Latest Guides */}
      <section className="w-full py-12 md:py-16 px-4 bg-surface-container-low">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            Guides &amp; Tips
          </div>
          <h2 className="font-headline font-black text-2xl md:text-4xl text-foreground mb-4">
            Timer Guides &amp; Best Practices
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Learn how to make the most of your timers with our expert guides on Pomodoro technique,
            HIIT training, board game pacing, and more.
          </p>
          <Button variant="default" size="lg" asChild>
            <Link href="/blog" className="no-underline text-base font-semibold">
              Read the Blog <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="w-full py-12 md:py-16 px-4 bg-surface">
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={FAQ_ITEMS} title="Frequently Asked Questions" />
        </div>
      </section>

      {/* 8. Footer */}
      <Footer />
    </main>
  );
}
