import {
  FaArrowUp,
  FaCalendarAlt,
  FaCar,
  FaTools,
  FaClock,
} from "react-icons/fa";
import BookingChart from "./BookingChart";
import WelcomeBanner from "./WelcomeBanner";

interface StatsCardProps {
  title: string;
  value: string;
  color: "blue" | "green" | "yellow" | "red";
}

export default function StatsCard({
  title,
  value,
  color,
}: StatsCardProps) {

  const colors = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      icon: <FaCalendarAlt />,
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      icon: <FaCar />,
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      icon: <FaClock />,
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      icon: <FaTools />,
    },
  };

  const current = colors[color];

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">

      {/* Top */}

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${current.bg} ${current.text}`}
        >
          {current.icon}
        </div>

      </div>

      {/* Bottom */}

      <div className="flex items-center gap-2 mt-6">

        <FaArrowUp className="text-green-500 text-sm" />

        <span className="text-green-600 font-semibold">
          +12%
        </span>

        <span className="text-gray-500 text-sm">
          from last week
        </span>

        <main className="p-8">

  <WelcomeBanner />

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

    <StatsCard title="Total Bookings" value="08" color="blue" />
    <StatsCard title="Pending Approval" value="02" color="yellow" />
    <StatsCard title="Vehicles In Use" value="06" color="green" />
    <StatsCard title="Maintenance" value="02" color="red" />

  </div>

  {/* Booking Chart */}

  <div className="mt-8">
    <BookingChart />
  </div>

</main>



      </div>

    </div>
  );
}