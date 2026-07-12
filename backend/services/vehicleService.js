import * as vehicleRepository from "../repositories/vehicleRepository.js";
import createError from "../utils/creatError.js";

// Get all vehicles

export const getAllVehicles = async () => {
  return await vehicleRepository.findAllVehicles();
};

// Create new vehicle

export const createVehicle = async (vehicleData) => {
  // Check duplicate vehicle number
  const existingVehicle = await vehicleRepository.findVehicleByNumber(
    vehicleData.vehicleNumber,
  );

  if (existingVehicle) {
    throw createError("Vehicle number already exists.", 409);
  }

  // Default status
  if (!vehicleData.status) {
    vehicleData.status = "AVAILABLE";
  }

  return await vehicleRepository.createVehicle(vehicleData);
};
