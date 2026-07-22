import express from "express";
import { param } from "express-validator";

import * as adminController from "../controllers/adminController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

//validation Rules

const bookingIdValidation = [
  param("id").isUUID().withMessage("Invalid booking ID."),
];

// Routes

/**
 * GET /api/admin/bookings
 * Get all approved bookings
 */
router.get(
  "/bookings",
  authenticate,
  authorize("ADMIN"),
  adminController.getApprovedBookings,
);

/**
 * PATCH /api/admin/bookings/:id/confirm
 * Confirm booking
 */
router.patch(
  "/bookings/:id/confirm",
  authenticate,
  authorize("ADMIN"),
  bookingIdValidation,
  adminController.confirmBooking,
);

/**
 * PATCH /api/admin/bookings/:id/complete
 * Complete booking
 * ADMIN only
 */
router.patch(
  "/bookings/:id/complete",
  authenticate,
  authorize("ADMIN"),
  bookingIdValidation,
  adminController.completeBooking,
);

/**
 * GET /api/admin/vehicles
 * View all vehicles
 */
router.get(
  "/vehicles",
  authenticate,
  authorize("ADMIN"),
  adminController.getAllVehicles,
);

/**
 * PATCH /api/admin/bookings/:id/cancel
 * Cancel booking
 */
router.patch(
  "/bookings/:id/cancel",
  authenticate,
  authorize("ADMIN"),
  bookingIdValidation,
  adminController.cancelBooking,
);

export default router;
