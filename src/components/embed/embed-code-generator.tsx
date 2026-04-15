"use client";

import React, { useState, useMemo, useCallback } from "react";
import { X, Copy, Check, Code2 } from "lucide-react";

interface EmbedCodeGeneratorProps {
  open: boolean;
  on_close: () => void;
  timer_path: string;
  timer_name: string;
  default_duration?: number;
}

type ThemeOption = "light" | "dark" | "auto";
type SizeOption = "compact" | "standard" | "large";
type TabOption = "html" | "url" | "wordpress";

const SIZE_DIMENSIONS: Record<SizeOption, { width: number; height: number }> = {
  compact: { width: 300, height: 250 },
  standard: { width: 480, height: 400 },
  large: { width: 640, height: 500 },
};

export function EmbedCodeGenerator({
  open,
  on_close,
  timer_path,
  timer_name,
  default_duration,
}: EmbedCodeGeneratorProps) {
  const [theme, set_theme] = useState<ThemeOption>("auto");
  const [accent, set_accent] = useState("E8613C");
  const [size, set_size] = useState<SizeOption>("standard");
  const [autostart, set_autostart] = useState(false);
  const [controls, set_controls] = useState<"full" | "minimal" | "none">("full");
  const [active_tab, set_active_tab] = useState<TabOption>("html");
  const [copied, set_copied] = useState(false);

  const embed_url = useMemo(() => {
    const params = new URLSearchParams();
    if (theme !== "auto") params.set("theme", theme);
    if (accent !== "E8613C") params.set("accent", accent);
    if (default_duration) params.set("duration", String(default_duration));
    if (autostart) params.set("autostart", "true");
    if (controls !== "full") params.set("controls", controls);
    const qs = params.toString();
    return `https://gotimer.org${timer_path}/embed${qs ? `?${qs}` : ""}`;
  }, [theme, accent, default_duration, autostart, controls, timer_path]);

  const dims = SIZE_DIMENSIONS[size];

  const html_code = useMemo(() => {
    return `<!-- GoTimer Embed -->
<div style="position:relative;width:100%;max-width:${dims.width}px;">
  <iframe src="${embed_url}"
    width="100%" height="${dims.height}" frameborder="0"
    allow="autoplay" loading="lazy"
    style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);"></iframe>
  <noscript><a href="https://gotimer.org${timer_path}">
    Free ${timer_name} by GoTimer</a></noscript>
</div>`;
  }, [embed_url, dims, timer_path, timer_name]);

  const wordpress_code = `[gotimer type="${timer_path.replace(/^\//, "")}" theme="${theme}" duration="${default_duration || ""}" accent="${accent}"]`;

  const copy_text = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        set_copied(true);
        setTimeout(() => set_copied(false), 2000);
      });
    },
    [],
  );

  if (!open) return null;

  const active_code = active_tab === "html" ? html_code : active_tab === "url" ? embed_url : wordpress_code;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60" onClick={on_close}>
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-foreground">Embed This Timer</h2>
              <p className="text-sm text-muted-foreground">{timer_name}</p>
            </div>
          </div>
          <button onClick={on_close} className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Left: Customization controls */}
          <div className="flex-1 space-y-5">
            {/* Theme */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Theme</label>
              <div className="flex gap-2">
                {(["light", "dark", "auto"] as ThemeOption[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => set_theme(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      theme === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent color */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={`#${accent}`}
                  onChange={(e) => set_accent(e.target.value.replace("#", ""))}
                  className="w-10 h-10 rounded-lg border border-surface-container-high cursor-pointer"
                />
                <input
                  type="text"
                  value={`#${accent}`}
                  onChange={(e) => set_accent(e.target.value.replace("#", ""))}
                  className="w-24 px-3 py-2 bg-surface-container-low rounded-lg text-sm font-mono text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
                />
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Size</label>
              <div className="flex gap-2">
                {(["compact", "standard", "large"] as SizeOption[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => set_size(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      size === s
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-start */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autostart}
                onChange={(e) => set_autostart(e.target.checked)}
                className="w-4 h-4 rounded accent-secondary"
              />
              <span className="text-sm text-foreground">Auto-start</span>
            </label>

            {/* Controls */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Controls</label>
              <div className="flex gap-2">
                {(["full", "minimal", "none"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => set_controls(c)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      controls === c
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
                    }`}
                  >
                    {c === "full" ? "All Controls" : c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live preview */}
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Live Preview</label>
            <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-center" style={{ minHeight: 300 }}>
              <iframe
                src={embed_url.replace("https://gotimer.org", "")}
                width={Math.min(dims.width, 400)}
                height={Math.min(dims.height, 280)}
                style={{ borderRadius: 8, border: "1px solid var(--surface-container-high)" }}
                title="Timer preview"
              />
            </div>
          </div>
        </div>

        {/* Bottom: Tabs + code output */}
        <div className="border-t border-surface-container-high px-6 pb-6 pt-4">
          {/* Tabs */}
          <div className="flex gap-1 mb-3">
            {(["html", "url", "wordpress"] as TabOption[]).map((tab) => (
              <button
                key={tab}
                onClick={() => set_active_tab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium uppercase transition-colors ${
                  active_tab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-container-low"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="relative">
            <pre className="bg-primary text-primary-foreground rounded-xl p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {active_code}
            </pre>
            <button
              onClick={() => copy_text(active_code)}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/90 transition-colors"
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
