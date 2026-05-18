import React from "react";
import {
  format_mmss,
  type ToastmastersPreset,
} from "@/lib/toastmasters-presets";

interface ToastmastersPresetInfoProps {
  preset: ToastmastersPreset;
}

export function ToastmastersPresetInfo({
  preset,
}: ToastmastersPresetInfoProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-surface-container-low rounded-xl p-3 text-xs text-muted-foreground">
      <div className="font-headline font-semibold text-foreground text-sm mb-1">
        {preset.name}
      </div>
      <div className="mb-1.5 leading-snug">{preset.tagline}</div>
      <ul className="space-y-0.5">
        <li>
          <span className="font-semibold text-emerald-700">Green:</span>{" "}
          {format_mmss(preset.green_seconds)} — qualifying window opens
        </li>
        <li>
          <span className="font-semibold text-amber-700">Yellow:</span>{" "}
          {format_mmss(preset.yellow_seconds)} — begin wrap-up
        </li>
        <li>
          <span className="font-semibold text-red-700">Red:</span>{" "}
          {format_mmss(preset.red_seconds)} — conclude immediately
        </li>
        <li>
          <span className="font-semibold">Project:</span> {preset.project}
        </li>
      </ul>
    </div>
  );
}
