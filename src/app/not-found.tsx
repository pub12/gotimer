import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found - GoTimer",
  description: "The page you're looking for doesn't exist. Browse GoTimer's free board game timers and public challenges.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        This page doesn&apos;t exist. Let&apos;s get you back to the game.
      </p>
      <nav className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 no-underline transition-colors text-lg"
        >
          Home
        </Link>
        <Link
          href="/countdown-setup"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 no-underline transition-colors text-lg"
        >
          Countdown Timer
        </Link>
        <Link
          href="/chess-clock-setup"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 no-underline transition-colors text-lg"
        >
          Chess Clock
        </Link>
        <Link
          href="/public-challenges"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 no-underline transition-colors text-lg"
        >
          Public Challenges
        </Link>
      </nav>
    </main>
  );
}
