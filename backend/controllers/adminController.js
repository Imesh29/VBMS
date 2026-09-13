import { validationResult } from "express-validator";

import * as adminService from "../services/adminService.js";

import * as vehicleService from "../services/vehicleService.js";

import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Get approved bookings.
 *
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
 * Get ALL bookings.
 *
 * GET /api/admin/bookings/all
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, vehicle, date, page, limit, sort, order } = req.query;

    const bookings = await adminService.getAllBookings({
      status,
      vehicle,
      date,
      page,
      limit,
      sort,
      order,
    });

    return successResponse(
      res,
      200,
      "All bookings retrieved successfully.",
      bookings,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm booking.
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

/**
 * Complete booking.
 */
export const completeBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const booking = await adminService.completeBooking(req.params.id);

    return successResponse(
      res,
      200,
      "Booking completed successfully.",
      booking,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all vehicles.
 */
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

/**
 * Cancel booking.
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const booking = await adminService.cancelBooking(req.params.id, req.body.reason);

    return successResponse(
      res,
      200,
      "Booking cancelled successfully.",
      booking,
    );
  } catch (error) {
    next(error);
  }
};
