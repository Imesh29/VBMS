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
