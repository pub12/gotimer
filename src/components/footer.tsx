"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FeedbackDialog } from "@/components/feedback-dialog";

export default function Footer() {
  const [show_feedback, set_show_feedback] = useState(false);

  return (
    <>
      <footer className="w-full bg-black text-white py-6 px-6 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-8 justify-between mb-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Timers</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/countdown-setup" className="text-white hover:text-gray-300 transition-colors no-underline text-sm">
                    Countdown Timer
                  </Link>
                </li>
                <li>
                  <Link href="/chess-clock-setup" className="text-white hover:text-gray-300 transition-colors no-underline text-sm">
                    Chess Clock
                  </Link>
                </li>
                <li>
                  <Link href="/round-timer-setup" className="text-white hover:text-gray-300 transition-colors no-underline text-sm">
                    Round Timer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Features</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/public-challenges" className="text-white hover:text-gray-300 transition-colors no-underline text-sm">
                    Public Challenges
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-white hover:text-gray-300 transition-colors no-underline text-sm">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Legal &amp; Info</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/privacy-policy" className="text-white hover:text-gray-300 transition-colors no-underline text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-white hover:text-gray-300 transition-colors no-underline text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => set_show_feedback(true)}
                    className="text-white hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer text-sm p-0 text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <Link href="/sitemap.xml" className="text-white hover:text-gray-300 transition-colors no-underline text-sm">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 text-sm text-gray-400">
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
