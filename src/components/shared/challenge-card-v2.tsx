import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type PlayerScore = {
  name: string;
  avatar?: string;
  score: number;
};

export function ChallengeCardV2({
  id,
  name,
  scores,
  status,
  gameName,
  totalGames,
  lastActivity,
  variant = "compact",
  href,
  className,
}: {
  id: string | number;
  name: string;
  scores: { player1: PlayerScore; player2: PlayerScore };
  status: "active" | "completed" | "paused";
  gameName?: string;
  totalGames?: number;
  lastActivity?: string;
  variant?: "compact" | "full";
  href?: string;
  className?: string;
}) {
  const status_variant = status === "active" ? "active" : status === "completed" ? "default" : "reported";

  const compact_content = (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <Avatar src={scores.player1.avatar} fallback={scores.player1.name.charAt(0)} size="sm" />
        <span className="font-headline font-black text-lg">
          {scores.player1.score}
        </span>
      </div>
      <span className="text-xs text-muted-foreground font-medium">VS</span>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-headline font-black text-lg">
          {scores.player2.score}
        </span>
        <Avatar src={scores.player2.avatar} fallback={scores.player2.name.charAt(0)} size="sm" />
      </div>
      <div className="flex-1 min-w-0 ml-2">
        <p className="font-medium text-sm truncate">{name}</p>
        {gameName && (
          <p className="text-xs text-muted-foreground truncate">{gameName}</p>
        )}
      </div>
      <Badge variant={status_variant} size="sm">
        {status}
      </Badge>
    </>
  );

  const full_content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline font-black text-lg">{name}</h3>
        <Badge variant={status_variant}>{status}</Badge>
      </div>
      <div className="flex items-center justify-center gap-6 my-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar src={scores.player1.avatar} fallback={scores.player1.name.charAt(0)} size="lg" />
          <span className="text-sm font-medium truncate max-w-[80px]">{scores.player1.name}</span>
        </div>
        <div className="text-center">
          <p className="font-headline font-black text-5xl tracking-tight">
            {scores.player1.score}
            <span className="text-muted-foreground mx-2 text-2xl">VS</span>
            {scores.player2.score}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar src={scores.player2.avatar} fallback={scores.player2.name.charAt(0)} size="lg" />
          <span className="text-sm font-medium truncate max-w-[80px]">{scores.player2.name}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {gameName && <span>{gameName}</span>}
        {totalGames !== undefined && <span>{totalGames} games</span>}
        {lastActivity && <span>{lastActivity}</span>}
      </div>
    </>
  );

  const compact_class = cn(
    "flex items-center gap-4 bg-card rounded-[1rem] p-4 shadow-[var(--shadow-soft)] hover:scale-[1.02] transition-all duration-200 no-underline text-foreground",
    className
  );

  const full_class = cn(
    "block bg-card rounded-[1.5rem] p-6 shadow-[var(--shadow-soft)] hover:scale-[1.02] transition-all duration-200 no-underline text-foreground",
    className
  );

  const content = variant === "compact" ? compact_content : full_content;
  const style_class = variant === "compact" ? compact_class : full_class;

  if (href) {
    return (
      <Link href={href} className={style_class}>
        {content}
      </Link>
    );
  }

  return (
    <div className={style_class}>
      {content}
    </div>
  );
}
