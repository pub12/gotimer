"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { use_auth_status } from "hazo_auth/client";
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
  Activity,
  Key,
  Menu,
  X,
  LogOut,
  User,
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
      { label: "Timer Health", href: "/admin/timer-health", icon: <Activity className="w-4 h-4" /> },
      { label: "API Keys", href: "/admin/api-keys", icon: <Key className="w-4 h-4" /> },
    ],
  },
];

function UserProfile() {
  const { authenticated, name, email, profile_picture_url, loading } = use_auth_status();

  if (loading || !authenticated) return null;

  const display_name = name || email || "Admin";
  const pic_url = profile_picture_url || null;

  return (
    <div className="px-4 py-3 border-t border-white/10">
      <div className="flex items-center gap-3">
        {pic_url ? (
          <Image
            src={pic_url}
            alt={display_name}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-4 h-4 text-white/70" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate m-0">{display_name}</p>
          {email && name && (
            <p className="text-white/50 text-xs truncate m-0">{email}</p>
          )}
        </div>
      </div>
      <a
        href="/api/hazo_auth/logout"
        className="flex items-center gap-2 mt-3 px-2 py-1.5 text-white/60 hover:text-white text-xs rounded hover:bg-white/10 transition-colors no-underline"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sign out
      </a>
    </div>
  );
}

function SidebarContent({ pathname, on_close }: { pathname: string; on_close?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* GoTimer logo + home link */}
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-3 border-b border-white/10 no-underline hover:bg-white/5 transition-colors"
      >
        <Image src="/favicon-96x96.png" alt="GoTimer" width={28} height={28} />
        <span className="text-white font-bold text-base tracking-wide">GoTimer</span>
      </Link>

      {/* Admin heading */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <span className="font-headline text-white/60 font-black text-xs uppercase tracking-widest">Admin Panel</span>
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
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out no-underline",
                        is_active
                          ? "bg-secondary text-white"
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

      <UserProfile />
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
        className="hidden md:flex flex-col w-[250px] shrink-0 min-h-screen bg-primary"
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg text-white bg-primary"
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
            className="md:hidden fixed top-0 left-0 h-full w-[250px] z-50 flex flex-col bg-primary"
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
