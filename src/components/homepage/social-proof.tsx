import React from "react";
import { Timer, Swords, Users } from "lucide-react";

const STATS = [
  { icon: Timer, value: "12,400+", label: "Timers Started" },
  { icon: Swords, value: "850+", label: "Active Challenges" },
  { icon: Users, value: "2,100+", label: "Users Competing" },
];

export default function SocialProof() {
  return (
    <section className="w-full py-10 md:py-14 px-4 bg-[#1A1A2E]">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <Icon className="w-7 h-7 text-[#FF6B35]" />
              <span className="text-3xl md:text-4xl font-bold text-white font-mono">
                {stat.value}
              </span>
              <span className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
