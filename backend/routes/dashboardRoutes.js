import express from "express";

import * as dashboardController from "../controllers/dashboardController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Dashboard Routes

/**
 * GET /api/dashboard/user
 * Dashboard for authenticated user
 */
router.get("/user", authenticate, dashboardController.getUserDashboard);

/**
 * GET /api/dashboard/dean
 * Dashboard for dean
 */
router.get(
  "/dean",
  authenticate,
  authorize("DEAN"),
  dashboardController.getDeanDashboard,
);

export default router;
