import { pool } from "../config/db.js";

/**
 * Get all approved bookings
 */
export const getApprovedBookings = async () => {
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

        WHERE b.status = 'APPROVED'

        ORDER BY b.created_at ASC;
    `;

  const result = await pool.query(query);

  return result.rows;
};
