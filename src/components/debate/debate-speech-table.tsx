import React from "react";
import type { SpeechTimesRow } from "@/lib/debate-formats";

interface DebateSpeechTableProps {
  rows: SpeechTimesRow[];
  caption?: string;
}

export function DebateSpeechTable({ rows, caption }: DebateSpeechTableProps) {
  return (
    <div className="overflow-x-auto bg-surface-container-low rounded-xl p-3 my-4">
      {caption && (
        <div className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2 px-1">
          {caption}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide">
            <th className="py-1.5 pr-2 font-semibold w-10">#</th>
            <th className="py-1.5 pr-2 font-semibold">Speech / Phase</th>
            <th className="py-1.5 pr-2 font-semibold w-16 text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.position}
              className="border-t border-border/40 align-top"
            >
              <td className="py-1.5 pr-2 text-foreground font-mono text-xs">
                {row.position}
              </td>
              <td className="py-1.5 pr-2 text-foreground">
                <div className="font-medium">{row.name}</div>
                {row.notes && (
                  <div
                    className="text-xs text-muted-foreground"
                    // skipcq: JS-0440
                    dangerouslySetInnerHTML={{ __html: row.notes }}
                  />
                )}
              </td>
              <td className="py-1.5 pr-2 text-foreground font-mono text-xs text-right">
                {row.duration}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
