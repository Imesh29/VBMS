import api from "./axios";

export interface BookingReportFilters {
  status?: string;
  from?: string;
  to?: string;
}

export interface VehicleReportFilters {
  status?: string;
}

export interface BookingReportRow {
  id: string;
  booking_reference: string;
  full_name: string;
  department: string | null;
  vehicle_number: string;
  vehicle_name: string;
  destination: string;
  departure_date: string;
  return_date: string;
  passenger_count: number;
  status: string;
}

export interface BookingReportPreview {
  summary: {
    total_bookings: number;
    pending: number;
    approved: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  rows: BookingReportRow[];
}

export interface VehicleReportRow {
  id: string;
  vehicle_number: string;
  vehicle_name: string;
  vehicle_type: string;
  capacity: number;
  fuel_type: string;
  driver_name: string | null;
  last_service_date: string | null;
  status: string;
}

export interface VehicleReportPreview {
  summary: {
    total_vehicles: number;
    available: number;
    in_use: number;
    maintenance: number;
  };
  rows: VehicleReportRow[];
}

export interface MonthlyActivityRow {
  month_start: string;
  month_label: string;
  completed: number;
  cancelled: number;
  pending: number;
  approved: number;
  confirmed: number;
  total_bookings: number;
  completion_rate: number;
}

export interface MonthlyActivityPreview {
  summary: {
    months_covered: number;
    total_trips: number;
    cancelled: number;
    pending: number;
  };
  rows: MonthlyActivityRow[];
}

export interface UserActivityRow {
  id: string;
  full_name: string;
  email: string;
  role: "USER" | "DEAN" | "ADMIN";
  department: string | null;
  is_active: boolean;
  created_at: string;
  bookings_count: number;
}

export interface UserActivityPreview {
  summary: {
    total_users: number;
    active: number;
    inactive: number;
    staff: number;
    deans: number;
    admins: number;
  };
  rows: UserActivityRow[];
}

const dataOf = <T>(response: any): T => response.data.data as T;

export const getBookingReportPreview = async (
  filters: BookingReportFilters = {},
): Promise<BookingReportPreview> => {
  const response = await api.get("/reports/bookings", { params: filters });
  return dataOf<BookingReportPreview>(response);
};

export const getVehicleReportPreview = async (
  filters: VehicleReportFilters = {},
): Promise<VehicleReportPreview> => {
  const response = await api.get("/reports/vehicles", { params: filters });
  return dataOf<VehicleReportPreview>(response);
};

export const getMonthlyActivityPreview = async (): Promise<MonthlyActivityPreview> => {
  const response = await api.get("/reports/monthly-activity");
  return dataOf<MonthlyActivityPreview>(response);
};

export const getUserActivityPreview = async (): Promise<UserActivityPreview> => {
  const response = await api.get("/reports/users");
  return dataOf<UserActivityPreview>(response);
};

function filenameFromResponse(response: any, fallback: string): string {
  const disposition: string | undefined = response.headers?.["content-disposition"];
  if (disposition) {
    const match = disposition.match(/filename="?([^";]+)"?/i);
    if (match?.[1]) return match[1];
  }
  return fallback;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

const downloadPdf = async (
  path: string,
  fallback: string,
  params?: BookingReportFilters | VehicleReportFilters,
) => {
  const response = await api.get(path, {
    params,
    responseType: "blob",
  });
  downloadBlob(response.data, filenameFromResponse(response, fallback));
};

export const downloadBookingReport = async (
  filters: BookingReportFilters = {},
): Promise<void> => {
  await downloadPdf("/reports/bookings/pdf", "booking-summary-report.pdf", filters);
};

export const downloadVehicleReport = async (
  filters: VehicleReportFilters = {},
): Promise<void> => {
  await downloadPdf("/reports/vehicles/pdf", "fleet-status-report.pdf", filters);
};

export const downloadMonthlyActivityReport = async (): Promise<void> => {
  await downloadPdf("/reports/monthly-activity/pdf", "monthly-activity-report.pdf");
};

export const downloadUserActivityReport = async (): Promise<void> => {
  await downloadPdf("/reports/users/pdf", "user-activity-report.pdf");
};

// Older calls remain safe if another page still uses this helper.
export const downloadDashboardReport = async (): Promise<void> => {
  await downloadPdf("/reports/dashboard/pdf", "dashboard-report.pdf");
};
