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
