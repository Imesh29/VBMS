import { pool } from "../config/db.js";

/**
 * Get all pending bookings
 */
export const getPendingBookings = async () => {
  const query = `
        SELECT
            b.id,
            b.booking_reference,
            b.purpose,
            b.destination,
            b.departure_date,
            b.return_date,
            b.passenger_count,
            b.remarks,
            b.status,
            b.created_at,

            u.id AS user_id,
            u.full_name,
            u.email,
            u.department,

            v.id AS vehicle_id,
            v.vehicle_number,
            v.vehicle_name,
            v.vehicle_type

        FROM bookings b

        INNER JOIN users u
            ON b.user_id = u.id

        INNER JOIN vehicles v
            ON b.vehicle_id = v.id

        WHERE b.status = 'PENDING'

        ORDER BY b.created_at ASC;
    `;

  const result = await pool.query(query);

  return result.rows;
};

/**
 * Find booking by ID
 */
export const findBookingById = async (bookingId) => {
  const query = `
        SELECT *
        FROM bookings
        WHERE id = $1;
    `;

  const result = await pool.query(query, [bookingId]);

  return result.rows[0] || null;
};

/**
 * Approve booking
 */
export const approveBooking = async (bookingId) => {
  const query = `
        UPDATE bookings
        SET
            status = 'APPROVED',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;
    `;

  const result = await pool.query(query, [bookingId]);

  return result.rows[0] || null;
};
