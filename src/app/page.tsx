"use client";
// Purpose: Home page for the Game Timer app. Displays a large Countdown button that navigates to the setup page.
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Footer from "../components/footer";

/**
 * home_page component displays the main entry with a large Countdown button.
 */
export default function HomePage() {
  const router = useRouter();

  // Handle navigation to countdown setup
  const handle_countdown = () => {
    router.push("/countdown-setup");
  };

  // Handle navigation to chess clock setup
  const handle_chess_clock = () => {
    router.push("/chess-clock-setup");
  };

  // Handle navigation to round timer setup
  const handle_round_timer = () => {
    router.push("/round-timer-setup");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 pt-20">
      {/* Header */}
      <Header />
      {/* Navbar */}
      <Navbar />
      <h1 className="text-3xl md:text-6xl font-bold mb-8 text-center text-gray-900">
        Choose Your Timer
      </h1>
      {/* Large Countdown Button */}
      <div className="flex flex-col flex-1 items-center justify-center w-full h-full gap-8">
        <Button
          className="text-3xl md:text-5xl px-16 py-10 rounded-2xl shadow-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900"
          onClick={handle_countdown}
        >
          Countdown
        </Button>
        <Button
          className="text-3xl md:text-5xl px-16 py-10 rounded-2xl shadow-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900"
          onClick={handle_chess_clock}
        >
          Chess Clock
        </Button>
        <Button
          className="text-3xl md:text-5xl px-16 py-10 rounded-2xl shadow-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900"
          onClick={handle_round_timer}
        >
          Round Timer
        </Button>
      </div>
      {/* Description Section */}
      <section className="w-full max-w-2xl mx-auto mt-12 mb-8 p-6 bg-white rounded-xl shadow text-gray-800">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Simple Game Timers</h2>
        <ul className="mb-4 list-disc list-inside space-y-2">
          <li>
            <span className="font-semibold">Countdown Timer:</span> Set a timer for any duration. Great for board games, workouts, or any activity where you need a single countdown.
          </li>
          <li>
            <span className="font-semibold">Chess Clock:</span> Two-player timer where each player has their own clock. Tap your side after your move. Perfect for chess, Scrabble, or any turn-based game.
          </li>
          <li>
            <span className="font-semibold">Round Timer:</span> Count-up timer that tracks total elapsed time and individual round durations. Reset rounds while keeping total time running. Perfect for tournament play and timeboxing strategy games like Twilight Imperium or Terraforming Mars.
          </li>
        </ul>
        <div className="mt-2 text-base">
          For further support or feature requests, contact <a href="mailto:pubs@hazoservices.com" className="text-blue-600 underline">pubs@hazoservices.com</a>.
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </main>
  );
}
