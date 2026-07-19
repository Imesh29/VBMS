import { pool } from "../config/db.js";

// Create a new booking

export const createBooking = async (booking) => {
  const query = `
        INSERT INTO bookings (
            booking_reference,
            user_id,
            vehicle_id,
            purpose,
            destination,
            departure_date,
            return_date,
            passenger_count,
            remarks,
            status
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
        )
        RETURNING
            id,
            booking_reference,
            user_id,
            vehicle_id,
            purpose,
            destination,
            departure_date,
            return_date,
            passenger_count,
            remarks,
            status,
            created_at,
            updated_at;
    `;

  const values = [
    booking.bookingReference,
    booking.userId,
    booking.vehicleId,
    booking.purpose,
    booking.destination,
    booking.departureDate,
    booking.returnDate,
    booking.passengerCount,
    booking.remarks,
    booking.status,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// Find booking by ID

export const findBookingById = async (id) => {
  const query = `
        SELECT *
        FROM bookings
        WHERE id = $1;
    `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};

/**
 * Find booking by booking reference
 */
export const findBookingByReference = async (reference) => {
  const query = `
        SELECT *
        FROM bookings
        WHERE booking_reference = $1;
    `;

  const result = await pool.query(query, [reference]);

  return result.rows[0] || null;
};

/**
 * Find all bookings of a user
 */
export const findBookingsByUser = async (userId) => {
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

            v.vehicle_number,
            v.vehicle_name,
            v.vehicle_type

        FROM bookings b

        INNER JOIN vehicles v
            ON b.vehicle_id = v.id

        WHERE b.user_id = $1

        ORDER BY b.created_at DESC;
    `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

/**
 * Update booking
 */
export const updateBooking = async (id, booking) => {
  const query = `
        UPDATE bookings
        SET

            vehicle_id = $1,
            purpose = $2,
            destination = $3,
            departure_date = $4,
            return_date = $5,
            passenger_count = $6,
            remarks = $7,
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $8

        RETURNING *;
    `;

  const values = [
    booking.vehicleId,
    booking.purpose,
    booking.destination,
    booking.departureDate,
    booking.returnDate,
    booking.passengerCount,
    booking.remarks,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};
