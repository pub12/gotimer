import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Zap, Timer, RefreshCw } from "lucide-react";

const TIMER_CARDS = [
  {
    icon: Zap,
    title: "HIIT Timer",
    description: "High-intensity interval training with configurable work and rest periods. Default 40s work / 20s rest, 8 rounds.",
    href: "/fitness/hiit",
    cta: "Start HIIT Timer",
  },
  {
    icon: RefreshCw,
    title: "Tabata Timer",
    description: "Classic Tabata protocol: 20 seconds on, 10 seconds off, 8 rounds. The original high-intensity interval format.",
    href: "/fitness/tabata",
    cta: "Start Tabata Timer",
  },
  {
    icon: Timer,
    title: "EMOM Timer",
    description: "Every Minute on the Minute. Complete your reps, rest the remainder of the minute, repeat. A staple of CrossFit and strength training.",
    href: "/fitness/emom",
    cta: "Start EMOM Timer",
  },
];

export default function IntervalTimerPage() {
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
              <Zap className="size-5 text-primary-foreground/60" />
              <span className="text-sm font-bold text-primary-foreground/60 uppercase tracking-wider">
                Fitness
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-[1.1] tracking-tight font-headline max-w-3xl mb-6">
              Free Interval Timer
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl leading-relaxed">
              HIIT, Tabata, and EMOM timers for interval training — free, no download, no sign-up.
            </p>
          </div>
        </header>

        {/* Timer cards */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-black text-primary font-headline tracking-tight mb-8">
            Choose Your Interval Format
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
              href="/fitness"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors no-underline"
            >
              Browse all fitness timers →
            </Link>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 pb-12 md:pb-16 prose prose-slate max-w-none">
          <h2>What Is Interval Training?</h2>
          <p>
            Interval training alternates between periods of higher-intensity effort and lower-intensity
            recovery (or rest). Instead of working at a steady pace for the entire workout, you push
            hard for a set period, then recover, and repeat. This structure lets you accumulate more
            high-intensity work than you could sustain continuously, which improves cardiovascular
            fitness, burns more calories, and builds endurance faster than steady-state cardio.
          </p>
          <p>
            An interval timer manages the work and rest periods automatically — you focus entirely on
            the effort, not on watching the clock.
          </p>

          <h2>HIIT vs. Tabata vs. EMOM: What&apos;s the Difference?</h2>
          <p>
            The three most common interval formats each have distinct structures and training goals:
          </p>

          <h3>HIIT (High-Intensity Interval Training)</h3>
          <p>
            <strong>HIIT</strong> is the umbrella term for any workout that alternates high-intensity
            effort with rest or lower-intensity recovery. The work-to-rest ratio is flexible — common
            formats include 40s on / 20s off, 30s on / 30s off, or 45s on / 15s off. HIIT sessions
            typically last 15–30 minutes. Use the{" "}
            <Link href="/fitness/hiit">HIIT timer</Link> when you want full control over work
            duration, rest duration, and round count.
          </p>

          <h3>Tabata</h3>
          <p>
            <strong>Tabata</strong> is a specific HIIT protocol developed by Japanese researcher
            Izumi Tabata: <strong>20 seconds of all-out effort, 10 seconds of rest, repeated
            8 times</strong> for a total of 4 minutes per exercise. The 2:1 work-to-rest ratio and
            the near-maximal intensity are what make Tabata so effective — and so demanding. Use the{" "}
            <Link href="/fitness/tabata">Tabata timer</Link> when you want a fixed, proven protocol
            with no configuration required.
          </p>

          <h3>EMOM (Every Minute on the Minute)</h3>
          <p>
            <strong>EMOM</strong> sets a task to complete within each 60-second minute. Start the
            timer, perform your prescribed reps (e.g., 10 kettlebell swings), and rest for whatever
            time remains in the minute. When the next minute begins, go again. EMOMs are popular in
            CrossFit, Olympic weightlifting, and functional fitness because they build work capacity
            and teach pacing — if your reps take 50 seconds, your rest is only 10 seconds. Use the{" "}
            <Link href="/fitness/emom">EMOM timer</Link> when you want a structured strength or
            conditioning circuit with built-in rest management.
          </p>

          <h2>How to Choose the Right Interval Timer</h2>
          <ul>
            <li>
              <strong>New to intervals?</strong> Start with <Link href="/fitness/hiit">HIIT</Link>{" "}
              at 30s on / 30s off. The equal work-rest ratio is manageable and easy to adjust.
            </li>
            <li>
              <strong>Short on time?</strong> <Link href="/fitness/tabata">Tabata</Link> gives you
              maximum intensity in exactly 4 minutes per exercise.
            </li>
            <li>
              <strong>Strength training?</strong> <Link href="/fitness/emom">EMOM</Link> keeps
              your rest honest and builds consistent pacing for barbell or kettlebell work.
            </li>
            <li>
              <strong>Custom protocol?</strong> <Link href="/fitness/hiit">HIIT</Link> lets you
              dial in any work/rest/rounds combination.
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
