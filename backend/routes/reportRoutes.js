import express from "express";

import * as reportController from "../controllers/reportController.js";

import authenticate from "../middleware/authMiddleware.js";

import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Booking Report
|--------------------------------------------------------------------------
*/

router.get(
  "/bookings/pdf",
  authenticate,
  authorize("ADMIN", "DEAN"),
  reportController.generateBookingReport,
);

/*
|--------------------------------------------------------------------------
| Vehicle Report
|--------------------------------------------------------------------------
*/

router.get(
  "/vehicles/pdf",
  authenticate,
  authorize("ADMIN", "DEAN"),
  reportController.generateVehicleReport,
);

/*
|--------------------------------------------------------------------------
| Dashboard Report
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard/pdf",
  authenticate,
  authorize("ADMIN", "DEAN"),
  reportController.generateDashboardReport,
);

export default router;
