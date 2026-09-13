import type { BookingStatus } from "../../types/booking";

const config: Record<
  BookingStatus,
  { color: string; background: string; border: string; dot: string }
> = {
  PENDING: {
    color: "#B45309",
    background: "#FFFBEB",
    border: "#FDE68A",
    dot: "#F59E0B",
  },
  APPROVED: {
    color: "#1D4ED8",
    background: "#EFF6FF",
    border: "#BFDBFE",
    dot: "#60A5FA",
  },
  CONFIRMED: {
    color: "#047857",
    background: "#ECFDF5",
    border: "#A7F3D0",
    dot: "#10B981",
  },
  COMPLETED: {
    color: "#475467",
    background: "#F8FAFC",
    border: "#E2E8F0",
    dot: "#94A3B8",
  },
  CANCELLED: {
    color: "#DC2626",
    background: "#FFF1F2",
    border: "#FECDD3",
    dot: "#FB7185",
  },
};

export default function BookingStatusBadge({
  status,
}: {
  status: BookingStatus;
}) {
  const item = config[status];

  return (
    <span
      className="inline-flex items-center font-medium"
      style={{
        gap: "7px",
        minHeight: "30px",
        padding: "0 11px",
        borderRadius: "15px",
        border: `1px solid ${item.border}`,
        backgroundColor: item.background,
        color: item.color,
        fontSize: "12px",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: item.dot,
          flexShrink: 0,
        }}
      />
      {status[0] + status.slice(1).toLowerCase()}
    </span>
  );
}
