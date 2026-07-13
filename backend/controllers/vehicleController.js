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

// Get vehicle by id

export const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await vehicleService.getVehicleById(id);

    return successResponse(
      res,
      200,
      "Vehicle retrieved successfully.",
      vehicle,
    );
  } catch (error) {
    next(error);
  }
};

// Get available vehicles

export const getAvailableVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAvailableVehicles();

    return successResponse(
      res,
      200,
      "Available vehicles retrieved successfully.",
      vehicles,
    );
  } catch (error) {
    next(error);
  }
};

// update vehicle

export const updateVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const { id } = req.params;

    const vehicle = await vehicleService.updateVehicle(id, req.body);

    return successResponse(res, 200, "Vehicle updated successfully.", vehicle);
  } catch (error) {
    next(error);
  }
};

// delete vehicle

export const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await vehicleService.deleteVehicle(id);

    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};
