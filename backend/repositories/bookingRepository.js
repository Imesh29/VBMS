import { pool } from "../config/db.js";

/**
 * Check for conflicting bookings
 * with another booking for the same vehicle.
 */
export const findConflictingBookings = async (
  vehicleId,
  departureDate,
  returnDate,
  excludeBookingId = null,
) => {
  let query = `
        SELECT
            id,
            booking_reference,
            departure_date,
            return_date,
            status
        FROM bookings
        WHERE vehicle_id = $1
          AND status IN (
              'PENDING',
              'APPROVED',
              'CONFIRMED'
          )
          AND (
                departure_date < $3
            AND return_date > $2
          )
    `;

  const values = [vehicleId, departureDate, returnDate];

  // Ignore the current booking when updating
  if (excludeBookingId) {
    query += " AND id <> $4";
    values.push(excludeBookingId);
  }

  query += " ORDER BY departure_date;";

  const result = await pool.query(query, values);

  return result.rows;
};

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
 * Find all bookings of a user with filtering, sorting and pagination
 */
export const findBookingsByUser = async (userId, filters = {}) => {
  const {
    status,
    vehicle,
    date,
    page = 1,
    limit = 10,
    sort = "created_at",
    order = "DESC",
  } = filters;

  const allowedSortFields = [
    "created_at",
    "departure_date",
    "return_date",
    "status",
    "booking_reference",
  ];

  const sortField = allowedSortFields.includes(sort) ? sort : "created_at";

  const sortOrder = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (page - 1) * limit;

  /*
   * Get total records
   */
  const countQuery = `
      SELECT COUNT(*) AS total

      FROM bookings b

      INNER JOIN vehicles v
          ON b.vehicle_id = v.id

      WHERE b.user_id = $1

      AND (
          $2::text IS NULL
          OR b.status = $2
      )

      AND (
          $3::text IS NULL
          OR v.vehicle_number ILIKE '%' || $3 || '%'
      )

      AND (
          $4::date IS NULL
          OR b.departure_date = $4
      );
  `;

  const countResult = await pool.query(countQuery, [
    userId,
    status || null,
    vehicle || null,
    date || null,
  ]);

  const totalItems = Number(countResult.rows[0].total);

  /*
   * Get paginated records
   */
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

          v.vehicle_number,
          v.vehicle_name,
          v.vehicle_type

      FROM bookings b

      INNER JOIN vehicles v
          ON b.vehicle_id = v.id

      WHERE b.user_id = $1

      AND (
          $2::text IS NULL
          OR b.status = $2
      )

      AND (
          $3::text IS NULL
          OR v.vehicle_number ILIKE '%' || $3 || '%'
      )

      AND (
          $4::date IS NULL
          OR b.departure_date = $4
      )

      ORDER BY b.${sortField} ${sortOrder}

      LIMIT $5
      OFFSET $6;
  `;

  const result = await pool.query(query, [
    userId,
    status || null,
    vehicle || null,
    date || null,
    limit,
    offset,
  ]);

  return {
    items: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

/**
 * Find all bookings with filtering, sorting and pagination
 * (Admin / Dean)
 */
export const findAllBookings = async (filters = {}) => {
  const {
    status,
    vehicle,
    date,
    page = 1,
    limit = 10,
    sort = "created_at",
    order = "DESC",
  } = filters;

  const allowedSortFields = [
    "created_at",
    "departure_date",
    "return_date",
    "status",
    "booking_reference",
  ];

  const sortField = allowedSortFields.includes(sort) ? sort : "created_at";

  const sortOrder = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (page - 1) * limit;

  const countQuery = `
      SELECT COUNT(*) AS total

      FROM bookings b

      INNER JOIN users u
          ON b.user_id = u.id

      INNER JOIN vehicles v
          ON b.vehicle_id = v.id

      WHERE
          ($1::text IS NULL OR b.status = $1)

      AND
          ($2::text IS NULL OR v.vehicle_number ILIKE '%' || $2 || '%')

      AND
          ($3::date IS NULL OR b.departure_date = $3);
  `;

  const countResult = await pool.query(countQuery, [
    status || null,
    vehicle || null,
    date || null,
  ]);

  const totalItems = Number(countResult.rows[0].total);

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

          v.vehicle_number,
          v.vehicle_name,
          v.vehicle_type

      FROM bookings b

      INNER JOIN users u
          ON b.user_id = u.id

      INNER JOIN vehicles v
          ON b.vehicle_id = v.id

      WHERE
          ($1::text IS NULL OR b.status = $1)

      AND
          ($2::text IS NULL OR v.vehicle_number ILIKE '%' || $2 || '%')

      AND
          ($3::date IS NULL OR b.departure_date = $3)

      ORDER BY b.${sortField} ${sortOrder}

      LIMIT $4
      OFFSET $5;
  `;

  const result = await pool.query(query, [
    status || null,
    vehicle || null,
    date || null,
    limit,
    offset,
  ]);

  return {
    items: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
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

/**
 * Delete booking
 */
export const deleteBooking = async (id) => {
  const query = `
        DELETE FROM bookings
        WHERE id = $1
        RETURNING id;
    `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};
