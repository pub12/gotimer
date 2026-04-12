"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Globe, User, BookOpen, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const default_items: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Globe, label: "Public", href: "/public-challenges" },
  { icon: BookOpen, label: "Blog", href: "/blog" },
  { icon: Trophy, label: "Challenges", href: "/challenges" },
  { icon: User, label: "Profile", href: "/hazo_auth/my_settings" },
];

export default function MobileBottomNav({
  centerAction,
  items = default_items,
  className,
}: {
  centerAction?: { icon: LucideIcon; label: string; href: string };
  items?: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();

  // Split items for center CTA placement
  const left_items = centerAction ? items.slice(0, 2) : items;
  const right_items = centerAction ? items.slice(2) : [];

  return (
    <nav
      className={cn(
        "glass-nav fixed bottom-0 left-0 w-full z-50 md:hidden backdrop-blur-[16px] bg-[rgba(248,249,255,0.72)] pb-[env(safe-area-inset-bottom)]",
        className
      )}
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-1">
        {left_items.map((item) => (
          <NavTab key={item.href} item={item} active={pathname === item.href} />
        ))}

        {centerAction && (
          <Link
            href={centerAction.href}
            className="flex flex-col items-center -mt-6 no-underline"
          >
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary text-white shadow-[var(--shadow-soft-lg)] transition-transform duration-200 hover:scale-105 active:scale-95">
              <centerAction.icon className="size-6" />
            </span>
            <span className="text-[10px] font-medium text-secondary mt-0.5">
              {centerAction.label}
            </span>
          </Link>
        )}

        {right_items.map((item) => (
          <NavTab key={item.href} item={item} active={pathname === item.href} />
        ))}
      </div>
    </nav>
  );
}

function NavTab({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3 py-1 no-underline transition-colors duration-200",
        active ? "text-foreground" : "text-muted-foreground"
      )}
    >
      <item.icon className="size-5" />
      <span className="text-[10px] font-medium">{item.label}</span>
    </Link>
  );
}
