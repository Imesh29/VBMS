import * as vehicleRepository from "../repositories/vehicleRepository.js";
import createError from "../utils/creatError.js";

// Get all vehicles

export const getAllVehicles = async () => {
  return await vehicleRepository.findAllVehicles();
};
