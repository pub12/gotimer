"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Check,
  Link2,
  Maximize2,
  Minimize2,
  Palette,
  Pencil,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FaqAccordion from "@/components/shared/faq-accordion";

/**
 * Shared chrome + SEO scaffold for the /classroom toolkit pages.
 */

// Same theme presets as TimerShellV2 so the classroom tools feel consistent.
const FS_THEMES = [
  { id: "",         name: "Default",  bg: "",        dot: "var(--color-secondary)" },
  { id: "ocean",    name: "Ocean",    bg: "#0c4a6e", dot: "#0ea5e9" },
  { id: "emerald",  name: "Emerald",  bg: "#064e3b", dot: "#10b981" },
  { id: "violet",   name: "Violet",   bg: "#2e1065", dot: "#8b5cf6" },
  { id: "rose",     name: "Rose",     bg: "#4c0519", dot: "#f43f5e" },
  { id: "amber",    name: "Amber",    bg: "#451a03", dot: "#f59e0b" },
  { id: "slate",    name: "Slate",    bg: "#1e293b", dot: "#94a3b8" },
  { id: "lime",     name: "Lime",     bg: "#1a2e05", dot: "#84cc16" },
];

interface RelatedTool {
  name: string;
  href: string;
  description: string;
}

interface BreadcrumbCrumb {
  name: string;
  href?: string;
}

interface ClassroomShellProps {
  title: string;
  intro?: string;
  crumbs: BreadcrumbCrumb[];
  tool: React.ReactNode;
  children: React.ReactNode;
  faq?: Array<{ question: string; answer: string }>;
  related?: RelatedTool[];
}

export function ClassroomShell({
  title,
  intro,
  crumbs,
  tool,
  children,
  faq = [],
  related = [],
}: ClassroomShellProps) {
  const tool_ref = useRef<HTMLDivElement>(null);
  const [is_fullscreen, set_is_fullscreen] = useState(false);

  // Fullscreen display controls — matching timer-shell-v2
  const [fs_theme_id, set_fs_theme_id] = useState("");
  const [fs_scale, set_fs_scale] = useState(100);
  const [fs_title, set_fs_title] = useState(title);
  const [editing_title, set_editing_title] = useState(false);
  const [show_color_picker, set_show_color_picker] = useState(false);
  const [link_copied, set_link_copied] = useState(false);

  useEffect(() => { set_fs_title(title); }, [title]);

  const active_theme = FS_THEMES.find((t) => t.id === fs_theme_id) ?? FS_THEMES[0];

  // Fullscreen API with webkit fallback (Safari)
  useEffect(() => {
    const handler = () => {
      const fs =
        !!document.fullscreenElement ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(document as any).webkitFullscreenElement;
      set_is_fullscreen(fs);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  const toggle_fullscreen = useCallback(() => {
    const el = tool_ref.current;
    if (!el) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      const req =
        el.requestFullscreen?.bind(el) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (el as any).webkitRequestFullscreen?.bind(el);
      req?.()?.catch?.(() => {});
    } else {
      const exit =
        document.exitFullscreen?.bind(document) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).webkitExitFullscreen?.bind(document);
      exit?.()?.catch?.(() => {});
    }
  }, []);

  const copy_share_link = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      set_link_copied(true);
      window.setTimeout(() => set_link_copied(false), 1800);
    } catch {
      /* ignore */
    }
  }, []);

  const SLIDER_CLS =
    "w-20 sm:w-28 h-1.5 accent-secondary rounded-full appearance-none bg-surface-container-highest cursor-pointer " +
    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 " +
    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:cursor-pointer";

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4">
        {/* Hero */}
        <section className="w-full max-w-3xl mx-auto pt-6 pb-2">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href="/classroom"
              className="hover:text-foreground transition-colors"
            >
              Classroom Tools
            </Link>
            {crumbs.map((c, i) => (
              <React.Fragment key={`${c.name}-${i}`}>
                <ChevronRight className="size-3" />
                {c.href ? (
                  <Link
                    href={c.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {c.name}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{c.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          <h1 className="font-headline font-black text-3xl md:text-4xl text-foreground tracking-tight">
            {title}
          </h1>
          {intro && (
            <p className="mt-3 text-base text-muted-foreground max-w-2xl">
              {intro}
            </p>
          )}
        </section>

        {/* Tool section — doubles as the fullscreen root */}
        <div
          ref={tool_ref}
          className={
            is_fullscreen
              ? "relative w-full overflow-y-auto"
              : "w-full py-6 md:py-10 px-2 md:px-4 relative"
          }
          style={
            is_fullscreen
              ? {
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: active_theme.bg || "var(--color-surface)",
                }
              : undefined
          }
        >
          {/* ── Fullscreen top bar — 3-column grid so title stays centered ── */}
          {is_fullscreen && (
            <div className="w-full px-6 pt-5 pb-2 grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3 shrink-0">
              {/* Left placeholder (mirrors exit button width) */}
              <div />

              {/* Center: editable title */}
              <div className="flex justify-center">
                {editing_title ? (
                  <input
                    type="text"
                    value={fs_title}
                    onChange={(e) => set_fs_title(e.target.value)}
                    onBlur={() => set_editing_title(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") set_editing_title(false);
                    }}
                    autoFocus
                    placeholder="Add a title…"
                    className="w-full max-w-lg text-center font-headline font-black text-2xl sm:text-3xl bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none border-b-2 border-secondary/30 focus:border-secondary pb-1"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => set_editing_title(true)}
                    className="inline-flex items-center gap-2 font-headline font-black text-2xl sm:text-3xl text-muted-foreground hover:text-secondary transition-colors cursor-pointer bg-transparent border-none text-center"
                  >
                    <span className="truncate max-w-xs sm:max-w-lg">
                      {fs_title || title}
                    </span>
                    <Pencil className="w-4 h-4 shrink-0 opacity-40" />
                  </button>
                )}
              </div>

              {/* Right: exit button */}
              <button
                type="button"
                onClick={toggle_fullscreen}
                aria-label="Exit fullscreen"
                className="rounded-full p-2.5 flex items-center justify-center transition-colors bg-surface-container-high hover:bg-surface-container-highest text-muted-foreground"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ── Tool content (scaled in fullscreen) ── */}
          <div
            className={is_fullscreen ? "w-full flex-1" : "w-full"}
            style={
              is_fullscreen
                ? {
                    transform: `scale(${fs_scale / 100})`,
                    transformOrigin: "top center",
                    paddingTop: "1rem",
                    paddingBottom: "5rem",
                    paddingLeft: "1.5rem",
                    paddingRight: "1.5rem",
                  }
                : undefined
            }
          >
            {tool}
          </div>

          {/* ── Fullscreen bottom bar ── */}
          {is_fullscreen && (
            <div className="absolute bottom-5 left-6 right-6 sm:bottom-6 sm:left-8 sm:right-8 flex items-center justify-between gap-3 pointer-events-none">
              {/* Left: GoTimer logo */}
              <div className="flex items-center gap-1.5 pointer-events-auto opacity-50 hover:opacity-80 transition-opacity">
                <Image
                  src="/gotimer_logo.png"
                  alt="GoTimer.org"
                  width={22}
                  height={22}
                  className="rounded-sm"
                />
                <span className="text-xs font-headline font-bold text-foreground hidden sm:inline">
                  GoTimer.org
                </span>
              </div>

              {/* Right: controls */}
              <div className="flex items-center gap-3 pointer-events-auto">
                {/* Share link */}
                <button
                  type="button"
                  onClick={copy_share_link}
                  className={`inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-1.5 transition-all duration-200 ${
                    link_copied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-surface-container-high text-muted-foreground hover:text-foreground hover:bg-surface-container-highest"
                  }`}
                >
                  {link_copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Link2 className="w-3.5 h-3.5" />
                  )}
                  {link_copied ? "Copied!" : "Share"}
                </button>

                {/* Theme picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => set_show_color_picker((v) => !v)}
                    aria-label="Change theme"
                    className="rounded-full p-1.5 flex items-center justify-center transition-colors bg-surface-container-high hover:bg-surface-container-highest text-muted-foreground"
                  >
                    {fs_theme_id ? (
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: active_theme.dot }}
                      />
                    ) : (
                      <Palette className="w-4 h-4" />
                    )}
                  </button>
                  {show_color_picker && (
                    <div className="absolute bottom-full right-0 mb-2 bg-surface-container-high rounded-xl p-2.5 flex gap-2 shadow-lg">
                      {FS_THEMES.map((t) => (
                        <button
                          key={t.id || "default"}
                          type="button"
                          onClick={() => {
                            set_fs_theme_id(t.id);
                            set_show_color_picker(false);
                          }}
                          title={t.name}
                          className={`w-7 h-7 rounded-full transition-transform hover:scale-110 overflow-hidden flex items-center justify-center ${
                            fs_theme_id === t.id
                              ? "ring-2 ring-white ring-offset-1 ring-offset-transparent"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              t.bg || "var(--color-surface-container-low)",
                            border: t.bg ? "none" : "1px solid var(--color-surface-container-high)",
                          }}
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: t.dot }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scale slider */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={50}
                    max={200}
                    step={5}
                    value={fs_scale}
                    onChange={(e) => set_fs_scale(Number(e.target.value))}
                    className={SLIDER_CLS}
                    aria-label="Zoom level"
                  />
                  <span className="text-xs text-muted-foreground font-mono w-8">
                    {fs_scale}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Non-fullscreen: simple "Fullscreen" button ── */}
          {!is_fullscreen && (
            <button
              type="button"
              onClick={toggle_fullscreen}
              title="Project fullscreen"
              className="mt-4 mx-auto flex items-center gap-2 px-3 py-2 rounded-full text-muted-foreground hover:text-foreground border border-surface-container-high transition-all duration-200 cursor-pointer text-xs font-headline font-semibold uppercase tracking-widest"
              aria-label="Project fullscreen"
            >
              <Maximize2 className="size-3.5 shrink-0" />
              <span>Fullscreen</span>
            </button>
          )}
        </div>

        {/* SEO body */}
        <section className="w-full py-10 md:py-12 px-4 bg-surface">
          <div className="max-w-3xl mx-auto">
            <div className="seo-prose space-y-4 text-sm text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-headline [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_p]:mb-3">
              {children}
            </div>

            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="font-headline font-bold text-lg text-foreground mb-4">
                  Related Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      className="group block p-4 bg-card rounded-xl shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="font-headline font-semibold text-foreground group-hover:text-secondary transition-colors text-sm">
                        {r.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {r.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {faq.length > 0 && (
              <div className="mt-12">
                <FaqAccordion items={faq} title={`${title} FAQ`} />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
