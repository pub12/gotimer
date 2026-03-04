"use client";
// Purpose: Countdown setup page for the Game Timer app. Allows user to configure timer and start countdown.

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/navbar";
import Header from "../../components/header";

/**
 * countdown_setup_page component displays the large card for timer configuration.
 */
export default function CountdownSetupPage() {
  // State for selected time (in seconds)
  const [timer_value, set_timer_value] = useState(60); // default 60 seconds
  const router = useRouter();

  // Preset values in seconds
  const presets = [10, 15, 30, 60];

  // Handle start button click
  const handle_start = () => {
    if (timer_value > 0) {
      router.push(`/countdown?time=${timer_value}`);
    }
  };

  // Format time as mm:ss
  const format_time = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <main className="h-dvh flex flex-col items-center bg-gray-50 px-3 pt-0 pb-2 overflow-hidden md:min-h-screen md:h-auto md:overflow-auto md:p-4 md:pt-20 md:justify-center">
      <Header />
      <Navbar />
      <div className="w-full max-w-2xl flex-1 flex flex-col justify-center md:flex-none md:mb-8">
        <div className="md:hidden flex flex-col items-center gap-3 w-full">
          <h1 className="text-2xl font-bold text-center">Configure Countdown</h1>
          <div className="flex flex-wrap gap-2 w-full justify-center">
            {presets.map((val) => (
              <Button
                key={val}
                type="button"
                onClick={() => set_timer_value(val)}
                className="px-5 py-2 text-lg rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
                variant="ghost"
              >
                {val < 60 ? `${val}s` : `${val / 60}m`}
              </Button>
            ))}
          </div>
          <label className="w-full flex flex-col items-center">
            <input
              type="range"
              min={1}
              max={3600}
              value={timer_value}
              onChange={e => set_timer_value(Number(e.target.value))}
              className="w-full h-3 accent-blue-500"
            />
            <span className="mt-2 text-3xl font-mono">{format_time(timer_value)}</span>
          </label>
          <Button
            className="w-full text-2xl py-5 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 focus:bg-gray-900"
            onClick={handle_start}
          >
            Start
          </Button>
        </div>
        <Card className="shadow-2xl w-full p-0 rounded-3xl hidden md:block">
          <CardContent className="flex flex-col items-center justify-center p-20">
            <h1 className="text-6xl font-bold mb-6 text-center">Configure Countdown Timer</h1>
            <div className="flex flex-wrap gap-4 mb-4 w-full justify-center">
              {presets.map((val) => (
                <Button
                  key={val}
                  type="button"
                  onClick={() => set_timer_value(val)}
                  className="px-6 py-3 text-2xl rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
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
                min={1}
                max={3600}
                value={timer_value}
                onChange={e => set_timer_value(Number(e.target.value))}
                className="w-full h-3 accent-blue-500"
              />
              <span className="mt-4 text-3xl font-mono">{format_time(timer_value)}</span>
            </label>
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
        <Link href="/chess-clock-setup" className="text-blue-600 hover:text-blue-800">Chess Clock</Link>
        <span className="text-gray-400">|</span>
        <Link href="/round-timer-setup" className="text-blue-600 hover:text-blue-800">Round Timer</Link>
        <span className="text-gray-400">|</span>
        <Link href="/public-challenges" className="text-blue-600 hover:text-blue-800">Public Challenges</Link>
      </nav>
    </main>
  );
} 