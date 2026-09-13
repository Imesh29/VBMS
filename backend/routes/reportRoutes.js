import express from "express";
import * as reportController from "../controllers/reportController.js";
import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Every report page/API is available to Admin and Dean only.
router.use(authenticate, authorize("ADMIN", "DEAN"));

// Preview data used by the Reports page.
router.get("/bookings", reportController.getBookingReportPreview);
router.get("/vehicles", reportController.getVehicleReportPreview);
router.get("/monthly-activity", reportController.getMonthlyActivityPreview);
router.get("/users", reportController.getUserActivityPreview);

// PDF downloads.
router.get("/bookings/pdf", reportController.generateBookingReport);
router.get("/vehicles/pdf", reportController.generateVehicleReport);
router.get("/monthly-activity/pdf", reportController.generateMonthlyActivityReport);
router.get("/users/pdf", reportController.generateUserActivityReport);

// Legacy endpoint kept for compatibility with older frontend builds.
router.get("/dashboard/pdf", reportController.generateDashboardReport);

export default router;
