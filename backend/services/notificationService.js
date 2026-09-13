import { v4 as uuidv4 } from "uuid";
import * as notificationRepository from "../repositories/notificationRepository.js";
import createError from "../utils/createError.js";

export const createForUser = async ({ userId, bookingId, type, title, message }) => {
  return notificationRepository.createNotification({
    id: uuidv4(),
    userId,
    bookingId,
    type,
    title,
    message,
  });
};

export const createForUsers = async ({ userIds, bookingId, type, title, message }) => {
  return Promise.all(
    [...new Set(userIds)].map((userId) =>
      createForUser({ userId, bookingId, type, title, message }),
    ),
  );
};

export const getMyNotifications = async (userId, limit) => {
  const [items, unreadCount] = await Promise.all([
    notificationRepository.findByUser(userId, limit),
    notificationRepository.countUnreadByUser(userId),
  ]);

  return { items, unreadCount };
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await notificationRepository.markAsRead(
    notificationId,
    userId,
  );

  if (!notification) {
    throw createError("Notification not found.", 404);
  }

  return notification;
};

export const markAllNotificationsAsRead = async (userId) => {
  await notificationRepository.markAllAsRead(userId);
  return { message: "All notifications marked as read." };
};
