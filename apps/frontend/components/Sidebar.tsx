"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Ticket,
  Users,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resources", href: "/resources", icon: BookOpen },
  { label: "Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Tickets", href: "/tickets", icon: Ticket },
];

export function Sidebar({ open, onNavigate }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const mobileTranslate = open ? "translate-x-0" : "-translate-x-full";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside
      className={`fixed left-0 top-20 bottom-0 w-[260px] bg-white border-r border-primary-200 z-40 transform transition-transform duration-200 ${mobileTranslate} lg:translate-x-0`}
    >
      <div className="flex flex-col h-full p-4">
        {/* HERO CARD */}
        <div className="mt-2 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white p-4 shadow-md">
          <Sparkles className="w-5 h-5" />
          <h3 className="mt-3 text-sm font-semibold">
            Smart Experience
          </h3>
          <p className="mt-1 text-xs text-primary-100 leading-5">
            Book resources, track tickets and manage your campus life easily.
          </p>
        </div>

        {/* NAV LINKS */}
        <nav className="mt-6 flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "text-primary-700"
                    : "text-primary-600 hover:bg-primary-50 hover:text-primary-900"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeSidebar"
                    className="absolute inset-0 bg-primary-50 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}

          {/* ADMIN SECTION */}
          {isAdmin && (
            <>
              <p className="px-3 pt-4 text-xs text-primary-400 uppercase">
                Admin
              </p>

              <Link
                href="/users"
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                  pathname === "/users"
                    ? "bg-primary-50 text-primary-700"
                    : "text-primary-600 hover:bg-primary-50"
                }`}
              >
                <Users className="w-5 h-5" />
                Users
              </Link>
            </>
          )}
        </nav>

        {/* PROFILE + LOGOUT */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 bg-primary-50 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-indigo-200 flex items-center justify-center text-primary-700 font-bold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-900">
                {user?.name}
              </p>
              <p className="text-xs text-primary-400">
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}