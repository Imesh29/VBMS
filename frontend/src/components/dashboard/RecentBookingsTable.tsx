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

const bookings = [
  {
    id: "BK-2024-001",
    vehicle: "Toyota HiAce",
    requester: "Amirah Zainudin",
    department: "Computer Science",
    destination: "KLCC Conference Centre",
    date: "2024-06-10",
    status: "Completed",
  },
  {
    id: "BK-2024-002",
    vehicle: "Toyota Fortuner",
    requester: "Hamdan Malik",
    department: "Engineering",
    destination: "UTM Johor Bahru",
    date: "2024-06-15",
    status: "Confirmed",
  },
  {
    id: "BK-2024-003",
    vehicle: "Toyota Alphard",
    requester: "Nurul Hafizah",
    department: "Business Admin",
    destination: "Ministry of Education, Putrajaya",
    date: "2024-06-18",
    status: "Approved",
  },
  {
    id: "BK-2024-004",
    vehicle: "Nissan Urvan",
    requester: "Syukri Osman",
    department: "Medicine",
    destination: "Hospital Kuala Lumpur",
    date: "2024-06-20",
    status: "Pending",
  },
  {
    id: "BK-2024-005",
    vehicle: "Toyota Camry",
    requester: "Amirah Zainudin",
    department: "Computer Science",
    destination: "Cyberjaya Technology Park",
    date: "2024-06-22",
    status: "Pending",
  },
];

function initials(name: string) {
  return name
    .split(" ")
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

export default function RecentBookingsTable() {
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
          Recent Bookings
        </h3>

        <button className="text-sm text-[#4C1D1D] font-semibold hover:underline">
          View all &rarr;
        </button>
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
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50/40 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-[#4C1D1D]">
                    {booking.id}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
