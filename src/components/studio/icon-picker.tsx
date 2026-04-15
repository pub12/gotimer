"use client";

import React from "react";
import { cn } from "@/lib/utils";

const ICONS = [
  "\u23F1\uFE0F", "\uD83D\uDD25", "\uD83C\uDFCB\uFE0F", "\uD83E\uDDD8", "\uD83C\uDFB2", "\uD83D\uDCF7", "\uD83C\uDF73", "\uD83D\uDCDA", "\uD83C\uDFAF", "\uD83D\uDCAA",
  "\uD83E\uDDE0", "\uD83C\uDF19", "\uD83E\uDD5A", "\u26A1", "\uD83C\uDF9E\uFE0F", "\uD83E\uDDEA", "\uD83C\uDFB5", "\uD83D\uDC8A", "\uD83C\uDF3F", "\u23F0",
];

type IconPickerProps = {
  value: string;
  onChange: (icon: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-10 gap-1.5">
      {ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => onChange(icon)}
          className={cn(
            "w-9 h-9 flex items-center justify-center text-lg rounded-lg transition-all duration-150 cursor-pointer",
            "hover:bg-surface-container-high",
            value === icon
              ? "ring-2 ring-primary bg-primary/10 scale-110"
              : "bg-surface-container-low"
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
