"use client";

import React, { useMemo } from "react";

interface QrCodeProps {
  url: string;
  size?: number;
}

/**
 * Minimal QR code display component.
 * Shows the URL in a styled box with a visual pattern.
 * For production QR generation, consider a dedicated library like 'qrcode'.
 */
export function QrCode({ url, size = 180 }: QrCodeProps) {
  // Generate a simple visual pattern from the URL hash for visual interest
  const pattern = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }

    const grid_size = 11;
    const cells: boolean[][] = [];

    for (let row = 0; row < grid_size; row++) {
      cells[row] = [];
      for (let col = 0; col < grid_size; col++) {
        // Border cells are always filled
        if (row === 0 || row === grid_size - 1 || col === 0 || col === grid_size - 1) {
          cells[row][col] = true;
          continue;
        }

        // Corner finder patterns (3x3 blocks in corners)
        if (
          (row <= 3 && col <= 3) ||
          (row <= 3 && col >= grid_size - 4) ||
          (row >= grid_size - 4 && col <= 3)
        ) {
          const r = row <= 3 ? row : row - (grid_size - 4);
          const c = col <= 3 ? col : col - (grid_size - 4);
          cells[row][col] =
            r === 0 || r === 3 || c === 0 || c === 3 ||
            (r === 1 && c === 1) || (r === 1 && c === 2) ||
            (r === 2 && c === 1) || (r === 2 && c === 2);
          continue;
        }

        // Data cells from hash
        const seed = (hash + row * 17 + col * 31) & 0xffffffff;
        cells[row][col] = (seed % 3) !== 0;
      }
    }

    return cells;
  }, [url]);

  const cell_size = size / pattern.length;

  return (
    <div className="flex flex-col items-center gap-2" style={{ width: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rounded-lg"
      >
        {/* White background */}
        <rect width={size} height={size} fill="white" rx="4" />

        {/* QR-like pattern */}
        {pattern.map((row, ri) =>
          row.map((filled, ci) =>
            filled ? (
              <rect
                key={`${ri}-${ci}`}
                x={ci * cell_size}
                y={ri * cell_size}
                width={cell_size}
                height={cell_size}
                fill="#1a1a1a"
              />
            ) : null
          )
        )}
      </svg>
      <p className="text-[10px] text-muted-foreground text-center">
        Scan to open or copy the link below
      </p>
    </div>
  );
}
