import type { BookingStatus } from "../../data/bookingData";

interface StatusBadgeProps {
  status: BookingStatus;
}

/**
 * Displays a styled status badge for a booking.
 *
 * Supported statuses:
 * - Pending
 * - Approved
 * - Confirmed
 * - Completed
 * - Cancelled
 */
export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  /**
   * Badge colours for each booking status.
   */
  const styles: Record<BookingStatus, string> = {
    Pending:
      "border-amber-300 bg-amber-50 text-amber-600",

    Approved:
      "border-blue-300 bg-blue-50 text-blue-600",

    Confirmed:
      "border-emerald-300 bg-emerald-50 text-emerald-600",

    Completed:
      "border-slate-300 bg-slate-50 text-slate-600",

    Cancelled:
      "border-red-300 bg-red-50 text-red-600",
  };

  /**
   * Small indicator-dot colour for each status.
   */
  const dots: Record<BookingStatus, string> = {
    Pending: "bg-amber-400",
    Approved: "bg-blue-400",
    Confirmed: "bg-emerald-400",
    Completed: "bg-slate-400",
    Cancelled: "bg-red-400",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2

        rounded-full
        border

        px-3
        py-1

        text-xs
        font-medium

        ${styles[status]}
      `}
    >
      {/* Status indicator */}
      <span
        className={`
          h-1.5
          w-1.5

          rounded-full

          ${dots[status]}
        `}
      />

      {status}
    </span>
  );
}