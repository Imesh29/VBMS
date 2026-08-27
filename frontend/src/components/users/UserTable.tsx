import { useState } from "react";
import { FaSearch, FaPlusCircle, FaPen, FaTrash } from "react-icons/fa";

import type { ManagedUser } from "../../types/user";
import {
  ROLE_LABEL,
  ROLE_BADGE_STYLE,
  formatJoinDate,
  initials,
} from "../../utils/user";

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
    <div className="flex flex-col" style={{ gap: "22px" }}>
      {/* Search + Add User */}
      <div
        className="flex flex-col lg:flex-row lg:items-center"
        style={{ gap: "14px" }}
      >
        <div className="relative min-w-0 flex-1">
          <FaSearch
            className="absolute top-1/2 -translate-y-1/2 text-[#A7B0C0]"
            style={{ left: "18px", width: "17px", height: "17px" }}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full outline-none transition-all"
            style={{
              height: "54px",
              borderRadius: "22px",
              border: "1px solid #E5E8EE",
              backgroundColor: "#FFFFFF",
              padding: "0 18px 0 50px",
              fontSize: "15px",
              color: "#4B5563",
            }}
          />
        </div>

        <button
          type="button"
          onClick={onAddUser}
          className="flex shrink-0 items-center justify-center whitespace-nowrap font-bold text-white transition-colors"
          style={{
            height: "54px",
            padding: "0 22px",
            gap: "9px",
            borderRadius: "22px",
            backgroundColor: "#5A1E1E",
            boxShadow: "0 4px 10px rgba(90, 30, 30, 0.14)",
            fontSize: "14px",
          }}
        >
          <FaPlusCircle style={{ width: "16px", height: "16px" }} />
          Add User
        </button>
      </div>

      {/* Data table card */}
      <div
        className="overflow-hidden bg-white"
        style={{
          borderRadius: "22px",
          border: "1px solid #E7EAF0",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.035)",
        }}
      >
        {/* Result count */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #F0F2F5",
          }}
        >
          <p style={{ fontSize: "13px", color: "#98A2B3" }}>
            <span className="font-bold" style={{ color: "#25283B" }}>
              {users.length}
            </span>{" "}
            user{users.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#FBFCFD" }}>
                {[
                  "User",
                  "Email",
                  "Role",
                  "Department",
                  "Joined",
                  "Bookings",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap text-left font-semibold uppercase"
                    style={{
                      padding: "15px 24px",
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      color: "#98A2B3",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "44px 24px",
                      textAlign: "center",
                      color: "#98A2B3",
                      fontSize: "14px",
                    }}
                  >
                    Loading users…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "44px 24px",
                      textAlign: "center",
                      color: "#EF4444",
                      fontSize: "14px",
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "44px 24px",
                      textAlign: "center",
                      color: "#98A2B3",
                      fontSize: "14px",
                    }}
                  >
                    No users match your search.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-[#FCFCFD]"
                    style={{ borderTop: "1px solid #F1F3F6" }}
                  >
                    {/* User */}
                    <td style={{ padding: "18px 24px" }}>
                      <div
                        className="flex items-center"
                        style={{ gap: "12px" }}
                      >
                        <div
                          className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#5A1E1E",
                            fontSize: "12px",
                          }}
                        >
                          {initials(user.full_name)}
                        </div>

                        <span
                          className="whitespace-nowrap font-bold"
                          style={{ fontSize: "14px", color: "#1F2434" }}
                        >
                          {user.full_name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td
                      className="whitespace-nowrap"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#667085",
                      }}
                    >
                      {user.email}
                    </td>

                    {/* Role */}
                    <td style={{ padding: "18px 24px" }}>
                      <span
                        className={`inline-flex items-center whitespace-nowrap rounded-full font-semibold ${ROLE_BADGE_STYLE[user.role]}`}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                        }}
                      >
                        {ROLE_LABEL[user.role]}
                      </span>
                    </td>

                    {/* Department */}
                    <td
                      className="whitespace-nowrap"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#667085",
                      }}
                    >
                      {user.department || "—"}
                    </td>

                    {/* Joined */}
                    <td
                      className="whitespace-nowrap"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#7C8799",
                      }}
                    >
                      {formatJoinDate(user.created_at)}
                    </td>

                    {/* Bookings */}
                    <td
                      className="whitespace-nowrap font-bold"
                      style={{
                        padding: "18px 24px",
                        fontSize: "13px",
                        color: "#1F2434",
                      }}
                    >
                      {user.bookings_count}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "18px 24px" }}>
                      <span
                        className="inline-flex items-center whitespace-nowrap rounded-full font-medium"
                        style={{
                          padding: "6px 12px",
                          fontSize: "13px",
                          color: user.is_active ? "#07865D" : "#667085",
                          backgroundColor: user.is_active
                            ? "#EAFBF4"
                            : "#F2F4F7",
                          border: user.is_active
                            ? "1px solid #D1F4E3"
                            : "1px solid #E4E7EC",
                        }}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "18px 24px" }}>
                      {deleteId === user.id ? (
                        <div
                          className="flex items-center"
                          style={{ gap: "6px" }}
                        >
                          <span style={{ fontSize: "10px", color: "#667085" }}>
                            Delete?
                          </span>

                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(user)}
                            disabled={deletingId === user.id}
                            className="font-bold text-white disabled:opacity-60"
                            style={{
                              padding: "5px 8px",
                              borderRadius: "8px",
                              backgroundColor: "#DC2626",
                              fontSize: "10px",
                            }}
                          >
                            {deletingId === user.id ? "…" : "Yes"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(null)}
                            className="font-semibold"
                            style={{
                              padding: "5px 8px",
                              borderRadius: "8px",
                              backgroundColor: "#F2F4F7",
                              color: "#667085",
                              fontSize: "10px",
                            }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center"
                          style={{ gap: "8px" }}
                        >
                          <button
                            type="button"
                            onClick={() => onEditUser(user)}
                            title="Edit"
                            className="flex items-center justify-center transition-colors"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "12px",
                              backgroundColor: "#EFF6FF",
                              color: "#2563EB",
                            }}
                          >
                            <FaPen style={{ width: "12px", height: "12px" }} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(user.id)}
                            title="Delete"
                            className="flex items-center justify-center transition-colors"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "12px",
                              backgroundColor: "#FFF1F2",
                              color: "#F04438",
                            }}
                          >
                            <FaTrash
                              style={{ width: "12px", height: "12px" }}
                            />
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
    </div>
  );
}
