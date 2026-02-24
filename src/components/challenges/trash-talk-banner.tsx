"use client";

import React, { useState, useEffect } from "react";

type TrashTalkBannerProps = {
  type: "win" | "lose";
};

export function TrashTalkBanner({ type }: TrashTalkBannerProps) {
  const [quote, set_quote] = useState<string>("");

  useEffect(() => {
    const file = type === "win" ? "/data/motivational.json" : "/data/trash-talk.json";
    fetch(file)
      .then((res) => res.json())
      .then((quotes: string[]) => {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        set_quote(random);
      })
      .catch(() => {
        set_quote(
          type === "win"
            ? "You're on fire! Keep it up!"
            : "Don't worry, you'll get them next time!"
        );
      });
  }, [type]);

  if (!quote) return null;

  return (
    <div
      className={`p-4 rounded-lg text-center text-sm md:text-base font-medium ${
        type === "win"
          ? "bg-primary/10 text-primary border border-primary/20"
          : "bg-destructive/10 text-destructive border border-destructive/20"
      }`}
    >
      &ldquo;{quote}&rdquo;
    </div>
  );
}
