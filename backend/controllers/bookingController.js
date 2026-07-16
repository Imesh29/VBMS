import { validationResult } from "express-validator";
import * as bookingService from "../services/bookingService.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Create Booking
 */
export const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const booking = await bookingService.createBooking(req.user.id, req.body);

    return successResponse(res, 201, "Booking created successfully.", booking);
  } catch (error) {
    next(error);
  }
};
