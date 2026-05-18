"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trophy, MessageSquare, Globe, Shield, BookOpen, Timer, Menu, X, Search, FileText, Layers, Video, GraduationCap } from "lucide-react";
import { ProfilePicMenu } from "hazo_auth/client";
import { use_auth_status } from "hazo_auth/client";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { check_new_user_sign_up, fire_search_event } from "@/lib/ga-events";
import { Button } from "@/components/ui/button";

const REDIRECT_KEY = "redirect_after_login";

export default function GlassmorphicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading: is_loading, permissions } = use_auth_status();
  const has_redirected = useRef(false);
  const [show_feedback, set_show_feedback] = useState(false);
  const [mobile_open, set_mobile_open] = useState(false);
  const [search_query, set_search_query] = useState("");
  const [search_results, set_search_results] = useState<{ title: string; url: string; type: string; description?: string }[]>([]);
  const [search_focused, set_search_focused] = useState(false);
  const search_timeout = useRef<ReturnType<typeof setTimeout>>(null);
  const search_ref = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const trimmed = search_query.trim();
    if (trimmed.length < 2) {
      set_search_results([]);
      return;
    }
    if (search_timeout.current) clearTimeout(search_timeout.current);
    search_timeout.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        .then((r) => r.json())
        .then((data) => set_search_results(data.results ?? []))
        .catch(() => set_search_results([]));
    }, 250);
    return () => { if (search_timeout.current) clearTimeout(search_timeout.current); };
  }, [search_query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handle_click(e: MouseEvent) {
      if (search_ref.current && !search_ref.current.contains(e.target as Node)) {
        set_search_focused(false);
      }
    }
    document.addEventListener("mousedown", handle_click);
    return () => document.removeEventListener("mousedown", handle_click);
  }, []);

  function handle_search_submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = search_query.trim();
    if (trimmed) {
      fire_search_event(trimmed);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      set_search_focused(false);
    }
  }

  function handle_result_click(url: string) {
    const trimmed = search_query.trim();
    if (trimmed) fire_search_event(trimmed);
    set_search_focused(false);
    set_search_query("");
    router.push(url);
  }

  // Fire GA sign_up event for new users
  useEffect(() => {
    if (is_loading || !authenticated) return;
    fetch("/api/hazo_auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.id) {
          const method = data.user.google_id ? "google" : "email";
          check_new_user_sign_up(data.user.id, method);
        }
      })
      .catch(() => {});
  }, [authenticated, is_loading]);

  // After OAuth, hazo_auth always redirects to "/".
  // Check localStorage for a pending redirect and navigate there immediately.
  useEffect(() => {
    if (has_redirected.current) return;
    if (pathname !== "/") return;
    const redirect_path = localStorage.getItem(REDIRECT_KEY);
    if (redirect_path && redirect_path.startsWith("/")) {
      has_redirected.current = true;
      localStorage.removeItem(REDIRECT_KEY);
      router.replace(redirect_path);
    } else if (redirect_path) {
      localStorage.removeItem(REDIRECT_KEY);
    }
  }, [pathname, router]);

  // Close mobile nav on route change
  useEffect(() => {
    set_mobile_open(false);
  }, [pathname]);

  const nav_link_class =
    "font-headline font-black text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground px-3 py-2 rounded-[0.75rem] hover:bg-surface-container-low transition-all duration-200 no-underline flex items-center gap-1.5";

  const mobile_link_class =
    "flex items-center gap-3 px-4 py-3 text-foreground font-headline font-semibold text-sm no-underline hover:bg-surface-container-low rounded-[0.75rem] transition-colors";

  return (
    <>
      {/* Desktop nav */}
      <nav className="glass-nav hidden md:flex w-full fixed top-0 left-0 z-50 items-center justify-between px-6 py-3 backdrop-blur-[16px] bg-[rgba(248,249,255,0.72)] shadow-[var(--shadow-soft)]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-headline font-black text-foreground no-underline shrink-0"
          aria-label="Go to Home"
        >
          <Image
            src="/gotimer_logo.png"
            alt="GoTimer logo"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <span>GoTimer.org</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Search bar */}
          <div ref={search_ref} className="relative">
            <form onSubmit={handle_search_submit}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search_query}
                onChange={(e) => set_search_query(e.target.value)}
                onFocus={() => set_search_focused(true)}
                placeholder="Search timers & articles..."
                className="w-44 lg:w-56 pl-8 pr-3 py-1.5 rounded-full bg-surface-container-low text-foreground placeholder:text-muted-foreground text-xs font-medium border border-surface-container-high focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all duration-200"
              />
            </form>
            {search_focused && search_results.length > 0 && (() => {
              const timers = search_results.filter((r) => r.type === "timer" || r.type === "page");
              const articles = search_results.filter((r) => r.type === "blog");
              return (
                <div className="absolute top-full right-0 mt-2 w-[28rem] max-h-[480px] overflow-y-auto bg-surface rounded-2xl border border-surface-container-high shadow-[var(--shadow-soft-lg)] z-50 p-4">
                  {timers.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <Timer className="size-4 text-secondary" />
                        <span className="text-xs font-headline font-bold uppercase tracking-wider text-muted-foreground">Timers</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {timers.map((r) => (
                          <button
                            key={r.url}
                            onClick={() => handle_result_click(r.url)}
                            className="flex items-start gap-3 bg-surface-container-low rounded-xl p-3 hover:scale-[1.02] transition-all duration-200 cursor-pointer border-none text-left"
                          >
                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                              {r.type === "page" ? <Layers className="size-4" /> : <Timer className="size-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                              {r.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.description}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {articles.length > 0 && (
                    <div>
                      {timers.length > 0 && <div className="border-t border-surface-container-high my-3" />}
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <FileText className="size-4 text-secondary" />
                        <span className="text-xs font-headline font-bold uppercase tracking-wider text-muted-foreground">Articles</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {articles.map((r) => (
                          <button
                            key={r.url}
                            onClick={() => handle_result_click(r.url)}
                            className="flex items-start gap-3 bg-surface-container-low rounded-xl p-3 hover:scale-[1.02] transition-all duration-200 cursor-pointer border-none text-left"
                          >
                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                              <BookOpen className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                              {r.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            {search_focused && search_query.trim().length >= 2 && search_results.length === 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-surface rounded-2xl border border-surface-container-high shadow-[var(--shadow-soft-lg)] z-50 px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">No results found</p>
              </div>
            )}
          </div>

          {!is_loading && authenticated && (
            <Link href="/studio" className={nav_link_class}>
              <Timer className="size-4" />
              <span>My Studio</span>
            </Link>
          )}
          {!is_loading && authenticated && (
            <Link href="/challenges" className={nav_link_class}>
              <Trophy className="size-4" />
              <span>My Challenges</span>
            </Link>
          )}
          <Link href="/public-challenges" className={nav_link_class}>
            <Globe className="size-4" />
            <span>Public Challenges</span>
          </Link>
          <Link href="/streamer-tools" className={nav_link_class}>
            <Video className="size-4" />
            <span>Streamer Tools</span>
          </Link>
          <Link href="/classroom" className={nav_link_class}>
            <GraduationCap className="size-4" />
            <span>Classroom Tools</span>
          </Link>
          <Link href="/blog" className={nav_link_class}>
            <BookOpen className="size-4" />
            <span>Blog</span>
          </Link>
          {!is_loading && authenticated && (
            <button
              onClick={() => set_show_feedback(true)}
              className={nav_link_class + " bg-transparent border-none cursor-pointer"}
              aria-label="Send feedback"
            >
              <MessageSquare className="size-4" />
              <span>Feedback</span>
            </button>
          )}
          {!is_loading && authenticated && permissions?.includes("admin_view_all_games") && (
            <Link href="/admin" className={nav_link_class}>
              <Shield className="size-4" />
              <span>Admin</span>
            </Link>
          )}

          {!is_loading && (
            <>
              {authenticated ? (
                <ProfilePicMenu
                  login_path="/hazo_auth/login"
                  register_path="/hazo_auth/register"
                  settings_path="/hazo_auth/my_settings"
                  logout_path="/api/hazo_auth/logout"
                  show_single_button={true}
                  sign_in_label="Login"
                  custom_menu_items={[
                    ...(permissions?.includes("admin_user_management")
                      ? [
                          { type: "separator" as const, order: 10, id: "admin-sep" },
                          { type: "link" as const, label: "User Management", href: "/admin/user-management", order: 11, id: "admin-users" },
                        ]
                      : []),
                    ...(permissions?.includes("admin_view_all_games")
                      ? [
                          { type: "link" as const, label: "All Games", href: "/admin/all-games", order: 12, id: "admin-games" },
                        ]
                      : []),
                  ]}
                />
              ) : (
                <Button variant="secondary" asChild>
                  <Link href="/hazo_auth/login">Login</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Mobile nav — top bar + slide-out drawer */}
      <nav className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 backdrop-blur-[16px] bg-[rgba(248,249,255,0.72)] shadow-[var(--shadow-soft)]">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-headline font-black text-foreground no-underline"
          aria-label="Go to Home"
        >
          <Image
            src="/gotimer_logo.png"
            alt="GoTimer logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span>GoTimer</span>
        </Link>
        <button
          onClick={() => set_mobile_open(!mobile_open)}
          className="p-2 rounded-[0.75rem] hover:bg-surface-container-low transition-colors cursor-pointer bg-transparent border-none"
          aria-label={mobile_open ? "Close menu" : "Open menu"}
        >
          {mobile_open ? <X className="size-6 text-foreground" /> : <Menu className="size-6 text-foreground" />}
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      {mobile_open && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => set_mobile_open(false)}
          />
          <div className="md:hidden fixed top-14 right-0 z-50 w-72 max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-surface rounded-bl-2xl shadow-[var(--shadow-soft-lg)] p-4 flex flex-col gap-1">
            {/* Mobile search */}
            <form
              onSubmit={(e) => { e.preventDefault(); const t = search_query.trim(); if (t) { fire_search_event(t); router.push(`/blog?q=${encodeURIComponent(t)}`); set_mobile_open(false); } }}
              className="px-2 pb-2"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={search_query}
                  onChange={(e) => set_search_query(e.target.value)}
                  placeholder="Search timers & articles..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-full bg-surface-container-low text-foreground placeholder:text-muted-foreground text-sm font-medium border border-surface-container-high focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all duration-200"
                />
              </div>
            </form>
            {!is_loading && authenticated && (
              <Link href="/studio" className={mobile_link_class}>
                <Timer className="size-5" /> My Studio
              </Link>
            )}
            {!is_loading && authenticated && (
              <Link href="/challenges" className={mobile_link_class}>
                <Trophy className="size-5" /> My Challenges
              </Link>
            )}
            <Link href="/public-challenges" className={mobile_link_class}>
              <Globe className="size-5" /> Public Challenges
            </Link>
            <Link href="/streamer-tools" className={mobile_link_class}>
              <Video className="size-5" /> Streamer Tools
            </Link>
            <Link href="/classroom" className={mobile_link_class}>
              <GraduationCap className="size-5" /> Classroom Tools
            </Link>
            <Link href="/blog" className={mobile_link_class}>
              <BookOpen className="size-5" /> Blog
            </Link>
            {!is_loading && authenticated && (
              <>
                <button
                  onClick={() => { set_mobile_open(false); set_show_feedback(true); }}
                  className={mobile_link_class + " bg-transparent border-none cursor-pointer w-full text-left"}
                >
                  <MessageSquare className="size-5" /> Feedback
                </button>
                {permissions?.includes("admin_view_all_games") && (
                  <Link href="/admin" className={mobile_link_class}>
                    <Shield className="size-5" /> Admin
                  </Link>
                )}
              </>
            )}
            <div className="border-t border-surface-container-high my-2" />
            {!is_loading && (
              authenticated ? (
                <Link href="/hazo_auth/my_settings" className={mobile_link_class}>
                  Settings
                </Link>
              ) : (
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/hazo_auth/login">Login</Link>
                </Button>
              )
            )}
          </div>
        </>
      )}

      {show_feedback && (
        <FeedbackDialog on_close={() => set_show_feedback(false)} />
      )}
    </>
  );
}
