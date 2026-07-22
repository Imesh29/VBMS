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

/**
 * Approve booking
 * PATCH /api/dean/bookings/:id/approve
 */
export const approveBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const booking = await deanService.approveBooking(req.params.id);

    return successResponse(res, 200, "Booking approved successfully.", booking);
  } catch (error) {
    next(error);
  }
};
