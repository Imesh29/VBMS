import { FaEye } from "react-icons/fa";

import type { Booking } from "../../data/bookingData";

interface BookingTableProps {
  bookings: Booking[];
}

export default function BookingTable({ bookings }: BookingTableProps) {
  const statusColor = (status: Booking["status"]) => {
    switch (status) {
      case "Approved":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "Confirmed":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "Completed":
        return "border-slate-200 bg-slate-50 text-slate-600";

      case "Cancelled":
        return "border-red-200 bg-red-50 text-red-600";

      default:
        return "border-gray-200 bg-gray-50 text-gray-600";
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-sm text-slate-400">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left">
        <thead
          className="
            bg-slate-50
            text-xs
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          <tr>
            <th className="px-6 py-4 font-medium">Ref No.</th>

            <th className="px-6 py-4 font-medium">Vehicle</th>

            <th className="px-6 py-4 font-medium">Destination</th>

            <th className="px-6 py-4 font-medium">Departure</th>

            <th className="px-6 py-4 font-medium">Pax</th>

            <th className="px-6 py-4 font-medium">Status</th>

            <th className="px-6 py-4 text-center font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="
                text-sm
                text-slate-700
                transition
                hover:bg-slate-50/70
              "
            >
              {/* Reference */}

              <td className="px-6 py-5">
                <p className="font-bold text-[#5B1E1D]">{booking.id}</p>

                <p className="mt-1 text-xs text-slate-400">
                  {booking.requestDate}
                </p>
              </td>

              {/* Vehicle */}

              <td className="px-6 py-5">
                <p className="font-semibold text-slate-900">
                  {booking.vehicle}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {booking.vehicleNumber}
                </p>
              </td>

              {/* Destination */}

              <td className="px-6 py-5">
                <p
                  className="
                    max-w-[220px]
                    truncate
                    font-medium
                  "
                >
                  {booking.destination}
                </p>

                <p
                  className="
                    mt-1
                    max-w-[220px]
                    truncate
                    text-xs
                    text-slate-400
                  "
                >
                  {booking.purpose}
                </p>
              </td>

              {/* Departure */}

              <td className="px-6 py-5">
                <p>{booking.departureDate}</p>

                <p className="mt-1 text-xs text-slate-400">
                  {booking.departureTime}
                </p>
              </td>

              {/* Passengers */}

              <td className="px-6 py-5">{booking.pax}</td>

              {/* Status */}

              <td className="px-6 py-5">
                <span
                  className={`
                    inline-flex
                    rounded-full
                    border
                    px-3
                    py-1
                    text-xs
                    font-medium
                    ${statusColor(booking.status)}
                  `}
                >
                  {booking.status}
                </span>
              </td>

              {/* Actions */}

              <td className="px-6 py-5">
                <div className="flex justify-center">
                  <button
                    type="button"
                    title="View booking"
                    className="
                      rounded-lg
                      p-2
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-[#5B1E1D]
                    "
                  >
                    <FaEye />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
