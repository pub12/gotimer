"use client";

import React from "react";
import ArenaSidebar from "./arena-sidebar";
import MobileBottomNav from "./mobile-bottom-nav";

/**
 * Arena layout — wraps leaderboard and challenge pages with the
 * shared left sidebar (desktop) and bottom nav (mobile).
 * Replaces the standard Navbar on these pages.
 */
export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      <ArenaSidebar />
      <main className="flex-grow flex flex-col min-h-screen overflow-x-hidden pb-24 md:pb-0">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
