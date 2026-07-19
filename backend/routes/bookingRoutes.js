import express from "express";
import { body, param } from "express-validator";

import * as bookingController from "../controllers/bookingController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// validation rules for creating a booking

const bookingValidation = [
  body("vehicleId")
    .notEmpty()
    .withMessage("Vehicle is required.")
    .isUUID()
    .withMessage("Invalid vehicle ID."),

  body("purpose")
    .trim()
    .notEmpty()
    .withMessage("Purpose is required.")
    .isLength({ max: 500 })
    .withMessage("Purpose cannot exceed 500 characters."),

  body("destination")
    .trim()
    .notEmpty()
    .withMessage("Destination is required.")
    .isLength({ max: 255 })
    .withMessage("Destination cannot exceed 255 characters."),

  body("departureDate")
    .notEmpty()
    .withMessage("Departure date is required.")
    .isISO8601()
    .withMessage("Invalid departure date."),

  body("returnDate")
    .notEmpty()
    .withMessage("Return date is required.")
    .isISO8601()
    .withMessage("Invalid return date."),

  body("passengerCount")
    .notEmpty()
    .withMessage("Passenger count is required.")
    .isInt({ min: 1 })
    .withMessage("Passenger count must be at least 1."),

  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Remarks cannot exceed 1000 characters."),
];

const bookingIdValidation = [
  param("id").isUUID().withMessage("Invalid booking ID."),
];

// create a new booking

router.post(
  "/",
  authenticate,
  authorize("USER"),
  bookingValidation,
  bookingController.createBooking,
);

/**
 * GET /api/bookings/my
 * USER only
 */
router.get(
  "/my",
  authenticate,
  authorize("USER"),
  bookingController.getMyBookings,
);

/**
 * GET /api/bookings/:id
 * USER only
 */
router.get(
  "/:id",
  authenticate,
  authorize("USER"),
  bookingIdValidation,
  bookingController.getBookingById,
);

/**
 * Update Booking
 * USER only
 */
router.put(
  "/:id",
  authenticate,
  authorize("USER"),
  bookingIdValidation,
  bookingValidation,
  bookingController.updateBooking,
);

export default router;
