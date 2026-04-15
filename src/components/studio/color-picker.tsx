"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const COLORS = [
  { value: "#E8613C", label: "Orange" },
  { value: "#041534", label: "Navy" },
  { value: "#10b981", label: "Emerald" },
  { value: "#0ea5e9", label: "Sky" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#f43f5e", label: "Rose" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#84cc16", label: "Lime" },
];

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {COLORS.map((color) => {
        const is_selected = value === color.value;
        return (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            title={color.label}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer",
              "hover:scale-110",
              is_selected && "ring-2 ring-offset-2 ring-primary"
            )}
            style={{ backgroundColor: color.value }}
          >
            {is_selected && (
              <Check
                className="w-4 h-4"
                style={{
                  color: ["#041534"].includes(color.value) ? "#ffffff" : "#ffffff",
                  filter: ["#f59e0b", "#84cc16"].includes(color.value)
                    ? "drop-shadow(0 0 1px rgba(0,0,0,0.5))"
                    : "none",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
