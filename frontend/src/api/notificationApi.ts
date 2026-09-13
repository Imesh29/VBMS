import api from "./axios";
import type { NotificationItem, NotificationListData } from "../types/notification";

export const getMyNotifications = async (limit = 20): Promise<NotificationListData> => {
  const response = await api.get("/notifications", { params: { limit } });
  return response.data.data;
};

export const markNotificationAsRead = async (
  id: string,
): Promise<NotificationItem> => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch("/notifications/read-all");
};
