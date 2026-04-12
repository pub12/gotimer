import React from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";

interface CompetitionCtaProps {
  timer_type: string;
  cta_text?: string;
}

export default function CompetitionCta({ timer_type, cta_text }: CompetitionCtaProps) {
  return (
    <section className="w-full bg-secondary rounded-[1rem] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3 text-secondary-foreground">
        <Trophy className="w-8 h-8 shrink-0" />
        <div>
          <h2 className="text-lg sm:text-xl font-headline font-black">
            {cta_text ?? "Make it a Competition"}
          </h2>
          <p className="text-secondary-foreground/80 text-sm mt-0.5">
            Challenge friends and track scores together
          </p>
        </div>
      </div>
      <Link
        href={`/challenges/create?timer_type=${encodeURIComponent(timer_type)}`}
        className="shrink-0 bg-card text-secondary font-semibold px-6 py-3 rounded-[0.75rem] hover:bg-surface-container-low transition-colors no-underline text-sm sm:text-base"
      >
        Create Challenge
      </Link>
    </section>
  );
}
