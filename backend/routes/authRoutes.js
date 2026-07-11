import express from "express";
import { body } from "express-validator";
import * as authController from "../controllers/authController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("department")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Department cannot exceed 100 characters"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, authController.register);

router.post("/login", loginValidation, authController.login);

router.get("/profile", authenticate, authController.getProfile);

router.post("/logout", authenticate, authController.logout);

export default router;
