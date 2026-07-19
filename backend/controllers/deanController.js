import { validationResult } from "express-validator";

import * as deanService from "../services/deanService.js";

import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Get all pending bookings
 * GET /api/dean/bookings
 */
export const getPendingBookings = async (req, res, next) => {
  try {
    const bookings = await deanService.getPendingBookings();

    return successResponse(
      res,
      200,
      "Pending bookings retrieved successfully.",
      bookings,
    );
  } catch (error) {
    next(error);
  }
};
