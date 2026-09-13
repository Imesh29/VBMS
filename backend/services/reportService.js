import * as reportRepository from "../repositories/reportRepository.js";

const percent = (part, total) => {
  const safeTotal = Number(total || 0);
  if (!safeTotal) return "0.0%";
  return `${((Number(part || 0) / safeTotal) * 100).toFixed(1)}%`;
};

export const getBookingReport = async (filters = {}) => {
  const report = await reportRepository.getBookingReportData(filters);
  const s = report.summary;
  const open = Number(s.pending || 0) + Number(s.approved || 0) + Number(s.confirmed || 0);

  return {
    title: "BOOKING SUMMARY REPORT",
    description: "Operational overview of vehicle booking requests, approval progress, trip outcomes, and requester details.",
    filename: "booking-summary-report.pdf",
    tableTitle: "Booking Details",
    summary: {
      "Total Bookings": s.total_bookings,
      Pending: s.pending,
      Approved: s.approved,
      Confirmed: s.confirmed,
      Completed: s.completed,
      Cancelled: s.cancelled,
    },
    insights: [
      `Completion rate ${percent(s.completed, s.total_bookings)}`,
      `${open} booking${open === 1 ? "" : "s"} still in progress`,
      `Cancellation rate ${percent(s.cancelled, s.total_bookings)}`,
    ],
    headers: [
      { label: "Reference", property: "booking_reference", width: 80 },
      { label: "Requester", property: "full_name", width: 95 },
      { label: "Department", property: "department", width: 85 },
      { label: "Vehicle", property: "vehicle_name", width: 90 },
      { label: "Destination", property: "destination", width: 110 },
      { label: "Departure", property: "departure_date", width: 95 },
      { label: "Return", property: "return_date", width: 95 },
      { label: "Pax", property: "passenger_count", width: 35 },
      { label: "Status", property: "status", width: 70 },
    ],
    rows: report.rows,
  };
};

export const getVehicleReport = async (filters = {}) => {
  const report = await reportRepository.getVehicleReportData(filters);
  const s = report.summary;

  return {
    title: "FLEET STATUS REPORT",
    description: "Current fleet readiness, utilization, maintenance status, driver assignment, and service information.",
    filename: "fleet-status-report.pdf",
    tableTitle: "Fleet Inventory and Status",
    summary: {
      "Total Vehicles": s.total_vehicles,
      Available: s.available,
      "In Use": s.in_use,
      Maintenance: s.maintenance,
    },
    insights: [
      `Availability rate ${percent(s.available, s.total_vehicles)}`,
      `Fleet utilization ${percent(s.in_use, s.total_vehicles)}`,
      `${s.maintenance || 0} vehicle${Number(s.maintenance || 0) === 1 ? "" : "s"} under maintenance`,
    ],
    headers: [
      { label: "Vehicle", property: "vehicle_name", width: 110 },
      { label: "Type", property: "vehicle_type", width: 75 },
      { label: "Plate No.", property: "vehicle_number", width: 80 },
      { label: "Capacity", property: "capacity", width: 65 },
      { label: "Fuel", property: "fuel_type", width: 65 },
      { label: "Driver", property: "driver_name", width: 110 },
      { label: "Status", property: "status", width: 85 },
      { label: "Last Service", property: "last_service_date", width: 90 },
    ],
    rows: report.rows,
  };
};

export const getMonthlyActivityReport = async () => {
  const report = await reportRepository.getMonthlyActivityReportData();
  const rows = report.rows;
  const completed = rows.reduce((sum, row) => sum + Number(row.completed || 0), 0);
  const busiest = rows.reduce((best, row) =>
    !best || Number(row.total_bookings || 0) > Number(best.total_bookings || 0) ? row : best, null);

  return {
    title: "MONTHLY ACTIVITY REPORT",
    description: "Six-month booking trend showing trip completion, cancellations, pending workload, and overall activity levels.",
    filename: "monthly-activity-report.pdf",
    tableTitle: "Monthly Booking Performance",
    summary: {
      "Months Covered": report.summary.months_covered,
      "Total Trips": report.summary.total_trips,
      Cancelled: report.summary.cancelled,
      Pending: report.summary.pending,
    },
    insights: [
      `Overall completion rate ${percent(completed, report.summary.total_trips)}`,
      `Busiest month ${busiest?.month_label || "-"} (${busiest?.total_bookings || 0} bookings)`,
      `Cancellation rate ${percent(report.summary.cancelled, report.summary.total_trips)}`,
    ],
    headers: [
      { label: "Month", property: "month_label", width: 110 },
      { label: "Completed", property: "completed", width: 85 },
      { label: "Cancelled", property: "cancelled", width: 85 },
      { label: "Pending", property: "pending", width: 75 },
      { label: "Approved", property: "approved", width: 75 },
      { label: "Confirmed", property: "confirmed", width: 80 },
      { label: "Total", property: "total_bookings", width: 65 },
      { label: "Completion %", property: "completion_rate", width: 85 },
    ],
    rows,
  };
};

export const getUserActivityReport = async () => {
  const report = await reportRepository.getUserActivityReportData();
  const s = report.summary;
  const totalBookings = report.rows.reduce((sum, row) => sum + Number(row.bookings_count || 0), 0);
  const topUser = report.rows.reduce((best, row) =>
    !best || Number(row.bookings_count || 0) > Number(best.bookings_count || 0) ? row : best, null);

  return {
    title: "USER ACTIVITY REPORT",
    description: "Registered-user overview covering account status, system roles, departments, and booking activity.",
    filename: "user-activity-report.pdf",
    tableTitle: "User Accounts and Booking Activity",
    summary: {
      "Total Users": s.total_users,
      Active: s.active,
      Inactive: s.inactive,
      Staff: s.staff,
      Deans: s.deans,
      Admins: s.admins,
    },
    insights: [
      `Active account rate ${percent(s.active, s.total_users)}`,
      `${totalBookings} booking request${totalBookings === 1 ? "" : "s"} created by registered users`,
      `Highest activity ${topUser?.full_name || "-"} (${topUser?.bookings_count || 0} bookings)`,
    ],
    headers: [
      { label: "User", property: "full_name", width: 120 },
      { label: "Email", property: "email", width: 145 },
      { label: "Role", property: "role", width: 60 },
      { label: "Department", property: "department", width: 100 },
      { label: "Joined", property: "created_at", width: 80 },
      { label: "Bookings", property: "bookings_count", width: 60 },
      { label: "Status", property: "is_active", width: 60 },
    ],
    rows: report.rows,
  };
};

export const getDashboardReport = async () => {
  const report = await reportRepository.getDashboardReportData();
  const s = report.bookingSummary;

  return {
    title: "SYSTEM DASHBOARD REPORT",
    description: "High-level operational snapshot combining booking activity and fleet availability.",
    filename: "dashboard-report.pdf",
    tableTitle: "Recent Booking Activity",
    summary: {
      "Total Bookings": s.total_bookings,
      Pending: s.pending,
      Approved: s.approved,
      Confirmed: s.confirmed,
      Completed: s.completed,
      "Total Vehicles": report.vehicleSummary.total_vehicles,
      Available: report.vehicleSummary.available,
      Maintenance: report.vehicleSummary.maintenance,
    },
    insights: [
      `Booking completion rate ${percent(s.completed, s.total_bookings)}`,
      `Fleet availability ${percent(report.vehicleSummary.available, report.vehicleSummary.total_vehicles)}`,
    ],
    headers: [
      { label: "Reference", property: "booking_reference", width: 100 },
      { label: "Destination", property: "destination", width: 180 },
      { label: "Departure", property: "departure_date", width: 100 },
      { label: "Status", property: "status", width: 90 },
    ],
    rows: report.recentBookings,
  };
};
