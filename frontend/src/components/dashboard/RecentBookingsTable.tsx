import { FaEye, FaEdit } from "react-icons/fa";

const bookings = [
  {
    id: "BK001",
    requester: "John Silva",
    vehicle: "Toyota Prius",
    date: "2026-07-20",
    destination: "Colombo",
    status: "Approved",
  },
  {
    id: "BK002",
    requester: "Kasun Perera",
    vehicle: "Nissan Caravan",
    date: "2026-07-21",
    destination: "Galle",
    status: "Pending",
  },
  {
    id: "BK003",
    requester: "Nimal Fernando",
    vehicle: "Toyota Hiace",
    date: "2026-07-22",
    destination: "Matara",
    status: "Rejected",
  },
  {
    id: "BK004",
    requester: "Saman Kumara",
    vehicle: "Honda Vezel",
    date: "2026-07-23",
    destination: "Hambantota",
    status: "Approved",
  },
];

export default function RecentBookingsTable() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold">
          Recent Bookings
        </h2>

        <button className="bg-[#5B1E1D] text-white px-4 py-2 rounded-lg hover:bg-[#491715]">
          View All
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Booking ID</th>
              <th className="text-left py-3">Requester</th>
              <th className="text-left py-3">Vehicle</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Destination</th>
              <th className="text-left py-3">Status</th>
              <th className="text-center py-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {bookings.map((booking) => (

              <tr
                key={booking.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="py-4">{booking.id}</td>

                <td>{booking.requester}</td>

                <td>{booking.vehicle}</td>

                <td>{booking.date}</td>

                <td>{booking.destination}</td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </td>

                <td>

                  <div className="flex justify-center gap-3">

                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>

                    <button className="text-green-600 hover:text-green-800">
                      <FaEdit />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}