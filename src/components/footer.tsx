"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FeedbackDialog } from "@/components/feedback-dialog";

export default function Footer() {
  const [show_feedback, set_show_feedback] = useState(false);

  return (
    <>
      <footer className="w-full bg-black text-white py-3 px-6 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <span>&copy; 2026 GoTimer.org</span>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors no-underline px-2">
              Home
            </Link>
            <span className="text-gray-500">|</span>
            <Link href="/privacy-policy" className="text-white hover:text-gray-300 transition-colors no-underline px-2">
              Privacy Policy
            </Link>
            <span className="text-gray-500">|</span>
            <Link href="/terms-of-service" className="text-white hover:text-gray-300 transition-colors no-underline px-2">
              Terms of Service
            </Link>
            <span className="text-gray-500">|</span>
            <button
              onClick={() => set_show_feedback(true)}
              className="text-white hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer text-sm px-2"
            >
              Contact Us
            </button>
            <span className="text-gray-500">|</span>
            <Link href="/sitemap.xml" className="text-white hover:text-gray-300 transition-colors no-underline px-2">
              Sitemap
            </Link>
          </nav>
        </div>
      </footer>

      {show_feedback && (
        <FeedbackDialog on_close={() => set_show_feedback(false)} />
      )}
    </>
  );
}
