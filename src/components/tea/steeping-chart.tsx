"use client";

import React from "react";
import { TEA_PRESETS } from "@/lib/tea-presets";

/**
 * Comprehensive steeping-time chart for the /kitchen/tea-timer hub.
 * Semantic <table> for accessibility — Google does not currently surface
 * it as a rich result but it is the page's main informational asset and
 * link-bait for tea retailers / blogs.
 */
export function SteepingChart() {
  return (
    <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
      <table className="w-full text-sm border-collapse">
        <caption className="sr-only">
          Tea steeping time and water temperature chart by tea type
        </caption>
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-2 pr-3 font-semibold">
              Tea type
            </th>
            <th scope="col" className="py-2 px-3 font-semibold">
              Water temp
            </th>
            <th scope="col" className="py-2 px-3 font-semibold">
              Steep time
            </th>
            <th scope="col" className="py-2 pl-3 font-semibold">
              Ratio
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.values(TEA_PRESETS).map((tea) => (
            <tr
              key={tea.slug}
              className="border-b border-border/40 align-top"
            >
              <th scope="row" className="py-3 pr-3 font-medium text-foreground">
                {tea.name}
              </th>
              <td className="py-3 px-3 text-muted-foreground">
                {tea.temp_c}°C
                <span className="text-xs"> ({tea.temp_f}°F)</span>
              </td>
              <td className="py-3 px-3 text-muted-foreground">
                {format_range(tea.steep_min, tea.steep_max)}
              </td>
              <td className="py-3 pl-3 text-muted-foreground text-xs">
                {tea.ratio}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function format_range(min: number, max: number): string {
  if (min < 60 && max < 60) return `${min}-${max}s`;
  const min_m = Math.floor(min / 60);
  const max_m = Math.floor(max / 60);
  if (min < 60) return `${min}s – ${max_m} min`;
  return `${min_m}-${max_m} min`;
}
