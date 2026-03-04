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
      <nav className="w-full max-w-2xl py-1 md:mt-4 md:mb-8 flex flex-wrap justify-center gap-4 text-sm shrink-0">
        <Link href="/countdown-setup" className="text-blue-600 hover:text-blue-800">Countdown Timer</Link>
        <span className="text-gray-400">|</span>
        <Link href="/chess-clock-setup" className="text-blue-600 hover:text-blue-800">Chess Clock</Link>
        <span className="text-gray-400">|</span>
        <Link href="/public-challenges" className="text-blue-600 hover:text-blue-800">Public Challenges</Link>
      </nav>
    </main>
  );
}
