import express from "express";
import { body, param } from "express-validator";

import * as vehicleController from "../controllers/vehicleController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Validation Rules for creating a vehicle

const vehicleValidation = [
  body("vehicleNumber")
    .trim()
    .notEmpty()
    .withMessage("Vehicle number is required.")
    .isLength({ max: 50 })
    .withMessage("Vehicle number cannot exceed 50 characters."),

  body("vehicleName")
    .trim()
    .notEmpty()
    .withMessage("Vehicle name is required.")
    .isLength({ max: 100 })
    .withMessage("Vehicle name cannot exceed 100 characters."),

  body("vehicleType")
    .trim()
    .notEmpty()
    .withMessage("Vehicle type is required."),

  body("capacity")
    .notEmpty()
    .withMessage("Capacity is required.")
    .isInt({ min: 1 })
    .withMessage("Capacity must be greater than zero."),

  body("fuelType").trim().notEmpty().withMessage("Fuel type is required."),

  body("driverName").trim().notEmpty().withMessage("Driver name is required."),

  body("lastServiceDate")
    .notEmpty()
    .withMessage("Last service date is required.")
    .isISO8601()
    .withMessage("Invalid service date."),

  body("status")
    .optional()
    .isIn(["AVAILABLE", "IN_USE", "MAINTENANCE"])
    .withMessage("Status must be AVAILABLE, IN_USE or MAINTENANCE."),
];

const idValidation = [param("id").isUUID().withMessage("Invalid vehicle id.")];

// Get all vehicles

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  vehicleController.getAllVehicles,
);

export default router;
