import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
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
    description: "Every Minute on the Minute. Complete your reps, rest the remainder of the minute, repeat.",
    href: "/fitness/emom",
    cta: "Start EMOM Timer",
  },
];

const INTERVAL_TIMER_FAQ = [
  {
    question: "What is an interval timer?",
    answer: "An interval timer automatically alternates between work and rest periods, signalling each transition with an audio cue. It lets you focus entirely on your effort instead of watching a clock, which improves workout quality and consistency.",
  },
  {
    question: "What is the difference between HIIT and Tabata?",
    answer: "Tabata is a specific HIIT protocol: exactly 20 seconds on, 10 seconds off, 8 rounds (4 minutes total). <strong>HIIT</strong> is the broader category — any alternating work/rest structure. Tabata is HIIT, but HIIT is not always Tabata. Use Tabata when you want a fixed, research-backed protocol; use HIIT when you want to customise your work and rest durations.",
  },
  {
    question: "How many rounds should I do for HIIT?",
    answer: "Most HIIT sessions run 4–8 rounds per exercise with 3–5 exercises total. A good starting point is 8 rounds of 30s on / 30s off per exercise. Increase rounds or reduce rest as your fitness improves. The <a href='/fitness/hiit'>HIIT timer</a> lets you configure rounds, work time, and rest time freely.",
  },
  {
    question: "Can I use an interval timer for strength training?",
    answer: "Yes — <a href='/fitness/emom'>EMOM</a> (Every Minute on the Minute) is the most popular strength training interval format. Complete your reps within the minute, rest the remainder, and start again when the next minute begins. This builds work capacity and enforces consistent rest between sets.",
  },
  {
    question: "Is a 20-minute HIIT workout effective?",
    answer: "Yes. Research shows that 20 minutes of high-intensity interval work produces cardiovascular and metabolic benefits comparable to 40+ minutes of steady-state cardio. The key is genuinely high effort during the work periods — the timer keeps you honest.",
  },
];

const RELATED_TIMERS = [
  { name: "HIIT Timer", href: "/fitness/hiit", description: "Configurable work/rest intervals for high-intensity training" },
  { name: "Tabata Timer", href: "/fitness/tabata", description: "20s on / 10s off, 8 rounds — the classic Tabata protocol" },
  { name: "EMOM Timer", href: "/fitness/emom", description: "Every Minute on the Minute for strength and conditioning" },
  { name: "Rest Timer", href: "/fitness/rest-timer", description: "Simple rest timer between strength training sets" },
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

        {/* SEO content */}
        <TimerSeoContent
          timer_name="Interval Timer"
          category_name="Fitness"
          category_slug="fitness"
          faq={INTERVAL_TIMER_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What is an interval timer?</h2>
          <p>
            An interval timer is a workout timer that automatically alternates between
            higher-intensity work periods and lower-intensity rest periods. Instead of running
            at a steady pace, you push hard for a set duration, recover for a set duration, and
            repeat for a number of rounds. This structure — known as interval training — lets
            you accumulate more high-intensity work than you could sustain continuously,
            improving cardiovascular fitness and burning more calories than steady-state cardio
            in less total time.
          </p>
          <p>
            A good interval timer manages the work and rest periods automatically with audio
            cues, so you can focus entirely on the effort and never have to watch the clock.
            GoTimer&apos;s free online interval timer handles all the popular formats — HIIT, Tabata,
            EMOM, and fully custom intervals — with full-screen display and no app install.
          </p>

          <h2>Why use an interval timer instead of a stopwatch?</h2>
          <p>
            Running intervals from a stopwatch means constantly switching attention between
            your form and the screen. You miss the start of rest periods, your work intervals
            drift, and your heart rate never settles into the rhythm the protocol is designed
            for. An interval timer fixes this with three things a stopwatch can&apos;t:
          </p>
          <ul>
            <li>
              <strong>Audio cues at every transition.</strong> A clear beep marks the switch
              from work to rest and back, so you don&apos;t need to look at the screen.
            </li>
            <li>
              <strong>Automatic round counting.</strong> You don&apos;t have to remember which
              round you&apos;re on — the timer tracks it and stops when you&apos;re done.
            </li>
            <li>
              <strong>Total time visibility.</strong> Full-screen mode shows you what&apos;s
              coming next and how long is left in the current interval, so pacing decisions
              are easy.
            </li>
          </ul>

          <h2>HIIT vs Tabata vs EMOM — which interval timer protocol should you use?</h2>
          <p>The three most common interval training formats each have distinct structures and goals:</p>
          <ul>
            <li>
              <strong>HIIT (High-Intensity Interval Training)</strong> — the umbrella term for
              any workout alternating high-intensity effort with rest. Work-to-rest ratio is
              flexible: 40s/20s, 30s/30s, 45s/15s. Use the <Link href="/fitness/hiit">HIIT timer</Link>{" "}
              when you want full control over work duration, rest duration, and round count.
              Best for: general conditioning, fat loss, varied protocols.
            </li>
            <li>
              <strong>Tabata</strong> — a specific protocol: 20 seconds of all-out effort, 10
              seconds of rest, 8 rounds (4 minutes per exercise). The fixed structure makes it
              simple to execute and easy to compare progress over time. Use the{" "}
              <Link href="/fitness/tabata">Tabata timer</Link> when you want a proven protocol
              with no configuration. Best for: maximum intensity in minimum time.
            </li>
            <li>
              <strong>EMOM (Every Minute on the Minute)</strong> — complete a prescribed set
              of reps within each 60-second minute; rest the remainder. Popular in CrossFit
              and weightlifting for building work capacity and pacing. Use the{" "}
              <Link href="/fitness/emom">EMOM timer</Link> for strength circuits and
              conditioning blocks. Best for: strength endurance, controlled pacing.
            </li>
          </ul>

          <h2>How to choose the right interval timer settings</h2>
          <p>
            Your interval timer settings should match your goal and current fitness level. A
            few starting points:
          </p>
          <ul>
            <li>
              <strong>New to intervals?</strong> Start with{" "}
              <Link href="/fitness/hiit">HIIT</Link> at 30s on / 30s off for 8 rounds
              (8 minutes total). The 1:1 work-rest ratio is the most manageable entry point.
            </li>
            <li>
              <strong>Intermediate, short on time?</strong>{" "}
              <Link href="/fitness/tabata">Tabata</Link> delivers maximum intensity in exactly
              4 minutes per exercise. Two Tabatas with 1 minute between is a complete 9-minute
              workout.
            </li>
            <li>
              <strong>Strength training?</strong>{" "}
              <Link href="/fitness/emom">EMOM</Link> keeps rest honest and builds consistent
              pacing for barbell or kettlebell work. Start with 10 minutes of EMOM at a
              manageable rep count.
            </li>
            <li>
              <strong>Running intervals?</strong> Try 60s work / 60s easy jog for 10 rounds —
              effective for both 5K training and general aerobic capacity.
            </li>
            <li>
              <strong>Custom protocol?</strong>{" "}
              <Link href="/fitness/hiit">HIIT</Link> lets you dial in any work/rest/rounds
              combination, from 10s/50s recovery work all the way to 90s/30s long-effort
              intervals.
            </li>
          </ul>

          <h2>Interval timer exercise ideas</h2>
          <p>
            An interval timer pairs with almost any bodyweight or weighted exercise. Some
            popular rotations:
          </p>
          <ul>
            <li>
              <strong>Full-body HIIT (no equipment):</strong> burpees → mountain climbers →
              squat jumps → high knees → push-ups → plank shoulder taps. 40s work / 20s rest
              for 2 rounds of each (12 minutes total).
            </li>
            <li>
              <strong>Tabata cardio finisher:</strong> jumping jacks for one Tabata, then
              squat jumps for another. 8 minutes of work, done.
            </li>
            <li>
              <strong>Kettlebell EMOM:</strong> 10 kettlebell swings every minute on the
              minute for 10 minutes. 100 swings, brutal but achievable.
            </li>
            <li>
              <strong>Running 30/30s:</strong> sprint 30 seconds, jog 30 seconds, repeat 10
              times. Treadmill or outdoor.
            </li>
          </ul>

          <h2>Tips for getting the most out of an online interval timer</h2>
          <ul>
            <li>
              <strong>Use full-screen mode.</strong> Tap the full-screen icon so the
              countdown and round number are visible from across the room. Especially
              useful for floor exercises.
            </li>
            <li>
              <strong>Set volume high enough.</strong> Audio cues only work if you can hear
              them over your breathing. Test before starting.
            </li>
            <li>
              <strong>Prop your device at eye level.</strong> Looking down at a flat phone
              breaks form on burpees and squats. Stand the device on a chair or counter.
            </li>
            <li>
              <strong>Warm up before high-intensity intervals.</strong> 3–5 minutes of light
              movement reduces injury risk and lets your first hard interval feel like a
              hard interval, not a panicked sprint.
            </li>
          </ul>
        </TimerSeoContent>
      </main>
      <Footer />
    </>
  );
}
