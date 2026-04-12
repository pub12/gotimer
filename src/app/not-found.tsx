import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Timer, Clock, RotateCcw, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found - GoTimer",
  description: "The page you're looking for doesn't exist. Browse GoTimer's free board game timers and public challenges.",
};

const timer_links = [
  { href: "/countdown-setup", label: "Countdown Timer", icon: Timer, desc: "Set a time limit and go" },
  { href: "/chess-clock-setup", label: "Chess Clock", icon: Clock, desc: "Two-player turn timer" },
  { href: "/round-timer-setup", label: "Round Timer", icon: RotateCcw, desc: "Multi-round tracking" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-6 text-center">
      <div className="max-w-lg w-full">
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

        <div className="grid gap-3 mt-2">
          {timer_links.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[var(--foreground)]/10 hover:border-[var(--foreground)]/25 hover:bg-[var(--foreground)]/[0.03] transition-colors text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--foreground)]/[0.06]">
                <Icon className="w-5 h-5 text-[var(--foreground)]/70" />
              </div>
              <div>
                <div className="font-semibold text-[var(--foreground)]">{label}</div>
                <div className="text-sm text-[var(--foreground)]/50">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
