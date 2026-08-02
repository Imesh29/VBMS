import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

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
    vehicle: "Toyota Hiace",
    date: "2026-07-22",
    destination: "Galle",
    status: "Pending",
  },
  {
    id: "BK003",
    requester: "Nimal Fernando",
    vehicle: "Nissan Caravan",
    date: "2026-07-23",
    destination: "Kandy",
    status: "Rejected",
  },
];

export default function BookingTable() {
  const statusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <div className="flex justify-between mb-5">

        <input
          type="text"
          placeholder="Search booking..."
          className="border rounded-lg px-4 py-2 w-72"
        />

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">Booking ID</th>
            <th className="text-left">Requester</th>
            <th className="text-left">Vehicle</th>
            <th className="text-left">Date</th>
            <th className="text-left">Destination</th>
            <th className="text-left">Status</th>
            <th className="text-center">Actions</th>

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
                  className={`px-3 py-1 rounded-full text-sm ${statusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>

              </td>

              <td>

                <div className="flex justify-center gap-4">

                  <button className="text-blue-600">
                    <FaEye />
                  </button>

                  <button className="text-green-600">
                    <FaEdit />
                  </button>

                  <button className="text-red-600">
                    <FaTrash />
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