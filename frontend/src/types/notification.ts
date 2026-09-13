export interface NotificationItem {
  id: string;
  user_id: string;
  booking_id?: string | null;
  booking_reference?: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListData {
  items: NotificationItem[];
  unreadCount: number;
}
