"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const sizes = {
  sm: { px: 120, viewBox: 140, radius: 54, strokeWidth: 8 },
  md: { px: 200, viewBox: 220, radius: 90, strokeWidth: 10 },
  lg: { px: 320, viewBox: 340, radius: 150, strokeWidth: 12 },
} as const

function ProgressRing({
  progress,
  size = "md",
  color,
  trackColor,
  strokeWidth: strokeWidthOverride,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  progress: number
  size?: "sm" | "md" | "lg"
  color?: string
  trackColor?: string
  strokeWidth?: number
  children?: React.ReactNode
}) {
  const config = sizes[size]
  const sw = strokeWidthOverride ?? config.strokeWidth
  const r = config.radius
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)))
  const center = config.viewBox / 2

  return (
    <div
      data-slot="progress-ring"
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: config.px, height: config.px }}
      {...props}
    >
      <svg
        width={config.px}
        height={config.px}
        viewBox={`0 0 ${config.viewBox} ${config.viewBox}`}
        className="absolute inset-0"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={trackColor || "var(--surface-container-high, #e5e7f0)"}
          strokeWidth={sw}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color || "var(--secondary, #ab3514)"}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-progress-transition"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      {children && (
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

export { ProgressRing }
