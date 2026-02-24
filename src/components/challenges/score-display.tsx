"use client";

import React from "react";
import Image from "next/image";

type ScoreDisplayProps = {
  player1_name: string;
  player2_name: string;
  player1_score: number;
  player2_score: number;
  player1_picture?: string | null;
  player2_picture?: string | null;
  draws: number;
};

export function ScoreDisplay({
  player1_name,
  player2_name,
  player1_score,
  player2_score,
  player1_picture,
  player2_picture,
  draws,
}: ScoreDisplayProps) {
  const p1_winning = player1_score > player2_score;
  const p2_winning = player2_score > player1_score;

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 py-6">
      <div className="text-center flex-1">
        {player1_picture ? (
          <Image
            src={player1_picture}
            alt={player1_name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mx-auto mb-1 object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full mx-auto mb-1 bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
            {player1_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-sm md:text-base font-medium text-muted-foreground truncate">
          {player1_name}
        </div>
        <div
          className={`text-4xl md:text-6xl font-bold mt-1 ${
            p1_winning ? "text-primary" : "text-foreground"
          }`}
        >
          {player1_score}
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl md:text-3xl font-light text-muted-foreground">
          vs
        </div>
        {draws > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            {draws} draw{draws !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="text-center flex-1">
        {player2_picture ? (
          <Image
            src={player2_picture}
            alt={player2_name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mx-auto mb-1 object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full mx-auto mb-1 bg-muted flex items-center justify-center text-muted-foreground font-bold text-lg">
            {player2_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-sm md:text-base font-medium text-muted-foreground truncate">
          {player2_name}
        </div>
        <div
          className={`text-4xl md:text-6xl font-bold mt-1 ${
            p2_winning ? "text-primary" : "text-foreground"
          }`}
        >
          {player2_score}
        </div>
      </div>
    </div>
  );
}
