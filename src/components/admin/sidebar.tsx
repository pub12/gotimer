"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  FileText,
  Timer,
  BookOpen,
  Search,
  BarChart2,
  Smile,
  Bot,
  Settings,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV_GROUPS: { items: NavItem[] }[] = [
  {
    items: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: "Users", href: "/admin/user-management", icon: <Users className="w-4 h-4" /> },
      { label: "All Games", href: "/admin/all-games", icon: <Gamepad2 className="w-4 h-4" /> },
    ],
  },
  {
    items: [
      { label: "Page Publishing", href: "/admin/page-publishing", icon: <FileText className="w-4 h-4" /> },
      { label: "Timer Pages", href: "/admin/timer-pages", icon: <Timer className="w-4 h-4" /> },
      { label: "Blog", href: "/admin/blog", icon: <BookOpen className="w-4 h-4" /> },
    ],
  },
  {
    items: [
      { label: "SEO", href: "/admin/seo", icon: <Search className="w-4 h-4" /> },
      { label: "Analytics", href: "/admin/analytics", icon: <BarChart2 className="w-4 h-4" /> },
      { label: "Characters", href: "/admin/characters", icon: <Smile className="w-4 h-4" /> },
      { label: "AI", href: "/admin/ai", icon: <Bot className="w-4 h-4" /> },
      { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
      { label: "Audit Log", href: "/admin/audit-log", icon: <ClipboardList className="w-4 h-4" /> },
    ],
  },
];

function SidebarContent({ pathname, on_close }: { pathname: string; on_close?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <span className="text-white font-bold text-lg tracking-wide">Admin</span>
        {on_close && (
          <button
            onClick={on_close}
            className="text-white/70 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <hr className="border-white/10 mb-4" />}
            <ul className="space-y-1 list-none m-0 p-0">
              {group.items.map((item) => {
                const is_active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={on_close}
                      className={[
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline",
                        is_active
                          ? "bg-[#FF6B35] text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10",
                      ].join(" ")}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobile_open, set_mobile_open] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-[250px] shrink-0 min-h-screen"
        style={{ backgroundColor: "#1A1A2E" }}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg text-white"
        style={{ backgroundColor: "#1A1A2E" }}
        onClick={() => set_mobile_open(true)}
        aria-label="Open admin menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay + slide-in drawer */}
      {mobile_open && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => set_mobile_open(false)}
          />
          <aside
            className="md:hidden fixed top-0 left-0 h-full w-[250px] z-50 flex flex-col"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <SidebarContent
              pathname={pathname}
              on_close={() => set_mobile_open(false)}
            />
          </aside>
        </>
      )}
    </>
  );
}
