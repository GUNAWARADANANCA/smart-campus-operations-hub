"use client";

import type { Ticket, TicketPriority, TicketStatus } from "@/lib/types";

function priorityClass(p: TicketPriority) {
  switch (p) {
    case "HIGH":
      return "bg-red-100 text-red-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "LOW":
      return "bg-gray-100 text-gray-600";
    case "CRITICAL":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function statusClass(s: TicketStatus) {
  switch (s) {
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

type TicketCardProps = {
  ticket: Ticket;
  onAdvanceStatus?: (id: string) => void;
};

export function TicketCard({ ticket, onAdvanceStatus }: TicketCardProps) {
  const canAdvance = Boolean(onAdvanceStatus) && ticket.status !== "CLOSED";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-400">
              {ticket.number}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityClass(ticket.priority)}`}
            >
              {ticket.priority}
            </span>
            <span
              role={canAdvance ? "button" : undefined}
              tabIndex={canAdvance ? 0 : undefined}
              onClick={
                canAdvance
                  ? (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAdvanceStatus?.(ticket.id);
                    }
                  : undefined
              }
              onKeyDown={
                canAdvance
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onAdvanceStatus?.(ticket.id);
                      }
                    }
                  : undefined
              }
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusClass(ticket.status)}`}
            >
              {ticket.status}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{ticket.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
            <span>Reported by: {ticket.reportedBy}</span>
            <span>&bull;</span>
            <span>
              {ticket.assignedTo
                ? `Assigned: ${ticket.assignedTo}`
                : "Unassigned"}
            </span>
            <span>&bull;</span>
            <span>
              {ticket.comments} comment{ticket.comments === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
