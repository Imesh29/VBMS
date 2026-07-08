import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const query = `
    SELECT
      id,
      full_name,
      email,
      password,
      role,
      department,
      created_at,
      updated_at
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const query = `
    SELECT
      id,
      full_name,
      email,
      role,
      department,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};

export const createUser = async ({
  fullName,
  email,
  password,
  role = "USER",
  department,
}) => {
  const query = `
    INSERT INTO users (
      full_name,
      email,
      password,
      role,
      department
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      full_name,
      email,
      role,
      department,
      created_at,
      updated_at
  `;

  const values = [fullName, email, password, role, department || null];

  const result = await pool.query(query, values);

  return result.rows[0];
};
