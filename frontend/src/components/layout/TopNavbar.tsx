import { useCallback, useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import AccountPanel from "../common/AccountPanel";
import NotificationDropdown from "../notifications/NotificationDropdown";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../api/notificationApi";
import type { NotificationItem } from "../../types/notification";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

export default function TopNavbar({
  title = "Dashboard",
  subtitle = "Overview of your vehicle booking system",
}: TopNavbarProps) {
  const { user } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationAreaRef = useRef<HTMLDivElement | null>(null);

  const displayName = user?.fullName || "User";
  const roleLabel =
    user?.role === "ADMIN"
      ? "Admin"
      : user?.role === "DEAN"
        ? "Faculty Dean"
        : "Staff";

  const loadNotifications = useCallback(async (showLoading = false) => {
    if (!user) return;

    if (showLoading) setNotificationsLoading(true);

    try {
      const data = await getMyNotifications(20);
      setNotifications(data.items);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Unable to load notifications:", error);
    } finally {
      if (showLoading) setNotificationsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    void loadNotifications();

    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 30000);

    const onFocus = () => void loadNotifications();
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user, loadNotifications]);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (
        notificationAreaRef.current &&
        !notificationAreaRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const handleBellClick = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (nextOpen) {
      await loadNotifications(true);
    }
  };

  const handleRead = async (id: string) => {
    const target = notifications.find((item) => item.id === id);

    if (target && !target.is_read) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, is_read: true } : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));

      try {
        await markNotificationAsRead(id);
      } catch (error) {
        console.error("Unable to mark notification as read:", error);
        await loadNotifications();
      }
    }
  };

  const handleReadAll = async () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, is_read: true })),
    );
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Unable to mark notifications as read:", error);
      await loadNotifications();
    }
  };

  return (
    <>
      <header
        className="bg-white border-b border-black/[0.06] px-6 md:px-8 py-5 flex items-center justify-between shrink-0"
        style={{ padding: "13px" }}
      >
        <div className="min-w-0">
          <h1
            className="text-xl md:text-2xl font-bold text-[#1C1C2E] truncate"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {title}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 truncate">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="relative" ref={notificationAreaRef}>
            <button
              type="button"
              onClick={() => void handleBellClick()}
              className="relative w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              title="Notifications"
            >
              <FaBell className="w-4 h-4" />

              {unreadCount > 0 && (
                <span
                  className="absolute flex items-center justify-center rounded-full bg-[#5B1E1D] text-white ring-2 ring-white"
                  style={{
                    top: "2px",
                    right: "1px",
                    minWidth: "18px",
                    height: "18px",
                    padding: "0 4px",
                    fontSize: "9px",
                    fontWeight: 700,
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                loading={notificationsLoading}
                onRead={(id) => void handleRead(id)}
                onReadAll={() => void handleReadAll()}
                onClose={() => setNotificationsOpen(false)}
              />
            )}
          </div>

          <button
            onClick={() => setAccountOpen(true)}
            className="flex items-center gap-3 pl-4 border-l border-gray-100 hover:opacity-80 transition-opacity"
            title="My Account"
          >
            <div className="w-11 h-11 rounded-full bg-[#4C1D1D] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials(displayName)}
            </div>

            <div
              className="hidden sm:block min-w-0 text-left"
              style={{ marginRight: "8px" }}
            >
              <p className="text-sm font-semibold text-[#1C1C2E] leading-tight truncate max-w-[160px]">
                {displayName}
              </p>
              <p className="text-xs text-gray-400 leading-tight mt-0.5 truncate">
                {roleLabel}
              </p>
            </div>
          </button>
        </div>
      </header>

      <AccountPanel open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
