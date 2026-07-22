import express from "express";
import { param } from "express-validator";

import * as deanController from "../controllers/deanController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Validation Rules

const bookingIdValidation = [
  param("id").isUUID().withMessage("Invalid booking ID."),
];

// Routes

/**
 * GET /api/dean/bookings
 * Get all pending bookings
 * DEAN only
 */
router.get(
  "/bookings",
  authenticate,
  authorize("DEAN"),
  deanController.getPendingBookings,
);

/**
 * PATCH /api/dean/bookings/:id/approve
 * Approve booking
 * DEAN only
 */
router.patch(
  "/bookings/:id/approve",
  authenticate,
  authorize("DEAN"),
  bookingIdValidation,
  deanController.approveBooking,
);

export default router;
