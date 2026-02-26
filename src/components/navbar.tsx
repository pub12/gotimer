"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trophy, MessageSquare } from "lucide-react";
import { ProfilePicMenu } from "hazo_auth/client";
import { use_auth_status } from "hazo_auth/client";
import { FeedbackDialog } from "@/components/feedback-dialog";

const REDIRECT_KEY = "redirect_after_login";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading: is_loading } = use_auth_status();
  const has_redirected = useRef(false);
  const [show_feedback, set_show_feedback] = useState(false);

  // After OAuth, hazo_auth always redirects to "/".
  // Check localStorage for a pending redirect and navigate there immediately.
  // No auth check needed — the target page handles its own auth.
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

  return (
    <>
      <nav className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between fixed top-0 left-0 z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-900 bg-transparent border-none cursor-pointer focus:outline-none"
          aria-label="Go to Home"
          style={{ fontFamily: "inherit" }}
        >
          <Image
            src="/gotimer_logo.png"
            alt="GoTimer logo"
            width={36}
            height={36}
            className="w-8 h-8 md:w-9 md:h-9"
          />
          GoTimer.org
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="text-base md:text-lg font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors no-underline"
          >
            Home
          </Link>
          <Link
            href="/challenges"
            className="text-base md:text-lg font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors no-underline flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4" />
            Challenges
          </Link>

          {!is_loading && authenticated && (
            <button
              onClick={() => set_show_feedback(true)}
              className="text-base md:text-lg font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
              aria-label="Send feedback"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">Feedback</span>
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
                />
              ) : (
                <Link
                  href="/hazo_auth/login"
                  className="text-base font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity no-underline"
                >
                  Login
                </Link>
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
