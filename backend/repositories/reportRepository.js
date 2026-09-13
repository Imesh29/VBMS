import { pool } from "../config/db.js";

/**
 * Booking report data.
 * Summary counts are for the whole selected date range while rows can also
 * be narrowed by status. This lets the report page keep the status KPI chips
 * useful even when the table is filtered.
 */
export const getBookingReportData = async (filters = {}) => {
  const { from, to, status } = filters;

  const summaryQuery = `
    SELECT
      COUNT(*)::int AS total_bookings,
      COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'APPROVED')::int AS approved,
      COUNT(*) FILTER (WHERE status = 'CONFIRMED')::int AS confirmed,
      COUNT(*) FILTER (WHERE status = 'COMPLETED')::int AS completed,
      COUNT(*) FILTER (WHERE status = 'CANCELLED')::int AS cancelled
    FROM bookings
    WHERE
      ($1::date IS NULL OR departure_date::date >= $1::date)
      AND ($2::date IS NULL OR departure_date::date <= $2::date);
  `;

  const rowsQuery = `
    SELECT
      b.id,
      b.booking_reference,
      u.full_name,
      u.department,
      v.vehicle_number,
      v.vehicle_name,
      b.destination,
      b.departure_date,
      b.return_date,
      b.passenger_count,
      b.status
    FROM bookings b
    INNER JOIN users u ON b.user_id = u.id
    INNER JOIN vehicles v ON b.vehicle_id = v.id
    WHERE
      ($1::date IS NULL OR b.departure_date::date >= $1::date)
      AND ($2::date IS NULL OR b.departure_date::date <= $2::date)
      AND ($3::text IS NULL OR b.status::text = $3::text)
    ORDER BY b.departure_date DESC;
  `;

  const [summaryResult, rowsResult] = await Promise.all([
    pool.query(summaryQuery, [from || null, to || null]),
    pool.query(rowsQuery, [from || null, to || null, status || null]),
  ]);

  return {
    summary: summaryResult.rows[0],
    rows: rowsResult.rows,
  };
};

/** Get current fleet status and details. */
export const getVehicleReportData = async (filters = {}) => {
  const { status } = filters;

  const summaryQuery = `
    SELECT
      COUNT(*)::int AS total_vehicles,
      COUNT(*) FILTER (WHERE status = 'AVAILABLE')::int AS available,
      COUNT(*) FILTER (WHERE status = 'IN_USE')::int AS in_use,
      COUNT(*) FILTER (WHERE status = 'MAINTENANCE')::int AS maintenance
    FROM vehicles;
  `;

  const rowsQuery = `
    SELECT
      id,
      vehicle_number,
      vehicle_name,
      vehicle_type,
      capacity,
      fuel_type,
      driver_name,
      last_service_date,
      status
    FROM vehicles
    WHERE ($1::text IS NULL OR status::text = $1::text)
    ORDER BY vehicle_name, vehicle_number;
  `;

  const [summaryResult, rowsResult] = await Promise.all([
    pool.query(summaryQuery),
    pool.query(rowsQuery, [status || null]),
  ]);

  return {
    summary: summaryResult.rows[0],
    rows: rowsResult.rows,
  };
};

/**
 * Six-month booking activity used by both the report preview and PDF.
 * generate_series guarantees that months with no bookings are still shown.
 */
export const getMonthlyActivityReportData = async () => {
  const rowsQuery = `
    WITH months AS (
      SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - interval '5 months',
        date_trunc('month', CURRENT_DATE),
        interval '1 month'
      )::date AS month_start
    )
    SELECT
      m.month_start,
      to_char(m.month_start, 'Mon YYYY') AS month_label,
      COUNT(b.id) FILTER (WHERE b.status = 'COMPLETED')::int AS completed,
      COUNT(b.id) FILTER (WHERE b.status = 'CANCELLED')::int AS cancelled,
      COUNT(b.id) FILTER (WHERE b.status = 'PENDING')::int AS pending,
      COUNT(b.id) FILTER (WHERE b.status = 'APPROVED')::int AS approved,
      COUNT(b.id) FILTER (WHERE b.status = 'CONFIRMED')::int AS confirmed,
      COUNT(b.id)::int AS total_bookings,
      CASE
        WHEN COUNT(b.id) = 0 THEN 0
        ELSE ROUND(
          (COUNT(b.id) FILTER (WHERE b.status = 'COMPLETED')::numeric
            / COUNT(b.id)::numeric) * 100,
          1
        )
      END AS completion_rate
    FROM months m
    LEFT JOIN bookings b
      ON date_trunc('month', b.departure_date)::date = m.month_start
    GROUP BY m.month_start
    ORDER BY m.month_start ASC;
  `;

  const rowsResult = await pool.query(rowsQuery);
  const rows = rowsResult.rows;

  const summary = rows.reduce(
    (acc, row) => {
      acc.months_covered += 1;
      acc.total_trips += Number(row.total_bookings || 0);
      acc.cancelled += Number(row.cancelled || 0);
      acc.pending += Number(row.pending || 0);
      return acc;
    },
    { months_covered: 0, total_trips: 0, cancelled: 0, pending: 0 },
  );

  return { summary, rows };
};

/** User/account activity report. */
export const getUserActivityReportData = async () => {
  const summaryQuery = `
    SELECT
      COUNT(*)::int AS total_users,
      COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active,
      COUNT(*) FILTER (WHERE is_active = FALSE)::int AS inactive,
      COUNT(*) FILTER (WHERE role = 'USER')::int AS staff,
      COUNT(*) FILTER (WHERE role = 'DEAN')::int AS deans,
      COUNT(*) FILTER (WHERE role = 'ADMIN')::int AS admins
    FROM users;
  `;

  const rowsQuery = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.role,
      u.department,
      u.is_active,
      u.created_at,
      COUNT(b.id)::int AS bookings_count
    FROM users u
    LEFT JOIN bookings b ON b.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC;
  `;

  const [summaryResult, rowsResult] = await Promise.all([
    pool.query(summaryQuery),
    pool.query(rowsQuery),
  ]);

  return {
    summary: summaryResult.rows[0],
    rows: rowsResult.rows,
  };
};

/** Legacy combined dashboard report retained for compatibility. */
export const getDashboardReportData = async () => {
  const [bookingReport, vehicleReport] = await Promise.all([
    getBookingReportData(),
    getVehicleReportData(),
  ]);

  return {
    bookingSummary: bookingReport.summary,
    vehicleSummary: vehicleReport.summary,
    recentBookings: bookingReport.rows.slice(0, 10),
  };
};
