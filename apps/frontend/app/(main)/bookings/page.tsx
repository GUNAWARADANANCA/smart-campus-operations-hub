"use client";

import { BookingTable } from "@/components/BookingTable";
import { Modal } from "@/components/Modal";
import { useApp } from "@/context/AppContext";
import type { BookingStatus } from "@/lib/types";
import { useMemo, useState } from "react";

export default function BookingsPage() {
  const {
    bookings,
    resources,
    updateBookingStatus,
    createBooking,
    showToast,
  } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All Status" | BookingStatus
  >("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState(30);
  const [purpose, setPurpose] = useState("");

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

  async function handleApprove(id: string) {
    try {
      await updateBookingStatus(id, "APPROVED");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Could not approve booking",
      );
    }
  }

  async function handleReject(id: string) {
    try {
      await updateBookingStatus(id, "REJECTED", "Rejected by administrator");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Could not reject booking",
      );
    }
  }

  async function handleCancel(id: string) {
    try {
      await updateBookingStatus(id, "CANCELLED", "By user");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Could not cancel booking",
      );
    }
  }

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
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={handleCancel}
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
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
            >
              <option value="">Select a resource...</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
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
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            />
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!resourceId || !date || !startTime || !endTime) {
                showToast("Please fill resource, date, and times.");
                return;
              }
              try {
                await createBooking({
                  resourceId,
                  date,
                  startTime,
                  endTime,
                  purpose: purpose || "General use",
                  attendees,
                });
                setModalOpen(false);
                showToast("Booking request submitted!");
              } catch (err) {
                showToast(
                  err instanceof Error ? err.message : "Booking failed",
                );
              }
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
