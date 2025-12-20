"use client";
// Purpose: Chess Clock setup page for the Game Timer app. Allows user to select total timer duration for chess clock.

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import Footer from "../../components/footer";

/**
 * chess_clock_setup_page component displays the card for chess clock timer configuration.
 */
export default function ChessClockSetupPage() {
  // State for selected time (in seconds)
  const [timer_value, set_timer_value] = useState(300); // default 5 minutes

  // Preset values in seconds
  const presets = [120, 300, 600, 1200, 1800, 3600];

  // Format time as mm:ss
  const format_time = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const router = useRouter();

  // Handle start button click
  const handle_start = () => {
    router.push(`/chess-clock?time=${timer_value}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 pt-20">
      {/* Header */}
      <Header />
      {/* Navbar */}
      <Navbar />
      {/* Chess Clock Setup Card */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-center">
        <Card className="shadow-2xl w-full p-0 rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center p-12 md:p-20">
            <span className="text-4xl md:text-6xl font-bold mb-6">Configure Chess Clock</span>
            <span className="mb-4 text-lg md:text-2xl">Select total timer duration per player</span>
            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-4 mb-4 w-full justify-center">
              {presets.map((val) => (
                <Button
                  key={val}
                  type="button"
                  onClick={() => set_timer_value(val)}
                  className="px-6 py-3 text-xl md:text-2xl rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
                  variant="ghost"
                >
                  {val < 60 ? `${val}s` : `${val / 60}m`}
                </Button>
              ))}
            </div>
            <label className="w-full flex flex-col items-center">
              <span className="mb-2 text-2xl">Set Time</span>
              <input
                type="range"
                min={10}
                max={3600}
                value={timer_value}
                onChange={e => set_timer_value(Number(e.target.value))}
                className="w-full h-3 accent-blue-500"
              />
              <span className="mt-4 text-3xl font-mono">{format_time(timer_value)}</span>
            </label>
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