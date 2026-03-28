"use client";

import type { NotificationItem } from "@/lib/types";

type NotificationPanelProps = {
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
};

function NotificationIcon({ kind }: { kind: NotificationItem["kind"] }) {
  if (kind === "success") {
    return (
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
        <svg
          className="w-4 h-4 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  }
  if (kind === "warning") {
    return (
      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
        <svg
          className="w-4 h-4 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </div>
  );
}

export function NotificationPanel({
  open,
  panelRef,
  notifications,
  onMarkAllRead,
}: NotificationPanelProps) {
  if (!open) return null;
  return (
    <div
      ref={panelRef}
      className="absolute top-14 right-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
    >
      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-sm">Notifications</h3>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.map((n, index) => (
          <div
            key={n.id}
            className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
              index < 2 ? "bg-blue-50/40" : ""
            }`}
          >
            <div className="flex gap-2">
              <NotificationIcon kind={n.kind} />
              <div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-gray-500">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
