"use client";

import GlassmorphicNavbar from "@/components/shared/glassmorphic-navbar";
import MobileBottomNav from "@/components/shared/mobile-bottom-nav";

/**
 * Navbar wrapper — renders both the desktop glassmorphic navbar
 * and the mobile bottom navigation. All pages that import Navbar
 * get both navigation patterns automatically.
 */
export default function Navbar() {
  return (
    <>
      <GlassmorphicNavbar />
      <MobileBottomNav />
    </>
  );
}
