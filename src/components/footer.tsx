"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FeedbackDialog } from "@/components/feedback-dialog";

export default function Footer() {
  const [show_feedback, set_show_feedback] = useState(false);

  return (
    <>
      <footer className="w-full bg-primary text-primary-foreground py-6 px-6 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-8 justify-between mb-6">
            <div>
              <h3 className="font-headline text-xs font-black uppercase tracking-wider text-primary-foreground/60 mb-3">Timers</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/countdown-setup" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Countdown Timer
                  </Link>
                </li>
                <li>
                  <Link href="/chess-clock-setup" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Chess Clock
                  </Link>
                </li>
                <li>
                  <Link href="/round-timer-setup" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Round Timer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-headline text-xs font-black uppercase tracking-wider text-primary-foreground/60 mb-3">Features</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/public-challenges" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Public Challenges
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-headline text-xs font-black uppercase tracking-wider text-primary-foreground/60 mb-3">Legal &amp; Info</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/privacy-policy" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => set_show_feedback(true)}
                    className="text-primary-foreground hover:text-primary-foreground/70 transition-colors bg-transparent border-none cursor-pointer text-sm p-0 text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <Link href="/sitemap.xml" className="text-primary-foreground hover:text-primary-foreground/70 transition-colors no-underline text-sm">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-4 text-sm text-primary-foreground/60">
            &copy; 2026 GoTimer.org
          </div>
        </div>
      </footer>

      {show_feedback && (
        <FeedbackDialog on_close={() => set_show_feedback(false)} />
      )}
    </>
  );
}
