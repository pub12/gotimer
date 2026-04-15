"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trophy, MessageSquare, Globe, Home, Shield, BookOpen, Timer, Menu, X } from "lucide-react";
import { ProfilePicMenu } from "hazo_auth/client";
import { use_auth_status } from "hazo_auth/client";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { check_new_user_sign_up } from "@/lib/ga-events";
import { Button } from "@/components/ui/button";

const REDIRECT_KEY = "redirect_after_login";

export default function GlassmorphicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading: is_loading, permissions } = use_auth_status();
  const has_redirected = useRef(false);
  const [show_feedback, set_show_feedback] = useState(false);
  const [mobile_open, set_mobile_open] = useState(false);

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
          <Link href="/" className={nav_link_class}>
            <Home className="size-4" />
            <span>Home</span>
          </Link>
          <Link href="/public-challenges" className={nav_link_class}>
            <Globe className="size-4" />
            <span>Public Challenges</span>
          </Link>
          <Link href="/blog" className={nav_link_class}>
            <BookOpen className="size-4" />
            <span>Blog</span>
          </Link>
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
          {!is_loading && authenticated && permissions?.includes("admin_view_all_games") && (
            <Link href="/admin" className={nav_link_class}>
              <Shield className="size-4" />
              <span>Admin</span>
            </Link>
          )}
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
            <Link href="/" className={mobile_link_class}>
              <Home className="size-5" /> Home
            </Link>
            <Link href="/public-challenges" className={mobile_link_class}>
              <Globe className="size-5" /> Public Challenges
            </Link>
            <Link href="/blog" className={mobile_link_class}>
              <BookOpen className="size-5" /> Blog
            </Link>
            {!is_loading && authenticated && (
              <>
                <Link href="/studio" className={mobile_link_class}>
                  <Timer className="size-5" /> My Studio
                </Link>
                <Link href="/challenges" className={mobile_link_class}>
                  <Trophy className="size-5" /> My Challenges
                </Link>
                {permissions?.includes("admin_view_all_games") && (
                  <Link href="/admin" className={mobile_link_class}>
                    <Shield className="size-5" /> Admin
                  </Link>
                )}
                <button
                  onClick={() => { set_mobile_open(false); set_show_feedback(true); }}
                  className={mobile_link_class + " bg-transparent border-none cursor-pointer w-full text-left"}
                >
                  <MessageSquare className="size-5" /> Feedback
                </button>
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
