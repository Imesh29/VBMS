import { useCallback, useEffect, useMemo, useState } from "react";

import * as userApi from "../api/userApi";
import type {
  ManagedUser,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/user";
import { computeUserStats } from "../utils/user";

/**
 * Loads all users (Admin only) once, then exposes fast
 * client-side search on top of it, plus CRUD mutations.
 */
export function useUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await userApi.getUsers();
        if (!cancelled) setUsers(result);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Failed to load users. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const stats = useMemo(() => computeUserStats(users), [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (u) =>
        u.full_name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.department || "").toLowerCase().includes(query),
    );
  }, [users, search]);

  const addUser = useCallback(async (payload: CreateUserPayload) => {
    const created = await userApi.createUser(payload);
    setUsers((prev) => [created, ...prev]);
    return created;
  }, []);

  const editUser = useCallback(
    async (id: string, payload: UpdateUserPayload) => {
      const updated = await userApi.updateUser(id, payload);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    },
    [],
  );

  const removeUser = useCallback(async (id: string) => {
    await userApi.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return {
    users: filteredUsers,
    allUsers: users,
    stats,
    loading,
    error,
    search,
    setSearch,
    refetch,
    addUser,
    editUser,
    removeUser,
  };
}
