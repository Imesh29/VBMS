/**
 * Shared shape for a role's booking status breakdown.
 * Present (in one form or another) on every dashboard endpoint.
 */
export interface BookingStatusCounts {
  pending_bookings: string;
  approved_bookings: string;
  confirmed_bookings: string;
  completed_bookings: string;
  cancelled_bookings: string;
}

/**
 * GET /api/dashboard/user
 */
export interface UserDashboardData extends BookingStatusCounts {
  total_bookings: string;
  upcoming_trips: string;
}

/**
 * GET /api/dashboard/dean
 * Note: the pending count is keyed "pending_approvals" for this role.
 */
export interface DeanDashboardData
  extends Omit<BookingStatusCounts, "pending_bookings"> {
  pending_approvals: string;
}

/**
 * GET /api/dashboard/admin
 */
export interface AdminDashboardData extends BookingStatusCounts {
  total_vehicles: string;
  available_vehicles: string;
  vehicles_in_use: string;
  vehicles_under_maintenance: string;

  total_bookings: string;
}

export type DashboardData =
  | UserDashboardData
  | DeanDashboardData
  | AdminDashboardData;

export interface DashboardApiResponse<T = AdminDashboardData> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Normalized row used by <RecentBookingsTable />, regardless of
 * which endpoint (my bookings / admin / dean) it was sourced from.
 */
export interface NormalizedBooking {
  id: string;
  bookingReference: string;
  vehicle: string;
  requester: string;
  department: string;
  destination: string;
  date: string;
  status: string;
}

/**
 * Normalized entry used by the status bar/pie charts.
 */
export interface StatusBreakdownItem {
  name: string;
  value: number;
  color: string;
}
