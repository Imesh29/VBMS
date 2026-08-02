import { FaCarSide, FaCalendarCheck } from "react-icons/fa";

export default function WelcomeBanner() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#5B1E1D] to-[#7A2E2B] text-white p-8 shadow-lg">

      <div className="flex flex-col lg:flex-row items-center justify-between">

        {/* Left Section */}
        <div>

          <p className="text-sm text-gray-200">
            Welcome Back 👋
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Vehicle Booking Dashboard
          </h2>

          <p className="mt-4 max-w-xl text-gray-200">
            Manage vehicle requests, approve bookings,
            monitor fleet availability and view system
            statistics from one place.
          </p>

          <button className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-[#5B1E1D] shadow hover:bg-gray-100 transition">
            Create New Booking
          </button>

        </div>

        {/* Right Section */}

        <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4">

          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 w-40">

            <FaCalendarCheck
              className="text-3xl mb-3"
            />

            <h3 className="text-3xl font-bold">
              08
            </h3>

            <p className="text-sm text-gray-200">
              Bookings Today
            </p>

          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 w-40">

            <FaCarSide
              className="text-3xl mb-3"
            />

            <h3 className="text-3xl font-bold">
              12
            </h3>

            <p className="text-sm text-gray-200">
              Vehicles Available
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}