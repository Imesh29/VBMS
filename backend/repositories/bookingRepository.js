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

  if (excludeBookingId) {
    query += " AND id <> $4";
    values.push(excludeBookingId);
  }

  query += " ORDER BY departure_date;";

  const result = await pool.query(query, values);

  return result.rows;
};

/**
 * Create booking
 */
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

/**
 * Find booking by ID
 */
export const findBookingById = async (id) => {
  const query = `
    SELECT
      b.*,
      v.vehicle_number,
      v.vehicle_name,
      v.vehicle_type,
      v.capacity,
      v.fuel_type,
      v.driver_name,
      v.status AS vehicle_status
    FROM bookings b
    INNER JOIN vehicles v
      ON v.id = b.vehicle_id
    WHERE b.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};

/**
 * Find booking by reference
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
 * Get logged-in user's bookings.
 *
 * Supports:
 * filtering
 * pagination
 * sorting
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

  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.max(Number(limit) || 10, 1);

  const offset = (safePage - 1) * safeLimit;

  /**
   * Count
   */
  const countQuery = `
    SELECT COUNT(*) AS total

    FROM bookings b

    INNER JOIN vehicles v
      ON b.vehicle_id = v.id

    WHERE b.user_id = $1

    AND (
      $2::text IS NULL
      OR b.status::text = $2::text
    )

    AND (
      $3::text IS NULL
      OR v.vehicle_number ILIKE '%' || $3 || '%'
      OR v.vehicle_name ILIKE '%' || $3 || '%'
    )

    AND (
      $4::date IS NULL
      OR b.departure_date::date = $4::date
    );
  `;

  const countResult = await pool.query(countQuery, [
    userId,
    status || null,
    vehicle || null,
    date || null,
  ]);

  const totalItems = Number(countResult.rows[0].total);

  /**
   * Data
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
      b.cancellation_reason,
      b.status,
      b.created_at,
      b.updated_at,

      v.id AS vehicle_id,
      v.vehicle_number,
      v.vehicle_name,
      v.vehicle_type

    FROM bookings b

    INNER JOIN vehicles v
      ON b.vehicle_id = v.id

    WHERE b.user_id = $1

    AND (
      $2::text IS NULL
      OR b.status::text = $2::text
    )

    AND (
      $3::text IS NULL
      OR v.vehicle_number ILIKE '%' || $3 || '%'
      OR v.vehicle_name ILIKE '%' || $3 || '%'
    )

    AND (
      $4::date IS NULL
      OR b.departure_date::date = $4::date
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
    safeLimit,
    offset,
  ]);

  return {
    items: result.rows,

    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
};

/**
 * Get ALL bookings.
 *
 * Used by Admin.
 *
 * Supports:
 * filtering
 * pagination
 * sorting
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

  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.max(Number(limit) || 10, 1);

  const offset = (safePage - 1) * safeLimit;

  /**
   * Count query
   */
  const countQuery = `
    SELECT COUNT(*) AS total

    FROM bookings b

    INNER JOIN users u
      ON b.user_id = u.id

    INNER JOIN vehicles v
      ON b.vehicle_id = v.id

    WHERE (
      $1::text IS NULL
      OR b.status::text = $1::text
    )

    AND (
      $2::text IS NULL
      OR v.vehicle_number ILIKE '%' || $2 || '%'
      OR v.vehicle_name ILIKE '%' || $2 || '%'
    )

    AND (
      $3::date IS NULL
      OR b.departure_date::date = $3::date
    );
  `;

  const countResult = await pool.query(countQuery, [
    status || null,
    vehicle || null,
    date || null,
  ]);

  const totalItems = Number(countResult.rows[0].total);

  /**
   * Data query
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
      b.cancellation_reason,
      b.status,
      b.created_at,
      b.updated_at,

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

    WHERE (
      $1::text IS NULL
      OR b.status::text = $1::text
    )

    AND (
      $2::text IS NULL
      OR v.vehicle_number ILIKE '%' || $2 || '%'
      OR v.vehicle_name ILIKE '%' || $2 || '%'
    )

    AND (
      $3::date IS NULL
      OR b.departure_date::date = $3::date
    )

    ORDER BY b.${sortField} ${sortOrder}

    LIMIT $4
    OFFSET $5;
  `;

  const result = await pool.query(query, [
    status || null,
    vehicle || null,
    date || null,
    safeLimit,
    offset,
  ]);

  return {
    items: result.rows,

    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
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
      AND status = 'PENDING'

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
