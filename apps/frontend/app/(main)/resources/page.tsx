"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { ResourceCard } from "@/components/ResourceCard";
import { useApp } from "@/context/AppContext";
import type { ResourceStatus, ResourceType } from "@/lib/types";

const ALL_TYPES = [
  "All Types",
  "Lecture Hall",
  "Lab",
  "Meeting Room",
  "Equipment",
] as const satisfies readonly (ResourceType | "All Types")[];

const ALL_STATUS = ["All Status", "ACTIVE", "OUT_OF_SERVICE"] as const;
type StatusFilter = (typeof ALL_STATUS)[number];

export default function ResourcesPage() {
  const { resources, showToast, createResource } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<(typeof ALL_TYPES)[number]>(
    "All Types",
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<ResourceType>("Lecture Hall");
  const [newCapacity, setNewCapacity] = useState<number>(50);
  const [newLocation, setNewLocation] = useState("");
  const [newStatus, setNewStatus] = useState<ResourceStatus>("ACTIVE");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((r) => {
      if (typeFilter !== "All Types" && r.type !== typeFilter) return false;
      if (statusFilter !== "All Status" && r.status !== statusFilter)
        return false;
      if (!q) return true;
      const hay = `${r.name} ${r.location} ${r.type}`.toLowerCase();
      return hay.includes(q);
    });
  }, [resources, search, typeFilter, statusFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse and manage campus resources
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-cyan-700 text-white rounded-lg text-sm font-medium hover:bg-cyan-500 transition shadow-sm shrink-0"
        >
          + Add Resource
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-64"
        />
        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as (typeof ALL_TYPES)[number])
          }
          className="px-4 py-2 border border-gray-300 rounded-lg text-cyan-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
        >
          {ALL_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as StatusFilter)
          }
          className="px-4 py-2 border border-gray-300 rounded-lg text-cyan-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
        >
          {ALL_STATUS.map((s) => (
            <option key={s} value={s}>
              {s === "All Status"
                ? "All Status"
                : s === "ACTIVE"
                  ? "Active"
                  : "Out of Service"}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>

      <Modal
        open={modalOpen}
        title="Add New Resource"
        onClose={() => setModalOpen(false)}
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Lecture Hall D-102"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={newType}
                onChange={(e) => setNewType(e.target.value as ResourceType)}
              >
                <option>Lecture Hall</option>
                <option>Lab</option>
                <option>Meeting Room</option>
                <option>Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Building D, Floor 1"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value as ResourceStatus)
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <input
                type="text"
                placeholder="e.g. Mon-Fri 8am-6pm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await createResource({
                  name: newName.trim() || "New resource",
                  type: newType,
                  capacity: newCapacity,
                  location: newLocation.trim() || "TBD",
                  status: newStatus,
                });
                setModalOpen(false);
                showToast("Resource created!");
              } catch (err) {
                showToast(
                  err instanceof Error ? err.message : "Could not create resource",
                );
              }
            }}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
          >
            Create Resource
          </button>
        </div>
      </Modal>
    </div>
  );
}
