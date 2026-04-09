import React from "react";
import Link from "next/link";
import { Trophy, Swords, ArrowRight } from "lucide-react";

export default function LeaderboardTeaser() {
  return (
    <section className="w-full py-12 md:py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#FFA500]/10 text-[#FFA500] rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
          <Trophy className="w-4 h-4" />
          Leaderboards &amp; Challenges
        </div>

        <h2 className="text-2xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
          Challenge Your Friends. Climb the Leaderboard.
        </h2>
        <p className="text-[#2C3E50]/70 max-w-2xl mx-auto mb-10">
          Create head-to-head challenges for any game, track wins and losses over time,
          and see who really deserves bragging rights.
        </p>

        {/* Challenge preview card */}
        <div className="bg-[#1A1A2E] rounded-2xl p-6 md:p-8 max-w-lg mx-auto mb-10 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Swords className="w-5 h-5 text-[#FFA500]" />
            <span className="text-white font-semibold">Sample Challenge</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-white font-mono">7</div>
              <div className="text-xs text-gray-400 mt-1">Player 1</div>
            </div>
            <div className="text-gray-500 text-sm font-medium px-3">vs</div>
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-white font-mono">5</div>
              <div className="text-xs text-gray-400 mt-1">Player 2</div>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-[#FFA500] h-2 rounded-full"
              style={{ width: "58%" }}
            />
          </div>
          <p className="text-xs text-gray-500">12 games played</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/challenges/create"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#FF6B35] hover:bg-[#e85a28] text-white text-lg font-bold transition-colors no-underline"
          >
            Start a Challenge <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/public-challenges"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white text-lg font-semibold transition-colors no-underline"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </section>
  );
}
