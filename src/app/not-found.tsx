import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Timer, Home, ArrowRight } from "lucide-react";
import { SITE_CATEGORIES } from "@/lib/site-categories";

export const metadata: Metadata = {
  title: "Page Not Found - GoTimer",
  description: "The page you're looking for doesn't exist. Browse GoTimer's free board game timers and public challenges.",
};

const TIMER_ROUTE_MAP: Record<string, string> = {
  "countdown": "/countdown",
  "chess-clock": "/chess-clock",
  "round-timer": "/round-timer",
  "pomodoro": "/pomodoro-timer",
  "study": "/study-timer",
  "adhd-focus": "/adhd-focus-timer",
  "classroom": "/classroom-timer",
  "presentation": "/presentation-timer",
  "hiit": "/hiit-timer",
  "meditation": "/meditation-timer",
  "breathing": "/breathing-timer",
  "sleep": "/sleep-timer",
  "fasting": "/fasting-timer",
  "cooking": "/cooking-timer",
  "eggs": "/egg-timer",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[var(--background)] p-6 text-center">
      <div className="max-w-lg w-full mt-20">
        <Image
          src="/mascots/drake-searching.png"
          alt="Drake the mascot searching for the page"
          width={421}
          height={512}
          className="mx-auto w-48 h-auto mb-6 drop-shadow-lg"
          priority
        />

        <h1 className="text-7xl font-[var(--font-lexend)] font-black text-[var(--foreground)] tracking-tight mb-2">
          404
        </h1>
        <p className="text-lg text-[var(--foreground)]/60 mb-10">
          Looks like this page ran out of time.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity text-lg mb-10"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>

      {/* Category grid */}
      <div className="max-w-4xl w-full mt-16 mb-12">
        <h2 className="font-[var(--font-lexend)] font-black text-2xl text-[var(--foreground)] mb-8">
          Browse All Timers
        </h2>
        {SITE_CATEGORIES.map((category) => {
          const featured = category.timers.filter((t) =>
            category.featured_timers.includes(t.slug),
          ).slice(0, 3);

          return (
            <div key={category.slug} className="mb-10 text-left">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/${category.slug}`}
                  className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
                >
                  {(() => { const Icon = category.icon; return <Icon className="w-5 h-5 text-[var(--secondary)]" />; })()}
                  <h3 className="font-[var(--font-lexend)] font-black text-lg text-[var(--foreground)]">
                    {category.name}
                  </h3>
                </Link>
                <Link
                  href={`/${category.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors no-underline"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {featured.map((timer) => {
                  const href = TIMER_ROUTE_MAP[timer.slug] || `/${category.slug}/${timer.slug}`;
                  return (
                    <Link
                      key={timer.slug}
                      href={href}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[var(--foreground)]/10 hover:border-[var(--foreground)]/25 hover:bg-[var(--foreground)]/[0.03] transition-colors no-underline"
                    >
                      <Timer className="w-4 h-4 mt-0.5 text-[var(--foreground)]/40 shrink-0" />
                      <div>
                        <div className="font-semibold text-sm text-[var(--foreground)]">{timer.name}</div>
                        <div className="text-xs text-[var(--foreground)]/50">{timer.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
