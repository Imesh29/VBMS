import { useState } from "react";
import { FaSearch, FaPlusCircle, FaPen, FaTrash } from "react-icons/fa";

import type { ManagedUser } from "../../types/user";
import { ROLE_LABEL, ROLE_BADGE_STYLE, formatJoinDate, initials } from "../../utils/user";

interface UserTableProps {
  users: ManagedUser[];
  search: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
  error?: string | null;
  onAddUser: () => void;
  onEditUser: (user: ManagedUser) => void;
  onDeleteUser: (user: ManagedUser) => Promise<unknown>;
}

export default function UserTable({
  users,
  search,
  onSearchChange,
  loading,
  error,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleConfirmDelete(user: ManagedUser) {
    setDeletingId(user.id);
    try {
      await onDeleteUser(user);
    } finally {
      setDeletingId(null);
      setDeleteId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      {/* Search + Add */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 border-b border-gray-50">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full bg-gray-50 border border-transparent focus:border-[#4C1D1D]/20 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-colors"
          />
        </div>

        <button
          onClick={onAddUser}
          className="flex items-center gap-2 px-4 py-3 bg-[#4C1D1D] text-white rounded-xl text-sm font-bold hover:bg-[#3A1515] transition-colors shadow-sm shadow-[#4C1D1D]/20 whitespace-nowrap shrink-0"
        >
          <FaPlusCircle className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="px-6 py-3 border-b border-gray-50">
        <p className="text-xs text-gray-400">
          <span className="font-bold text-[#1C1C2E]">{users.length}</span>{" "}
          user{users.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60">
              {[
                "User",
                "Email",
                "Role",
                "Department",
                "Joined",
                "Bookings",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-400">
                  Loading users…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-400">
                  No users match your search.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#4C1D1D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {initials(user.full_name)}
                      </div>
                      <span className="text-sm font-bold text-[#1C1C2E] whitespace-nowrap">
                        {user.full_name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {user.email}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${ROLE_BADGE_STYLE[user.role]}`}
                    >
                      {ROLE_LABEL[user.role]}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {user.department || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatJoinDate(user.created_at)}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[#1C1C2E]">
                    {user.bookings_count}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        user.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {deleteId === user.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 mr-0.5">Delete?</span>
                        <button
                          onClick={() => handleConfirmDelete(user)}
                          disabled={deletingId === user.id}
                          className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                        >
                          {deletingId === user.id ? "…" : "Yes"}
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEditUser(user)}
                          className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FaPen className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteId(user.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
