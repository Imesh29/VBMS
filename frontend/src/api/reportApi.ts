import api from "./axios";

export interface BookingReportFilters {
  status?: string;
  from?: string;
  to?: string;
}

export interface VehicleReportFilters {
  status?: string;
}

/**
 * Pulls a filename out of a Content-Disposition header, falling back
 * to a sensible default if the header is missing.
 */
function filenameFromResponse(response: any, fallback: string): string {
  const disposition: string | undefined =
    response.headers?.["content-disposition"];

  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/i);
    if (match?.[1]) return match[1];
  }

  return fallback;
}

/**
 * Triggers a browser download for a PDF blob response.
 */
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

/**
 * Generate + download the Booking Report PDF.
 * GET /api/reports/bookings/pdf
 */
export const downloadBookingReport = async (
  filters: BookingReportFilters = {},
): Promise<void> => {
  const response = await api.get("/reports/bookings/pdf", {
    params: filters,
    responseType: "blob",
  });

  downloadBlob(
    response.data,
    filenameFromResponse(response, "booking-report.pdf"),
  );
};

/**
 * Generate + download the Vehicle Report PDF.
 * GET /api/reports/vehicles/pdf
 */
export const downloadVehicleReport = async (
  filters: VehicleReportFilters = {},
): Promise<void> => {
  const response = await api.get("/reports/vehicles/pdf", {
    params: filters,
    responseType: "blob",
  });

  downloadBlob(
    response.data,
    filenameFromResponse(response, "vehicle-report.pdf"),
  );
};

/**
 * Generate + download the Dashboard/Activity Summary Report PDF.
 * GET /api/reports/dashboard/pdf
 */
export const downloadDashboardReport = async (): Promise<void> => {
  const response = await api.get("/reports/dashboard/pdf", {
    responseType: "blob",
  });

  downloadBlob(
    response.data,
    filenameFromResponse(response, "dashboard-report.pdf"),
  );
};
