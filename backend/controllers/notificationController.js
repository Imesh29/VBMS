import { validationResult } from "express-validator";
import * as notificationService from "../services/notificationService.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getMyNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getMyNotifications(
      req.user.id,
      req.query.limit,
    );

    return successResponse(res, 200, "Notifications retrieved successfully.", data);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const notification = await notificationService.markNotificationAsRead(
      req.params.id,
      req.user.id,
    );

    return successResponse(res, 200, "Notification marked as read.", notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllNotificationsAsRead(req.user.id);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};
