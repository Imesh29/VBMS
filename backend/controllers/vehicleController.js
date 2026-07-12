import * as vehicleService from "../services/vehicleService.js";
import { successResponse, errorResponse } from "../utils/response.js";

import { validationResult } from "express-validator";

// Get all vehicles

export const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();

    return successResponse(
      res,
      200,
      "Vehicles retrieved successfully.",
      vehicles,
    );
  } catch (error) {
    next(error);
  }
};
