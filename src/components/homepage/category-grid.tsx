import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  Timer,
  Egg,
  Utensils,
  Moon,
  Bed,
  type LucideIcon,
} from "lucide-react";

// Map timer page slugs to icons and short descriptions
const SLUG_META: Record<string, { icon: LucideIcon; description: string }> = {
  "pomodoro-timer": { icon: Clock, description: "25-minute focus sessions with breaks" },
  "hiit-timer": { icon: Flame, description: "Interval training with work and rest periods" },
  "meditation-timer": { icon: Brain, description: "Guided mindfulness with gentle alerts" },
  "breathing-timer": { icon: Wind, description: "Box breathing and relaxation exercises" },
  "cooking-timer": { icon: CookingPot, description: "Kitchen timers for recipes and baking" },
  "study-timer": { icon: BookOpen, description: "Timed study blocks with progress tracking" },
  "classroom-timer": { icon: GraduationCap, description: "Activity timers for teachers and students" },
  "adhd-focus-timer": { icon: Focus, description: "Low-distraction timers for deep work" },
  "presentation-timer": { icon: Presentation, description: "Keep talks and meetings on schedule" },
  "egg-timer": { icon: Egg, description: "Perfect eggs every time with precision timing" },
  "fasting-timer": { icon: Utensils, description: "Track intermittent fasting windows" },
  "sleep-timer": { icon: Moon, description: "Wind-down timers for better sleep" },
  "5-minute-timer": { icon: Timer, description: "Quick 5-minute countdown" },
  "10-minute-timer": { icon: Timer, description: "10-minute countdown timer" },
  "15-minute-timer": { icon: Timer, description: "15-minute countdown timer" },
  "20-minute-timer": { icon: Timer, description: "20-minute countdown timer" },
  "25-minute-timer": { icon: Timer, description: "25-minute countdown timer" },
  "30-minute-timer": { icon: Timer, description: "30-minute countdown timer" },
  "45-minute-timer": { icon: Timer, description: "45-minute countdown timer" },
  "60-minute-timer": { icon: Timer, description: "60-minute countdown timer" },
};

// Static entries that aren't timer pages (always shown)
const STATIC_ENTRIES = [
  {
    icon: Dice5,
    title: "Board Games",
    description: "Turn timers and chess clocks for game night",
    href: "/board-games",
  },
];

// Display title: strip "Free" prefix and "Online" suffix, or use as-is
function display_title(title: string, slug: string): string {
  // Use slug-derived short name for cleaner display
  const short = slug
    .replace(/-/g, " ")
    .replace(/\btimer\b/i, "")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
  // For duration timers, keep the number format
  if (/^\d+/.test(slug)) {
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return short || title;
}

export default function CategoryGrid({
  published_pages = [],
}: {
  published_pages?: { slug: string; title: string; timer_type: string }[];
}) {
  // Build dynamic entries from published pages
  const dynamic_entries = published_pages.map((page) => {
    const meta = SLUG_META[page.slug];
    return {
      icon: meta?.icon || Timer,
      title: display_title(page.title, page.slug),
      description: meta?.description || page.title,
      href: `/${page.slug}`,
    };
  });

  // Combine: dynamic published pages first, then static entries
  const all_entries = [...dynamic_entries, ...STATIC_ENTRIES];

  return (
    <section className="w-full py-12 md:py-16 px-4 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/mascots/drake-timer.png"
            alt="Drake the Explorer holding a stopwatch"
            width={120}
            height={120}
            className="w-24 h-24 md:w-28 md:h-28 object-contain mb-4"
          />
          <h2 className="font-headline font-black text-2xl md:text-4xl text-center text-foreground mb-3">
            A Timer for Everything
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Pick your activity. We handle the rest.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {all_entries.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex items-start gap-4 bg-surface-container-low rounded-[1rem] p-5 shadow-[var(--shadow-soft)] hover:scale-105 transition-all duration-200 ease-out no-underline"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-[0.75rem] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{cat.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
