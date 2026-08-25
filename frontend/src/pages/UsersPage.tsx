import { useState } from "react";

import AppShell from "../components/layout/AppShell";
import UserSummaryCards from "../components/users/UserSummaryCards";
import UserTable from "../components/users/UserTable";
import UserFormPanel from "../components/users/UserFormPanel";

import { useUsers } from "../hooks/useUsers";
import type { ManagedUser } from "../types/user";

export default function UsersPage() {
  const {
    users,
    allUsers,
    stats,
    loading,
    error,
    search,
    setSearch,
    refetch,
    addUser,
    editUser,
    removeUser,
  } = useUsers();

  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ManagedUser | null>(null);

  function openAdd() {
    setEditTarget(null);
    setPanelOpen(true);
  }

  function openEdit(user: ManagedUser) {
    setEditTarget(user);
    setPanelOpen(true);
  }

  return (
    <AppShell
      title="User Management"
      subtitle="Manage system users, roles and access"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3.5 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={refetch}
            className="font-semibold hover:underline shrink-0 ml-4"
          >
            Retry
          </button>
        </div>
      )}

      <UserSummaryCards stats={stats} loading={loading} />

      <UserTable
        users={users}
        search={search}
        onSearchChange={setSearch}
        loading={loading}
        error={!loading ? error : null}
        onAddUser={openAdd}
        onEditUser={openEdit}
        onDeleteUser={(user) => removeUser(user.id)}
      />

      <UserFormPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        editTarget={editTarget}
        existingEmails={allUsers.map((u) => u.email)}
        onAdd={addUser}
        onEdit={editUser}
      />
    </AppShell>
  );
}
