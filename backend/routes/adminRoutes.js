import express from "express";

import { body, param } from "express-validator";

import * as adminController from "../controllers/adminController.js";

import authenticate from "../middleware/authMiddleware.js";

import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

const bookingIdValidation = [
  param("id").isUUID().withMessage("Invalid booking ID."),
];

/**
 * Existing:
 * GET /api/admin/bookings
 *
 * Approved only.
 */
router.get(
  "/bookings",
  authenticate,
  authorize("ADMIN"),
  adminController.getApprovedBookings,
);

/**
 * New:
 * GET /api/admin/bookings/all
 *
 * ALL bookings.
 */
router.get(
  "/bookings/all",
  authenticate,
  authorize("ADMIN"),
  adminController.getAllBookings,
);

/**
 * Confirm booking.
 */
router.patch(
  "/bookings/:id/confirm",
  authenticate,
  authorize("ADMIN"),
  bookingIdValidation,
  adminController.confirmBooking,
);

/**
 * Complete booking.
 */
router.patch(
  "/bookings/:id/complete",
  authenticate,
  authorize("ADMIN"),
  bookingIdValidation,
  adminController.completeBooking,
);

/**
 * Cancel booking.
 */
router.patch(
  "/bookings/:id/cancel",
  authenticate,
  authorize("ADMIN"),
  bookingIdValidation,
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Cancellation reason is required.")
    .isLength({ max: 500 })
    .withMessage("Cancellation reason cannot exceed 500 characters."),
  adminController.cancelBooking,
);

/**
 * Get all vehicles.
 */
router.get(
  "/vehicles",
  authenticate,
  authorize("ADMIN"),
  adminController.getAllVehicles,
);

export default router;
