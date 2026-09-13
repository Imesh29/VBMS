import express from "express";
import { param } from "express-validator";
import * as notificationController from "../controllers/notificationController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, notificationController.getMyNotifications);

router.patch(
  "/read-all",
  authenticate,
  notificationController.markAllAsRead,
);

router.patch(
  "/:id/read",
  authenticate,
  param("id").isUUID().withMessage("Invalid notification ID."),
  notificationController.markAsRead,
);

export default router;
