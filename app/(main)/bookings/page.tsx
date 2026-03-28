"use client";

import { useMemo, useState } from "react";
import { BookingTable } from "@/components/BookingTable";
import { Modal } from "@/components/Modal";
import { useApp } from "@/context/AppContext";
import type { BookingStatus } from "@/lib/types";

export default function BookingsPage() {
  const { bookings, updateBookingStatus, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All Status" | BookingStatus
  >("All Status");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "All Status" && b.status !== statusFilter)
        return false;
      if (!q) return true;
      const hay = `${b.resourceName} ${b.purpose} ${b.dateTime}`.toLowerCase();
      return hay.includes(q);
    });
  }, [bookings, search, statusFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage resource bookings</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm shrink-0"
        >
          + New Booking
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="All Status">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <BookingTable
        bookings={filtered}
        onApprove={(id) => updateBookingStatus(id, "APPROVED")}
        onReject={(id) => updateBookingStatus(id, "REJECTED")}
        onCancel={(id) => updateBookingStatus(id, "CANCELLED")}
      />

      <Modal
        open={modalOpen}
        title="New Booking"
        onClose={() => setModalOpen(false)}
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Select a resource...</option>
              <option>Lecture Hall A-101</option>
              <option>Computer Lab B-201</option>
              <option>Meeting Room C-105</option>
              <option>Auditorium Main</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendees
              </label>
              <input
                type="number"
                placeholder="e.g. 30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <textarea
              rows={3}
              placeholder="Describe the purpose of your booking..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setModalOpen(false);
              showToast("Booking request submitted!");
            }}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
          >
            Submit Booking Request
          </button>
        </div>
      </Modal>
    </div>
  );
}
