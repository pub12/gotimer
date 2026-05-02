import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 pb-12 md:pb-16 prose prose-slate max-w-none">
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
            GoTimer&apos;s <Link href="/board-games/turn-timer">turn timer</Link> supports 2–8
            players with named player slots, per-player time tracking, and a simple tap-to-advance
            interface.
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
            second you spend is gone. This creates a different kind of pressure — you must judge
            when a position is &ldquo;good enough&rdquo; rather than perfect.
          </p>
          <p>
            For Go (Baduk/Weiqi) players, our chess clock includes a{" "}
            <Link href="/chess-clock#go-clock">dedicated byoyomi setup guide</Link> covering main
            time configuration and period lengths for casual and club play.
          </p>

          <h2>Round Timers: Fixed Duration Rounds</h2>
          <p>
            A <strong>round timer</strong> counts down a fixed duration for an entire round, then
            advances automatically. All players act simultaneously within the round, or the round
            represents a phase of play. This format suits:
          </p>
          <ul>
            <li><strong>Tournament play</strong> — each round of a board game tournament has a fixed duration.</li>
            <li><strong>Speed games</strong> — simultaneous-action games like Sushi Go! and 7 Wonders.</li>
            <li><strong>Elimination rounds</strong> — progressive rounds in trivia or pub quiz formats.</li>
          </ul>

          <h2>Which Game Timer Should I Use?</h2>
          <p>
            Use this guide to pick the right timer:
          </p>
          <ul>
            <li><strong>2 players, alternating turns</strong> → <Link href="/board-games/chess-clock">Chess Clock</Link></li>
            <li><strong>3–8 players, one player acts at a time</strong> → <Link href="/board-games/turn-timer">Turn Timer</Link></li>
            <li><strong>All players act simultaneously in rounds</strong> → <Link href="/board-games/round-timer">Round Timer</Link></li>
            <li><strong>Go / Baduk with byoyomi</strong> → <Link href="/chess-clock#go-clock">Chess Clock (byoyomi guide)</Link></li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
