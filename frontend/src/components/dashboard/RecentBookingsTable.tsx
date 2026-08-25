import type { NormalizedBooking } from "../../types/dashboard";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  Approved: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  Confirmed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Completed: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
  },
};

function initials(name: string) {
  return name
    .split(" ")
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
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

interface RecentBookingsTableProps {
  title?: string;
  bookings: NormalizedBooking[];
  loading?: boolean;
  error?: string | null;
}

export default function RecentBookingsTable({
  title = "Recent Bookings",
  bookings,
  loading,
  error,
}: RecentBookingsTableProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden"
      style={{
        marginTop: "30px",
        padding: "20px",
      }}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
        <h3
          className="text-lg font-bold text-[#1C1C2E]"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60">
              {[
                "Booking No.",
                "Requester",
                "Destination",
                "Date",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                  Loading bookings…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                  No bookings to show.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#4C1D1D]">
                      {booking.bookingReference}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {booking.vehicle}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#4C1D1D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {initials(booking.requester)}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1C1C2E] truncate">
                          {booking.requester}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {booking.department}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 max-w-[200px]">
                    <p className="text-sm text-gray-700 truncate">
                      {booking.destination}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 whitespace-nowrap">
                      {booking.date}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
