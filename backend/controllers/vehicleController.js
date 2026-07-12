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

// create new vehicle

export const createVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const vehicle = await vehicleService.createVehicle(req.body);

    return successResponse(res, 201, "Vehicle created successfully.", vehicle);
  } catch (error) {
    next(error);
  }
};
