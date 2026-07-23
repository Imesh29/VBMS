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
