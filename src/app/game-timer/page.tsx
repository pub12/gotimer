import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { Gamepad2, Clock, Users, RotateCcw } from "lucide-react";

const TIMER_CARDS = [
  {
    icon: Users,
    title: "Turn Timer",
    description: "Per-player countdown for 2–8 players. Each player gets equal time per turn — perfect for Catan, Carcassonne, Ticket to Ride, and party games.",
    href: "/board-games/turn-timer",
    cta: "Use Turn Timer",
  },
  {
    icon: Clock,
    title: "Chess Clock",
    description: "Two-player time bank with tap-to-switch. Total time per player depletes across all turns — ideal for chess, Scrabble, Go, and Backgammon.",
    href: "/board-games/chess-clock",
    cta: "Use Chess Clock",
  },
  {
    icon: RotateCcw,
    title: "Round Timer",
    description: "Fixed-duration rounds with automatic advance. Great for tournament rounds, speed games, and elimination-style board game nights.",
    href: "/board-games/round-timer",
    cta: "Use Round Timer",
  },
];

const GAME_TIMER_FAQ = [
  {
    question: "What is a game timer?",
    answer: "A game timer is a countdown tool designed to manage time during turn-based and competitive games. Unlike a simple stopwatch, game timers track time per player or per round, keeping games moving at a fair pace and preventing analysis paralysis.",
  },
  {
    question: "Chess clock vs turn timer — which should I use for board games?",
    answer: "Use a <strong>chess clock</strong> when each player should manage a total time budget across all their turns — the pressure builds as time runs low. Use a <strong>turn timer</strong> when every player should get exactly the same time per move, and unused time doesn't carry over. Chess clocks suit competitive play; turn timers suit casual game nights.",
  },
  {
    question: "What is the best timer for Catan?",
    answer: "A <a href='/board-games/turn-timer'>turn timer</a> set to 60–90 seconds per turn works well for Catan. It prevents long trade negotiations from stalling the game while still giving players enough time to think. For faster play, try 45 seconds.",
  },
  {
    question: "How do I use GoTimer for Go (byoyomi)?",
    answer: "Set the <a href='/chess-clock#go-clock'>chess clock</a> to your agreed main time (20–60 minutes for casual play). When a player's main time runs out, switch to manual byoyomi tracking using 30s or 60s countdown periods. Full setup instructions are on the chess clock page.",
  },
  {
    question: "Do I need a timer for casual board games?",
    answer: "Not always — but a timer transforms a 3-hour game night into a focused 90-minute session. Even a loose turn timer (90 seconds, no strict enforcement) keeps energy up and prevents one player from dominating decision time.",
  },
];

const RELATED_TIMERS = [
  { name: "Turn Timer", href: "/board-games/turn-timer", description: "Multi-player per-turn countdown for 2–8 board game players" },
  { name: "Chess Clock", href: "/board-games/chess-clock", description: "Two-player time bank for chess, Scrabble, Go, and Backgammon" },
  { name: "Round Timer", href: "/board-games/round-timer", description: "Fixed rounds for tournaments and elimination-style game nights" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple configurable countdown with audio alert" },
];

export default function GameTimerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-14 md:pt-20">
        {/* Hero */}
        <header className="relative overflow-hidden bg-primary">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-secondary/10 rotate-12 rounded-3xl" />
          <div className="relative max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="size-5 text-primary-foreground/60" />
              <span className="text-sm font-bold text-primary-foreground/60 uppercase tracking-wider">
                Board Games
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-[1.1] tracking-tight font-headline max-w-3xl mb-6">
              Free Online Game Timer
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl leading-relaxed">
              Turn timers, chess clocks, and round timers for board games — free, no download, no sign-up.
            </p>
          </div>
        </header>

        {/* Timer cards */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-black text-primary font-headline tracking-tight mb-8">
            Choose Your Game Timer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIMER_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex flex-col gap-4 bg-surface-container-low rounded-2xl p-6 hover:bg-surface-container-high hover:shadow-md transition-all no-underline"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-headline font-black text-lg text-foreground mb-2">
                      {card.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <span className="mt-auto text-sm font-bold text-secondary group-hover:text-secondary/80 transition-colors">
                    {card.cta} →
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/board-games"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors no-underline"
            >
              Browse all board game timers →
            </Link>
          </div>
        </section>

        {/* SEO content */}
        <TimerSeoContent
          timer_name="Game Timer"
          category_name="Board Games"
          category_slug="board-games"
          faq={GAME_TIMER_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What Is a Game Timer?</h2>
          <p>
            A game timer is a countdown tool designed for turn-based and competitive games. Unlike
            a simple stopwatch, game timers track time per player or per round, ensuring every
            participant has a fair and equal share of time. They prevent analysis paralysis — the
            frustrating tendency for one player to take far longer than others on a single turn —
            and keep game nights moving at a fun pace.
          </p>
          <p>
            There are three main types of game timer, each suited to different game formats and
            player preferences.
          </p>

          <h2>Turn Timers: Equal Time Per Move</h2>
          <p>
            A <strong>turn timer</strong> resets at the start of every player&apos;s turn. Each
            player gets the same amount of time — say, 60 seconds — and once it expires, the turn
            passes. This is the fairest format for games where every decision is of roughly equal
            weight, such as:
          </p>
          <ul>
            <li><strong>Catan</strong> — prevents one player from spending 10 minutes on a trade while everyone else waits.</li>
            <li><strong>Carcassonne</strong> — keeps tile placement decisions snappy.</li>
            <li><strong>Ticket to Ride</strong> — enforces turn limits in competitive play.</li>
            <li><strong>Party games</strong> — Codenames, Concept, and Dixit all benefit from per-turn time pressure.</li>
          </ul>
          <p>
            GoTimer&apos;s <a href="/board-games/turn-timer">turn timer</a> supports 2–8 players
            with named player slots, per-player time tracking, and a simple tap-to-advance interface.
          </p>

          <h2>Chess Clocks: Time Bank Across All Turns</h2>
          <p>
            A <strong>chess clock</strong> gives each player a single time bank that depletes
            across all their turns combined. Spend five minutes on one move and you have five fewer
            minutes for the rest of the game. This rewards time management and is the standard
            format for competitive chess, Scrabble, Go, and Backgammon.
          </p>
          <p>
            The key difference from a turn timer: a chess clock never resets between turns. Every
            second you spend is gone. For Go (Baduk/Weiqi) players, the chess clock includes a
            dedicated <a href="/chess-clock#go-clock">byoyomi setup guide</a> covering main time
            configuration and period lengths for casual and club play.
          </p>

          <h2>Round Timers: Fixed Duration Rounds</h2>
          <p>
            A <strong>round timer</strong> counts down a fixed duration for an entire round, then
            advances automatically. All players act simultaneously within the round, or the round
            represents a phase of play. This format suits tournament play, simultaneous-action
            games like Sushi Go! and 7 Wonders, and game nights with a schedule to keep.
          </p>

          <h2>Which Game Timer Should I Use?</h2>
          <ul>
            <li><strong>2 players, alternating turns</strong> → <a href="/board-games/chess-clock">Chess Clock</a></li>
            <li><strong>3–8 players, one player acts at a time</strong> → <a href="/board-games/turn-timer">Turn Timer</a></li>
            <li><strong>All players act simultaneously in rounds</strong> → <a href="/board-games/round-timer">Round Timer</a></li>
            <li><strong>Go / Baduk with byoyomi</strong> → <a href="/chess-clock#go-clock">Chess Clock (byoyomi guide)</a></li>
          </ul>
        </TimerSeoContent>
      </main>
      <Footer />
    </>
  );
}
