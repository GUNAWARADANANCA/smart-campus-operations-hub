"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { NotificationPanel } from "@/components/NotificationPanel";

type NavbarProps = {
  onMenuClick: () => void;
};

const userNavItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Resources", href: "/resources" },
  { label: "Bookings", href: "/bookings" },
  { label: "Tickets", href: "/tickets" },
];

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();
  const { notifications, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const unread = notifications.filter((n) => !n.read).length;
  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (!open) return;
      if (wrapRef.current?.contains(t)) return;
      setOpen(false);
    }

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/40 bg-white/75 backdrop-blur-xl shadow-sm">
      <div className="flex h-20 items-center justify-between px-4 lg:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-xl p-2.5 text-primary-600 transition hover:bg-primary-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-500 text-sm font-bold text-white shadow-md">
              S
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-bold text-slate-900">Smart Campus Hub</p>
              <p className="text-xs text-cyan-600">
                {isAdmin ? "Admin Portal" : "Student Portal"}
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER */}
        {!isAdmin && (
          <div className="hidden lg:flex items-center gap-2">
            {userNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-slate-600 hover:bg-cyan-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={wrapRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative rounded-2xl bg-cyan-50 p-3 text-cyan-600 transition hover:bg-cyan-200/70"
              aria-expanded={open}
              aria-haspopup="true"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1 text-xs font-semibold text-white">
                  {unread}
                </span>
              ) : null}
            </button>

            <NotificationPanel
              open={open}
              panelRef={panelRef}
              notifications={notifications}
              onMarkAllRead={markAllNotificationsRead}
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-[#f4f7fb] px-3 py-2 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 font-bold text-cyan-700">
              {initial}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs uppercase text-slate-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE NAV FOR USER */}
      {!isAdmin && (
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 bg-white px-4 py-2 lg:hidden">
          {userNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}