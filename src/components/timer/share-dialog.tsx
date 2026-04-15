"use client";

import React, { useState, useCallback, useMemo } from "react";
import { X, Copy, Check, Share2 } from "lucide-react";
import { encode_live_timer } from "@/lib/timer-url-encoder";
import { QrCode } from "./qr-code";

interface ShareDialogProps {
  open: boolean;
  on_close: () => void;
  timer_path: string;
  timer_type: string;
  config: Record<string, unknown>;
}

export function ShareDialog({ open, on_close, timer_path, timer_type, config }: ShareDialogProps) {
  const [copied, set_copied] = useState(false);

  const share_url = useMemo(() => {
    if (typeof window === "undefined") return "";
    const encoded = encode_live_timer({
      type: timer_type,
      started: new Date(),
      config,
    });
    return `${window.location.origin}${timer_path}?${encoded}`;
  }, [timer_path, timer_type, config]);

  const copy_link = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(share_url);
      set_copied(true);
      setTimeout(() => set_copied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = share_url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      set_copied(true);
      setTimeout(() => set_copied(false), 2000);
    }
  }, [share_url]);

  const native_share = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GoTimer - Live Timer",
          text: "Follow along with my timer!",
          url: share_url,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  }, [share_url]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={on_close} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-surface p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Share Timer</h2>
          <button
            onClick={on_close}
            className="rounded-full p-1 hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <QrCode url={share_url} size={180} />
        </div>

        {/* URL display */}
        <div className="rounded-lg bg-surface-container p-3 mb-4">
          <p className="text-xs text-muted-foreground break-all line-clamp-3 font-mono">
            {share_url}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={copy_link}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={native_share}
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium bg-surface-container-high text-foreground hover:bg-surface-container-highest transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
