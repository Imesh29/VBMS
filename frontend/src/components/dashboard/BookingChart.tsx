import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const bookingData = [
  { month: "Jan", bookings: 15 },
  { month: "Feb", bookings: 22 },
  { month: "Mar", bookings: 18 },
  { month: "Apr", bookings: 30 },
  { month: "May", bookings: 27 },
  { month: "Jun", bookings: 35 },
  { month: "Jul", bookings: 40 },
];

export default function BookingChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Monthly Vehicle Bookings
        </h2>

        <p className="text-gray-500 text-sm">
          Total bookings recorded this year
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={bookingData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="bookings"
            fill="#5B1E1D"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}