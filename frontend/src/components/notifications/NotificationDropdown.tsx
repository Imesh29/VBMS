import {
  FaCheck,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import type { NotificationItem } from "../../types/notification";

interface Props {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  onRead: (id: string) => void;
  onReadAll: () => void;
  onClose: () => void;
}

type VisualState = {
  label: string;
  accent: string;
  iconBg: string;
  icon: "clock" | "check" | "times";
};

function getVisualState(type: string): VisualState {
  switch (type) {
    case "BOOKING_APPROVED":
      return {
        label: "APPROVED",
        accent: "#00A86B",
        iconBg: "#ECFDF5",
        icon: "check",
      };

    case "BOOKING_CONFIRMED":
      return {
        label: "CONFIRMED",
        accent: "#7C3AED",
        iconBg: "#F5F3FF",
        icon: "check",
      };

    case "BOOKING_COMPLETED":
      return {
        label: "COMPLETED",
        accent: "#64748B",
        iconBg: "#F1F5F9",
        icon: "check",
      };

    case "BOOKING_CANCELLED":
      return {
        label: "CANCELLED",
        accent: "#EF4444",
        iconBg: "#FEF2F2",
        icon: "times",
      };

    case "BOOKING_PENDING_DEAN":
      return {
        label: "NEW REQUEST",
        accent: "#F59E0B",
        iconBg: "#FFFBEB",
        icon: "clock",
      };

    case "BOOKING_CREATED":
    default:
      return {
        label: "SUBMITTED",
        accent: "#2563EB",
        iconBg: "#EFF6FF",
        icon: "clock",
      };
  }
}

function extractBookingReference(item: NotificationItem) {
  if (item.booking_reference) return item.booking_reference;

  const source = `${item.title} ${item.message}`;
  const match = source.match(/BK-[A-Z0-9-]+/i);

  return match?.[0] ?? "BOOKING";
}

function formatNotificationDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusIcon({ state }: { state: VisualState }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: "42px",
        height: "42px",
        backgroundColor: state.iconBg,
        color: state.accent,
      }}
    >
      {state.icon === "times" ? (
        <FaTimes style={{ width: "15px", height: "15px" }} />
      ) : state.icon === "clock" ? (
        <FaClock style={{ width: "15px", height: "15px" }} />
      ) : (
        <FaCheck style={{ width: "14px", height: "14px" }} />
      )}
    </div>
  );
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  loading,
  onRead,
  onReadAll,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        style={{
          backgroundColor: "rgba(17, 24, 39, 0.42)",
          backdropFilter: "blur(2px)",
        }}
      />

      <aside
        className="absolute right-0 top-0 flex h-full flex-col bg-white"
        style={{
          width: "min(520px, 100vw)",
          boxShadow: "-18px 0 55px rgba(15, 23, 42, 0.16)",
        }}
      >
        <div
          className="flex items-start justify-between"
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid #EEF0F4",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: 1.2,
                fontWeight: 700,
                color: "#171A2B",
              }}
            >
              Notifications
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "13px",
                color: "#98A2B3",
              }}
            >
              {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-full transition-colors hover:bg-slate-100"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#F8FAFC",
              color: "#667085",
            }}
            title="Close notifications"
          >
            <FaTimes style={{ width: "15px", height: "15px" }} />
          </button>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ padding: "26px 26px 20px" }}
        >
          {loading ? (
            <div
              style={{
                padding: "56px 16px",
                textAlign: "center",
                fontSize: "13px",
                color: "#98A2B3",
              }}
            >
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div
              style={{
                padding: "56px 16px",
                textAlign: "center",
                fontSize: "13px",
                color: "#98A2B3",
              }}
            >
              No notifications yet.
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: "12px" }}>
              {notifications.map((item) => {
                const state = getVisualState(item.type);
                const bookingReference = extractBookingReference(item);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onRead(item.id)}
                    className="w-full text-left transition-all hover:-translate-y-[1px]"
                    style={{
                      position: "relative",
                      borderRadius: "20px",
                      border: item.is_read
                        ? "1px solid #E7EAF0"
                        : "1px solid #CFE2FF",
                      backgroundColor: item.is_read ? "#FFFFFF" : "#F8FBFF",
                      padding: "18px 18px 17px",
                      boxShadow: item.is_read
                        ? "0 1px 2px rgba(15,23,42,0.02)"
                        : "0 1px 3px rgba(37,99,235,0.05)",
                    }}
                  >
                    <div className="flex items-start" style={{ gap: "14px" }}>
                      <StatusIcon state={state} />

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          className="flex flex-wrap items-center"
                          style={{ gap: "8px" }}
                        >
                          <span
                            style={{
                              borderRadius: "9px",
                              backgroundColor: "#F4F1F1",
                              padding: "4px 8px",
                              fontSize: "11px",
                              lineHeight: 1,
                              fontWeight: 700,
                              color: "#5B1E1D",
                            }}
                          >
                            {bookingReference}
                          </span>

                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 800,
                              color: state.accent,
                            }}
                          >
                            {state.label}
                          </span>
                        </div>

                        <p
                          style={{
                            margin: "10px 0 0",
                            fontSize: "13px",
                            lineHeight: 1.55,
                            color: "#475467",
                          }}
                        >
                          {item.message}
                        </p>

                        <p
                          style={{
                            margin: "9px 0 0",
                            fontSize: "11px",
                            color: "#98A2B3",
                          }}
                        >
                          {formatNotificationDate(item.created_at)}
                        </p>
                      </div>

                      {!item.is_read && (
                        <span
                          aria-label="Unread"
                          style={{
                            width: "9px",
                            height: "9px",
                            marginTop: "4px",
                            flexShrink: 0,
                            borderRadius: "999px",
                            backgroundColor: "#2F80ED",
                          }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="flex shrink-0 items-center justify-center bg-white"
          style={{
            minHeight: "76px",
            borderTop: "1px solid #EEF0F4",
            padding: "14px 20px",
          }}
        >
          <button
            type="button"
            onClick={onReadAll}
            disabled={unreadCount === 0}
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: unreadCount > 0 ? "#5B1E1D" : "#B8BEC9",
              cursor: unreadCount > 0 ? "pointer" : "not-allowed",
            }}
          >
            Mark all as read
          </button>
        </div>
      </aside>
    </div>
  );
}
