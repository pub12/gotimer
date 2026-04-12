"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { use_auth_status } from "hazo_auth/client";
import {
  Swords,
  Trophy,
  Globe,
  Home,
  Settings,
  HelpCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/challenges", label: "My Challenges", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/public-challenges", label: "Public Challenges", icon: Globe },
];

const BOTTOM_LINKS = [
  { href: "/hazo_auth/my_settings", label: "Settings", icon: Settings },
  { href: "mailto:pubs@hazoservices.com", label: "Support", icon: HelpCircle },
];

export default function ArenaSidebar() {
  const pathname = usePathname();
  const { authenticated, loading: is_loading } = use_auth_status();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 rounded-r-[1.5rem] overflow-hidden bg-surface-container-low shadow-[var(--shadow-soft-lg)] p-4 gap-2 sticky top-0 z-40 shrink-0">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 px-2 mb-8 no-underline"
      >
        <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center overflow-hidden">
          <Image
            src="/gotimer_logo.png"
            alt="GoTimer logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
        <span className="text-xl font-black text-foreground font-headline">
          GoTimer.org
        </span>
      </Link>

      {/* Main nav */}
      <nav className="flex-grow flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const is_active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-all duration-200 ${
                is_active
                  ? "bg-gradient-to-br from-primary to-primary-container text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-surface-container-highest/50 hover:translate-x-1"
              }`}
            >
              <Icon className="size-5" />
              <span className="font-medium font-headline text-sm">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-6 border-t border-foreground/5 flex flex-col gap-1">
        {/* User profile card */}
        {!is_loading && authenticated && (
          <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-surface-container-highest/30 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-sm font-headline font-black text-foreground">
              ?
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold font-headline">Player</span>
              <span className="text-[10px] opacity-60 uppercase tracking-widest">
                Kinetic Member
              </span>
            </div>
          </div>
        )}

        {BOTTOM_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-surface-container-highest/50 transition-all duration-200 rounded-xl no-underline"
            >
              <Icon className="size-5" />
              <span className="font-medium font-headline text-sm">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
