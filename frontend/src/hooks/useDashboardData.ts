import { useCallback, useEffect, useState } from "react";

import * as dashboardApi from "../api/dashboardApi";
import * as bookingApi from "../api/bookingApi";
import * as adminApi from "../api/adminApi";
import * as deanApi from "../api/deanApi";

import { useAuth } from "../context/AuthContext";

import type {
  AdminDashboardData,
  DeanDashboardData,
  NormalizedBooking,
  UserDashboardData,
} from "../types/dashboard";

import {
  getStatusBreakdown,
  mapMyBooking,
  mapStaffBooking,
  toNumber,
} from "../utils/dashboard";

type RoleDashboardData =
  | UserDashboardData
  | DeanDashboardData
  | AdminDashboardData
  | null;

interface UseDashboardDataResult {
  loading: boolean;
  error: string | null;
  data: RoleDashboardData;
  statusBreakdown: ReturnType<typeof getStatusBreakdown>;
  recentBookings: NormalizedBooking[];
  recentBookingsTitle: string;
  totalBookings: number;
  refetch: () => void;
}

/**
 * Fetches everything the dashboard page needs, based on the
 * logged-in user's role (USER / DEAN / ADMIN), and normalizes
 * it into a shape the presentational components can consume.
 */
export function useDashboardData(): UseDashboardDataResult {
  const { user } = useAuth();
  const role = user?.role;

  const [data, setData] = useState<RoleDashboardData>(null);
  const [recentBookings, setRecentBookings] = useState<NormalizedBooking[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    if (!role) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (role === "ADMIN") {
          const [stats, bookings] = await Promise.all([
            dashboardApi.getAdminDashboard(),
            adminApi.getApprovedBookings(),
          ]);

          if (cancelled) return;

          setData(stats);
          setRecentBookings(
            (bookings as any[]).slice(0, 5).map(mapStaffBooking),
          );
        } else if (role === "DEAN") {
          const [stats, bookings] = await Promise.all([
            dashboardApi.getDeanDashboard(),
            deanApi.getPendingBookings(),
          ]);

          if (cancelled) return;

          setData(stats);
          setRecentBookings(
            (bookings as any[]).slice(0, 5).map(mapStaffBooking),
          );
        } else {
          const [stats, bookings] = await Promise.all([
            dashboardApi.getUserDashboard(),
            bookingApi.getBookings({
              limit: 5,
              sort: "created_at",
              order: "DESC",
            }),
          ]);

          if (cancelled) return;

          setData(stats);

          const items = bookings?.data?.items ?? [];
          setRecentBookings(
            items.map((item: any) => mapMyBooking(item, user)),
          );
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Failed to load dashboard data. Please try again.",
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
  }, [role, reloadToken, user]);

  const statusBreakdown = getStatusBreakdown(
    (role as "USER" | "DEAN" | "ADMIN") ?? "USER",
    data,
  );

  const totalBookings =
    data && "total_bookings" in data
      ? toNumber((data as UserDashboardData | AdminDashboardData).total_bookings)
      : statusBreakdown.reduce((sum, s) => sum + s.value, 0);

  const recentBookingsTitle =
    role === "ADMIN"
      ? "Recent Approved Bookings"
      : role === "DEAN"
        ? "Pending Approvals"
        : "Recent Bookings";

  return {
    loading,
    error,
    data,
    statusBreakdown,
    recentBookings,
    recentBookingsTitle,
    totalBookings,
    refetch,
  };
}
