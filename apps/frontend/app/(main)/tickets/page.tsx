"use client";

import { Modal } from "@/components/Modal";
import { TicketCard } from "@/components/TicketCard";
import { useApp } from "@/context/AppContext";
import type { TicketPriority, TicketStatus } from "@/lib/types";
import { useMemo, useState } from "react";

export default function TicketsPage() {
  const {
    tickets,
    resources,
    advanceTicketStatus,
    createTicket,
    showToast,
  } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All Status" | TicketStatus
  >("All Status");
  const [priorityFilter, setPriorityFilter] = useState<
    "All Priority" | TicketPriority
  >("All Priority");
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Equipment Failure");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [resourceId, setResourceId] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (statusFilter !== "All Status" && t.status !== statusFilter)
        return false;
      if (priorityFilter !== "All Priority" && t.priority !== priorityFilter)
        return false;
      if (!q) return true;
      const hay =
        `${t.title} ${t.subtitle} ${t.number} ${t.reportedBy}`.toLowerCase();
      return hay.includes(q);
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  async function handleAdvance(id: string) {
    try {
      await advanceTicketStatus(id);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Could not update ticket status",
      );
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Incident Tickets
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Report and track maintenance issues
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm shrink-0"
        >
          + Create Ticket
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white border-gray-300"
        >
          <option value="All Status">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as typeof priorityFilter)
          }
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="All Priority">All Priority</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((t) => (
          <TicketCard
            key={t.id}
            ticket={t}
            onAdvanceStatus={(id) => void handleAdvance(id)}
          />
        ))}
      </div>

      <Modal
        open={modalOpen}
        title="Create Incident Ticket"
        onClose={() => setModalOpen(false)}
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Equipment Failure</option>
                <option>HVAC</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Furniture</option>
                <option>Network</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TicketPriority)
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related resource (optional)
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
            >
              <option value="">None</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Building A, Room 101"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide detailed description of the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments (max 3 images)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
              <svg
                className="w-8 h-8 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-500">
                Drag & drop images or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB each
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!title.trim()) {
                showToast("Please enter a title.");
                return;
              }
              try {
                await createTicket({
                  title: title.trim(),
                  description: description.trim(),
                  category,
                  location: location.trim() || "Campus",
                  priority,
                  resourceId: resourceId || null,
                });
                setModalOpen(false);
                setTitle("");
                setDescription("");
                setLocation("");
                setResourceId("");
                showToast("Ticket created successfully!");
              } catch (err) {
                showToast(
                  err instanceof Error ? err.message : "Could not create ticket",
                );
              }
            }}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
          >
            Create Ticket
          </button>
        </div>
      </Modal>
    </div>
  );
}
