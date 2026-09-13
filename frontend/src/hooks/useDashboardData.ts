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

export function useDashboardData(): UseDashboardDataResult {
  const { user } = useAuth();

  const role = user?.role;

  const [data, setData] = useState<RoleDashboardData>(null);

  const [recentBookings, setRecentBookings] = useState<NormalizedBooking[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((value) => value + 1), []);

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
        /**
         * ADMIN
         */
        if (role === "ADMIN") {
          const stats = await dashboardApi.getAdminDashboard();

          if (cancelled) {
            return;
          }

          setData(stats);

          try {
            const bookings = await adminApi.getAllBookings({
              page: 1,
              limit: 5,
              sort: "created_at",
              order: "DESC",
            });

            if (!cancelled) {
              setRecentBookings(bookings.items.map(mapStaffBooking));
            }
          } catch (bookingError) {
            console.error(
              "Unable to load recent Admin bookings:",
              bookingError,
            );

            if (!cancelled) {
              setRecentBookings([]);
            }
          }

          return;
        }

        /**
         * DEAN
         */
        if (role === "DEAN") {
          const stats = await dashboardApi.getDeanDashboard();

          if (cancelled) {
            return;
          }

          setData(stats);

          try {
            const bookings = await deanApi.getPendingBookings();

            if (!cancelled) {
              setRecentBookings(bookings.slice(0, 5).map(mapStaffBooking));
            }
          } catch (bookingError) {
            console.error("Unable to load Dean bookings:", bookingError);

            if (!cancelled) {
              setRecentBookings([]);
            }
          }

          return;
        }

        /**
         * USER
         */
        const stats = await dashboardApi.getUserDashboard();

        if (cancelled) {
          return;
        }

        setData(stats);

        try {
          const bookings = await bookingApi.getMyBookings({
            page: 1,
            limit: 5,
            sort: "created_at",
            order: "DESC",
          });

          if (!cancelled) {
            setRecentBookings(
              bookings.items.map((item) => mapMyBooking(item, user)),
            );
          }
        } catch (bookingError) {
          console.error("Unable to load user recent bookings:", bookingError);

          if (!cancelled) {
            setRecentBookings([]);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Failed to load dashboard data. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

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
      ? toNumber(
          (data as UserDashboardData | AdminDashboardData).total_bookings,
        )
      : statusBreakdown.reduce((sum, status) => sum + status.value, 0);

  const recentBookingsTitle =
    role === "ADMIN"
      ? "Recent Bookings"
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
