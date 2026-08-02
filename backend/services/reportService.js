import * as reportRepository from "../repositories/reportRepository.js";

/**
 * Booking Report
 */
export const getBookingReport = async (filters = {}) => {
  const report = await reportRepository.getBookingReportData(filters);

  const headers = [
    {
      label: "Reference",
      property: "booking_reference",
      width: 90,
    },
    {
      label: "Requester",
      property: "full_name",
      width: 120,
    },
    {
      label: "Vehicle No",
      property: "vehicle_number",
      width: 80,
    },
    {
      label: "Vehicle",
      property: "vehicle_name",
      width: 120,
    },
    {
      label: "Destination",
      property: "destination",
      width: 130,
    },
    {
      label: "Departure",
      property: "departure_date",
      width: 80,
    },
    {
      label: "Return",
      property: "return_date",
      width: 80,
    },
    {
      label: "Status",
      property: "status",
      width: 80,
    },
  ];

  return {
    title: "BOOKING REPORT",

    filename: "booking-report.pdf",

    summary: {
      "Total Bookings": report.summary.total_bookings,

      Pending: report.summary.pending,

      Approved: report.summary.approved,

      Confirmed: report.summary.confirmed,

      Completed: report.summary.completed,

      Cancelled: report.summary.cancelled,
    },

    headers,

    rows: report.rows,
  };
};

/**
 * Vehicle Report
 */
export const getVehicleReport = async (filters = {}) => {
  const report = await reportRepository.getVehicleReportData(filters);

  const headers = [
    {
      label: "Vehicle No",
      property: "vehicle_number",
      width: 90,
    },
    {
      label: "Vehicle Name",
      property: "vehicle_name",
      width: 140,
    },
    {
      label: "Type",
      property: "vehicle_type",
      width: 90,
    },
    {
      label: "Capacity",
      property: "capacity",
      width: 70,
    },
    {
      label: "Driver",
      property: "driver_name",
      width: 120,
    },
    {
      label: "Status",
      property: "status",
      width: 90,
    },
  ];

  return {
    title: "VEHICLE REPORT",

    filename: "vehicle-report.pdf",

    summary: {
      "Total Vehicles": report.summary.total_vehicles,

      Available: report.summary.available,

      "In Use": report.summary.in_use,

      Maintenance: report.summary.maintenance,
    },

    headers,

    rows: report.rows,
  };
};

/**
 * Dashboard Report
 */
export const getDashboardReport = async () => {
  const report = await reportRepository.getDashboardReportData();

  const headers = [
    {
      label: "Reference",
      property: "booking_reference",
      width: 100,
    },
    {
      label: "Destination",
      property: "destination",
      width: 180,
    },
    {
      label: "Departure",
      property: "departure_date",
      width: 100,
    },
    {
      label: "Status",
      property: "status",
      width: 90,
    },
  ];

  return {
    title: "SYSTEM DASHBOARD REPORT",

    filename: "dashboard-report.pdf",

    summary: {
      "Total Bookings": report.bookingSummary.total_bookings,

      Pending: report.bookingSummary.pending,

      Approved: report.bookingSummary.approved,

      Completed: report.bookingSummary.completed,

      "Total Vehicles": report.vehicleSummary.total_vehicles,

      Available: report.vehicleSummary.available,

      Maintenance: report.vehicleSummary.maintenance,
    },

    headers,

    rows: report.recentBookings,
  };
};
