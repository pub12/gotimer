"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function BarChartWrapper({
  data,
  config,
  xKey,
  bars,
  height = 200,
  className,
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  xKey: string;
  bars: { key: string; color?: string; stackId?: string }[];
  height?: number;
  className?: string;
}) {
  return (
    <div data-slot="bar-chart" className={cn("w-full", className)}>
      <ChartContainer config={config} className={`h-[${height}px]`}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--surface-container-high, #e5e7f0)" />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              fill={bar.color || `var(--color-${bar.key})`}
              radius={[4, 4, 0, 0]}
              stackId={bar.stackId}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
