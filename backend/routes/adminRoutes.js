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
 * ADMIN only
 */
router.get(
  "/bookings",
  authenticate,
  authorize("ADMIN"),
  adminController.getApprovedBookings,
);

export default router;
