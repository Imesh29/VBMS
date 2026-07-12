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

export const findVehicleByNumber = async (vehicleNumber) => {
  const query = `
    SELECT *
    FROM vehicles
    WHERE vehicle_number = $1;
  `;

  const result = await pool.query(query, [vehicleNumber]);

  return result.rows[0] || null;
};

// Create vehicle

export const createVehicle = async (vehicle) => {
  const query = `
    INSERT INTO vehicles (
      vehicle_number,
      vehicle_name,
      vehicle_type,
      capacity,
      fuel_type,
      driver_name,
      last_service_date,
      status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8
    )
    RETURNING
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
      updated_at;
  `;

  const values = [
    vehicle.vehicleNumber,
    vehicle.vehicleName,
    vehicle.vehicleType,
    vehicle.capacity,
    vehicle.fuelType,
    vehicle.driverName,
    vehicle.lastServiceDate,
    vehicle.status || "AVAILABLE",
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// Get vehicle by ID

export const findVehicleById = async (id) => {
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
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};
