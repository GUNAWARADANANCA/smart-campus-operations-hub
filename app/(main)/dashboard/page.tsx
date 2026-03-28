"use client";

import { StatsCard } from "@/components/StatsCard";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import type { BookingStatus } from "@/lib/types";

function bookingRecentBadge(status: BookingStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function ticketRecentBadge(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "OPEN":
      return "bg-orange-100 text-orange-700";
    case "RESOLVED":
      return "bg-green-100 text-green-700";
    case "CLOSED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { resources, bookings, tickets, managementUsers } = useApp();

  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const openTickets = tickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
  ).length;
  const urgentTickets = tickets.filter(
    (t) =>
      (t.priority === "HIGH" || t.priority === "CRITICAL") &&
      t.status !== "CLOSED" &&
      t.status !== "RESOLVED",
  ).length;

  const recentBookings = bookings.slice(0, 4);
  const recentTickets = tickets.slice(0, 4);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          variant="resources"
          label="Total Resources"
          value={resources.length}
          hint="+3 this month"
          hintClassName="text-green-600"
        />
        <StatsCard
          variant="pending"
          label="Pending Bookings"
          value={pendingBookings}
          hint="Awaiting approval"
          hintClassName="text-yellow-600"
        />
        <StatsCard
          variant="tickets"
          label="Open Tickets"
          value={openTickets}
          hint={`${urgentTickets} high priority`}
          hintClassName="text-red-500"
        />
        <StatsCard
          variant="users"
          label="Total Users"
          value={managementUsers.length}
          hint="+12 this week"
          hintClassName="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-medium">{b.resourceName}</p>
                  <p className="text-xs text-gray-500">
                    {b.dateTime} &bull; {b.purpose}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${bookingRecentBadge(b.status)}`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Tickets</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTickets.map((t) => {
              const category = t.subtitle.split("•")[0]?.trim() ?? "";
              return (
                <div
                  key={t.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-gray-500">
                      {t.number} &bull; {t.priority} &bull; {category}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${ticketRecentBadge(t.status)}`}
                  >
                    {t.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
