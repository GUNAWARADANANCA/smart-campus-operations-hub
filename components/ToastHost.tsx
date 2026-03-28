"use client";

import { useApp } from "@/context/AppContext";

export function ToastHost() {
  const { toastMessage } = useApp();
  if (!toastMessage) return null;
  return (
    <div className="pointer-events-none fixed top-20 right-4 z-[60] animate-toast">
      <div className="pointer-events-auto bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
