import { pool } from "../config/db.js";

export const createNotification = async ({
  id,
  userId,
  bookingId = null,
  type,
  title,
  message,
}) => {
  const query = `
    INSERT INTO notifications (
      id,
      user_id,
      booking_id,
      type,
      title,
      message
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    id,
    userId,
    bookingId,
    type,
    title,
    message,
  ]);

  return result.rows[0];
};

export const findByUser = async (userId, limit = 20) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const result = await pool.query(
    `
      SELECT
        n.id,
        n.user_id,
        n.booking_id,
        b.booking_reference,
        n.type,
        n.title,
        n.message,
        n.is_read,
        n.created_at
      FROM notifications n
      LEFT JOIN bookings b
        ON b.id = n.booking_id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
      LIMIT $2;
    `,
    [userId, safeLimit],
  );

  return result.rows;
};

export const countUnreadByUser = async (userId) => {
  const result = await pool.query(
    `
      SELECT COUNT(*)::int AS count
      FROM notifications
      WHERE user_id = $1
        AND is_read = FALSE;
    `,
    [userId],
  );

  return result.rows[0]?.count ?? 0;
};

export const markAsRead = async (notificationId, userId) => {
  const result = await pool.query(
    `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
        AND user_id = $2
      RETURNING *;
    `,
    [notificationId, userId],
  );

  return result.rows[0] || null;
};

export const markAllAsRead = async (userId) => {
  await pool.query(
    `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1
        AND is_read = FALSE;
    `,
    [userId],
  );
};
