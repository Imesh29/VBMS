import { pool } from "../config/db.js";

// Get all vehicles

export const findAllVehicles = async () => {
  const query = `
    SELECT
      id,
      vehicle_number,
      vehicle_name,
      vehicle_type,
      capacity,
      fuel_type,
      driver_name,
      last_service_date,
      status,
      created_at,
      updated_at
    FROM vehicles
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};
