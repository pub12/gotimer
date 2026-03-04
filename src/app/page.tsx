// Purpose: Home page for the Game Timer app. Displays timer options, feature descriptions, FAQ, and use cases.
// Server Component — all content is SSR for AI crawlers and SEO.
import React from "react";
import Link from "next/link";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Footer from "../components/footer";

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

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
      <Header />
      <Navbar />

      {/* Hero Section */}
      <h1 className="text-3xl md:text-6xl font-bold mb-4 text-center text-gray-900">
        Free Online Board Game Timers
      </h1>
      <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-8">
        Simple, mobile-friendly timers for board games, chess, tournaments, and ADHD focus sessions.
        Plus competitive challenge tracking to settle rivalries with friends.
      </p>

      {/* Timer Buttons */}
      <div className="flex flex-col flex-1 items-center justify-center w-full h-full gap-8">
        <Link
          href="/countdown-setup"
          className="inline-flex items-center justify-center text-3xl md:text-5xl px-16 py-10 rounded-2xl shadow-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900 no-underline transition-colors"
        >
          Countdown
        </Link>
        <Link
          href="/chess-clock-setup"
          className="inline-flex items-center justify-center text-3xl md:text-5xl px-16 py-10 rounded-2xl shadow-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900 no-underline transition-colors"
        >
          Chess Clock
        </Link>
        <Link
          href="/round-timer-setup"
          className="inline-flex items-center justify-center text-3xl md:text-5xl px-16 py-10 rounded-2xl shadow-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900 no-underline transition-colors"
        >
          Round Timer
        </Link>
      </div>

      {/* What is GoTimer Section */}
      <section className="w-full max-w-3xl mx-auto mt-16 mb-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center text-gray-900">
          What is GoTimer?
        </h2>
        <div className="bg-white rounded-xl shadow p-6 md:p-8 text-gray-700 space-y-4">
          <p>
            GoTimer is a free web app built for board game enthusiasts who need reliable,
            easy-to-use timers during game night. Whether you&apos;re playing a quick round of
            Scrabble, a tense chess match, or a marathon session of Twilight Imperium,
            GoTimer keeps your games moving at the right pace.
          </p>
          <p>
            Beyond timers, GoTimer lets you create <strong>competitive challenges</strong> with
            friends. Track game results over time, see who&apos;s winning the rivalry, and share
            your matchups publicly. Add GIF reactions to celebrate victories or commiserate
            defeats.
          </p>
          <p>
            No app download required &mdash; GoTimer works in any modern browser on phones,
            tablets, and computers.
          </p>
        </div>
      </section>

      {/* Timer Descriptions */}
      <section className="w-full max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
          Three Timers for Every Game
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/countdown-setup" className="no-underline">
            <div className="bg-white rounded-xl shadow p-6 text-gray-800 hover:shadow-lg transition-shadow h-full">
              <h3 className="text-xl font-bold mb-2">Countdown Timer</h3>
              <p className="text-sm text-gray-600">
                Set a timer for any duration from 1 second to 60 minutes. Great for board games,
                trivia rounds, speed puzzles, ADHD focus sessions, cooking, or workouts. Audio
                beeps alert you during the last 10 seconds.
              </p>
            </div>
          </Link>
          <Link href="/chess-clock-setup" className="no-underline">
            <div className="bg-white rounded-xl shadow p-6 text-gray-800 hover:shadow-lg transition-shadow h-full">
              <h3 className="text-xl font-bold mb-2">Chess Clock</h3>
              <p className="text-sm text-gray-600">
                Two-player timer where each player has their own countdown. Tap to switch turns
                after a move. Perfect for chess, Scrabble, Go, Blokus, or any turn-based game
                requiring time limits.
              </p>
            </div>
          </Link>
          <Link href="/round-timer-setup" className="no-underline">
            <div className="bg-white rounded-xl shadow p-6 text-gray-800 hover:shadow-lg transition-shadow h-full">
              <h3 className="text-xl font-bold mb-2">Round Timer</h3>
              <p className="text-sm text-gray-600">
                Count-up timer that tracks total elapsed time and individual round durations.
                Reset rounds while keeping the total running. Ideal for Twilight Imperium,
                Terraforming Mars, tournament play, and Pomodoro-style focus sessions.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Challenge Tracking Feature */}
      <section className="w-full max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
          Track Competitive Challenges
        </h2>
        <div className="bg-white rounded-xl shadow p-6 md:p-8 text-gray-700 space-y-4">
          <p>
            GoTimer isn&apos;t just a timer &mdash; it&apos;s a rivalry tracker. Create challenges
            between you and your friends for any board game, then log results after each game.
          </p>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-1">Score Tracking</h4>
              <p className="text-sm text-gray-600">Track wins, losses, and draws over time. See who&apos;s really the best at your favorite game.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-1">Visual History</h4>
              <p className="text-sm text-gray-600">View game history with charts showing your win/loss record across all your challenges.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-1">GIF Reactions</h4>
              <p className="text-sm text-gray-600">Add GIF reactions to game results. Celebrate wins and commiserate losses with style.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-1">Share Publicly</h4>
              <p className="text-sm text-gray-600">Make challenges public for others to follow, or keep them private between you and your opponent.</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link
              href="/public-challenges"
              className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
            >
              Browse Public Challenges &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="w-full max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
          Perfect For
        </h2>
        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Chess", "Scrabble", "Catan", "Twilight Imperium", "Terraforming Mars",
              "Go", "Blokus", "Codenames", "Ticket to Ride", "7 Wonders",
              "Azul", "Wingspan", "Gloomhaven", "Pandemic", "Dominion",
              "ADHD Focus", "Pomodoro", "Study Sessions",
            ].map((game) => (
              <span
                key={game}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {game}
              </span>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            ...and any other board game, card game, tabletop game, or focus activity that needs a timer.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What is a chess clock for board games?
            </summary>
            <p className="mt-3 text-gray-600">
              A chess clock is a two-player timer where each player has their own countdown.
              After making a move, you tap the clock to switch to your opponent&apos;s timer.
              This ensures both players have equal time and keeps the game moving. While
              traditionally used for chess, chess clocks work great for Scrabble, Go, and any
              turn-based game.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              How do I time board game turns?
            </summary>
            <p className="mt-3 text-gray-600">
              For two-player games, use GoTimer&apos;s Chess Clock &mdash; set a time limit per
              player and tap to switch turns. For group games, use the Countdown Timer to give
              each player a fixed amount of time per turn. For tracking total game rounds, use
              the Round Timer.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Can I track game scores with friends?
            </summary>
            <p className="mt-3 text-gray-600">
              Yes! GoTimer&apos;s challenge system lets you create ongoing rivalries with friends.
              Create a challenge for any game, invite your opponent, and log results after each
              game. You&apos;ll see a running score, game history, and visual charts tracking your
              rivalry over time.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What board games need a timer?
            </summary>
            <p className="mt-3 text-gray-600">
              Any game benefits from a timer when turns take too long! Chess and Scrabble
              traditionally use time limits. Heavy strategy games like Twilight Imperium and
              Terraforming Mars benefit from round timers to keep the game on schedule. Party
              games like Codenames and trivia games often need countdown timers for timed rounds.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Is GoTimer free to use?
            </summary>
            <p className="mt-3 text-gray-600">
              Yes, GoTimer is completely free. All three timers (Countdown, Chess Clock, and
              Round Timer) work without an account. Creating challenges and tracking scores
              requires a free account.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Does GoTimer work on mobile phones?
            </summary>
            <p className="mt-3 text-gray-600">
              Yes, GoTimer is designed to be mobile-friendly. It works in any modern web browser
              on phones, tablets, and desktop computers. No app download is needed &mdash; just
              visit gotimer.org in your browser.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Can I use GoTimer for ADHD focus sessions?
            </summary>
            <p className="mt-3 text-gray-600">
              Yes! GoTimer&apos;s countdown timer is great for ADHD focus and Pomodoro-style work
              sessions. Set a 25-minute focus block, and the audio alerts help you stay aware of
              time without constantly checking the clock. The full-screen display and simple
              interface minimize distractions. Use the round timer to track multiple focus blocks
              and see how long you stayed on task.
            </p>
          </details>
        </div>
      </section>

      {/* Contact */}
      <section className="w-full max-w-3xl mx-auto mb-8 text-center">
        <p className="text-gray-600">
          For support or feature requests, contact{" "}
          <a href="mailto:pubs@hazoservices.com" className="text-blue-600 underline">
            pubs@hazoservices.com
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
