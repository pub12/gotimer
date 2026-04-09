import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Free Board Game Timers — Chess Clock, Countdown & Round Timer",
  description:
    "Free online timers for board games, card games, and tabletop gaming. Chess clock, countdown timer, and round timer — no app download needed.",
  alternates: {
    canonical: "/board-games",
  },
  openGraph: {
    title: "Free Board Game Timers — Chess Clock, Countdown & Round Timer",
    description:
      "Free online timers for board games, card games, and tabletop gaming. Chess clock, countdown timer, and round timer — no app download needed.",
    url: "https://gotimer.org/board-games",
    type: "website",
  },
};

const timers = [
  {
    href: "/countdown-setup",
    title: "Countdown Timer",
    description:
      "Set a countdown for any duration. Perfect for turn time limits, timed rounds, trivia questions, and speed puzzles. Audio beeps alert you during the last 10 seconds.",
  },
  {
    href: "/chess-clock-setup",
    title: "Chess Clock",
    description:
      "Two-player timer where each player has their own countdown. Tap to switch turns after a move. Ideal for chess, Scrabble, Go, Blokus, and any head-to-head game.",
  },
  {
    href: "/round-timer-setup",
    title: "Round Timer",
    description:
      "Track total game time and individual round durations. Reset rounds while keeping the overall clock running. Great for Twilight Imperium, Terraforming Mars, and tournament play.",
  },
];

const related_pages = [
  {
    href: "/classroom-timer",
    title: "Classroom Timer",
    description: "Fullscreen timer for teachers — works on smartboards and projectors.",
  },
  {
    href: "/presentation-timer",
    title: "Presentation Timer",
    description: "Keep meetings and talks on schedule with a visible countdown.",
  },
  {
    href: "/pomodoro-timer",
    title: "Pomodoro Timer",
    description: "25/5 focus sessions — great for game-night prep and planning.",
  },
];

const games = [
  "Chess",
  "Scrabble",
  "Catan",
  "Twilight Imperium",
  "Terraforming Mars",
  "Go",
  "Blokus",
  "Codenames",
  "Ticket to Ride",
  "7 Wonders",
  "Azul",
  "Wingspan",
  "Gloomhaven",
  "Pandemic",
  "Dominion",
  "Splendor",
  "Carcassonne",
  "Root",
  "Spirit Island",
  "King of Tokyo",
];

export default function BoardGamesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
      <Navbar />

      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center text-gray-900">
        Free Board Game Timers
      </h1>
      <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-10">
        Keep game night moving with free, mobile-friendly timers. No app download,
        no signup — just pick a timer and play.
      </p>

      {/* Main timers */}
      <section className="w-full max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
          Choose Your Timer
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {timers.map((timer) => (
            <Link key={timer.href} href={timer.href} className="no-underline">
              <div className="bg-white rounded-xl shadow p-6 text-gray-800 hover:shadow-lg transition-shadow h-full">
                <h3 className="text-xl font-bold mb-2">{timer.title}</h3>
                <p className="text-sm text-gray-600">{timer.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why timers matter */}
      <section className="w-full max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
          Why Board Games Need Timers
        </h2>
        <div className="bg-white rounded-xl shadow p-6 md:p-8 text-gray-700 space-y-4">
          <p>
            Every board gamer knows the feeling: one player takes ten minutes to decide
            where to place a single tile, and suddenly a 90-minute game stretches to
            three hours. Timers solve this by creating friendly time pressure that keeps
            everyone engaged and the game moving at a good pace.
          </p>
          <p>
            For competitive games like chess and Scrabble, a chess clock ensures both
            players get equal time. For heavier strategy games like Terraforming Mars or
            Twilight Imperium, a round timer tracks how long each phase takes so you can
            plan your evening. And for party games like Codenames or trivia, a countdown
            timer adds excitement to timed rounds.
          </p>
          <p>
            GoTimer works in any browser on phones, tablets, and laptops — no app
            download needed. Set it up on one device and place it where all players can
            see the remaining time.
          </p>
        </div>
      </section>

      {/* Games list */}
      <section className="w-full max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
          Works Great With
        </h2>
        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {games.map((game) => (
              <span
                key={game}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {game}
              </span>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            ...and any other board game, card game, or tabletop game that needs a timer.
          </p>
        </div>
      </section>

      {/* Related timers */}
      <section className="w-full max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
          More Timers You Might Like
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related_pages.map((page) => (
            <Link key={page.href} href={page.href} className="no-underline">
              <div className="bg-white rounded-xl shadow p-6 text-gray-800 hover:shadow-lg transition-shadow h-full">
                <h3 className="text-lg font-bold mb-1">{page.title}</h3>
                <p className="text-sm text-gray-600">{page.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
