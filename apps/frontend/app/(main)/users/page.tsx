"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import type { ManagementUser } from "@/lib/types";

function roleBadgeClass(role: ManagementUser["role"]) {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-700";
    case "USER":
      return "bg-blue-100 text-blue-700";
    case "TECHNICIAN":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { managementUsers, updateUserRole, showToast } = useApp();

  useEffect(() => {
    if (user?.role !== "ADMIN") router.replace("/dashboard");
  }, [user, router]);

  if (user?.role !== "ADMIN") {
    return <div className="min-h-[40vh]" aria-busy="true" />;
  }

  async function updateRole(id: string, role: ManagementUser["role"]) {
    try {
      await updateUserRole(id, role);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update role");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage user accounts and roles
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {managementUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${u.avatarClass}`}
                    >
                      {u.initial}
                    </div>
                    <span className="text-sm font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{u.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleBadgeClass(u.role)}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{u.joined}</td>
                <td className="px-5 py-4">
                  <select
                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                    value={u.role}
                    onChange={(e) =>
                      updateRole(u.id, e.target.value as ManagementUser["role"])
                    }
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                    <option value="TECHNICIAN">TECHNICIAN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
