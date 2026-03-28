"use client";

import type { Booking, BookingStatus } from "@/lib/types";

function statusBadge(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "CANCELLED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

type BookingTableProps = {
  bookings: Booking[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
};

export function BookingTable({
  bookings,
  onApprove,
  onReject,
  onCancel,
}: BookingTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-5 py-3">Resource</th>
            <th className="px-5 py-3">Date & Time</th>
            <th className="px-5 py-3">Purpose</th>
            <th className="px-5 py-3">Attendees</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-gray-50 transition">
              <td className="px-5 py-4 text-sm font-medium">{b.resourceName}</td>
              <td className="px-5 py-4 text-sm text-gray-500">{b.dateTime}</td>
              <td className="px-5 py-4 text-sm text-gray-500">{b.purpose}</td>
              <td className="px-5 py-4 text-sm text-gray-500">{b.attendees}</td>
              <td className="px-5 py-4">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusBadge(b.status)}`}
                >
                  {b.status}
                </span>
              </td>
              <td className="px-5 py-4">
                {b.status === "PENDING" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => onApprove(b.id)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => onReject(b.id)}
                    >
                      Reject
                    </button>
                  </div>
                ) : b.status === "APPROVED" ? (
                  <button
                    type="button"
                    className="px-3 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={() => onCancel(b.id)}
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">
                    {b.actionNote ?? "—"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
