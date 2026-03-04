"use client";
// Purpose: Round Timer setup page for the Game Timer app. Allows user to start the round timer.

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/navbar";
import Header from "../../components/header";

/**
 * round_timer_setup_page component displays the setup card for round timer.
 * No configuration needed as timer starts at 0.
 */
export default function RoundTimerSetupPage() {
  const router = useRouter();

  // Handle start button click
  const handle_start = () => {
    router.push("/round-timer");
  };

  return (
    <main className="h-dvh flex flex-col items-center bg-gray-50 px-3 pt-0 pb-2 overflow-hidden md:min-h-screen md:h-auto md:overflow-auto md:p-4 md:pt-20 md:justify-center">
      <Header />
      <Navbar />
      <div className="w-full max-w-2xl flex-1 flex flex-col justify-center md:flex-none md:mb-8">
        <div className="md:hidden flex flex-col items-center gap-4 w-full">
          <h1 className="text-2xl font-bold text-center">Start Round Timer</h1>
          <p className="text-base text-center text-gray-700">
            Track total elapsed time and individual round durations. Perfect for tournament play and timeboxing strategy games.
          </p>
          <Button
            className="w-full text-2xl py-6 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900"
            onClick={handle_start}
          >
            Start
          </Button>
        </div>
        <Card className="shadow-2xl w-full p-0 rounded-3xl hidden md:block">
          <CardContent className="flex flex-col items-center justify-center p-20">
            <h1 className="text-6xl font-bold mb-6 text-center">Start Round Timer</h1>
            <p className="mb-8 text-2xl text-center text-gray-700">
              Track total elapsed time and individual round durations. Perfect for tournament play and timeboxing strategy games.
            </p>
            <Button
              className="w-full text-4xl py-8 mt-8 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900"
              onClick={handle_start}
            >
              Start
            </Button>
          </CardContent>
        </Card>
      </div>
      <section className="w-full max-w-2xl mt-4 md:mt-6 px-1">
        <div className="space-y-2">
          <details className="bg-white rounded-xl shadow p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer text-sm">What is a round timer for board games?</summary>
            <p className="mt-2 text-sm text-gray-600">A round timer tracks both total elapsed time and individual round durations. Unlike a countdown, it counts up — you press a button to mark the end of each round. Ideal for games like Twilight Imperium, Terraforming Mars, and Gloomhaven.</p>
          </details>
          <details className="bg-white rounded-xl shadow p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer text-sm">How do I time a board game tournament?</summary>
            <p className="mt-2 text-sm text-gray-600">Start the timer when the round begins, and press Round Reset when it ends. The total timer keeps running across all rounds while you see individual round durations. This helps organizers stay on schedule.</p>
          </details>
          <details className="bg-white rounded-xl shadow p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer text-sm">What timer should I use for Twilight Imperium?</summary>
            <p className="mt-2 text-sm text-gray-600">Twilight Imperium games can run 4-12+ hours, so a round timer is perfect. It tracks total game time and individual round durations without limits. Many TI groups use it to set soft time targets per round.</p>
          </details>
        </div>
      </section>
      <nav className="w-full max-w-2xl py-1 md:mt-4 md:mb-8 flex flex-wrap justify-center gap-4 text-sm shrink-0">
        <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="text-gray-400">|</span>
        <Link href="/countdown-setup" className="text-blue-600 hover:text-blue-800">Countdown Timer</Link>
        <span className="text-gray-400">|</span>
        <Link href="/chess-clock-setup" className="text-blue-600 hover:text-blue-800">Two-Player Chess Clock</Link>
      </nav>
    </main>
  );
}
