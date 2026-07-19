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

/**
 * Get Booking By Id
 */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(
      req.params.id,
      req.user.id,
    );

    return successResponse(
      res,
      200,
      "Booking retrieved successfully.",
      booking,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get My Bookings
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getMyBookings(req.user.id);

    return successResponse(
      res,
      200,
      "Bookings retrieved successfully.",
      bookings,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update Booking
 * PUT /api/bookings/:id
 */
export const updateBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const booking = await bookingService.updateBooking(
      req.params.id,
      req.user.id,
      req.body,
    );

    return successResponse(res, 200, "Booking updated successfully.", booking);
  } catch (error) {
    next(error);
  }
};
