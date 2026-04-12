import React from "react";
import { Timer, Swords, Users, type LucideIcon } from "lucide-react";

const STATS: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Timer, value: "12,400+", label: "Timers Started" },
  { icon: Swords, value: "850+", label: "Active Challenges" },
  { icon: Users, value: "2,100+", label: "Users Competing" },
];

export default function SocialProof() {
  return (
    <section className="w-full py-10 md:py-14 px-4 bg-primary">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-primary-foreground/5 rounded-[1rem] p-6 shadow-[var(--shadow-soft)] flex items-start justify-between"
            >
              <div>
                <p className="font-headline font-black text-3xl text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/60 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-[0.75rem] bg-primary-foreground/10">
                <Icon className="size-5 text-primary-foreground/60" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
