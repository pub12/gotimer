import React from "react";
import Link from "next/link";
import {
  Clock,
  Flame,
  Brain,
  Wind,
  CookingPot,
  BookOpen,
  GraduationCap,
  Dice5,
  Focus,
  Presentation,
} from "lucide-react";

const CATEGORIES = [
  {
    icon: Clock,
    title: "Pomodoro",
    description: "25-minute focus sessions with breaks",
    href: "/pomodoro-timer",
  },
  {
    icon: Flame,
    title: "HIIT / Workout",
    description: "Interval training with work and rest periods",
    href: "/hiit-timer",
  },
  {
    icon: Brain,
    title: "Meditation",
    description: "Guided mindfulness with gentle alerts",
    href: "/meditation-timer",
  },
  {
    icon: Wind,
    title: "Breathing",
    description: "Box breathing and relaxation exercises",
    href: "/breathing-timer",
  },
  {
    icon: CookingPot,
    title: "Cooking",
    description: "Kitchen timers for recipes and baking",
    href: "/cooking-timer",
  },
  {
    icon: BookOpen,
    title: "Study",
    description: "Timed study blocks with progress tracking",
    href: "/study-timer",
  },
  {
    icon: GraduationCap,
    title: "Classroom",
    description: "Activity timers for teachers and students",
    href: "/classroom-timer",
  },
  {
    icon: Dice5,
    title: "Board Games",
    description: "Turn timers and chess clocks for game night",
    href: "/board-games",
  },
  {
    icon: Focus,
    title: "ADHD Focus",
    description: "Low-distraction timers for deep work",
    href: "/adhd-focus-timer",
  },
  {
    icon: Presentation,
    title: "Presentation",
    description: "Keep talks and meetings on schedule",
    href: "/presentation-timer",
  },
];

export default function CategoryGrid() {
  return (
    <section className="w-full py-12 md:py-16 px-4 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-[#1A1A2E] mb-3">
          A Timer for Everything
        </h2>
        <p className="text-center text-[#2C3E50]/70 mb-10 max-w-2xl mx-auto">
          Pick your activity. We handle the rest.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-transparent hover:border-[#FF6B35]/30 transition-all no-underline"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-[#2C3E50]/60 mt-0.5">{cat.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
