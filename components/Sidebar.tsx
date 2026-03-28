"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const linkBase =
  "sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 transition";

function activeClass(active: boolean) {
  return active
    ? "bg-blue-50 text-blue-700 border-r-[3px] border-blue-600"
    : "text-gray-600";
}

type SidebarProps = {
  open: boolean;
  onNavigate?: () => void;
};

export function Sidebar({ open, onNavigate }: SidebarProps) {
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
      className={`fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-gray-200 z-40 transform transition-transform duration-200 ${mobileTranslate} lg:translate-x-0`}
    >
      <nav className="p-3 space-y-1 relative h-full">
        <Link
          href="/dashboard"
          className={`${linkBase} ${activeClass(pathname === "/dashboard")}`}
          onClick={onNavigate}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Dashboard
        </Link>
        <Link
          href="/resources"
          className={`${linkBase} ${activeClass(pathname === "/resources")}`}
          onClick={onNavigate}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Resources
        </Link>
        <Link
          href="/bookings"
          className={`${linkBase} ${activeClass(pathname === "/bookings")}`}
          onClick={onNavigate}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Bookings
        </Link>
        <Link
          href="/tickets"
          className={`${linkBase} ${activeClass(pathname === "/tickets")}`}
          onClick={onNavigate}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Tickets
        </Link>

        {isAdmin ? (
          <>
            <div className="pt-3 pb-1">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin
              </p>
            </div>
            <Link
              href="/users"
              className={`${linkBase} ${activeClass(pathname === "/users")}`}
              onClick={onNavigate}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Users
            </Link>
          </>
        ) : null}

        <div className="absolute bottom-4 left-3 right-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
