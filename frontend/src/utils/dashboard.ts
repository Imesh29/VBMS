import type {
  AdminDashboardData,
  DeanDashboardData,
  NormalizedBooking,
  StatusBreakdownItem,
  UserDashboardData,
} from "../types/dashboard";
import type { AuthUser } from "../api/authApi";

export type DashboardRole = "USER" | "DEAN" | "ADMIN";

/** Safely turn the string counts returned by Postgres into numbers. */
export const toNumber = (value: string | number | undefined): number => {
  if (value === undefined || value === null) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * Build the pie/bar chart data from whichever dashboard payload
 * the current role received. Every role returns a status breakdown,
 * just under slightly different key names.
 */
export function getStatusBreakdown(
  role: DashboardRole,
  data: UserDashboardData | DeanDashboardData | AdminDashboardData | null,
): StatusBreakdownItem[] {
  if (!data) return [];

  const pending =
    role === "DEAN"
      ? (data as DeanDashboardData).pending_approvals
      : (data as UserDashboardData | AdminDashboardData).pending_bookings;

  return [
    { name: "Pending", value: toNumber(pending), color: "#F59E0B" },
    {
      name: "Approved",
      value: toNumber(data.approved_bookings),
      color: "#3B82F6",
    },
    {
      name: "Confirmed",
      value: toNumber(data.confirmed_bookings),
      color: "#10B981",
    },
    {
      name: "Completed",
      value: toNumber(data.completed_bookings),
      color: "#94A3B8",
    },
    {
      name: "Cancelled",
      value: toNumber(data.cancelled_bookings),
      color: "#EF4444",
    },
  ];
}

/** Title-cases an UPPER_SNAKE status like "IN_USE" -> "In Use". */
export function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Normalizes a row from GET /api/bookings (the current user's own bookings). */
export function mapMyBooking(
  item: Record<string, any>,
  currentUser: AuthUser | null,
): NormalizedBooking {
  return {
    id: item.id,
    bookingReference: item.booking_reference,
    vehicle: item.vehicle_name || item.vehicle_number || "—",
    requester: currentUser?.fullName || "You",
    department: currentUser?.department || "—",
    destination: item.destination,
    date: formatDate(item.departure_date),
    status: formatStatus(item.status),
  };
}

/** Normalizes a row from GET /api/admin/bookings or GET /api/dean/bookings. */
export function mapStaffBooking(item: Record<string, any>): NormalizedBooking {
  return {
    id: item.id,
    bookingReference: item.booking_reference,
    vehicle: item.vehicle_name || item.vehicle_number || "—",
    requester: item.full_name || "—",
    department: item.department || "—",
    destination: item.destination,
    date: formatDate(item.departure_date),
    status: formatStatus(item.status),
  };
}
