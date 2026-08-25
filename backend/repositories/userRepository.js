import { pool } from "../config/db.js";

/**
 * Get all users with their booking counts.
 * Supports search across name / email / department.
 */
export const getAllUsers = async ({ search } = {}) => {
  const query = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.role,
      u.department,
      u.is_active,
      u.created_at,
      u.updated_at,
      COUNT(b.id)::int AS bookings_count
    FROM users u
    LEFT JOIN bookings b
      ON b.user_id = u.id
    WHERE
      ($1::text IS NULL
        OR u.full_name ILIKE '%' || $1 || '%'
        OR u.email ILIKE '%' || $1 || '%'
        OR u.department ILIKE '%' || $1 || '%')
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;

  const result = await pool.query(query, [search || null]);

  return result.rows;
};

export const findUserById = async (id) => {
  const query = `
    SELECT
      id,
      full_name,
      email,
      role,
      department,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};

export const findUserByEmail = async (email) => {
  const query = `SELECT id FROM users WHERE email = $1`;

  const result = await pool.query(query, [email]);

  return result.rows[0] || null;
};

export const createUser = async ({
  fullName,
  email,
  password,
  role,
  department,
  isActive,
}) => {
  const query = `
    INSERT INTO users (full_name, email, password, role, department, is_active)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      full_name,
      email,
      role,
      department,
      is_active,
      created_at,
      updated_at
  `;

  const values = [
    fullName,
    email,
    password,
    role,
    department || null,
    isActive,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const updateUser = async (id, fields) => {
  const columns = [];
  const values = [];
  let i = 1;

  for (const [column, value] of Object.entries(fields)) {
    columns.push(`${column} = $${i}`);
    values.push(value);
    i += 1;
  }

  columns.push(`updated_at = NOW()`);

  values.push(id);

  const query = `
    UPDATE users
    SET ${columns.join(", ")}
    WHERE id = $${i}
    RETURNING
      id,
      full_name,
      email,
      role,
      department,
      is_active,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};

export const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id`;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};
