import { pool } from "../config/db.js";

/**
 * Get dashboard statistics for a user
 */
export const getUserDashboard = async (userId) => {
  const query = `
        SELECT
            COUNT(*) AS total_bookings,

            COUNT(*) FILTER (
                WHERE status = 'PENDING'
            ) AS pending_bookings,

            COUNT(*) FILTER (
                WHERE status = 'APPROVED'
            ) AS approved_bookings,

            COUNT(*) FILTER (
                WHERE status = 'CONFIRMED'
            ) AS confirmed_bookings,

            COUNT(*) FILTER (
                WHERE status = 'COMPLETED'
            ) AS completed_bookings,

            COUNT(*) FILTER (
                WHERE status = 'CANCELLED'
            ) AS cancelled_bookings,

            COUNT(*) FILTER (
                WHERE departure_date >= CURRENT_DATE
                  AND status IN ('APPROVED', 'CONFIRMED')
            ) AS upcoming_trips

        FROM bookings
        WHERE user_id = $1;
    `;

  const result = await pool.query(query, [userId]);

  return result.rows[0];
};

/**
 * Get dashboard statistics for the Dean
 */
export const getDeanDashboard = async () => {
  const query = `
        SELECT

            COUNT(*) FILTER (
                WHERE status = 'PENDING'
            ) AS pending_approvals,

            COUNT(*) FILTER (
                WHERE status = 'APPROVED'
            ) AS approved_bookings,

            COUNT(*) FILTER (
                WHERE status = 'CONFIRMED'
            ) AS confirmed_bookings,

            COUNT(*) FILTER (
                WHERE status = 'COMPLETED'
            ) AS completed_bookings,

            COUNT(*) FILTER (
                WHERE status = 'CANCELLED'
            ) AS cancelled_bookings

        FROM bookings;
    `;

  const result = await pool.query(query);

  return result.rows[0];
};

/**
 * Get dashboard statistics for the Admin
 */
export const getAdminDashboard = async () => {
  const query = `
        SELECT

            /* Vehicle Statistics */

            (
                SELECT COUNT(*)
                FROM vehicles
            ) AS total_vehicles,

            (
                SELECT COUNT(*)
                FROM vehicles
                WHERE status = 'AVAILABLE'
            ) AS available_vehicles,

            (
                SELECT COUNT(*)
                FROM vehicles
                WHERE status = 'IN_USE'
            ) AS vehicles_in_use,

            (
                SELECT COUNT(*)
                FROM vehicles
                WHERE status = 'MAINTENANCE'
            ) AS vehicles_under_maintenance,

            /* Booking Statistics */

            (
                SELECT COUNT(*)
                FROM bookings
            ) AS total_bookings,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'PENDING'
            ) AS pending_bookings,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'APPROVED'
            ) AS approved_bookings,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'CONFIRMED'
            ) AS confirmed_bookings,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'COMPLETED'
            ) AS completed_bookings,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'CANCELLED'
            ) AS cancelled_bookings;
    `;

  const result = await pool.query(query);

  return result.rows[0];
};
