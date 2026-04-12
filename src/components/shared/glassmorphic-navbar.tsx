"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trophy, MessageSquare, Globe, Home, Shield, BookOpen } from "lucide-react";
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

  const nav_link_class =
    "font-headline font-black text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground px-3 py-2 rounded-[0.75rem] hover:bg-surface-container-low transition-all duration-200 no-underline flex items-center gap-1.5";

  return (
    <>
      <nav className="glass-nav hidden md:flex w-full fixed top-0 left-0 z-50 items-center justify-between px-6 py-3 backdrop-blur-[16px] bg-[rgba(248,249,255,0.72)] shadow-[var(--shadow-soft)]">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xl font-headline font-black text-foreground bg-transparent border-none cursor-pointer focus:outline-none shrink-0"
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
        </button>

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

      {show_feedback && (
        <FeedbackDialog on_close={() => set_show_feedback(false)} />
      )}
    </>
  );
}
