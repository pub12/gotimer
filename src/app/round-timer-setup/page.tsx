"use client";
// Purpose: Round Timer setup page for the Game Timer app. Allows user to start the round timer.

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import Footer from "../../components/footer";

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 pt-20">
      {/* Header */}
      <Header />
      {/* Navbar */}
      <Navbar />
      {/* Large Round Timer Setup Card */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-center">
        <Card className="shadow-2xl w-full p-0 rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center p-12 md:p-20">
            <span className="text-4xl md:text-6xl font-bold mb-6">Start Round Timer</span>
            <p className="mb-8 text-lg md:text-2xl text-center text-gray-700">
              Track total elapsed time and individual round durations. Perfect for tournament play and timeboxing strategy games.
            </p>
            <Button
              className="w-full text-3xl md:text-4xl py-8 mt-8 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900"
              onClick={handle_start}
            >
              Start
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Footer */}
      <Footer />
    </main>
  );
}


