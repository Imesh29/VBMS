import {
  FaEye,
  FaTrash,
} from "react-icons/fa";

import StatusBadge from "./StatusBadge";

export type Booking = {
  id: string;
  requestDate: string;
  vehicle: string;
  vehicleNumber: string;
  destination: string;
  purpose: string;
  departureDate: string;
  departureTime: string;
  pax: number;
  status: string;
};

type StatusBadgeStatus = Parameters<typeof StatusBadge>[0]["status"];

interface BookingTableProps {
  bookings: Booking[];
}

export default function BookingTable({
  bookings,
}: BookingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse">

        {/* Header */}
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">

            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              Ref No.
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              Vehicle
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              Destination
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              Departure
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              Pax
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              Status
            </th>

            <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
              Actions
            </th>

          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-12 text-center text-sm text-slate-400"
              >
                No bookings found.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr
                key={booking.id}
                className="
                  border-b
                  border-slate-100
                  last:border-b-0
                  hover:bg-slate-50/50
                  transition
                "
              >

                {/* Reference */}
                <td className="px-6 py-5">
                  <div className="font-semibold text-sm text-slate-800">
                    {booking.id}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {booking.requestDate}
                  </div>
                </td>

                {/* Vehicle */}
                <td className="px-6 py-5">
                  <div className="text-sm font-medium text-slate-800">
                    {booking.vehicle}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {booking.vehicleNumber}
                  </div>
                </td>

                {/* Destination */}
                <td className="px-6 py-5">
                  <div className="text-sm text-slate-700">
                    {booking.destination}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {booking.purpose}
                  </div>
                </td>

                {/* Departure */}
                <td className="px-6 py-5">
                  <div className="text-sm text-slate-700">
                    {booking.departureDate}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {booking.departureTime}
                  </div>
                </td>

                {/* Pax */}
                <td className="px-6 py-5 text-sm font-medium text-slate-700">
                  {booking.pax}
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <StatusBadge
                    status={booking.status as StatusBadgeStatus}
                  />
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-4">

                    <button
                      type="button"
                      title="View booking"
                      className="
                        text-slate-400
                        transition
                        hover:text-[#5B1E1D]
                      "
                      onClick={() =>
                        console.log(
                          "View:",
                          booking.id
                        )
                      }
                    >
                      <FaEye size={15} />
                    </button>

                    <button
                      type="button"
                      title="Delete booking"
                      className="
                        text-slate-400
                        transition
                        hover:text-red-500
                      "
                      onClick={() =>
                        console.log(
                          "Delete:",
                          booking.id
                        )
                      }
                    >
                      <FaTrash size={14} />
                    </button>

                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>


    </div>
  );
}