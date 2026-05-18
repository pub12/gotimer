import React from "react";
import type { DebateFormat } from "@/lib/debate-formats";

interface DebateFormatInfoProps {
  format: DebateFormat;
}

export function DebateFormatInfo({ format }: DebateFormatInfoProps) {
  const prep_minutes = Math.round(format.prep_seconds / 60);
  return (
    <div className="w-full max-w-md mx-auto bg-surface-container-low rounded-xl p-3 text-xs text-muted-foreground">
      <div className="font-headline font-semibold text-foreground text-sm mb-1">
        {format.name}
      </div>
      <div className="mb-1.5 leading-snug">{format.tagline}</div>
      <ul className="space-y-0.5">
        <li>
          <span className="font-semibold">Round total:</span>{" "}
          {format.total_minutes} min ({format.summary})
        </li>
        <li>
          <span className="font-semibold">Prep per side:</span> {prep_minutes}{" "}
          min
        </li>
        <li>
          <span className="font-semibold">League:</span> {format.league}
        </li>
        {format.poi_supported && format.poi_window && (
          <li>
            <span className="font-semibold">POIs:</span> {format.poi_window}
          </li>
        )}
      </ul>
    </div>
  );
}
