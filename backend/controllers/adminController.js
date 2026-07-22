import { validationResult } from "express-validator";

import * as adminService from "../services/adminService.js";

import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Get all approved bookings
 * GET /api/admin/bookings
 */
export const getApprovedBookings = async (req, res, next) => {
  try {
    const bookings = await adminService.getApprovedBookings();

    return successResponse(
      res,
      200,
      "Approved bookings retrieved successfully.",
      bookings,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm booking
 * PATCH /api/admin/bookings/:id/confirm
 */
export const confirmBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const booking = await adminService.confirmBooking(req.params.id);

    return successResponse(
      res,
      200,
      "Booking confirmed successfully.",
      booking,
    );
  } catch (error) {
    next(error);
  }
};
