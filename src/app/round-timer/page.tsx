"use client";
// Purpose: Round Timer page for the Game Timer app. Displays total elapsed time and current round time with count-up functionality.

import React, { useEffect, useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Volume2, VolumeX, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import Footer from "../../components/footer";

/**
 * round_timer_page_content component displays dual timers: total elapsed time and current round time.
 * Total time counts up continuously, round time resets on button press.
 */
export default function RoundTimerPage() {
  const router = useRouter();
  const [total_time, set_total_time] = useState(0);
  const [round_time, set_round_time] = useState(0);
  const [running, set_running] = useState(true);
  const [audio_enabled, set_audio_enabled] = useState(false);
  const [previous_round_times, set_previous_round_times] = useState<number[]>([]);
  const audio_context_ref = useRef<AudioContext | null>(null);

  // Toggle audio context and enabled state
  const toggle_audio = () => {
    if (!audio_enabled) {
      try {
        if (!audio_context_ref.current) {
          audio_context_ref.current = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })?.webkitAudioContext)();
        }
        set_audio_enabled(true);
      } catch {
        // Audio not supported in this browser
      }
    } else {
      set_audio_enabled(false);
    }
  };

  // Count-up effect for both timers
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      set_total_time((prev) => prev + 1);
      set_round_time((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Format time as mm:ss or hh:mm:ss for longer durations
  const format_time = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Handle round reset - log previous round time and reset round timer
  const handle_round_reset = () => {
    if (round_time > 0) {
      set_previous_round_times((prev) => [...prev, round_time]);
    }
    set_round_time(0);
    // Total time continues running
  };

  // Handle pause/resume
  const handle_pause = () => set_running((p) => !p);

  // Handle navigation to round timer setup
  const handle_settings = () => {
    router.push("/round-timer-setup");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-2 pt-20 w-full overflow-x-hidden">
      {/* Header */}
      <Header />
      {/* Navbar */}
      <Navbar />
      <h1 className="text-2xl md:text-5xl font-bold mb-6 text-center text-gray-900">
        Total & Round Time Tracker
      </h1>
      <div className="flex flex-col items-center gap-10 w-full max-w-2xl mx-auto">
        {/* Sound Toggle Icon Button */}
        <button
          aria-label={audio_enabled ? "Disable Sound" : "Enable Sound"}
          onClick={toggle_audio}
          className={`mb-2 rounded-full ${audio_enabled ? "bg-blue-100 hover:bg-blue-200" : "bg-gray-200 hover:bg-gray-300"} p-4 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          style={{ fontSize: 40 }}
        >
          {audio_enabled ? (
            <Volume2 className="text-blue-600" size={40} />
          ) : (
            <VolumeX className="text-gray-500" size={40} />
          )}
        </button>

        {/* Dual Timer Display */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Total Time Display */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl md:text-2xl font-semibold mb-2 text-gray-700">Total Time</span>
            <span
              className="font-mono font-bold tracking-widest select-none leading-none w-full text-center"
              style={{
                fontSize: "clamp(2.5rem, 15vw, 8rem)",
                wordBreak: "break-all",
                lineHeight: 1.1,
                display: "block",
              }}
            >
              {format_time(total_time)}
            </span>
          </div>

          {/* Round Time Display */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl md:text-2xl font-semibold mb-2 text-gray-700">Round Time</span>
            <span
              className="font-mono font-bold tracking-widest select-none leading-none w-full text-center"
              style={{
                fontSize: "clamp(2.5rem, 15vw, 8rem)",
                wordBreak: "break-all",
                lineHeight: 1.1,
                display: "block",
              }}
            >
              {format_time(round_time)}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col gap-6 items-center w-full">
          {/* Round Reset Button */}
          <Button
            onClick={handle_round_reset}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-2xl md:text-4xl px-0 py-8 rounded-2xl shadow-2xl w-full max-w-full font-bold"
            style={{ minHeight: "6rem" }}
          >
            Round Reset
          </Button>

          {/* Previous Rounds List */}
          {previous_round_times.length > 0 && (
            <div className="w-full max-w-md mt-4">
              <h2 className="text-lg md:text-xl font-semibold mb-3 text-center text-gray-700">
                Previous Rounds
              </h2>
              <div className="bg-white rounded-xl shadow-lg p-4 max-h-48 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {previous_round_times.map((time, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm md:text-base font-medium text-gray-700">
                        Round {index + 1}
                      </span>
                      <span className="text-sm md:text-base font-mono font-semibold text-gray-900">
                        {format_time(time)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pause/Resume and Settings */}
          <div className="flex gap-4 items-center w-full max-w-full">
            <Button
              onClick={handle_pause}
              className="text-white bg-orange-500 hover:bg-orange-600 focus:bg-orange-700 text-2xl md:text-4xl px-0 py-8 rounded-2xl shadow-2xl flex-1 font-bold"
              style={{ minHeight: "6rem" }}
            >
              {running ? "Pause" : "Resume"}
            </Button>
            <button
              onClick={handle_settings}
              aria-label="Change Settings"
              className="bg-gray-600 hover:bg-gray-700 text-white p-6 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
              style={{ minHeight: "6rem", minWidth: "6rem" }}
            >
              <Settings size={40} />
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </main>
  );
}


