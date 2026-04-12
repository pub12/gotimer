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
import { Timer, Play, Trophy, BookOpen, ArrowRight } from "lucide-react";
import { get_db } from "../lib/db";

// Static FAQ structured data for SEO - no user input, safe to serialize
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
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
      name: "How do I time board game turns?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For two-player games, use GoTimer's Chess Clock — set a time limit per player and tap to switch turns. For group games, use the Countdown Timer to give each player a fixed amount of time per turn. For tracking total game rounds, use the Round Timer.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track game scores with friends?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! GoTimer's challenge system lets you create ongoing rivalries with friends. Create a challenge for any game, invite your opponent, and log results after each game. You'll see a running score, game history, and visual charts tracking your rivalry over time.",
      },
    },
    {
      "@type": "Question",
      name: "What board games need a timer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any game benefits from a timer when turns take too long! Chess and Scrabble traditionally use time limits. Heavy strategy games like Twilight Imperium and Terraforming Mars benefit from round timers to keep the game on schedule. Party games like Codenames and trivia games often need countdown timers for timed rounds.",
      },
    },
    {
      "@type": "Question",
      name: "Is GoTimer free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, GoTimer is completely free. All three timers (Countdown, Chess Clock, and Round Timer) work without an account. Creating challenges and tracking scores requires a free account.",
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
        text: "Yes! GoTimer's countdown timer is great for ADHD focus and Pomodoro-style work sessions. Set a 25-minute focus block, and the audio alerts help you stay aware of time without constantly checking the clock. The full-screen display and simple interface minimize distractions. Use the round timer to track multiple focus blocks and see how long you stayed on task.",
      },
    },
  ],
});

const FAQ_ITEMS = [
  {
    question: "What is a chess clock for board games?",
    answer:
      "A chess clock is a two-player timer where each player has their own countdown. After making a move, you tap the clock to switch to your opponent&apos;s timer. This ensures both players have equal time and keeps the game moving. While traditionally used for chess, chess clocks work great for Scrabble, Go, and any turn-based game.",
  },
  {
    question: "How do I time board game turns?",
    answer:
      "For two-player games, use GoTimer&apos;s Chess Clock &mdash; set a time limit per player and tap to switch turns. For group games, use the Countdown Timer to give each player a fixed amount of time per turn. For tracking total game rounds, use the Round Timer.",
  },
  {
    question: "Can I track game scores with friends?",
    answer:
      "Yes! GoTimer&apos;s challenge system lets you create ongoing rivalries with friends. Create a challenge for any game, invite your opponent, and log results after each game. You&apos;ll see a running score, game history, and visual charts tracking your rivalry over time.",
  },
  {
    question: "What board games need a timer?",
    answer:
      "Any game benefits from a timer when turns take too long! Chess and Scrabble traditionally use time limits. Heavy strategy games like Twilight Imperium and Terraforming Mars benefit from round timers to keep the game on schedule. Party games like Codenames and trivia games often need countdown timers for timed rounds.",
  },
  {
    question: "Is GoTimer free to use?",
    answer:
      "Yes, GoTimer is completely free. All three timers (Countdown, Chess Clock, and Round Timer) work without an account. Creating challenges and tracking scores requires a free account.",
  },
  {
    question: "Does GoTimer work on mobile phones?",
    answer:
      "Yes, GoTimer is designed to be mobile-friendly. It works in any modern web browser on phones, tablets, and desktop computers. No app download is needed &mdash; just visit gotimer.org in your browser.",
  },
  {
    question: "Can I use GoTimer for ADHD focus sessions?",
    answer:
      "Yes! GoTimer&apos;s countdown timer is great for ADHD focus and Pomodoro-style work sessions. Set a 25-minute focus block, and the audio alerts help you stay aware of time without constantly checking the clock. The full-screen display and simple interface minimize distractions. Use the round timer to track multiple focus blocks and see how long you stayed on task.",
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
    icon: Trophy,
    step: "3",
    title: "Add a Leaderboard",
    description: "Create challenges, invite friends, and track who wins over time.",
  },
];

function get_published_timer_pages(): { slug: string; title: string; timer_type: string }[] {
  try {
    const db = get_db();
    return db
      .prepare(
        `SELECT slug, title, timer_type FROM timer_pages WHERE status = 'published' ORDER BY published_at DESC`
      )
      .all() as { slug: string; title: string; timer_type: string }[];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const published_pages = get_published_timer_pages();

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
      <CategoryGrid published_pages={published_pages} />

      {/* 3. Leaderboard Teaser */}
      <LeaderboardTeaser />

      {/* 4. Social Proof Strip */}
      <SocialProof />

      {/* 5. How It Works */}
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
                  className="flex flex-col items-center text-center bg-surface-container-low rounded-[1rem] p-6 shadow-[var(--shadow-soft)] hover:scale-105 transition-all duration-200 ease-out"
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

      {/* Contact */}
      <section className="w-full py-8 px-4 bg-surface text-center">
        <p className="text-muted-foreground">
          For support or feature requests, contact{" "}
          <a href="mailto:pubs@hazoservices.com" className="text-secondary underline">
            pubs@hazoservices.com
          </a>
        </p>
      </section>

      {/* 8. Footer */}
      <Footer />
    </main>
  );
}
