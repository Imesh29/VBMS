import { pool } from "../config/db.js";

/**
 * Get Booking Report Data
 */
export const getBookingReportData = async (filters = {}) => {
  const { from, to, status } = filters;

  /*
    |--------------------------------------------------------------------------
    | Summary
    |--------------------------------------------------------------------------
    */

  const summaryQuery = `
        SELECT

            COUNT(*) AS total_bookings,

            COUNT(*) FILTER (
                WHERE status = 'PENDING'
            ) AS pending,

            COUNT(*) FILTER (
                WHERE status = 'APPROVED'
            ) AS approved,

            COUNT(*) FILTER (
                WHERE status = 'CONFIRMED'
            ) AS confirmed,

            COUNT(*) FILTER (
                WHERE status = 'COMPLETED'
            ) AS completed,

            COUNT(*) FILTER (
                WHERE status = 'CANCELLED'
            ) AS cancelled

        FROM bookings

        WHERE
            ($1::date IS NULL OR departure_date >= $1)

        AND
            ($2::date IS NULL OR departure_date <= $2)

        AND
            ($3::text IS NULL OR status = $3);
    `;

  const summaryResult = await pool.query(summaryQuery, [
    from || null,
    to || null,
    status || null,
  ]);

  /*
    |--------------------------------------------------------------------------
    | Booking Details
    |--------------------------------------------------------------------------
    */

  const rowsQuery = `
        SELECT

            b.booking_reference,

            u.full_name,

            v.vehicle_number,

            v.vehicle_name,

            b.destination,

            b.departure_date,

            b.return_date,

            b.status

        FROM bookings b

        INNER JOIN users u
            ON b.user_id = u.id

        INNER JOIN vehicles v
            ON b.vehicle_id = v.id

        WHERE
            ($1::date IS NULL OR b.departure_date >= $1)

        AND
            ($2::date IS NULL OR b.departure_date <= $2)

        AND
            ($3::text IS NULL OR b.status = $3)

        ORDER BY
            b.departure_date DESC;
    `;

  const rowsResult = await pool.query(rowsQuery, [
    from || null,
    to || null,
    status || null,
  ]);

  return {
    summary: summaryResult.rows[0],

    rows: rowsResult.rows,
  };
};

/**
 * Get Vehicle Report Data
 */
export const getVehicleReportData = async (filters = {}) => {
  const { status } = filters;

  /*
    |--------------------------------------------------------------------------
    | Summary
    |--------------------------------------------------------------------------
    */

  const summaryQuery = `
        SELECT

            COUNT(*) AS total_vehicles,

            COUNT(*) FILTER (
                WHERE status = 'AVAILABLE'
            ) AS available,

            COUNT(*) FILTER (
                WHERE status = 'IN_USE'
            ) AS in_use,

            COUNT(*) FILTER (
                WHERE status = 'MAINTENANCE'
            ) AS maintenance

        FROM vehicles

        WHERE
            ($1::text IS NULL OR status = $1);
    `;

  const summaryResult = await pool.query(summaryQuery, [status || null]);

  /*
    |--------------------------------------------------------------------------
    | Vehicle Details
    |--------------------------------------------------------------------------
    */

  const rowsQuery = `
        SELECT

            vehicle_number,

            vehicle_name,

            vehicle_type,

            capacity,

            driver_name,

            status

        FROM vehicles

        WHERE
            ($1::text IS NULL OR status = $1)

        ORDER BY
            vehicle_number;
    `;

  const rowsResult = await pool.query(rowsQuery, [status || null]);

  return {
    summary: summaryResult.rows[0],

    rows: rowsResult.rows,
  };
};

/**
 * Get Dashboard Report Data
 */
export const getDashboardReportData = async () => {
  /*
    |--------------------------------------------------------------------------
    | Booking Summary
    |--------------------------------------------------------------------------
    */

  const bookingSummary = await pool.query(`
        SELECT

            COUNT(*) AS total_bookings,

            COUNT(*) FILTER (
                WHERE status = 'PENDING'
            ) AS pending,

            COUNT(*) FILTER (
                WHERE status = 'APPROVED'
            ) AS approved,

            COUNT(*) FILTER (
                WHERE status = 'CONFIRMED'
            ) AS confirmed,

            COUNT(*) FILTER (
                WHERE status = 'COMPLETED'
            ) AS completed,

            COUNT(*) FILTER (
                WHERE status = 'CANCELLED'
            ) AS cancelled

        FROM bookings;
    `);

  /*
    |--------------------------------------------------------------------------
    | Vehicle Summary
    |--------------------------------------------------------------------------
    */

  const vehicleSummary = await pool.query(`
        SELECT

            COUNT(*) AS total_vehicles,

            COUNT(*) FILTER (
                WHERE status = 'AVAILABLE'
            ) AS available,

            COUNT(*) FILTER (
                WHERE status = 'IN_USE'
            ) AS in_use,

            COUNT(*) FILTER (
                WHERE status = 'MAINTENANCE'
            ) AS maintenance

        FROM vehicles;
    `);

  /*
    |--------------------------------------------------------------------------
    | Recent Bookings
    |--------------------------------------------------------------------------
    */

  const recentBookings = await pool.query(`
        SELECT

            booking_reference,

            destination,

            departure_date,

            status

        FROM bookings

        ORDER BY created_at DESC

        LIMIT 10;
    `);

  return {
    bookingSummary: bookingSummary.rows[0],

    vehicleSummary: vehicleSummary.rows[0],

    recentBookings: recentBookings.rows,
  };
};
