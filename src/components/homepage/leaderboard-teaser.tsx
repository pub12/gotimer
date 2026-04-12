import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Swords, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LeaderboardTeaser() {
  return (
    <section className="w-full py-12 md:py-16 px-4 bg-surface-container-low">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
          <Trophy className="w-4 h-4" />
          Leaderboards &amp; Challenges
        </div>

        <Image
          src="/mascots/scout-victory.png"
          alt="Scout celebrating with a trophy"
          width={110}
          height={110}
          className="w-24 h-24 md:w-28 md:h-28 object-contain mx-auto mb-4"
        />
        <h2 className="font-headline font-black text-2xl md:text-4xl text-foreground mb-4">
          Challenge Your Friends. Climb the Leaderboard.
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
          Create head-to-head challenges for any game, track wins and losses over time,
          and see who really deserves bragging rights.
        </p>

        {/* Challenge preview card */}
        <div className="bg-primary rounded-[1rem] p-6 md:p-8 max-w-lg mx-auto mb-10 text-left shadow-[var(--shadow-soft-lg)]">
          <div className="flex items-center gap-3 mb-4">
            <Swords className="w-5 h-5 text-accent" />
            <span className="text-primary-foreground font-headline font-semibold">Sample Challenge</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-3xl font-headline font-black text-primary-foreground font-mono">7</div>
              <div className="text-xs text-primary-foreground/50 mt-1">Player 1</div>
            </div>
            <div className="text-primary-foreground/40 text-sm font-medium px-3">vs</div>
            <div className="text-center flex-1">
              <div className="text-3xl font-headline font-black text-primary-foreground font-mono">5</div>
              <div className="text-xs text-primary-foreground/50 mt-1">Player 2</div>
            </div>
          </div>
          <div className="w-full bg-primary-foreground/10 rounded-full h-2 mb-2">
            <div
              className="bg-accent h-2 rounded-full"
              style={{ width: "58%" }}
            />
          </div>
          <p className="text-xs text-primary-foreground/40">12 games played</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/challenges/create" className="text-lg font-bold px-8 py-3.5 no-underline">
              Start a Challenge <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/public-challenges" className="text-lg font-semibold px-8 py-3.5 no-underline">
              View Leaderboard
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
