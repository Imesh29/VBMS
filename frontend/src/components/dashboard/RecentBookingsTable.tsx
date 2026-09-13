import type { NormalizedBooking } from "../../types/dashboard";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  Pending: {
    bg: "#FFFBEB",
    text: "#B45309",
    border: "#FDE68A",
    dot: "#F59E0B",
  },
  Approved: {
    bg: "#EFF6FF",
    text: "#1D4ED8",
    border: "#BFDBFE",
    dot: "#60A5FA",
  },
  Confirmed: {
    bg: "#ECFDF5",
    text: "#047857",
    border: "#A7F3D0",
    dot: "#10B981",
  },
  Completed: {
    bg: "#F8FAFC",
    text: "#475467",
    border: "#E2E8F0",
    dot: "#94A3B8",
  },
  Cancelled: {
    bg: "#FFF1F2",
    text: "#DC2626",
    border: "#FECDD3",
    dot: "#FB7185",
  },
};

function initials(name?: string | null) {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        height: "32px",
        padding: "0 13px",
        borderRadius: "999px",
        backgroundColor: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: s.dot,
          flexShrink: 0,
        }}
      />

      {status}
    </span>
  );
}

interface RecentBookingsTableProps {
  title?: string;
  bookings: NormalizedBooking[];
  loading?: boolean;
  error?: string | null;
  onViewAll?: () => void;
}

export default function RecentBookingsTable({
  title = "Recent Bookings",
  bookings,
  loading = false,
  error = null,
  onViewAll,
}: RecentBookingsTableProps) {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "22px",
        border: "1px solid #E7EAF0",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 3px 12px rgba(15, 23, 42, 0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "68px",
          padding: "0 26px",
          borderBottom: "1px solid #EEF0F4",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: 700,
            color: "#171A2B",
          }}
        >
          {title}
        </h3>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              fontSize: "12px",
              fontWeight: 700,
              color: "#5B1E1D",
              cursor: "pointer",
            }}
          >
            View all →
          </button>
        )}
      </div>

      {/* Loading / error / empty */}
      {loading ? (
        <div
          style={{
            padding: "52px 24px",
            textAlign: "center",
            fontSize: "14px",
            color: "#98A2B3",
          }}
        >
          Loading bookings…
        </div>
      ) : error ? (
        <div
          style={{
            padding: "52px 24px",
            textAlign: "center",
            fontSize: "14px",
            color: "#EF4444",
          }}
        >
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div
          style={{
            padding: "52px 24px",
            textAlign: "center",
            fontSize: "14px",
            color: "#98A2B3",
          }}
        >
          No bookings to show.
        </div>
      ) : (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: "980px" }}>
            {/* Column header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.25fr 1.4fr 1.5fr 0.9fr 0.8fr",
                alignItems: "center",
                minHeight: "50px",
                padding: "0 26px",
                backgroundColor: "#FBFCFD",
                borderBottom: "1px solid #EEF0F4",
                columnGap: "28px",
              }}
            >
              {[
                "BOOKING NO.",
                "REQUESTER",
                "DESTINATION",
                "DATE",
                "STATUS",
              ].map((heading) => (
                <div
                  key={heading}
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "#98A2B3",
                  }}
                >
                  {heading}
                </div>
              ))}
            </div>

            {/* Rows */}
            {bookings.map((booking, index) => (
              <div
                key={booking.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.25fr 1.4fr 1.5fr 0.9fr 0.8fr",
                  alignItems: "center",
                  minHeight: "88px",
                  padding: "0 26px",
                  columnGap: "28px",
                  backgroundColor: "#FFFFFF",
                  borderTop: index === 0 ? "none" : "1px solid #F1F3F6",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = "#FCFCFD";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                {/* Booking */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      lineHeight: "20px",
                      fontWeight: 700,
                      color: "#5B1E1D",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {booking.bookingReference}
                  </div>

                  <div
                    style={{
                      marginTop: "7px",
                      fontSize: "11px",
                      lineHeight: "17px",
                      color: "#A0A8B8",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {booking.vehicle || "—"}
                  </div>
                </div>

                {/* Requester */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "13px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#5B1E1D",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {initials(booking.requester)}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        fontWeight: 700,
                        color: "#1F2434",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {booking.requester || "Unknown User"}
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "11px",
                        lineHeight: "17px",
                        color: "#98A2B3",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {booking.department || "—"}
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div
                  style={{
                    minWidth: 0,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#475467",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {booking.destination || "—"}
                </div>

                {/* Date */}
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#475467",
                    whiteSpace: "nowrap",
                  }}
                >
                  {booking.date || "—"}
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
