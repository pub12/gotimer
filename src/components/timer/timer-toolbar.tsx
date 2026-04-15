"use client";

import React, { useState, useCallback } from "react";
import { Volume2, VolumeX, Maximize, Minimize, Link2, Check, Code2 } from "lucide-react";
import { useTimer } from "./timer-provider";
import { SaveTimerButton } from "@/components/studio/save-timer-button";

interface TimerToolbarProps {
  /** Timer label shown in the status pill */
  label: string;
  /** Timer type identifier for save/embed features */
  timer_type?: string;
  /** Timer config for save feature */
  timer_config?: Record<string, unknown>;
  /** Timer path for embed feature (e.g., "/countdown") */
  timer_path?: string;
  /** Whether we're in fullscreen mode */
  fullscreen?: boolean;
  /** Extra buttons */
  extra?: React.ReactNode;
}

export function TimerToolbar({
  label,
  timer_type,
  timer_config,
  timer_path,
  fullscreen = false,
  extra,
}: TimerToolbarProps) {
  const { audio, fullscreen: fs } = useTimer();
  const [link_copied, set_link_copied] = useState(false);

  const copy_share_link = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        set_link_copied(true);
        setTimeout(() => set_link_copied(false), 2000);
      })
      .catch(() => {});
  }, []);

  const btn_bg = fullscreen
    ? "bg-white/10 hover:bg-white/20"
    : "bg-surface-container-high hover:bg-surface-container-highest";
  const btn_text = fullscreen
    ? "text-primary-foreground/60"
    : "text-muted-foreground";

  return (
    <div className="flex items-center justify-center gap-3 w-full flex-wrap">
      {/* Status pill */}
      <div className="flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        {label}
      </div>

      {/* Audio toggle */}
      <button
        aria-label={audio.enabled ? "Disable Sound" : "Enable Sound"}
        onClick={audio.toggle}
        className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${
          audio.enabled ? "bg-secondary/10" : btn_bg
        }`}
      >
        {audio.enabled ? (
          <Volume2 className="text-secondary w-4 h-4" />
        ) : (
          <VolumeX className={`${btn_text} w-4 h-4`} />
        )}
      </button>

      {/* Fullscreen toggle */}
      <button
        aria-label={fs.is_fullscreen ? "Exit Full Screen" : "Full Screen"}
        onClick={fs.toggle}
        className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${btn_bg}`}
      >
        {fs.is_fullscreen ? (
          <Minimize className={`${btn_text} w-4 h-4`} />
        ) : (
          <Maximize className={`${btn_text} w-4 h-4`} />
        )}
      </button>

      {/* Share link */}
      <button
        onClick={copy_share_link}
        className={`rounded-full p-1.5 flex items-center justify-center transition-colors ${
          link_copied ? "bg-emerald-100 text-emerald-700" : btn_bg
        }`}
        aria-label={link_copied ? "Link copied" : "Copy shareable link"}
      >
        {link_copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Link2 className={`${btn_text} w-4 h-4`} />
        )}
      </button>

      {/* Save to Studio button */}
      {timer_type && (
        <SaveTimerButton
          timer_type={timer_type}
          title={label}
          config={timer_config || {}}
        />
      )}

      {/* Extra buttons */}
      {extra}
    </div>
  );
}
