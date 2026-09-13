import { FaTimes } from "react-icons/fa";
import type { Booking } from "../../types/booking";
import BookingStatusBadge from "./BookingStatusBadge";

export default function BookingDetailsModal({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  if (!booking) return null;

  const rows = [
    ["Reference", booking.booking_reference],
    ["Requester", booking.full_name || "My booking"],
    ["Vehicle", `${booking.vehicle_name} (${booking.vehicle_number})`],
    ["Destination", booking.destination],
    ["Purpose", booking.purpose],
    ["Departure", new Date(booking.departure_date).toLocaleString()],
    ["Return", new Date(booking.return_date).toLocaleString()],
    ["Passengers", String(booking.passenger_count)],
    ["Remarks", booking.remarks || "—"],
    ...(booking.cancellation_reason
      ? [["Cancellation reason", booking.cancellation_reason]]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(17, 24, 39, 0.42)",
        backdropFilter: "blur(3px)",
        padding: "20px",
      }}
      onMouseDown={onClose}
    >
      <div
        className="w-full bg-white"
        style={{
          maxWidth: "620px",
          borderRadius: "24px",
          boxShadow: "0 24px 70px rgba(15,23,42,0.22)",
          overflow: "hidden",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-start justify-between"
          style={{
            padding: "24px 26px 20px",
            borderBottom: "1px solid #EEF0F4",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
                color: "#171A2B",
              }}
            >
              Booking Details
            </h2>

            <div style={{ marginTop: "10px" }}>
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              backgroundColor: "#F4F6F8",
              color: "#667085",
            }}
          >
            <FaTimes style={{ width: "14px", height: "14px" }} />
          </button>
        </div>

        <div style={{ padding: "8px 26px 22px" }}>
          {rows.map(([label, value], index) => (
            <div
              key={label}
              className="grid"
              style={{
                gridTemplateColumns: "140px 1fr",
                gap: "18px",
                padding: "14px 0",
                borderBottom:
                  index === rows.length - 1 ? "none" : "1px solid #F1F3F6",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#98A2B3",
                }}
              >
                {label}
              </span>

              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#344054",
                  lineHeight: 1.6,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
