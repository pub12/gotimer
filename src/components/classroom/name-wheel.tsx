"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * SVG name picker wheel.
 *
 * Uses CSS transform: rotate() on the wheel <g> (not Canvas) so the GPU
 * handles the animation — keeps 60fps on low-spec Chromebooks. The winner is
 * computed from the final rotation angle relative to a fixed pointer at 12
 * o'clock (top of the wheel).
 *
 * Spin model: pick a random target winner index, compute the angle that lands
 * that slice at the top, then animate to (current + 5..7 full turns + delta).
 */

interface NameWheelProps {
  names: string[];
  spin_duration_ms?: number;
  remove_after_pick?: boolean;
  on_winner?: (name: string, remaining: string[]) => void;
}

const PALETTE = [
  "#7c3aed",
  "#22c55e",
  "#f97316",
  "#06b6d4",
  "#ec4899",
  "#eab308",
  "#0ea5e9",
  "#f43f5e",
  "#14b8a6",
  "#a855f7",
];

function fmt_path(cx: number, cy: number, r: number, start: number, end: number): string {
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

export function NameWheel({
  names,
  spin_duration_ms = 5500,
  remove_after_pick = false,
  on_winner,
}: NameWheelProps) {
  const [pool, set_pool] = useState<string[]>(names);
  const [rotation, set_rotation] = useState(0);
  const [spinning, set_spinning] = useState(false);
  const [winner, set_winner] = useState<string | null>(null);
  const wheel_ref = useRef<SVGGElement>(null);

  // Sync pool when caller's names list changes.
  useEffect(() => {
    set_pool(names);
    set_winner(null);
  }, [names]);

  const handle_spin = useCallback(() => {
    if (spinning || pool.length === 0) return;
    const target_index = Math.floor(Math.random() * pool.length);
    const slice = 360 / pool.length;
    // Slice i occupies [i*slice, (i+1)*slice) starting from 0° at 3 o'clock,
    // going clockwise. Pointer sits at 12 o'clock = -90° (= 270°).
    // We want the centre of target slice to land at 270°.
    const slice_centre_deg = target_index * slice + slice / 2;
    // After rotation r, slice_centre lands at (slice_centre + r) mod 360.
    // We want that = 270° (pointer).
    // r = 270 - slice_centre_deg (mod 360)
    const base_target = (270 - slice_centre_deg + 360) % 360;
    const full_turns = 5 + Math.floor(Math.random() * 3); // 5–7 turns
    const current_mod = ((rotation % 360) + 360) % 360;
    const delta = (base_target - current_mod + 360) % 360;
    const next_rotation = rotation + full_turns * 360 + delta;
    set_spinning(true);
    set_winner(null);
    set_rotation(next_rotation);
    window.setTimeout(() => {
      const won = pool[target_index];
      set_winner(won);
      set_spinning(false);
      const remaining = remove_after_pick
        ? pool.filter((_, i) => i !== target_index)
        : pool;
      if (remove_after_pick) set_pool(remaining);
      on_winner?.(won, remaining);
    }, spin_duration_ms + 50);
  }, [spinning, pool, rotation, remove_after_pick, spin_duration_ms, on_winner]);

  if (pool.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-surface-container-low rounded-2xl text-center">
        <p className="text-sm text-muted-foreground">
          Add at least one name to spin the wheel.
        </p>
      </div>
    );
  }

  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.95;
  const slice = (Math.PI * 2) / pool.length;
  const transform_style: React.CSSProperties = {
    transform: `rotate(${rotation}deg)`,
    transition: spinning
      ? `transform ${spin_duration_ms}ms cubic-bezier(0.18, 0.85, 0.22, 1)`
      : "none",
    transformOrigin: `${cx}px ${cy}px`,
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <div className="relative w-full aspect-square max-w-[360px]">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
          role="img"
          aria-label="Name picker wheel"
        >
          <g ref={wheel_ref} style={transform_style}>
            {pool.map((name, i) => {
              const start = -Math.PI / 2 + i * slice;
              const end = start + slice;
              const fill = PALETTE[i % PALETTE.length];
              const mid = start + slice / 2;
              const text_r = r * 0.62;
              const tx = cx + text_r * Math.cos(mid);
              const ty = cy + text_r * Math.sin(mid);
              const deg = (mid * 180) / Math.PI;
              // Truncate long names so they fit.
              const max_chars = Math.max(6, Math.floor(28 / Math.max(pool.length / 6, 1)));
              const display =
                name.length > max_chars ? `${name.slice(0, max_chars - 1)}…` : name;
              return (
                <g key={`${name}-${i}`}>
                  <path d={fmt_path(cx, cy, r, start, end)} fill={fill} />
                  <text
                    x={tx}
                    y={ty}
                    fill="#fff"
                    fontSize={pool.length > 12 ? 11 : 14}
                    fontWeight={700}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${deg} ${tx} ${ty})`}
                    style={{ pointerEvents: "none" }}
                  >
                    {display}
                  </text>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r={r * 0.12} fill="#fff" stroke="#1f2937" strokeWidth={2} />
          </g>
        </svg>
        {/* Pointer at 12 o'clock */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 -top-1 w-0 h-0"
          style={{
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "22px solid #1f2937",
          }}
        />
      </div>

      <button
        type="button"
        onClick={handle_spin}
        disabled={spinning || pool.length === 0}
        className="mt-6 px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-headline font-black uppercase tracking-widest text-sm shadow-[var(--shadow-soft)] hover:shadow-md active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer border-none"
      >
        {spinning ? "Spinning…" : "Spin"}
      </button>

      {winner && !spinning && (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 px-6 py-4 rounded-2xl bg-surface-container-low border-2 border-secondary text-center"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-headline font-bold">
            Selected
          </p>
          <p className="text-3xl font-headline font-black text-foreground mt-1">
            {winner}
          </p>
        </div>
      )}
    </div>
  );
}
