import express from "express";
import { body, param } from "express-validator";

import * as userController from "../controllers/userController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

const createUserValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("role")
    .notEmpty()
    .withMessage("Role is required.")
    .isIn(["USER", "DEAN", "ADMIN"])
    .withMessage("Role must be USER, DEAN or ADMIN."),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required.")
    .isLength({ max: 100 })
    .withMessage("Department cannot exceed 100 characters."),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean."),
];

const updateUserValidation = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters."),

  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(["USER", "DEAN", "ADMIN"])
    .withMessage("Role must be USER, DEAN or ADMIN."),

  body("department")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Department cannot exceed 100 characters."),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean."),

  body("password")
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

const idValidation = [param("id").isUUID().withMessage("Invalid user id.")];

// GET /api/users
router.get("/", authenticate, authorize("ADMIN"), userController.getAllUsers);

// POST /api/users
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createUserValidation,
  userController.createUser,
);

// PUT /api/users/:id
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  idValidation,
  updateUserValidation,
  userController.updateUser,
);

// DELETE /api/users/:id
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  idValidation,
  userController.deleteUser,
);

export default router;
