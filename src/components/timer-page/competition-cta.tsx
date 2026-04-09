import React from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";

interface CompetitionCtaProps {
  timer_type: string;
  cta_text?: string;
}

export default function CompetitionCta({ timer_type, cta_text }: CompetitionCtaProps) {
  return (
    <section className="w-full bg-orange-500 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-white">
        <Trophy className="w-8 h-8 shrink-0" />
        <div>
          <h2 className="text-lg sm:text-xl font-bold">
            {cta_text ?? "Make it a Competition"}
          </h2>
          <p className="text-orange-100 text-sm mt-0.5">
            Challenge friends and track scores together
          </p>
        </div>
      </div>
      <Link
        href={`/challenges/create?timer_type=${encodeURIComponent(timer_type)}`}
        className="shrink-0 bg-white text-orange-600 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors no-underline text-sm sm:text-base"
      >
        Create Challenge
      </Link>
    </section>
  );
}
